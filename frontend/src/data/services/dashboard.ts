import type { DashboardLayoutItem } from "@/core/types/dashboard-types";
import api from "./api";

export async function fetchDashboard(id?: string) {
  if (id) {
    return (await api.get(`/dashboards/${id}`)).data;
  }
  return (await api.get("/dashboards/me")).data;
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
  }
) {
  // On envoie le layout, le titre et la config avancée
  return api.put(`/dashboards/${dashboardId}`, {
    layout,
    ...(title ? { title } : {}),
    ...config,
  });
}

export async function fetchDashboards() {
  return (await api.get("/dashboards")).data;
}

export async function createDashboard(data: {
  title: string;
  layout?: DashboardLayoutItem[];
}) {
  return (await api.post("/dashboards", data)).data;
}
