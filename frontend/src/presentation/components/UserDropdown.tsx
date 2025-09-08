import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "@store/user";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";

export default function UserDropdown() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  if (!user) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex cursor-pointer items-center gap-2 rounded-md dark:bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold dart:text-white  focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white dark:data-hover:bg-gray-700 dark:data-open:bg-gray-700">
        <span className="font-semibold  hidden md:block">
          {user.username || user.email}
        </span>
        <ChevronDownIcon className="w-4 h-4 fill-white transition-transform" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className=" rounded-xl bg-white dark:bg-gray-900 p-1 w-52 origin-top-right border border-white/5 shadow text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] z-50 focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 select-none">
          Connecté en tant que{" "}
          <span className="font-semibold">{user.email || user.username}</span>
        </div>
        <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
        <MenuItem>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 font-medium text-sm transition text-left text-red-500 dark:text-red-400 ui-active:bg-gray-50 ui-active:dark:bg-gray-800"
          >
            <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
            Se déconnecter
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
