import { registerSW } from 'virtual:pwa-register';

/**
 * Register the service worker with automatic updates.
 *
 * With `registerType: 'autoUpdate'` (see vite.config.js), a new deploy's worker
 * installs, skips waiting, and claims clients; we reload once so the user lands
 * on the newest code — which is also when any new "What's New" entry fires.
 */
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Belt-and-suspenders: if a build ever falls back to prompt mode, still
    // apply the update automatically rather than nagging the user.
    window.location.reload();
  },
});
