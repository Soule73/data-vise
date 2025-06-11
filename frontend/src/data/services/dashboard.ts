import api from './api';
import type { DashboardLayoutItem } from '@/core/hooks/useDashboard';

export async function fetchDashboard(id?: string) {
  if (id) {
    return (await api.get(`/dashboards/${id}`)).data;
  }
  return (await api.get('/dashboards/me')).data;
}

export async function fetchSources() {
  return (await api.get('/sources')).data;
}

export async function saveDashboardLayout(dashboardId: string, layout: DashboardLayoutItem[], title?: string) {
  // On envoie le layout tel quel (width: string %, height: px)
  return api.put(`/dashboards/${dashboardId}`, title ? { layout, title } : { layout });
}

export async function fetchDashboards() {
  return (await api.get('/dashboards')).data;
}

export async function createDashboard(data: { title: string; layout?: DashboardLayoutItem[] }) {
  return (await api.post('/dashboards', data)).data;
}
