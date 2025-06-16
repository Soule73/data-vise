import { Bars3Icon, HomeIcon } from "@heroicons/react/24/outline";
import ThemeDropdown from "./ThemeDropdown";
import UserDropdown from "./UserDropdown";
import { useSidebarStore } from "@/core/store/sidebar";
import { Link } from "react-router-dom";
import { useDashboardStore } from "@/core/store/dashboard";
import { ROUTES } from "@/core/constants/routes";
import logoDataVise from "/logo-datavise.svg";
import { useEffect } from "react";

export default function Navbar() {
  // Affiche le bouton menu sur toutes les tailles d'écran
  const open = useSidebarStore((s) => s.open);
  const openSidebar = useSidebarStore((s) => s.openSidebar);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const handleToggleSidebar = () => (open ? closeSidebar() : openSidebar());

  // Récupère le tableau breadcrumb du store
  const breadcrumb = useDashboardStore((s) => s.breadcrumb);

  // Met à jour dynamiquement le titre de la page selon le breadcrumb
  useEffect(() => {
    if (breadcrumb && breadcrumb.length > 0) {
      document.title = `${breadcrumb[breadcrumb.length - 1].label} – DataVise`;
    } else {
      document.title = "DataVise";
    }
  }, [breadcrumb]);

  const breadcrumbNav = (
    <nav
      className=" items-center text-xs text-gray-500 dark:text-gray-300 gap-1 hidden sm:flex"
      aria-label="Ouvrir la barre de navigation"
    >
      <Link
        to={ROUTES.dashboardList}
        className="hover:underline cursor-pointer flex items-center gap-1"
      >
        <HomeIcon className="w-4 h-4" />
      </Link>
      {breadcrumb.map((item, idx) => {
        const isLast = idx === breadcrumb.length - 1;
        return (
          <span key={item.url} className="flex items-center gap-1">
            <span className="mx-1">/</span>
            {isLast ? (
              <span className="font-semibold text-indigo-500 ">
                {item.label}
              </span>
            ) : (
              <Link to={item.url} className="hover:underline cursor-pointer">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-12 flex items-center justify-between px-4 bg-surface dark:bg-surface-dark transition-colors duration-300 overflow-hidden font-sans antialiased 
    bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
    >
      <div className="flex items-center md:gap-2">
        <button
          className="p-2 cursor-pointer rounded hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Ouvrir le menu"
          onClick={handleToggleSidebar}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <img
          src={logoDataVise}
          alt="Logo DataVise"
          className="h-10 w-auto  border-x px-2 border-gray-300 dark:border-gray-700"
          style={{ minWidth: 40 }}
        />
        {breadcrumbNav}
      </div>
      <nav className="flex items-center gap-4">
        {/* Ajoute d'autres liens ou actions */}
        <ThemeDropdown />
        <UserDropdown />
      </nav>
    </header>
  );
}
