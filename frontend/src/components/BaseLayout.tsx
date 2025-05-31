import { type ReactNode } from 'react';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors duration-300 pl-0 md:pl-64 pt-16 dark:text-white text-gray-900">
      <Sidebar />
      <Navbar />
      <main className="py-4 px-2 md:px-6">{children}</main>
    </div>
  );
}
