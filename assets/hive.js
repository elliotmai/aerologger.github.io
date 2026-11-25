/*
 * Sign in with Hive: signed in to Hive (hive.flyingdoublemranch.com), you're
 * signed in here too, with no second login, both inside Hive and here at
 * aero-logger.com. Otherwise the usual email-and-password sign-in works as
 * always.
 *
 * Inside Hive's frame, the page asks Hive:
 *   page → Hive   { type: 'hive:hello' }         "who's signed in?"
 *   Hive → page   { type: 'hive:pass', pass }    a two-minute pass made for AeroLogger only
 *   Hive → page   { type: 'hive:signed-out' }    nobody is signed in to Hive
 *
 * On its own, signed out (once per visit), the page steps over to Hive's
 * /api/hive/hop for a moment, which comes straight back with
 * #hive-pass=<pass> if Hive is signed in, or #hive-pass= if not. That's the
 * only way to see Hive's sign-in from another domain.
 *
 * Either way the pass goes to Hive's /api/hive/exchange/aerologger, which
 * checks it and answers with a Firebase custom token for the AeroLogger
 * account with the same confirmed email (made if there is none).
 *
 * Signed in through Hive and Hive signs out: signed out here too.
 *
 * Needs `auth` and `db` (firebase v8) from the page's main script.
 */
(function () {
    var HIVE_ORIGIN = 'https://hive.flyingdoublemranch.com';
    var EXCHANGE = HIVE_ORIGIN + '/api/hive/exchange/aerologger';
    var HOP = HIVE_ORIGIN + '/api/hive/hop';
    var VIA_HIVE = 'aerologger.viaHive'; // this sign-in came from Hive
    var HOPPED = 'aerologger.hiveHop';   // asked Hive already this visit
    if (typeof auth === 'undefined') return;

    var framed = window.parent !== window;
    var store = function (s, k, v) { try { if (v === undefined) return s.getItem(k); if (v === null) s.removeItem(k); else s.setItem(k, v); } catch (e) { return null; } return null; };

    var busy = false;
    var authKnown = new Promise(function (resolve) {
        var stop = auth.onAuthStateChanged(function () { stop(); resolve(); });
    });

    /** A first visit from Hive has no profile yet: make the one sign-up would. */
    function ensureProfile(user, name) {
        var ref = db.collection('users').doc(user.uid);
        return ref.get().then(function (doc) {
            if (doc.exists) return;
            var parts = String(name || user.displayName || '').trim().split(/\s+/);
            return ref.set({
                firstName: parts[0] || '',
                lastName: parts.slice(1).join(' '),
                username: '',
                email: user.email || '',
            });
        });
    }

    function signInWithPass(pass) {
        return fetch(EXCHANGE, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ pass: pass }),
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (body) {
                if (!res.ok || !body.token) throw new Error(body.error || ('Hive answered ' + res.status));
                return auth.signInWithCustomToken(body.token).then(function (cred) {
                    store(localStorage, VIA_HIVE, '1');
                    return ensureProfile(cred.user, body.name);
                });
            });
        });
    }

    function usePass(pass) {
        return authKnown.then(function () {
            if (busy || auth.currentUser) return;
            busy = true;
            return signInWithPass(pass)
                .catch(function (err) { console.warn('[hive] sign-in failed:', err.message); })
                .then(function () { busy = false; });
        });
    }

    /** Hive has nobody signed in: undo a sign-in that came from Hive. */
    function hiveSignedOut() {
        return authKnown.then(function () {
            if (auth.currentUser && store(localStorage, VIA_HIVE) === '1') {
                store(localStorage, VIA_HIVE, null);
                return auth.signOut();
            }
        });
    }

    // Signing out here by hand: the next visit may sign in with Hive again.
    var was = null;
    auth.onAuthStateChanged(function (user) {
        if (was && !user) store(localStorage, VIA_HIVE, null);
        was = user;
    });

    if (framed) {
        window.addEventListener('message', function (e) {
            if (e.origin !== HIVE_ORIGIN || e.source !== window.parent || !e.data) return;
            if (e.data.type === 'hive:signed-out') { hiveSignedOut(); return; }
            if (e.data.type === 'hive:pass' && typeof e.data.pass === 'string') usePass(e.data.pass);
        });
        window.parent.postMessage({ type: 'hive:hello', v: 1 }, HIVE_ORIGIN);
        return;
    }

    // Back from Hive's hop: take the pass out of the address first.
    var m = /(?:^#|&)hive-pass=([^&]*)/.exec(location.hash);
    if (m) {
        history.replaceState(null, '', location.pathname + location.search);
        var pass = decodeURIComponent(m[1] || '');
        if (pass) usePass(pass); else hiveSignedOut();
        return;
    }

    // Only from the real address: Hive's hop sends a pass back to nowhere else.
    if (location.origin !== 'https://aero-logger.com') return;

    // Signed out (or signed in through Hive, to notice Hive signing out):
    // ask Hive once per visit.
    authKnown.then(function () {
        var viaHive = auth.currentUser && store(localStorage, VIA_HIVE) === '1';
        if (auth.currentUser && !viaHive) return;
        if (store(sessionStorage, HOPPED) !== null) return;
        store(sessionStorage, HOPPED, '1');
        if (store(sessionStorage, HOPPED) !== '1') return; // no storage: never risk a loop
        var back = location.origin + location.pathname + location.search;
        location.replace(HOP + '?app=aerologger&return=' + encodeURIComponent(back));
    });
})();
