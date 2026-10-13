# app-template

Starter template with the features shared across all my apps. Clone it, rename a
few things, and build.

**Stack:** Vite + React + Tailwind CSS. PWA via `vite-plugin-pwa`.

## What's included

| Feature | Where |
| --- | --- |
| Accumulating **What's New** popup | `src/config/whatsNew.js`, `src/components/WhatsNew.jsx` |
| **Ticketbooth** feedback footer link | `src/components/Footer.jsx` (URL in `src/config/app.js`) |
| **PWA** (installable, offline, **auto-update** on new deploy) | `vite.config.js`, `src/pwa.js` |
| **Full mobile viewport, non-zoomable** + safe areas | `index.html`, `src/index.css` |
| **Pull-to-refresh** | `src/components/PullToRefresh.jsx` |
| **Offline/online** status toast | `src/components/NetworkStatus.jsx` |
| **Toast / snackbar** system | `src/context/ToastContext.jsx` (`useToast()`) |
| **Dark / light theme** toggle (system default, persisted) | `src/context/ThemeContext.jsx`, `src/components/ThemeToggle.jsx` |
| Optional **Firebase** module (off by default) | `src/lib/firebase.js`, `.env.example` |
| **Pre-commit hook** — auto-stamps changelog date + reminds | `.githooks/` |
| **CI** — requires a What's New entry or opt-out | `.github/workflows/whats-new.yml` |

## Getting started

```bash
npm install       # also activates the git hook via the "prepare" script
npm run dev
```

## Using it for a new app

1. **Identity** — edit `src/config/app.js`: `APP_NAME`, `APP_KEY` (namespaces
   localStorage — must be unique per app), and `FEEDBACK_URL` (already set).
2. **Manifest & title** — update `name`/`short_name`/colors in `vite.config.js`
   and the `<title>` in `index.html`.
3. **Icons** — `public/favicon.svg` and `public/icons/icon.svg` are placeholders.
   For the best Android install experience add PNGs (`pwa-192.png`, `pwa-512.png`,
   and a maskable `512`) to `public/icons/` and list them in the `manifest.icons`
   array in `vite.config.js`.
4. Replace the demo `Home` screen in `src/App.jsx` with your app. Keep the
   provider/layout structure (providers → `PullToRefresh` → content → `Footer`,
   with `WhatsNew` + `NetworkStatus` floating).

## The "What's New" workflow

- Ship user-facing changes → **prepend an entry** to `src/config/whatsNew.js`
  (newest first). Any placeholder `version` is fine — the pre-commit hook stamps
  it with today's date (`YYYY.MM.DD`) on commit.
- The popup shows every entry newer than the version each device last saw, so a
  user who missed several releases sees them stacked into one popup. First-ever
  visit shows only the newest entry.
- **Nothing users would notice** (refactor/infra)? Skip the entry and put
  `[whats-new: none]` in a commit message.

### Enforcement

- **Local (pre-commit hook):** reminds you if `src/**` changed without a
  changelog entry. Non-blocking by default; set `WHATSNEW_ENFORCE=1` to make it
  block. Bypass any time with `git commit --no-verify`. Auto-activates on
  `npm install` (the `prepare` script runs `git config core.hooksPath .githooks`).
- **CI (GitHub Actions):** the `whats-new` workflow **fails** a PR/push that
  changes `src/**` without either a changelog entry or `[whats-new: none]`.

## Optional Firebase

Off by default. To enable: `npm install firebase`, copy `.env.example` to
`.env.local`, fill in the `VITE_FIREBASE_*` keys, then
`import { initFirebase, auth, db } from '@/lib/firebase'` and `await initFirebase()`.
