/*
 * Sign in with Hive. When AeroLogger is opened inside Hive
 * (hive.flyingdoublemranch.com) and you're signed in there, you're signed in
 * here too, with no second login. Anywhere else this does nothing, and the
 * usual email-and-password sign-in works as always.
 *
 *   page → Hive   { type: 'hive:hello' }         "who's signed in?"
 *   Hive → page   { type: 'hive:pass', pass }    a two-minute pass made for AeroLogger only
 *   Hive → page   { type: 'hive:signed-out' }    nobody is signed in to Hive
 *
 * The pass goes to Hive's /api/hive/exchange/aerologger (AeroLogger has no
 * server of its own), which checks it and answers with a Firebase custom
 * token for the AeroLogger account with the same confirmed email, made if
 * there is none. Only messages from Hive's own address, sent by the window
 * that framed this page, are listened to.
 *
 * Needs `auth` and `db` (firebase v8) from the page's main script.
 */
(function () {
    var HIVE_ORIGIN = 'https://hive.flyingdoublemranch.com';
    var EXCHANGE = HIVE_ORIGIN + '/api/hive/exchange/aerologger';
    if (window.parent === window || typeof auth === 'undefined') return;

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
                    return ensureProfile(cred.user, body.name);
                });
            });
        });
    }

    window.addEventListener('message', function (e) {
        if (e.origin !== HIVE_ORIGIN || e.source !== window.parent) return;
        if (!e.data || e.data.type !== 'hive:pass' || typeof e.data.pass !== 'string') return;
        var pass = e.data.pass;
        authKnown.then(function () {
            if (busy || auth.currentUser) return;
            busy = true;
            return signInWithPass(pass)
                .catch(function (err) { console.warn('[hive] sign-in failed:', err.message); })
                .then(function () { busy = false; });
        });
    });

    window.parent.postMessage({ type: 'hive:hello', v: 1 }, HIVE_ORIGIN);
})();
