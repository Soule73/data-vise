import Dashboard from "../models/Dashboard";
import Widget from "../models/Widget";
import type {
  IDashboard,
  DashboardCreatePayload,
  DashboardUpdatePayload,
} from "@/types/dashboardType";
import type { IWidget } from "@/types/widgetType";
import type { ApiResponse } from "@/types/api";
import { cleanTimeRange } from "@/utils/dataSourceUtils";

const dashboardService = {
  async createDashboard(
    userId: string,
    data: DashboardCreatePayload
  ): Promise<ApiResponse<IDashboard>> {
    // Nettoyage de la timeRange selon le mode
    const timeRange = cleanTimeRange(data.timeRange);
    const dashboard = await Dashboard.create({
      ...data,
      userId,
      visibility: data.visibility ?? "private",
      autoRefreshInterval: data.autoRefreshInterval ?? 60000,
      autoRefreshIntervalValue: data.autoRefreshIntervalValue,
      autoRefreshIntervalUnit: data.autoRefreshIntervalUnit,
      timeRange,
    });
    return { data: dashboard };
  },
  async getDashboardById(id: string): Promise<ApiResponse<IDashboard>> {
    const dashboard = await Dashboard.findById(id);
    if (!dashboard)
      return { error: { message: "Dashboard non trouvé." }, status: 404 };
    return { data: dashboard };
  },
  async updateDashboard(
    id: string,
    data: DashboardUpdatePayload
  ): Promise<ApiResponse<IDashboard>> {
    // Nettoyage de la timeRange selon le mode
    const timeRange = cleanTimeRange(data.timeRange);
    const updated = await Dashboard.findByIdAndUpdate(
      id,
      {
        ...data,
        visibility: data.visibility ?? "private",
        autoRefreshInterval: data.autoRefreshInterval ?? 60000,
        autoRefreshIntervalValue: data.autoRefreshIntervalValue,
        autoRefreshIntervalUnit: data.autoRefreshIntervalUnit,
        timeRange,
      },
      { new: true }
    );
    if (!updated)
      return { error: { message: "Dashboard non trouvé." }, status: 404 };
    return { data: updated };
  },
  async deleteDashboard(id: string): Promise<ApiResponse<{ message: string }>> {
    const dashboard = await Dashboard.findByIdAndDelete(id);
    if (!dashboard)
      return { error: { message: "Dashboard non trouvé." }, status: 404 };
    return { data: { message: "Dashboard supprimé." } };
  },
  async debugWidgets(): Promise<IWidget[]> {
    return await Widget.find({}, { widgetId: 1, _id: 1, title: 1 });
  },
  async listUserDashboards(userId: string): Promise<ApiResponse<IDashboard[]>> {
    const dashboards = await Dashboard.find({
      $or: [{ ownerId: userId }, { visibility: "public" }],
    });
    return { data: dashboards };
  },
};

export default dashboardService;
