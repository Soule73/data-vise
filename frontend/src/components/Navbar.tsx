import { Bars3Icon } from '@heroicons/react/24/outline';
import ThemeDropdown from './ThemeDropdown';
import UserDropdown from './UserDropdown';
import { useSidebarStore } from '@/store/sidebar';

export default function Navbar() {
  // Utilise l'état isMobile du store pour afficher/cacher le bouton menu
  const isMobile = useSidebarStore((s) => s.isMobile);
  const openSidebar = useSidebarStore((s) => s.openSidebar);
  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-4 md:px-8 bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-hidden font-sans antialiased 
    bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex items-center gap-2">
        {/* Bouton menu mobile visible seulement si <768px */}
        {isMobile && (
          <button
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Ouvrir le menu"
            onClick={openSidebar}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        )}
        <span className="font-bold text-lg text-primary">Data-Vise</span>
      </div>
      <nav className="flex items-center gap-4">
        {/* Ajoute d'autres liens ou actions */}
        <ThemeDropdown />
        <UserDropdown />
      </nav>
    </header>
  );
}
