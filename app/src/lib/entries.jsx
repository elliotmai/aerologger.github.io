import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SAMPLE_ENTRIES } from '@/data/sampleEntries';

/**
 * Entries store. This is the single seam between UI and data: screens only call
 * `useEntries()`. Today it keeps sample data in memory; the Firebase version
 * (flat `entries` collection, see docs/FUNCTIONALITY.md §3) replaces this file
 * without touching any screen.
 */
const EntriesContext = createContext(null);
let counter = 0;

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState(SAMPLE_ENTRIES);

  const add = useCallback((data) => {
    const entry = { photos: [], published: false, ...data, id: `n${++counter}`, createdAt: Date.now() };
    setEntries((list) => [entry, ...list]);
    return entry;
  }, []);
  const update = useCallback((id, patch) => setEntries((l) => l.map((e) => (e.id === id ? { ...e, ...patch } : e))), []);
  const remove = useCallback((id) => setEntries((l) => l.filter((e) => e.id !== id)), []);

  const value = useMemo(() => ({ entries, add, update, remove }), [entries, add, update, remove]);
  return <EntriesContext.Provider value={value}>{children}</EntriesContext.Provider>;
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntries must be used inside <EntriesProvider>');
  return ctx;
}

const SORTS = {
  new: (a, b) => b.createdAt - a.createdAt,
  date: (a, b) => (b.dateSpotted || '').localeCompare(a.dateSpotted || ''),
  type: (a, b) => a.aircraftType.localeCompare(b.aircraftType),
  operator: (a, b) => (a.operator || '').localeCompare(b.operator || ''),
};
export const SORT_OPTIONS = [
  ['new', 'Newest added'],
  ['date', 'Date spotted'],
  ['type', 'Aircraft type'],
  ['operator', 'Operator'],
];

const SEARCH_FIELDS = ['aircraftType', 'operator', 'registration', 'flightNumber', 'locationName', 'origin', 'destination', 'notes'];

export function filterEntries(entries, { q = '', sort = 'new', filter = 'all' }) {
  const needle = q.trim().toLowerCase();
  return entries
    .filter((e) => !needle || SEARCH_FIELDS.some((f) => (e[f] || '').toLowerCase().includes(needle)))
    .filter((e) => (filter === 'published' ? e.published : filter === 'lifers' ? e.lifer : true))
    .sort(SORTS[sort]);
}
