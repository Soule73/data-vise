import { Bars3Icon, HomeIcon } from "@heroicons/react/24/outline";
import ThemeDropdown from "./ThemeDropdown";
import UserDropdown from "./UserDropdown";
import { useSidebarStore } from "@/store/sidebar";
import { useLocation, Link } from "react-router-dom";
import { useDashboardStore } from "@/store/dashboard";

export default function Navbar() {
  // Affiche le bouton menu sur toutes les tailles d'écran
  const open = useSidebarStore((s) => s.open);
  const openSidebar = useSidebarStore((s) => s.openSidebar);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const handleToggleSidebar = () => (open ? closeSidebar() : openSidebar());
  const location = useLocation();

  // Génère un breadcrumb dynamique à partir du chemin
  const getBreadcrumbDisplayName = useDashboardStore(
    (s) => s.getBreadcrumbDisplayName
  );
  const pathnames = location.pathname.split("/").filter(Boolean);
  const breadcrumb = (
    <nav
      className="flex items-center text-xs text-gray-500 dark:text-gray-300 gap-1"
      aria-label="Ouvrir la barre de navigation"
    >
      <Link
        to="/dashboards"
        className="hover:underline cursor-pointer flex items-center gap-1"
      >
        <HomeIcon className="w-4 h-4" />
      </Link>
      {pathnames.map((name, idx) => {
        const routeTo = "/" + pathnames.slice(0, idx + 1).join("/");
        const isLast = idx === pathnames.length - 1;
        const displayName = getBreadcrumbDisplayName
          ? getBreadcrumbDisplayName(name, routeTo)
          : name.charAt(0).toUpperCase() + name.slice(1);
        return (
          <span key={routeTo} className="flex items-center gap-1">
            <span className="mx-1">/</span>
            {isLast ? (
              <span className="font-semibold text-indigo-500 ">
                {displayName}
              </span>
            ) : (
              <Link to={routeTo} className="hover:underline cursor-pointer">
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-12 flex items-center justify-between px-4 bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-hidden font-sans antialiased 
    bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
    >
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Ouvrir le menu"
          onClick={handleToggleSidebar}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-primary ml-2 border-x px-2 border-gray-300 dark:border-gray-700">
          Data-Vise
        </span>
        {breadcrumb}
      </div>
      <nav className="flex items-center gap-4">
        {/* Ajoute d'autres liens ou actions */}
        <ThemeDropdown />
        <UserDropdown />
      </nav>
    </header>
  );
}
