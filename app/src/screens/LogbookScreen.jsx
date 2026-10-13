import { useMemo, useState } from 'react';
import { EntryCard } from '@/components/EntryCard';
import { EntrySheet } from '@/components/EntrySheet';
import { SORT_OPTIONS, filterEntries, useEntries } from '@/lib/entries';

const FILTERS = [['all', 'All'], ['published', 'Published'], ['lifers', 'Lifers']];

export function LogbookScreen({ onAdd }) {
  const { entries } = useEntries();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('new');
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const list = useMemo(() => filterEntries(entries, { q, sort, filter }), [entries, q, sort, filter]);
  const open = entries.find((e) => e.id === openId);
  const photoCount = entries.reduce((n, e) => n + (e.photos?.length || 0), 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Logbook</h1>
          <p className="text-sm text-mute">{entries.length} spots · {photoCount} photos</p>
        </div>
        <button onClick={onAdd} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg">Add spot</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search type, operator, reg, notes…"
          aria-label="Search logbook"
          className="min-w-0 flex-[1_1_200px] rounded-xl border border-line bg-[#f8f4ea] px-3 py-2.5 text-sm text-navy dark:bg-widget dark:text-ink"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort"
          className="rounded-xl border border-line bg-[#f8f4ea] px-3 py-2.5 text-sm text-navy dark:bg-widget dark:text-ink"
        >
          {SORT_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map(([v, l]) => (
          <button
            key={v}
            aria-pressed={filter === v}
            onClick={() => setFilter(v)}
            className="rounded-full border border-line px-3 py-1 text-xs text-mute aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-[#EFE9DA] dark:aria-pressed:border-brand dark:aria-pressed:bg-brand dark:aria-pressed:text-brand-fg"
          >
            {l}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-10 text-center text-sm text-mute">
          {entries.length === 0 ? 'No spots yet. Add your first one.' : 'No spots match. Clear the search or add a new spot.'}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-3">
          {list.map((e) => <EntryCard key={e.id} entry={e} onOpen={setOpenId} />)}
        </div>
      )}

      {open && <EntrySheet entry={open} onClose={() => setOpenId(null)} />}
    </>
  );
}
