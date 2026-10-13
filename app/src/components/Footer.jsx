import { FEEDBACK_URL } from '@/config/app';

/**
 * Persistent, understated footer link to the shared bug-report / feature-request
 * page. Included on every screen. Sits above the safe-area inset on mobile.
 */
export function Footer() {
  return (
    <footer className="flex flex-none items-center justify-center border-t border-black/5 py-2 pb-safe dark:border-white/10">
      <a
        href={FEEDBACK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] font-medium text-neutral-400 transition hover:text-brand dark:text-neutral-500"
      >
        Report a bug or request a feature
      </a>
    </footer>
  );
}
