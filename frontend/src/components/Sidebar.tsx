import { HomeIcon, TableCellsIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useSidebarAutoClose, useSidebarStore } from '../store/sidebar';
import { useUserStore } from '@/store/user';
import SidebarItem from './SidebarItem';

const sidebarItems = [
  {
    to: '/dashboard',
    label: 'Tableau de bord',
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    to: '/sources',
    label: 'Sources de données',
    icon: <TableCellsIcon className="w-5 h-5" />,
  },
  {
    to: '/widgets',
    label: 'Visualisations',
    icon: <ChartBarIcon className="w-5 h-5" />,
  },
  // Ajoute d'autres items ici si besoin
];

export default function Sidebar() {
  const user = useUserStore((s) => s.user);
  const open = useSidebarStore((s) => s.open);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const isMobile = useSidebarStore((s) => s.isMobile);
  useSidebarAutoClose();

  // Responsive sidebar : mobile = overlay, desktop = fixe
  const showSidebar = isMobile ? open : true;

  return (
    <>
      {showSidebar && (
        <div className={
          isMobile
            ? 'fixed inset-0 z-40 md:hidden'
            : 'hidden md:flex fixed top-0 left-0 flex-col w-64 h-screen z-20'
        }>
          {/* Overlay mobile */}
          {isMobile && <div className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-colors duration-300" onClick={closeSidebar} />}
          <aside className={
            'absolute top-0 left-0 flex flex-col w-64 h-full ' +
            'bg-white dark:bg-gray-900 text-gray-900 dark:text-white ' +
            'transition-transform duration-300 border-r border-gray-200 dark:border-gray-700 ' +
            (isMobile ? 'z-50' : ' mt-16')
          }>
            {
              isMobile&&
              <div className={
              'h-16 flex items-center ' +
              (isMobile ? 'justify-between px-4' : 'justify-center') +
              ' font-bold text-lg tracking-wide border-b border-gray-200 dark:border-gray-700 '
            }>
                <button onClick={closeSidebar} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none" aria-label="Fermer le menu">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              
            </div>}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map(item => (
                <SidebarItem key={item.to} to={item.to} icon={item.icon}>{item.label}</SidebarItem>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs opacity-70  transition-colors duration-300">
              Connecté en tant que <span className="font-semibold">{user?.email}</span>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
