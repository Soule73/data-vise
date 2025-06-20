import { QueryClient, useQuery } from "@tanstack/react-query";
import { fetchDashboard, fetchDashboards, saveDashboardLayout, createDashboard as apiCreateDashboard, fetchSharedDashboard, fetchSharedDashboardSources } from "@/data/services/dashboard";
import type { Dashboard } from "@/core/types/dashboard-model";

// Liste de tous les tableaux de bord
export function dashboardsQuery() {
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
export function dashboardIdQuery(dashboardId?: string, enabled: boolean = true) {
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
    await queryClient.invalidateQueries({ queryKey: ["dashboard", newDashboard._id] });
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
    const { layout, title, autoRefreshIntervalValue, autoRefreshIntervalUnit, timeRange, visibility } = updates;
    await saveDashboardLayout(
        dashboardId ?? "",
        layout,
        title,
        {
            autoRefreshIntervalValue,
            autoRefreshIntervalUnit,
            timeRange,
            visibility,
        }
    );
    await queryClient.invalidateQueries({ queryKey: ["dashboard", dashboardId ?? ""] });
}

// Récupération d'un dashboard partagé par son shareId (public)
export function sharedDashboardQuery(shareId?: string) {
  return useQuery<Dashboard | undefined>({
    queryKey: ["shared-dashboard", shareId],
    queryFn: async () => {
      if (!shareId) return undefined;
      try {
        return await fetchSharedDashboard(shareId);
      } catch (e: any) {
        // if (e?.response?.status === 404) return undefined;
        throw e;
      }
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
export function sharedDashboardSourcesQuery(shareId?: string) {
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

