/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DashboardLayoutItem } from "@type/dashboardTypes";
import type { Dashboard } from "@type/dashboardTypes";
import type { ApiResponse } from "@type/api";
import api from "@services/api";
import { extractApiData } from "@utils/apiUtils";

export async function fetchDashboard(id?: string): Promise<Dashboard> {
  const res = await api.get<ApiResponse<Dashboard>>(`/dashboards/${id}`);
  return extractApiData(res);
}

export async function saveDashboardLayout(
  dashboardId: string,
  layout: DashboardLayoutItem[],
  title?: string,
  config?: {
    autoRefreshIntervalValue?: number;
    autoRefreshIntervalUnit?: string;
    timeRange?: any;
    visibility?: "public" | "private";
  }
): Promise<Dashboard> {
  const res = await api.put<ApiResponse<Dashboard>>(
    `/dashboards/${dashboardId}`,
    {
      layout,
      ...(title ? { title } : {}),
      ...config,
    }
  );
  return extractApiData(res);
}

export async function fetchDashboards(): Promise<Dashboard[]> {
  const res = await api.get<ApiResponse<Dashboard[]>>("/dashboards");
  return extractApiData(res);
}

export async function createDashboard(data: {
  title: string;
  layout?: DashboardLayoutItem[];
  visibility?: "public" | "private";
}): Promise<Dashboard> {
  const res = await api.post<ApiResponse<Dashboard>>("/dashboards", data);
  return extractApiData(res);
}

export async function enableDashboardShare(
  dashboardId: string
): Promise<{ shareId: string }> {
  const res = await api.post<ApiResponse<{ shareId: string }>>(
    `/dashboards/${dashboardId}/share/enable`
  );
  return extractApiData(res);
}

export async function disableDashboardShare(
  dashboardId: string
): Promise<{ success: boolean }> {
  const res = await api.post<ApiResponse<{ success: boolean }>>(
    `/dashboards/${dashboardId}/share/disable`
  );
  return extractApiData(res);
}

export async function fetchSharedDashboard(
  shareId: string
): Promise<Dashboard> {
  const res = await api.get<ApiResponse<Dashboard>>(
    `/dashboards/share/${shareId}`
  );
  return extractApiData(res);
}

export async function fetchSharedDashboardSources(shareId: string) {
  const res = await api.get<ApiResponse<any[]>>(
    `/dashboards/share/${shareId}/sources`
  );
  return extractApiData(res);
}

export async function deleteDashboard(
  dashboardId: string
): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<{ message: string }>>(
    `/dashboards/${dashboardId}`
  );
  return extractApiData(res);
}
