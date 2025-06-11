import { type ReactNode } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Notification from "@/components/Notification";
import { useNotificationStore } from "@/store/notification";

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const notif = useNotificationStore((s) => s.notification);
  const closeNotif = useNotificationStore((s) => s.closeNotification);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-300 pt-12 dark:text-white text-gray-900">
      <Notification
        open={notif.open}
        onClose={closeNotif}
        type={notif.type}
        title={notif.title}
        description={notif.description}
      />
      <Navbar />
      <Sidebar />
      <main className="py-4 px-2 md:px-6 relative z-0">{children}</main>
    </div>
  );
}
