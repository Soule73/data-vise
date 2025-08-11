import { create } from 'zustand';
import type { ThemeMode, ThemeStore } from '@type/themeTypes';


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
