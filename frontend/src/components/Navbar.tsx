import { Bars3Icon } from "@heroicons/react/24/outline";
import ThemeDropdown from "./ThemeDropdown";
import UserDropdown from "./UserDropdown";
import { useSidebarStore } from "@/store/sidebar";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  // Affiche le bouton menu sur toutes les tailles d'écran
  const open = useSidebarStore((s) => s.open);
  const openSidebar = useSidebarStore((s) => s.openSidebar);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const handleToggleSidebar = () => (open ? closeSidebar() : openSidebar());
  const location = useLocation();

  // Génère un breadcrumb dynamique à partir du chemin
  const pathnames = location.pathname.split("/").filter(Boolean);
  const breadcrumb = (
    <nav
      className="flex items-center text-xs text-gray-500 dark:text-gray-300 gap-1"
      aria-label="Fil d'Ariane"
    >
      <span
        className="hover:underline cursor-pointer"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Accueil
      </span>
      {pathnames.map((name, idx) => {
        const routeTo = "/" + pathnames.slice(0, idx + 1).join("/");
        const isLast = idx === pathnames.length - 1;
        return (
          <span key={routeTo} className="flex items-center gap-1">
            <span className="mx-1">/</span>
            {isLast ? (
              <span className="font-semibold text-primary">
                {decodeURIComponent(name)}
              </span>
            ) : (
              <span
                className="hover:underline cursor-pointer"
                onClick={() => (window.location.href = routeTo)}
              >
                {decodeURIComponent(name)}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-4 bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-hidden font-sans antialiased 
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
        <span className="font-bold text-lg text-primary ml-2">Data-Vise</span>
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
