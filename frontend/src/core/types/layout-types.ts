// ======================================================
// 10. Layouts & Authentification
// ======================================================

export interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
    logoUrl?: string;
    bottomText?: React.ReactNode;
}

export interface BaseLayoutProps {
    children: React.ReactNode;
    hideSidebar?: boolean;
    hideNavbar?: boolean;
    hideUserInfo?: boolean;
}

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    children: React.ReactNode;
    footer?: React.ReactNode;
    hideCloseButton?: boolean;
    className?: string;
}