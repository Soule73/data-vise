import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Role, RoleStore } from "../types/auth-types";
import { fetchRoles } from "@/data/services/user";

export const useRoleStore = create<RoleStore>()(
  devtools((set) => ({
    roles: [],
    setRoles: (roles) => set({ roles }),
  }))
);

export function useGlobalRoles() {
  const setRoles = useRoleStore((s) => s.setRoles);
  const roles = useRoleStore((s) => s.roles);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => fetchRoles(),
    staleTime: 1000 * 60 * 60 * 24, // 24h
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    initialData: () =>
      queryClient.getQueryData(["roles"]) as Role[] | undefined,
  });

  useEffect(() => {
    if (data) setRoles(data);
  }, [data, setRoles]);

  return roles;
}
