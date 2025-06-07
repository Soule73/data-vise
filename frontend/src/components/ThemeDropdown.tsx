import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useThemeStore, useApplyThemeClass } from '../store/theme';

const themes = [
  { value: 'system', label: 'Système', icon: <ComputerDesktopIcon className="w-5 h-5" /> },
  { value: 'light', label: 'Clair', icon: <SunIcon className="w-5 h-5" /> },
  { value: 'dark', label: 'Sombre', icon: <MoonIcon className="w-5 h-5" /> },
];

export default function ThemeDropdown() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  useApplyThemeClass(theme);
  const current = themes.find(t => t.value === theme) || themes[0];

  return (
    <Menu as="div" className="relative inline-block text-left bg-white dark:bg-gray-900">
      <MenuButton className="inline-flex cursor-pointer items-center gap-2 rounded-md dark:bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold dart:text-white shadow-inner  focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white dark:data-hover:bg-gray-700 dark:data-open:bg-gray-700">
        {current.icon}
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="w-56 origin-top-right rounded-xl bg-white dark:bg-gray-900 p-1 text-sm/6 text-gray-900 dark:text-gray-100 shadow-lg ring-1 ring-black focus:outline-none z-50 mt-2">
        {themes.map((t) => (
          <MenuItem key={t.value}>
            {(props) => {
              const isActive = (props as any)?.['data-headlessui-state']?.includes('active');
              return (
                <button
                  onClick={() => setTheme(t.value as any)}
                  className={`
                    hover:bg-gray-100 dark:hover:bg-gray-800 ui-active:bg-gray-100 dark:ui-active:bg-gray-800 cursor-pointer
                    group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 font-medium text-sm transition text-left
                    ${theme === t.value ? 'bg-gray-200 dark:bg-gray-700 font-bold text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'}
                    ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                >
                  <span className="w-5 h-5 flex items-center justify-center">{t.icon}</span>
                  {t.label}
                  {theme === t.value && (
                    <span className="ml-auto text-xs text-indigo-600 dark:text-indigo-300 font-semibold">Actif</span>
                  )}
                </button>
              );
            }}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
