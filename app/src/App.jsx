import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { NetworkStatus } from '@/components/NetworkStatus';
import { WhatsNew } from '@/components/WhatsNew';
import { Footer } from '@/components/Footer';
import { PullToRefresh } from '@/components/PullToRefresh';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AccountIcon, GalleryIcon, LogIcon, Logo, MapIcon, PublicIcon } from '@/components/Icons';
import { EntriesProvider } from '@/lib/entries';
import { LogbookScreen } from '@/screens/LogbookScreen';
import { AddSpotScreen } from '@/screens/AddSpotScreen';
import { ComingSoon } from '@/screens/ComingSoon';
import { APP_NAME } from '@/config/app';

const TABS = [
  ['log', 'Logbook', LogIcon],
  ['gallery', 'Gallery', GalleryIcon],
  ['public', 'Public', PublicIcon],
  ['map', 'Map', MapIcon],
  ['account', 'Account', AccountIcon],
];

function Screen({ view, setView }) {
  switch (view) {
    case 'add': return <AddSpotScreen onDone={() => setView('log')} />;
    case 'gallery': return <ComingSoon title="Gallery" note="One gallery per entry, with photos from your spots. Needs the Firebase storage layer." />;
    case 'public': return <ComingSoon title="Public Gallery" note="Photos people have published, with place names only. Needs paging and the user profile page." />;
    case 'map': return <ComingSoon title="Map" note="Pins for every place you have spotted, built on OpenStreetMap." />;
    case 'account': return <ComingSoon title="Account" note="Profile, export, and delete account." />;
    default: return <LogbookScreen onAdd={() => setView('add')} />;
  }
}

function Shell() {
  const [view, setView] = useState('log');
  const current = view === 'add' ? 'log' : view;
  return (
    <div className="flex min-h-full flex-col bg-ground text-ink">
      <header className="flex items-center gap-3 px-4 pb-2 pt-safe">
        <div className="flex items-center gap-2 pt-3 font-display text-xl font-bold tracking-tight">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-brand text-navy"><Logo /></span>
          {APP_NAME}
        </div>
        <nav className="ml-6 hidden gap-1 pt-3 md:flex" aria-label="Main">
          {TABS.map(([k, label]) => (
            <button key={k} onClick={() => setView(k)} aria-current={current === k ? 'page' : undefined} className="rounded-lg px-3 py-2 text-sm font-semibold text-mute aria-[current=page]:text-ink">
              {label}
            </button>
          ))}
        </nav>
        <div className="ml-auto pt-3"><ThemeToggle /></div>
      </header>

      <div className="flex-1"><PullToRefresh>
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pb-6 pt-2">
          <Screen view={view} setView={setView} />
        </main>
      </PullToRefresh></div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-white/10 bg-navy px-2 pt-2 pb-safe md:hidden" aria-label="Main">
        {TABS.map(([k, label, Icon]) => (
          <button key={k} onClick={() => setView(k)} aria-current={current === k ? 'page' : undefined} className="flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-semibold text-[#8da0aa] aria-[current=page]:text-brand">
            <Icon className="h-[22px] w-[22px]" />
            {label}
          </button>
        ))}
      </nav>
      <div className="pb-16 md:pb-0"><Footer /></div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <EntriesProvider>
          <Shell />
        </EntriesProvider>
        <NetworkStatus />
        <WhatsNew />
      </ToastProvider>
    </ThemeProvider>
  );
}
