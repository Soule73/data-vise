import api from "./api";
import type { DashboardLayoutItem } from "@/core/types/dashboard-types";
import type { Dashboard } from "@/core/types/dashboard-model";
import type { ApiError, ApiData, ApiResponse } from "@/core/types/api";

function extractApiError(
  err: { message: string } | { errors: Record<string, string> }
): string {
  if ("message" in err) return err.message;
  if ("errors" in err) return Object.values(err.errors).join(", ");
  return "Erreur inconnue";
}

export async function fetchDashboard(id?: string): Promise<Dashboard> {
  const res = await api.get<ApiResponse<Dashboard>>(`/dashboards/${id}`);

  if ((res.data as ApiError).error)
    throw new Error(extractApiError((res.data as ApiError).error));
  return (res.data as ApiData<Dashboard>).data;
}

export async function saveDashboardLayout(
  dashboardId: string,
  layout: DashboardLayoutItem[],
  title?: string,
  config?: {
    autoRefreshInterval?: number;
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
  if ((res.data as ApiError).error)
    throw new Error(extractApiError((res.data as ApiError).error));
  return (res.data as ApiData<Dashboard>).data;
}

export async function fetchDashboards(): Promise<Dashboard[]> {
  const res = await api.get<ApiResponse<Dashboard[]>>("/dashboards");
  if ((res.data as ApiError).error)
    throw new Error(extractApiError((res.data as ApiError).error));
  return (res.data as ApiData<Dashboard[]>).data;
}

export async function createDashboard(data: {
  title: string;
  layout?: DashboardLayoutItem[];
  visibility?: "public" | "private";
}): Promise<Dashboard> {
  const res = await api.post<ApiResponse<Dashboard>>("/dashboards", data);
  if ((res.data as ApiError).error)
    throw new Error(extractApiError((res.data as ApiError).error));
  return (res.data as ApiData<Dashboard>).data;
}
