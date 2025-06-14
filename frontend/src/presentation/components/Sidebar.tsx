import {
  HomeIcon,
  TableCellsIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserIcon,
  Bars3Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useSidebarAutoClose } from "../../core/store/sidebar";
import SidebarItem from "./SidebarItem";
import { useSidebarLogic } from "./useSidebarLogic";

const sidebarGroups = [
  {
    label: "Navigation",
    permissions: ["dashboard:canView", "datasource:canView", "widget:canView"],
    items: [
      {
        to: "/dashboards",
        label: "Mes dashboards",
        icon: <HomeIcon className="w-5 h-5" />,
        permission: "dashboard:canView",
      },
      {
        to: "/sources",
        label: "Sources de données",
        icon: <TableCellsIcon className="w-5 h-5" />,
        permission: "datasource:canView",
      },
      {
        to: "/widgets",
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
        to: "/roles",
        label: "Gestion des rôles",
        icon: <ShieldCheckIcon className="w-5 h-5" />,
        permission: "role:canView",
      },
      {
        to: "/users",
        label: "Gestion des utilisateurs",
        icon: <UserIcon className="w-5 h-5" />,
        permission: "user:canView",
      },
      // Ajoute d'autres items admin ici si besoin
    ],
  },
];

export default function Sidebar() {
  const sidebarLogic = useSidebarLogic(sidebarGroups);
  const {
    user,
    open,
    closeSidebar,
    isMobile,
    hasPermission,
    openGroups,
    toggleGroup,
    filteredGroups,
  } = sidebarLogic;
  useSidebarAutoClose();

  // Responsive sidebar : mobile = overlay, desktop = pliable (contrôlé par open)
  const showSidebar = open; // Affiche le sidebar seulement si open=true, même sur desktop

  return (
    <>
      {showSidebar && (
        <div className={"fixed inset-0 z-10"}>
          {/* Overlay mobile */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-colors duration-300"
            onClick={closeSidebar}
          />
          <aside
            id="sidebar-panel"
            className={
              "absolute top-0 left-0 flex flex-col w-64 h-full " +
              "bg-white dark:bg-gray-900 text-gray-900 dark:text-white " +
              "transition-transform duration-300 border-r border-gray-200 dark:border-gray-700 " +
              (isMobile ? "z-50" : " pt-16")
            }
          >
            {isMobile && (
              <div
                className={
                  "h-16 flex items-center " +
                  (isMobile ? "justify-between px-4" : "justify-center") +
                  " font-bold text-lg tracking-wide border-b border-gray-200 dark:border-gray-700 "
                }
              >
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none"
                  aria-label="Fermer le menu"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>
              </div>
            )}
            <nav className="flex-1 p-4 space-y-6">
              {filteredGroups.map((group: any) => {
                const isOpen = openGroups[group.label] ?? true;
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
                        {group.items.map((item: any) =>
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
              })}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs opacity-70  transition-colors duration-300">
              Connecté en tant que{" "}
              <span className="font-semibold">{user?.email}</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
