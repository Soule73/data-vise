// ======================================================
// 6. Notifications & Alerts
// ======================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface NotificationState {
    open: boolean;
    type: NotificationType;
    title: string;
    description?: string;
}

export interface NotificationStore {
    notification: NotificationState;
    showNotification: (notif: NotificationState) => void;
    closeNotification: () => void;
}

export interface NotificationProps {
    open: boolean;
    onClose: () => void;
    type?: NotificationType;
    title: string;
    description?: string;
    duration?: number; // ms
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export interface AlertModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type?: 'error' | 'success' | 'info' | 'warning' | 'default';
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
}
