
import { useEffect } from 'react';
import type { ThemeMode } from '@type/themeTypes';
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
