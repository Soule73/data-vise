import { useState } from 'react';
import Dropdown from './Dropdown';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function UserDropdown() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate(ROUTES.login, { replace: true });
  };

  if (!user) return null;

  return (
    <Dropdown
      open={open}
      onClose={() => setOpen(false)}
      zIndex={100}
      trigger={
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex cursor-pointer items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200"
        >
          <span className="font-semibold">{user.username || user.email}</span>
          <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
      }
    >
      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">Connecté en tant que {user.email || user.email}</div>
      <button
        onClick={e => { e.stopPropagation(); handleLogout(); }}
        className="w-full cursor-pointer text-left px-4 py-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium rounded-b"
      >
        Se déconnecter
      </button>
    </Dropdown>
  );
}
