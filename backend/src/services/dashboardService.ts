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
import { randomUUID } from "crypto";

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
  // async getDashboardById(
  //   id: string
  // ): Promise<ApiResponse<IDashboard & { widgets: IWidget[] }>> {
  //   const dashboard = await Dashboard.findById(id);
  //   if (!dashboard)
  //     return { error: { message: "Dashboard non trouvé." }, status: 404 };
  //   // Récupérer les widgetIds du layout
  //   const widgetIds = dashboard.layout.map((item) => item.widgetId);
  //   // Récupérer les widgets correspondants
  //   const widgets = await Widget.find({ widgetId: { $in: widgetIds } });
  //   // Retourner le dashboard + la liste des widgets
  //   return { data: { ...dashboard.toObject(), widgets } };
  // },

  // { dashboard: IDashboard; widgets: IWidget[] }
  async getDashboardById(id: string): Promise<ApiResponse<IDashboard>> {
    const dashboard = await Dashboard.findById(id);
    if (!dashboard)
      return { error: { message: "Dashboard non trouvé." }, status: 404 };
    // Récupérer les widgetIds du layout
    const widgetIds = dashboard.layout.map((item: any) => item.widgetId);
    // Récupérer les widgets correspondants (objets JS purs)
    const widgets = await Widget.find({ widgetId: { $in: widgetIds } }).lean();
    // Créer une map widgetId -> widget
    const widgetMap = Object.fromEntries(widgets.map((w) => [w.widgetId, w]));
    // Hydrater chaque item du layout avec le widget correspondant (objet plat)
    const hydratedLayout = dashboard.layout.map((item: any) => {
      const plainItem = item.toObject ? item.toObject() : { ...item };
      return {
        ...plainItem,
        widget: widgetMap[plainItem.widgetId] || null,
      };
    });
    // Retourner le dashboard avec le layout hydraté (objets JS plats)
    const dashboardObj = dashboard.toObject();
    dashboardObj.layout = hydratedLayout;
    return { data: dashboardObj };
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
  // Activer le partage public (génère un shareId)
  async enableShare(dashboardId: string): Promise<ApiResponse<{ shareId: string }>> {
    const shareId = randomUUID();
    const updated = await Dashboard.findByIdAndUpdate(
      dashboardId,
      { shareEnabled: true, shareId },
      { new: true }
    );
    if (!updated) return { error: { message: "Dashboard non trouvé." }, status: 404 };
    if (!updated.shareId) return { error: { message: "Erreur lors de l'activation du partage." }, status: 500 };
    return { data: { shareId: updated.shareId as string } };
  },
  // Désactiver le partage public (supprime le shareId)
  async disableShare(dashboardId: string): Promise<ApiResponse<{ success: boolean }>> {
    const updated = await Dashboard.findByIdAndUpdate(
      dashboardId,
      { shareEnabled: false, shareId: null },
      { new: true }
    );
    if (!updated) return { error: { message: "Dashboard non trouvé." }, status: 404 };
    return { data: { success: true } };
  },
  // Récupérer un dashboard partagé par shareId
  async getSharedDashboard(shareId: string): Promise<ApiResponse<IDashboard>> {
    const dashboard = await Dashboard.findOne({ shareId, shareEnabled: true });
    if (!dashboard) return { error: { message: "Dashboard non trouvé ou non partagé." }, status: 404 };
    // Hydrate layout avec widgets comme getDashboardById
    const widgetIds = dashboard.layout.map((item: any) => item.widgetId);
    const widgets = await Widget.find({ widgetId: { $in: widgetIds } }).lean();
    const widgetMap = Object.fromEntries(widgets.map((w) => [w.widgetId, w]));
    const hydratedLayout = dashboard.layout.map((item: any) => {
      const plainItem = item.toObject ? item.toObject() : { ...item };
      return {
        ...plainItem,
        widget: widgetMap[plainItem.widgetId] || null,
      };
    });
    const dashboardObj = dashboard.toObject();
    dashboardObj.layout = hydratedLayout;
    return { data: dashboardObj };
  },
  // Récupérer les sources d'un dashboard partagé par shareId
  async getSharedDashboardSources(shareId: string) {
    // On vérifie que le dashboard est bien partagé
    const dashboard = await Dashboard.findOne({ shareId, shareEnabled: true });
    if (!dashboard) return { error: { message: "Dashboard non trouvé ou non partagé." }, status: 404 };
    // On récupère toutes les sources utilisées dans le layout
    const widgetIds = dashboard.layout.map((item: any) => item.widgetId);
    const widgets = await Widget.find({ widgetId: { $in: widgetIds } }).lean();
    // On extrait tous les dataSourceId uniques utilisés par les widgets
    const dataSourceIds = [
      ...new Set(
        widgets
          .map((w: any) => w.dataSourceId)
          .filter((id: any) => !!id)
      ),
    ];
    // On récupère les sources
    const DataSource = require("../models/DataSource").default;
    const sources = await DataSource.find({ _id: { $in: dataSourceIds } }).lean();
    return { data: sources };
  },
};

export default dashboardService;
