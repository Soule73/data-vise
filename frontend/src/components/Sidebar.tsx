import {
  HomeIcon,
  TableCellsIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useSidebarAutoClose, useSidebarStore } from "../store/sidebar";
import { useUserStore } from "@/store/user";
import SidebarItem from "./SidebarItem";

const sidebarGroups = [
  {
    label: "Navigation",
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
  const user = useUserStore((s) => s.user);
  const open = useSidebarStore((s) => s.open);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const isMobile = useSidebarStore((s) => s.isMobile);
  useSidebarAutoClose();

  // Permissions utilisateur (tableau de string)
  const userPerms = user?.role?.permissions?.map((p) => p.name) || [];

  // État d'ouverture/fermeture des groupes
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  // Fermer le sidebar si on clique en dehors (overlay ou desktop)
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const sidebar = document.getElementById("sidebar-panel");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        closeSidebar();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, closeSidebar]);

  // Responsive sidebar : mobile = overlay, desktop = pliable (contrôlé par open)
  const showSidebar = open; // Affiche le sidebar seulement si open=true, même sur desktop

  return (
    <>
      {showSidebar && (
        <div
          className={
            //   isMobile
            // ?
            "fixed inset-0 z-10"
            // : "hidden md:flex fixed top-0 left-0 flex-col w-64 h-screen z-20"
          }
        >
          {/* Overlay mobile */}
          {/* {isMobile && ( */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-colors duration-300"
            onClick={closeSidebar}
          />
          {/* )} */}
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
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            <nav className="flex-1 p-4 space-y-6">
              {sidebarGroups.map((group) => {
                const isOpen = openGroups[group.label] ?? true;
                return (
                  <div key={group.label}>
                    <button
                      className="flex cursor-pointer items-center w-full text-xs font-semibold text-gray-400 uppercase mb-2 px-2 tracking-wider focus:outline-none select-none"
                      onClick={() => toggleGroup(group.label)}
                      aria-expanded={isOpen}
                    >
                      <span className="flex-1 text-left">{group.label}</span>
                      <svg
                        className={`w-4 h-4 ml-1 transition-transform ${
                          isOpen ? "" : "rotate-180"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="space-y-2">
                        {group.items
                          .filter(
                            (item) =>
                              !item.permission ||
                              userPerms.includes(item.permission)
                          )
                          .map((item) => (
                            <SidebarItem
                              key={item.to}
                              to={item.to}
                              icon={item.icon}
                            >
                              {item.label}
                            </SidebarItem>
                          ))}
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
