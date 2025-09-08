import { Bars3Icon, HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeDropdown from "@components/ThemeDropdown";
import UserDropdown from "@components/UserDropdown";
import { Link } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import logoDataVise from "@assets/logo-datavise.svg";
import useNavBar from "@hooks/useNavBar";

export default function Navbar({
  hideUserInfo = false,
  hideSidebar = false,
}: {
  hideUserInfo?: boolean;
  hideSidebar?: boolean;
}) {
  const { open, openSidebar, closeSidebar, breadcrumb } = useNavBar();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-12 flex items-center justify-between px-4 bg-surface dark:bg-surface-dark transition-colors duration-300 overflow-hidden font-sans antialiased 
    bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
    >
      <div className="flex items-center md:gap-2">
        {!hideSidebar && (
          <button
            className="p-2 cursor-pointer rounded hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Ouvrir le menu"
            onClick={open ? closeSidebar : openSidebar}
          >
            {open ? (
              <XMarkIcon className="w-6 h-6" aria-label="Fermer le menu" />
            ) : (
              <Bars3Icon className="w-6 h-6" aria-label="Ouvrir le menu" />
            )}
          </button>
        )}
        <img
          src={logoDataVise}
          alt="Logo DataVise"
          className={`h-10 w-auto  ${hideSidebar ? "border-r" : "border-x"
            } px-2 border-gray-300 dark:border-gray-700`}
          style={{ minWidth: 40 }}
        />
        <Breadcrumb breadcrumb={breadcrumb} hideSidebar={hideSidebar} />
      </div>
      <nav className="flex items-center gap-4">
        <ThemeDropdown />
        {!hideUserInfo && <UserDropdown />}
      </nav>
    </header>
  );
}

function Breadcrumb({
  breadcrumb,
  hideSidebar = false,
}: {
  breadcrumb: { url: string; label: string }[];
  hideSidebar?: boolean;
}) {
  return (
    <nav
      className=" hidden md:flex items-center text-xs text-gray-500 dark:text-gray-300 gap-1"
      aria-label="Ouvrir la barre de navigation"
    >
      {!hideSidebar && (
        <Link
          to={ROUTES.dashboardList}
          className="hover:underline cursor-pointer flex items-center gap-1"
        >
          <HomeIcon className="w-4 h-4" />
        </Link>
      )}
      {breadcrumb.map((item, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === breadcrumb.length - 1;

        const showFirstSlash = hideSidebar && isFirst;

        return (
          <span key={item.url} className="flex items-center gap-1">
            <span className={`mx-1 ${showFirstSlash ? "hidden" : ""}`}>/</span>
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
}
