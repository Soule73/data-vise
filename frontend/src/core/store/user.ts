import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StateCreator } from "zustand";
import type { Permission, User, UserStoreWithPerms } from "@type/authTypes";

function getPermissionList(user: User | null): string[] {
  if (!user || !user.role || !user.role.permissions) return [];
  return user.role.permissions.map((p: Permission) => p.name);
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
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },
      getPermissions: () => getPermissionList(get().user),
      hasPermission: (permName: string) => {
        const can = getPermissionList(get().user).includes(permName);

        return can;
      },
      isOwner: (ownerId: string) => {
        const user = get().user;
        if (!user || !user._id) return false;
        return user._id === ownerId;
      },
    }),
    {
      name: "user-store",
    }
  ) as StateCreator<UserStoreWithPerms, [], [], UserStoreWithPerms>
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "token" && event.newValue === null) {
      useUserStore.getState().logout();
    }
  });
}
