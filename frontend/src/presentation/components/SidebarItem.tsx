import type { SidebarItemProps } from '@type/navigationTypes';
import { NavLink } from 'react-router-dom';

export default function SidebarItem({ to, children, icon }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded transition font-medium text-sm
        ${isActive ? 'bg-indigo-900/15 text-indigo-900 dark:text-white font-bold dark:bg-indigo-800'
          : 'hover:bg-primary-light/60 dark:text-gray-200'}`
      }
      end
    >
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      {children}
    </NavLink>
  );
}
