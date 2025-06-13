
// ======================================================
// 3. Sidebar & Navigation
// ======================================================

export interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    to: string;
    active?: boolean;
    children?: React.ReactNode;
}