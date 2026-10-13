import { formatDate } from '@/lib/format';

/** Cover: the first real photo of the spot, or a typographic tile. Never generated art. */
export function Cover({ entry, className = '' }) {
  const url = entry.photos?.[0]?.thumbUrl;
  if (url) return <img src={url} alt={`${entry.aircraftType} ${entry.registration}`} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-0.5 bg-[#1b3442] ${className}`}>
      <span className="font-mono text-sm tracking-wider text-brand">{entry.registration || '—'}</span>
      <span className="text-[11px] text-[#8da0aa]">No photo</span>
    </div>
  );
}

export function EntryCard({ entry, onOpen }) {
  return (
    <button
      onClick={() => onOpen(entry.id)}
      className="grid grid-cols-[104px_1fr] overflow-hidden rounded-2xl bg-widget text-left text-[#EFE9DA] transition active:scale-[0.99]"
    >
      <div className="min-h-[112px]">
        <Cover entry={entry} />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 px-3.5 py-3">
        <span className="font-mono text-[11px] tracking-wider text-brand">
          {entry.registration}
          {entry.lifer ? ' · LIFER' : ''}
        </span>
        <h3 className="truncate font-display text-[17px] font-bold">{entry.aircraftType}</h3>
        <span className="truncate text-xs text-[#9fb2bb]">
          {entry.operator} · {formatDate(entry.dateSpotted)}
        </span>
        <span className="mt-auto flex items-center gap-1.5 font-mono text-xs text-[#58b6c9]">
          {entry.origin} → {entry.destination}
          {entry.published && <span className="ml-auto rounded-full bg-sky/20 px-2 py-0.5 font-sans text-[11px] font-semibold">Public</span>}
        </span>
      </div>
    </button>
  );
}
