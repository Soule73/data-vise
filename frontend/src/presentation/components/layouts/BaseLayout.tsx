import Sidebar from "@/presentation/components/layouts/Sidebar";
import Navbar from "@/presentation/components/layouts/Navbar";
import Notification from "@/presentation/components/Notification";
import { useNotificationStore } from "@/core/store/notification";
import type { BaseLayoutProps } from "@/core/types/layout-types";

export default function BaseLayout({ children, hideSidebar = false, hideNavbar = false, hideUserInfo = false }: BaseLayoutProps) {
  const notif = useNotificationStore((s) => s.notification);
  const closeNotif = useNotificationStore((s) => s.closeNotification);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors duration-300 pt-12 dark:text-white text-gray-900">
      <Notification
        open={notif.open}
        onClose={closeNotif}
        type={notif.type}
        title={notif.title}
        description={notif.description}
      />
      {!hideNavbar && <Navbar 
      hideSidebar={hideSidebar}
      hideUserInfo={hideUserInfo} />}
      {!hideSidebar && <Sidebar />}
      <main className="py-4 px-2 md:px-6 relative z-0">{children}</main>
    </div>
  );
}
