'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext({ theme: 'light' as Theme, toggleTheme: () => {} });
const storageKey = 'medibrief-theme';


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(storageKey); } catch { /* Storage may be disabled. */ }
      const next = saved === 'dark' || saved === 'light' ? saved : media.matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.style.colorScheme = next;
      setTheme(next);
    };
    sync();
    media.addEventListener('change', sync);
    const onStorage = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) sync(); };
    window.addEventListener('storage', onStorage);
    return () => { media.removeEventListener('change', sync); window.removeEventListener('storage', onStorage); };
  }, []);

  const toggleTheme = () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
    setTheme(next);
    try { localStorage.setItem(storageKey, next); } catch { /* In-memory theme still works. */ }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button type="button" onClick={toggleTheme} aria-label="Tema gelap" aria-pressed={theme === 'dark'} title="Ganti tema terang / gelap" className="theme-toggle shrink-0 w-11 h-11 inline-flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">
      <Moon className="w-[18px] h-[18px] dark:hidden" aria-hidden="true" />
      <Sun className="w-[18px] h-[18px] hidden dark:block" aria-hidden="true" />
    </button>
  );
}
