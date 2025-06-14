import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StateCreator } from "zustand";
import type { UserState } from "../types/auth-types";
// import { usePermissionStore } from "@/core/store/permissions";

function getPermissionList(user: any): string[] {
  if (!user || !user.role || !user.role.permissions) return [];
  return user.role.permissions.map((p: any) =>
    typeof p === "string" ? p : p.name
  );
}

export interface UserStoreWithPerms extends UserState {
  getPermissions: () => string[];
  hasPermission: (permName: string) => boolean;
}

export const useUserStore = create<UserStoreWithPerms>(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem("token"),
      setUser: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token });
      },
      logout: () => {
        console.log("Logging out...");
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },
      getPermissions: () => getPermissionList(get().user),
      hasPermission: (permName: string) => {
        // Centralisation : permission doit exister côté backend ET être attribuée à l'utilisateur
        // const allPerms = usePermissionStore.getState().permissions;
        // if (!allPerms.some((p) => p.name === permName)) return false;
        return getPermissionList(get().user).includes(permName);
      },
    }),
    {
      name: "user-store",
    }
  ) as StateCreator<UserStoreWithPerms, [], [], UserStoreWithPerms>
);

// Synchronisation du logout entre onglets et re-render global
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "token" && event.newValue === null) {
      useUserStore.getState().logout();
    }
  });
}
