import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { NotificationStore } from "@type/notificationTypes";

export const useNotificationStore = create<NotificationStore>()(
  devtools((set) => ({
    notification: { open: false, type: "success", title: "" },
    showNotification: (notif) =>
      set({ notification: { ...notif, open: true } }),
    closeNotification: () =>
      set((state) => ({
        notification: { ...state.notification, open: false },
      })),
  }))
);
