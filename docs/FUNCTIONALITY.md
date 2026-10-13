# AeroLogger — Functionality Spec (v2 draft)

Purpose: pin down *what the app does* before we redesign the UI or tune performance.
Sources: `Brainstorming.pdf`, your to-do list, and an audit of the current `index.html` (3,014 lines, one file).

---

## 1. Product in one paragraph

AeroLogger is a personal **spotting logbook** for aviation fans. You log an aircraft you saw (type, operator, registration, flight, date, place, route, notes, photos), browse your photos as galleries, and optionally **publish** photos to a **public gallery** where others can browse them and see who shot them.

Core loop: **Spot → Log → Photograph → (Publish) → Browse/Search → Export.**

Three audiences: (1) *me*, keeping a private record; (2) *browsers*, looking at others' photos; (3) *me again*, wanting to export or back up.

---

## 2. Feature inventory

Status: ✅ works · ⚠️ built but flawed · ❌ missing. Priority: **P0** do first · **P1** v2 · **P2** later.

### 2.1 Accounts
| Feature | Status | Pri | Notes |
|---|---|---|---|
| Sign up (name, username, email, password) + verification email | ✅ | — | |
| Login / forgot password / resend verification | ✅ | — | |
| Bad-login feedback, email validation | ⚠️ | P0 | Uses `alert()`; replace with inline messages |
| Remember me / stay signed in | ⚠️ | P0 | Checkbox exists; confirm it maps to Firebase `LOCAL` vs `SESSION` persistence |
| Unique username | ⚠️ | P0 | Checked client-side only, so two users can race; needs a `usernames/{name}` doc enforced by rules |
| Update account / delete account | ⚠️ | P1 | Delete must also remove Storage files and public photos; verify it does |
| Public profile page (`/u/username`) | ❌ | P0 | Your "click username → see all their published photos" item |
| Avatar | ❌ | P2 | |

### 2.2 Logbook (entries)
| Feature | Status | Pri | Notes |
|---|---|---|---|
| Add entry with fields + photos | ✅ | — | Fields: type, operator, ID/reg, flight no., date, location, origin, destination, notes |
| View list, tap for detail popup | ✅ | — | |
| Edit / delete (with confirm) | ✅ | — | |
| Search + filter by field + sort | ✅ | — | |
| User-defined sort order (drag to reorder) | ❌ | P2 | Currently only sorts by a field |
| Search by notes | ⚠️ | P0 | Check that notes are in the search index |
| Autocomplete for type/operator/airport | ❌ | P1 | Big UX win; ICAO type + airline lists are static JSON, no API needed |
| Tags / "Collections" (PDF: groups) | ❌ | P1 | See 2.6 |
| Location: GPS "use my location" | ❌ | P1 | Browser geolocation, one tap |
| Location: pick on map, pins page | ❌ | P1 | See 2.7 |
| "Lifer" tracking (first time you've seen a type/reg) | ❌ | P1 | Natural spotter feature; derive from entries |
| Stats page (totals, top types/operators/airports, per-year) | ❌ | P1 | Derived data, no new storage |

### 2.3 Photos & galleries
Today: one gallery per entry, created automatically. The data model allows multiple galleries per entry, but the UI doesn't use that.

| Feature | Status | Pri | Notes |
|---|---|---|---|
| Upload multiple photos | ⚠️ | P0 | Sequential, full-resolution, no progress per file, and filename collisions overwrite (`…/${file.name}`) |
| Upload spinner / progress | ⚠️ | P0 | Single spinner; want per-file progress and ability to continue browsing |
| Thumbnails + resized display copy | ❌ | P0 | Biggest cause of slowness and "photos not loading on phone" (see §5) |
| Add photos to existing gallery | ✅ | — | |
| Delete single photo | ⚠️ | P0 | Deletes by matching URL; make sure the Storage file is removed too |
| Lightbox with next/back + entry details | ✅ | — | Add swipe + keyboard arrows |
| Publish photo | ⚠️ | P0 | No duplicate guard; copies the entry's details into the public doc, so edits go stale |
| Unpublish | ⚠️ | P0 | Only possible from the public gallery view |
| Set cover photo | ❌ | P1 | |
| Export single gallery | ✅ | — | Add spinner (your list) |

### 2.4 Public gallery
| Feature | Status | Pri | Notes |
|---|---|---|---|
| Browse all published photos | ⚠️ | P0 | Loads the **entire** collection at once; needs paging / infinite scroll |
| Search/filter | ✅ | — | Runs client-side over whatever was loaded, so it breaks once paged; needs a plan (§4) |
| Detail view with username | ✅ | — | |
| Click username → user's published photos | ❌ | P0 | |
| Owner can delete their own | ⚠️ | P0 | Enforced only in the UI; rules must enforce it |
| Report a photo | ❌ | P1 | Needed once strangers upload; tie into the Request form |
| Likes / favorites | ❌ | P2 | Only if you want it social |

### 2.5 Export
| Feature | Status | Pri | Notes |
|---|---|---|---|
| Export entries / galleries / all as ZIP | ⚠️ | P0 | PDF lists "text vs object" format bug; define the format: `entries.json` + `entries.csv` + `photos/<entry>/…` |
| Share an entry (link or image card) | ❌ | P2 | |
| Import from a previous export | ❌ | P2 | Makes export a real backup |

### 2.6 Collections (from your PDF)
Named groups with a description. An entry can belong to many. Collection page shows a card per group; opening one shows its description, its entries, and a photo grid labelled by entry name. Create / edit / delete a collection; remove an entry from it. **Pri: P1.** Model: `collections/{id}` with `entryIds[]` (or `collectionIds[]` on each entry — see §3).

### 2.7 Map & location
Pick location from a map (or GPS), save a name + coordinates, show a **map page** with one pin per place; clicking a pin lists entries from there. **Pri: P1.** Use **Leaflet + OpenStreetMap** (free, no key). The PDF's Google Maps embed needs a billing-enabled key and doesn't give you pins/click handling for free.

### 2.8 Smart extras (your "optional" list)
| Feature | Pri | Notes / honest take |
|---|---|---|
| Aircraft facts / news by reg or type | P2 | Needs a backend and an API; "scrape the internet" is fragile. Cheaper: a type-facts lookup from a static dataset |
| FlightRadar24 API | **P1** | **Raised by you.** Autofill operator/route/type from a flight number or reg. Paid API, so call it through a Cloud Function (key stays private, results cached per flight). Needs a plan check on FR24 pricing/limits before we commit |
| Chatbot answering aircraft questions | **P3 (parked)** | Needs a **server-side proxy** (a Firebase Cloud Function) so the key isn't public, plus rate limiting and a cost cap |
| Request form | P0 (cheap) | **Decided:** reuse Ticketbooth from `app-template` (`FEEDBACK_URL` footer link to the shared page). Nothing to build beyond the footer; add to rebuild |

### 2.9 Platform & polish (your list)
- **Navigation:** hamburger vs bottom tab bar → decide in UI phase (my pick: bottom tabs on phone, side rail on desktop).
- **Alerts:** 26 `alert()` calls today → replace with toasts + inline errors.
- **Header text/tab title/logo:** "AeroLogger" only. Remove "Public Gallery" header leaking onto other pages and the signup form under login.
- **Custom domain:** `aero-logger.com` is already in the deploy workflow.
- **Installable PWA** (add to home screen, offline shell): P1, since you mainly use it on a phone.
- **Accessibility:** keyboard nav, focus states, contrast on the orange-on-navy text: P1.

---

## 3. Proposed data model

Current: `users/{uid}/logbooks/{id}/galleries/{id}/photos/{id}` (four levels, each read needs several queries) plus a flat `publicGallery` that embeds a copy of the entry.

Proposed (flatter, fewer reads):

```
users/{uid}                 profile: first, last, username, createdAt
usernames/{username}        { uid }                       ← enforces uniqueness
entries/{entryId}           { uid, aircraftType, operator, registration, flightNo,
                              date, locationName, lat, lng, origin, destination,
                              notes, photoCount, coverPhotoId, collectionIds[],
                              createdAt, updatedAt }
photos/{photoId}            { uid, entryId, storagePath, thumbPath, w, h,
                              createdAt, published, publishedAt }
collections/{id}            { uid, name, description, createdAt }
reports/{id}                { photoId, reporterUid, reason, createdAt }
```

- The **public gallery is just `photos where published == true`**, joined to its entry for display. No duplicated copy that goes stale; unpublish is a flag flip.
- `photoCount` on the entry removes the N+1 count queries.
- Each photo stores **both** a thumbnail and a display-size path.
- A one-off **migration script** moves existing data. It needs your Firebase admin access; it can't run from this session.

---

## 4. Decisions

**Settled**
1. **One gallery per entry.** Collections handle grouping. (The multi-gallery model goes away.)
2. **Audience:** you and friends now, built so it can grow. So: reporting + owner-only rules enforced server-side from day one; no heavy moderation tooling yet.
3. **Request form = feedback/changes**, via the shared **Ticketbooth** from `app-template`.
4. **Chatbot** parked (P3). **FR24** promoted to P1; **aircraft facts** stay P2.
5. **Privacy:** published photos show **place name only**; coordinates never leave the owner's account. Enforced by not copying lat/lng into anything public.

**Still open**
- **Public search at scale:** my default is indexed queries on username, type, operator, registration; free-text search later only if it grows.
- **Migration — decided: migrate.** One-off script moves `users/*/logbooks/*/galleries/*/photos/*` and `publicGallery` into the §3 model, generating thumbnails and dropping lat/lng from public data. Needs your Firebase service-account key run locally (not in this session). Dry-run first, and take a Firestore export + Storage backup beforehand.
- **FR24 — decided: you have the Explorer plan.** Credit-based, so lookups go through a Cloud Function that caches per flight/reg and caps per user. Still to verify against FR24's docs: which endpoints Explorer includes (flight lookup by number vs. by registration) and the monthly credit allowance.

---

## 5. Audit findings that affect scope

*(Detail for the performance phase; listed here because they change what "done" means.)*

- Images are served **full-size** everywhere, and there are no thumbnails.
- Public gallery downloads **every published doc** on each visit and renders them one by one, with `console.log` per photo.
- Photo counts do **one query per gallery per entry** (N+1).
- Firebase **v8** SDK, four scripts, loaded from the CDN on every page view; v10+ modular is far smaller.
- A realtime listener is opened per logbook/gallery, and the lists are re-fetched after every add.
- Everything is one 137 KB HTML file with inline CSS/JS and global functions. That is why the UI is hard to improve safely.
- **"API key secrets":** a Firebase web API key is *meant* to be public. What protects data is **Firestore/Storage security rules** and **App Check**. I haven't seen your rules (they aren't in this repo). Reviewing them is a **P0 security task**, since the "owner can delete" and "unique username" checks currently live only in the browser.

---

## 6. Proposed order of work

1. **Functionality (this doc):** you answer §4, we lock scope and priorities.
2. **UI exploration:** I build 3 clickable HTML previews (logbook, entry detail, gallery, public gallery, map) in different directions, including your eggshell-background / darker-widgets idea. You pick one.
3. **Rebuild on `app-template`** (Vite + React + Tailwind, PWA with auto-update, toasts, theme toggle, pull-to-refresh, What's New popup, Ticketbooth footer, optional Firebase module) with the chosen UI and new data model. This covers the PWA, toast/alert, tab-title and "remove stray headers" items for free. Note the template's CLAUDE.md and CI require a What's New entry per release.
4. **Performance:** thumbnails, paging, modular Firebase SDK, caching/PWA. Measured before/after with Lighthouse.
5. **Extras:** map, collections, stats, then chatbot/FR24 if you still want them.

A note on sequencing: the data model change (§3) is what unlocks most of the speed-up, so I'd fold the core of it into step 3 rather than leaving performance entirely to the end.
