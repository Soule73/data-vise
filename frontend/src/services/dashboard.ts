import api from './api';
import type { DashboardLayoutItem } from '@/hooks/useDashboard';

export async function fetchDashboard() {
  return (await api.get('/dashboards/me')).data;
}

export async function fetchSources() {
  return (await api.get('/sources')).data;
}

export async function saveDashboardLayout(dashboardId: string, layout: DashboardLayoutItem[]) {
  return api.put(`/dashboards/${dashboardId}`, { layout });
}
