import { useState } from 'react';
import { useEntries } from '@/lib/entries';
import { useToast } from '@/context/ToastContext';

const EMPTY = { aircraftType: '', operator: '', registration: '', flightNumber: '', dateSpotted: new Date().toISOString().slice(0, 10), locationName: '', origin: '', destination: '', notes: '' };

function Field({ label, className = '', children }) {
  return (
    <label className={`flex flex-col gap-1 text-xs text-[#9fb2bb] ${className}`}>
      {label}
      {children}
    </label>
  );
}
const input = 'w-full rounded-lg border border-[#2b4352] bg-[#0d1f2a] px-3 py-2.5 text-sm text-[#EFE9DA] placeholder:text-[#5d7280]';

export function AddSpotScreen({ onDone }) {
  const { add } = useEntries();
  const { toast } = useToast();
  const [f, setF] = useState(EMPTY);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!f.aircraftType.trim()) return toast('Add an aircraft type to save this spot.', { type: 'error' });
    add({ ...f, aircraftType: f.aircraftType.trim(), registration: f.registration.trim().toUpperCase() });
    toast('Spot saved', { type: 'success' });
    onDone();
  }

  return (
    <>
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Add spot</h1>
        <p className="text-sm text-mute">Fill in what you know. Photos are optional.</p>
      </div>
      <form onSubmit={submit} className="grid max-w-3xl gap-3 rounded-2xl bg-widget p-5 sm:grid-cols-2">
        <Field label="Aircraft type" className="sm:col-span-2"><input className={input} value={f.aircraftType} onChange={set('aircraftType')} placeholder="Boeing 737-800" /></Field>
        <div className="flex items-end gap-2">
          <Field label="Flight number" className="flex-1"><input className={input} value={f.flightNumber} onChange={set('flightNumber')} placeholder="AS318" /></Field>
          <button type="button" onClick={() => toast('FR24 autofill arrives with the lookup function', { type: 'info' })} className="whitespace-nowrap rounded-lg border border-[#2b4352] px-3 py-2.5 text-xs font-semibold text-[#EFE9DA]">Autofill</button>
        </div>
        <Field label="Date spotted"><input type="date" className={input} value={f.dateSpotted} onChange={set('dateSpotted')} /></Field>
        <Field label="Registration"><input className={input} value={f.registration} onChange={set('registration')} placeholder="N915AK" /></Field>
        <Field label="Operator"><input className={input} value={f.operator} onChange={set('operator')} placeholder="Alaska Airlines" /></Field>
        <Field label="From"><input className={input} value={f.origin} onChange={set('origin')} placeholder="SEA" /></Field>
        <Field label="To"><input className={input} value={f.destination} onChange={set('destination')} placeholder="LAX" /></Field>
        <Field label="Location" className="sm:col-span-2"><input className={input} value={f.locationName} onChange={set('locationName')} placeholder="Seattle (SEA)" /></Field>
        <Field label="Notes" className="sm:col-span-2"><textarea className={`${input} min-h-[70px]`} value={f.notes} onChange={set('notes')} placeholder="Livery, runway, light, anything worth remembering" /></Field>
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg">Save spot</button>
          <button type="button" onClick={onDone} className="rounded-xl border border-[#2b4352] px-4 py-2.5 text-sm font-semibold text-[#EFE9DA]">Cancel</button>
        </div>
      </form>
    </>
  );
}
