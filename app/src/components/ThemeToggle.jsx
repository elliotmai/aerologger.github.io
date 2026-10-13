import { useTheme } from '@/context/ThemeContext';

/** Small light/dark toggle button. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 text-lg transition active:scale-95 dark:border-white/10 dark:bg-white/5"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
