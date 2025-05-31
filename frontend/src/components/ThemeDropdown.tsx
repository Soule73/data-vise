import { useState } from 'react';
import { MoonIcon, SunIcon, ComputerDesktopIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Dropdown from './Dropdown';
import { useThemeStore, useApplyThemeClass } from '../store/theme';

const themes = [
  { value: 'system', label: 'Système', icon: <ComputerDesktopIcon className="w-5 h-5" /> },
  { value: 'light', label: 'Clair', icon: <SunIcon className="w-5 h-5" /> },
  { value: 'dark', label: 'Sombre', icon: <MoonIcon className="w-5 h-5" /> },
];

export default function ThemeDropdown() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  useApplyThemeClass(theme);

  const handleChange = (value: string) => {
    setTheme(value as any);
    setOpen(false);
  };

  const current = themes.find(t => t.value === theme) || themes[0];

  return (
    <Dropdown
      open={open}
      onClose={() => setOpen(false)}
      zIndex={100}
      trigger={
        <button
          onClick={() => setOpen(v => !v)}
          className="flex cursor-pointer items-center gap-2 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Changer le thème"
        >
          {current.icon}
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      }
    >
      <div className="flex flex-col min-w-36">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => handleChange(t.value)}
            className={`flex cursor-pointer items-center gap-2 px-4 py-2 w-full text-left rounded transition font-medium text-sm
              ${theme === t.value ? 'bg-gray-200 dark:bg-gray-700 font-bold text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'}
              hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
      </div>
    </Dropdown>
  );
}
