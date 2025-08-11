/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, useQuery } from "@tanstack/react-query";
import {
  fetchDashboard,
  fetchDashboards,
  saveDashboardLayout,
  createDashboard as apiCreateDashboard,
  fetchSharedDashboard,
  fetchSharedDashboardSources,
} from "@services/dashboard";
import type { Dashboard } from "@type/dashboardTypes";
import api from "@services/api";

// Liste de tous les tableaux de bord
export function useDashboardsQuery() {
  return useQuery<Dashboard[]>({
    queryKey: ["dashboards"],
    queryFn: fetchDashboards,
    staleTime: 1000 * 60 * 60 * 24, // 24h
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Récupération d'un tableau de bord spécifique par son ID
export function useDashboardIdQuery(
  dashboardId?: string,
  enabled: boolean = true
) {
  return useQuery<Dashboard | undefined>({
    queryKey: ["dashboard", dashboardId],
    queryFn: () => (dashboardId ? fetchDashboard(dashboardId) : undefined),
    enabled: enabled && !!dashboardId,
    staleTime: 1000 * 60 * 60 * 24, // 24h
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Création d'un nouveau tableau de bord
export async function createDashboardQuery({
  localDashboard,
  visibility,
  queryClient,
}: {
  localDashboard: { layout: any[]; title: string };
  visibility: "public" | "private" | undefined;
  queryClient: QueryClient;
}) {
  const newDashboard = await apiCreateDashboard({
    title: localDashboard.title,
    layout: localDashboard.layout,
    visibility,
  });
  await queryClient.invalidateQueries({
    queryKey: ["dashboard", newDashboard._id],
  });
  await queryClient.invalidateQueries({ queryKey: ["dashboards"] });
  return newDashboard;
}

// Mise à jour d'un tableau de bord
export async function updateDashboardQuery({
  dashboardId,
  updates,
  queryClient,
}: {
  dashboardId: string | undefined;
  updates: any;
  queryClient: any;
}) {
  // Extraction des champs
  const {
    layout,
    title,
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit,
    timeRange,
    visibility,
  } = updates;
  await saveDashboardLayout(dashboardId ?? "", layout, title, {
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit,
    timeRange,
    visibility,
  });
  await queryClient.invalidateQueries({
    queryKey: ["dashboard", dashboardId ?? ""],
  });
}

// Récupération d'un dashboard partagé par son shareId (public)
export function useSharedDashboardQuery(shareId?: string) {
  return useQuery<Dashboard | undefined>({
    queryKey: ["shared-dashboard", shareId],
    queryFn: async () => {
      if (!shareId) return undefined;
      return await fetchSharedDashboard(shareId);
    },
    enabled: !!shareId,
    retry: (failureCount, error: any) => {
      // Ne pas réessayer si 404
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Récupération des sources d'un dashboard partagé par son shareId (public)
export function useSharedDashboardSourcesQuery(shareId?: string) {
  return useQuery<any[]>({
    queryKey: ["shared-dashboard-sources", shareId],
    queryFn: async () => {
      if (!shareId) return [];
      try {
        return await fetchSharedDashboardSources(shareId);
      } catch (e: any) {
        if (e?.response?.status === 404) return [];
        throw e;
      }
    },
    enabled: !!shareId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Suppression d'un tableau de bord
export async function deleteDashboardQuery({
  dashboardId,
  queryClient,
}: {
  dashboardId: string | undefined;
  queryClient: QueryClient;
}) {
  if (!dashboardId) throw new Error("Dashboard ID is required for deletion");
  await api.delete(`/dashboards/${dashboardId}`);
  await queryClient.invalidateQueries({ queryKey: ["dashboards"] });
}
