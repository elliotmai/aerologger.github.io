/**
 * OPTIONAL Firebase module — disabled by default.
 *
 * To enable in an app that clones this template:
 *   1. `npm install firebase`
 *   2. Copy `.env.example` to `.env.local` and fill in the VITE_FIREBASE_* keys.
 *   3. Import what you need: `import { auth, db } from '@/lib/firebase'`.
 *
 * Until both the package and the env keys are present, `app`, `auth`, and `db`
 * are `null`, so importing this file is safe and side-effect-free.
 */
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(cfg.apiKey && cfg.projectId);

export let app = null;
export let auth = null;
export let db = null;

// Lazy, guarded init. Call `await initFirebase()` from an app that opts in.
export async function initFirebase() {
  if (!isFirebaseConfigured) {
    console.warn('[firebase] Skipped: set VITE_FIREBASE_* in .env.local to enable.');
    return { app, auth, db };
  }
  if (app) return { app, auth, db };
  const { initializeApp } = await import('firebase/app');
  const { getAuth } = await import('firebase/auth');
  const { getFirestore } = await import('firebase/firestore');
  app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
  return { app, auth, db };
}
