import type { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {children}
        </div>
    );
}
