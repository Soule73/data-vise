import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeStore {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.theme as ThemeMode) || 'system';
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      if (theme === 'system') {
        localStorage.removeItem('theme');
      } else {
        localStorage.theme = theme;
      }
    }
  },
}));

// Hook utilitaire pour appliquer la classe .dark sur <html> selon le store
import { useEffect } from 'react';
export function useApplyThemeClass(theme: ThemeMode) {
  useEffect(() => {
    const setHtmlDarkClass = () => {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const userTheme = theme === 'system' ? localStorage.theme : theme;
      if (userTheme === 'dark' || (!userTheme && systemDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    setHtmlDarkClass();
    if (theme === 'system') {
      const listener = () => setHtmlDarkClass();
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
      return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    }
  }, [theme]);
}
