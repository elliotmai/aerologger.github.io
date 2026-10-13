/**
 * End-user "What's New" entries — NEWEST FIRST.
 *
 * When you ship user-facing changes, prepend a new entry with plain-language,
 * benefit-focused bullets. Leave `version` as today's date in YYYY.MM.DD form —
 * the pre-commit hook auto-stamps it for you on commit, so a placeholder is fine.
 *
 * The next time each person opens the app, the popup shows every entry newer than
 * what their device last saw — so if several releases stacked up between visits,
 * they see them all at once (tracked per-device in localStorage).
 *
 * Nothing users would notice (refactors, config, infra)? Don't add an entry —
 * instead put `[whats-new: none]` in your commit message so CI passes.
 */
export const WHATS_NEW = [
  {
    version: '2026.10.13',
    date: 'October 2026',
    items: [
      'A fresh look: eggshell background with dark navy cards.',
      '🐛 Spot a bug or have an idea? Use the “Report a bug or request a feature” link in the footer.',
    ],
  },
];
