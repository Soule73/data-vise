/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import type { Permission, Role } from "@type/authTypes";
import {
  fetchRoles,
  updateRole,
  deleteRole,
  createRole,
  fetchPermissions,
} from "@services/role";

export function useRolesQuery() {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    staleTime: 1000 * 60 * 60 * 24, // 24h
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return { roles: data, isLoading, error };
}

export function usePermissionsQuery() {
  return useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
    staleTime: 1000 * 60 * 60 * 24, // 24h
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useUpdateRoleMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      onSuccess?.();
    },
    onError,
  });
}

export function useDeleteRoleMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  queryClient: QueryClient;
}) {
  return useMutation({
    mutationFn: async (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      onSuccess?.();
    },
    onError,
  });
}

export function useCreateRoleMutation({
  onSuccess,
  onError,
  queryClient,
}: {
  queryClient: QueryClient;
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (payload: any) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      onSuccess?.();
    },
    onError,
  });
}
