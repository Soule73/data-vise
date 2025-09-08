import {
  HomeIcon,
  TableCellsIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useSidebarAutoClose } from "@store/sidebar";
import SidebarItem from "@components/SidebarItem";
import { ROUTES } from "@constants/routes";
import { useSidebar } from "@hooks/useSidebar";
import { Transition } from "@headlessui/react";
import type {
  SidebarGroup,
  SidebarGroupItem,
} from "@type/navigationTypes";

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Navigation",
    permissions: ["dashboard:canView", "datasource:canView", "widget:canView"],
    items: [
      {
        to: ROUTES.dashboards,
        label: "Mes dashboards",
        icon: <HomeIcon className="w-5 h-5" />,
        permission: "dashboard:canView",
      },
      {
        to: ROUTES.sources,
        label: "Sources de données",
        icon: <TableCellsIcon className="w-5 h-5" />,
        permission: "datasource:canView",
      },
      {
        to: ROUTES.widgets,
        label: "Visualisations",
        icon: <ChartBarIcon className="w-5 h-5" />,
        permission: "widget:canView",
      },
    ],
  },
  {
    label: "Administration",
    permissions: ["role:canView", "user:canView"],
    items: [
      {
        to: ROUTES.roles,
        label: "Gestion des rôles",
        icon: <ShieldCheckIcon className="w-5 h-5" />,
        permission: "role:canView",
      },
      {
        to: ROUTES.users,
        label: "Gestion des utilisateurs",
        icon: <UserIcon className="w-5 h-5" />,
        permission: "user:canView",
      },
    ],
  },
];

export default function Sidebar() {
  const {
    user,
    open,
    closeSidebar,
    hasPermission,
    openGroups,
    toggleGroup,
    filteredGroups,
  } = useSidebar(sidebarGroups);
  useSidebarAutoClose();

  return (
    <div className={`fixed inset-0 z-10 md:pt-16 ${open ? "block" : "hidden"}`}>
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-colors duration-300"
        onClick={closeSidebar}
      />
      <Transition
        show={open}
        enter="transition-transform transition-opacity duration-500"
        enterFrom="-translate-x-full scale-90 opacity-0"
        enterTo="translate-x-0 scale-100 opacity-100"
        leave="transition-transform transition-opacity duration-400"
        leaveFrom="translate-x-0 scale-100 opacity-100"
        leaveTo="-translate-x-full scale-90 opacity-0"
        unmount={false}
      >
        <aside
          id="sidebar-panel"
          className={
            "absolute top-0 left-0 pt-16 flex flex-col w-64 h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-transform duration-300 border-r border-gray-200 dark:border-gray-700  "
          }
        >
          <nav className="flex-1 p-4 space-y-6">
            {filteredGroups.map((group: SidebarGroup) => {
              const isOpen = openGroups[group.label] ?? true;
              return (
                <SideBarGroupItem
                  key={group.label}
                  group={group}
                  isOpen={isOpen}
                  toggleGroup={toggleGroup}
                  hasPermission={hasPermission}
                />
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs opacity-70  transition-colors duration-300">
            Connecté en tant que{" "}
            <span className="font-semibold">{user?.email}</span>
          </div>
        </aside>
      </Transition>
    </div>
  );
}

function SideBarGroupItem({
  group,
  isOpen,
  toggleGroup,
  hasPermission,
}: {
  group: SidebarGroup;
  isOpen: boolean;
  toggleGroup: (label: string) => void;
  hasPermission: (permission: string) => boolean;
}) {
  return (
    <div key={group.label}>
      <button
        className="flex cursor-pointer items-center w-full text-xs font-semibold text-gray-400 uppercase mb-2 px-2 tracking-wider focus:outline-none select-none"
        onClick={() => toggleGroup(group.label)}
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-left">{group.label}</span>
        {isOpen ? (
          <ChevronDownIcon className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 ml-1 rotate-180" />
        )}
      </button>
      {isOpen && (
        <div className="space-y-2">
          {group.items.map((item: SidebarGroupItem) =>
            !item.permission || hasPermission(item.permission) ? (
              <SidebarItem
                label={item.label}
                key={item.to}
                to={item.to}
                icon={item.icon}
              >
                {item.label}
              </SidebarItem>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
