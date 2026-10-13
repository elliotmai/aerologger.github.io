import { useRef, useState } from 'react';

const THRESHOLD = 70; // px pulled before a release triggers refresh
const MAX = 110; // px cap on the indicator travel

/**
 * Wrap your scrollable app content. When the user is scrolled to the very top
 * and pulls down past the threshold, this reloads the app (fetching the latest
 * from the network / updated service worker). Pass `onRefresh` to run your own
 * data refresh instead of a full reload.
 */
export function PullToRefresh({ children, onRefresh }) {
  const startY = useRef(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  function atTop() {
    return (document.scrollingElement || document.documentElement).scrollTop <= 0;
  }

  function onTouchStart(e) {
    startY.current = atTop() ? e.touches[0].clientY : null;
  }

  function onTouchMove(e) {
    if (startY.current == null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0 && atTop()) {
      // Resistance curve so it feels rubbery, capped at MAX.
      setPull(Math.min(MAX, delta * 0.5));
    }
  }

  async function onTouchEnd() {
    if (pull >= THRESHOLD) {
      setRefreshing(true);
      try {
        if (onRefresh) await onRefresh();
        else window.location.reload();
      } finally {
        setRefreshing(false);
      }
    }
    setPull(0);
    startY.current = null;
  }

  const active = pull > 0 || refreshing;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative h-full"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center overflow-hidden transition-[height] duration-150"
        style={{ height: refreshing ? 44 : pull }}
        aria-hidden={!active}
      >
        <div
          className={[
            'mt-2 h-6 w-6 rounded-full border-2 border-neutral-300 border-t-brand dark:border-neutral-700 dark:border-t-brand',
            refreshing || pull >= THRESHOLD ? 'animate-spin' : '',
          ].join(' ')}
          style={{ opacity: Math.min(1, pull / THRESHOLD) || (refreshing ? 1 : 0) }}
        />
      </div>
      <div style={{ transform: `translateY(${refreshing ? 44 : pull}px)`, transition: pull ? 'none' : 'transform 150ms' }}>
        {children}
      </div>
    </div>
  );
}
