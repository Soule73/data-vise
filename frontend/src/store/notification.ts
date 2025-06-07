import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface NotificationState {
  open: boolean;
  type: NotificationType;
  title: string;
  description?: string;
}

interface NotificationStore {
  notification: NotificationState;
  showNotification: (notif: NotificationState) => void;
  closeNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  devtools((set) => ({
    notification: { open: false, type: 'success', title: '' },
    showNotification: (notif) => set({ notification: { ...notif, open: true } }),
    closeNotification: () => set((state) => ({ notification: { ...state.notification, open: false } })),
  }))
);
