import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Permission, PermissionStore } from "../types/auth-types";
import api from "@/data/services/api";

export const usePermissionStore = create<PermissionStore>()(
  devtools((set) => ({
    permissions: [],
    setPermissions: (perms) => set({ permissions: perms }),
  }))
);

export function useGlobalPermissions() {
  const setPermissions = usePermissionStore((s) => s.setPermissions);
  const permissions = usePermissionStore((s) => s.permissions);
  const queryClient = useQueryClient();

  // Utilise react-query pour le cache, mais ne refetch pas inutilement
  const { data } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => (await api.get("/auth/permissions")).data,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData: () =>
      queryClient.getQueryData(["permissions"]) as Permission[] | undefined,
  });

  useEffect(() => {
    if (data) setPermissions(data);
  }, [data, setPermissions]);

  return permissions;
}
