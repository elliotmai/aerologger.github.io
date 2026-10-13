const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const wrap = (d) =>
  function Icon({ className = 'h-6 w-6' }) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
        {d}
      </svg>
    );
  };
export const LogIcon = wrap(<><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" /><path d="M9 8h6M9 12h6" /></>);
export const GalleryIcon = wrap(<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M4 18l5-5 4 4 3-3 4 4" /></>);
export const PublicIcon = wrap(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>);
export const MapIcon = wrap(<><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>);
export const AccountIcon = wrap(<><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 15-5 16 0" /></>);
export function Logo({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2 14l9-2 4-8h3l-2 8 5 1v2l-6-.5-1 5h-2l-1-5-9-1z" />
    </svg>
  );
}
