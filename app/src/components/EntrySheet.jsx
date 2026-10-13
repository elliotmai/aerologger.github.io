import { useEffect, useState } from 'react';
import { Cover } from '@/components/EntryCard';
import { formatDate } from '@/lib/format';
import { useEntries } from '@/lib/entries';
import { useToast } from '@/context/ToastContext';

function Row({ label, children }) {
  if (!children) return null;
  return (
    <>
      <dt className="text-mute">{label}</dt>
      <dd className="break-words font-medium">{children}</dd>
    </>
  );
}

export function EntrySheet({ entry, onClose }) {
  const { update, remove } = useEntries();
  const { toast } = useToast();
  const hasPhoto = entry.photos?.length > 0;
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/55 md:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label={entry.aircraftType}
        onClick={(e) => e.stopPropagation()}
        className="animate-pop grid max-h-[94%] w-full max-w-3xl overflow-auto rounded-t-3xl bg-widget text-[#EFE9DA] md:max-h-[88%] md:grid-cols-[1.1fr_1fr] md:rounded-3xl"
      >
        <div className="aspect-[4/3] bg-black">
          <Cover entry={entry} />
        </div>
        <div className="flex flex-col gap-3 p-5">
          <span className="w-fit rounded-full bg-sky/20 px-2 py-0.5 text-[11px] font-semibold text-[#58b6c9]">{entry.lifer ? 'Lifer' : entry.registration}</span>
          <h3 className="font-display text-2xl font-bold">{entry.aircraftType}</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px] [&_dt]:text-[#9fb2bb]">
            <Row label="Operator">{entry.operator}</Row>
            <Row label="Registration">{entry.registration}</Row>
            <Row label="Flight">{entry.flightNumber}</Row>
            <Row label="Route">{entry.origin && `${entry.origin} → ${entry.destination}`}</Row>
            <Row label="Spotted">{formatDate(entry.dateSpotted)}</Row>
            <Row label="Location">{entry.locationName}</Row>
            <Row label="Notes">{entry.notes}</Row>
            <Row label="Photos">{hasPhoto ? String(entry.photos.length) : 'None yet'}</Row>
          </dl>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {hasPhoto ? (
              <button
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg"
                onClick={() => {
                  update(entry.id, { published: !entry.published });
                  toast(entry.published ? 'Unpublished' : 'Published to the public gallery', { type: 'success' });
                }}
              >
                {entry.published ? 'Unpublish' : 'Publish'}
              </button>
            ) : (
              <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg" onClick={() => toast('Photo upload arrives with Firebase storage')}>
                Add photos
              </button>
            )}
            <button className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold" onClick={() => toast('Editing is next')}>Edit</button>
            <button
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-[#f08a7c]"
              onClick={() => {
                if (!confirmDelete) return setConfirmDelete(true);
                remove(entry.id);
                onClose();
                toast('Spot deleted');
              }}
            >
              {confirmDelete ? 'Tap again to delete' : 'Delete'}
            </button>
            <button className="ml-auto rounded-xl px-3 py-2.5 text-sm text-[#9fb2bb]" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
