import Dashboard from "../models/Dashboard";
import Widget from "../models/Widget";

// Utilitaire pour nettoyer la timeRange selon le mode
function cleanTimeRange(timeRange: any) {
  if (!timeRange) return {};
  // Mode relatif : intervalValue + intervalUnit
  if (timeRange.intervalValue && timeRange.intervalUnit) {
    return {
      intervalValue: timeRange.intervalValue,
      intervalUnit: timeRange.intervalUnit,
    };
  }
  // Mode absolu : from/to
  const cleaned: any = {};
  if (timeRange.from)
    cleaned.from =
      typeof timeRange.from === "string"
        ? new Date(timeRange.from)
        : timeRange.from;
  if (timeRange.to)
    cleaned.to =
      typeof timeRange.to === "string" ? new Date(timeRange.to) : timeRange.to;
  return cleaned;
}

const dashboardService = {
  async getMyDashboard(userId: string) {
    let dashboard = await Dashboard.findOne({ userId });
    if (!dashboard) {
      dashboard = await Dashboard.create({
        userId,
        ownerId: userId,
        title: "Mon dashboard",
        layout: [],
      });
    }
    const layout = dashboard.layout || [];
    const widgetIds = layout.map((item: any) => item.widgetId);
    const widgets = await Widget.find({ widgetId: { $in: widgetIds } });
    const widgetMap = new Map(widgets.map((w) => [w.widgetId, w]));
    const notFound = widgetIds.filter((id) => !widgetMap.has(id));
    if (notFound.length > 0) {
      console.warn("Widget(s) non trouvés pour le dashboard:", notFound);
    }
    const enrichedLayout = layout.map((item: any) => {
      const base = item._doc ? item._doc : item;
      return {
        widgetId: base.widgetId,
        w: base.w,
        h: base.h,
        x: base.x,
        y: base.y,
        widget: widgetMap.get(base.widgetId) || null,
      };
    });
    return { data: { ...dashboard.toObject(), layout: enrichedLayout } };
  },
  async createDashboard(userId: string, data: any) {
    // Nettoyage de la timeRange selon le mode
    const timeRange = cleanTimeRange(data.timeRange);
    const dashboard = await Dashboard.create({
      ...data,
      userId,
      autoRefreshInterval: data.autoRefreshInterval ?? 60000,
      autoRefreshIntervalValue: data.autoRefreshIntervalValue,
      autoRefreshIntervalUnit: data.autoRefreshIntervalUnit,
      timeRange,
    });
    return { data: dashboard };
  },
  async getDashboardById(id: string) {
    const dashboard = await Dashboard.findById(id);
    if (!dashboard)
      return { error: { message: "Dashboard non trouvé." }, status: 404 };
    return { data: dashboard };
  },
  async updateDashboard(id: string, data: any) {
    // Nettoyage de la timeRange selon le mode
    const timeRange = cleanTimeRange(data.timeRange);
    const dashboard = await Dashboard.findByIdAndUpdate(
      id,
      {
        ...data,
        autoRefreshInterval: data.autoRefreshInterval ?? 60000,
        autoRefreshIntervalValue: data.autoRefreshIntervalValue,
        autoRefreshIntervalUnit: data.autoRefreshIntervalUnit,
        timeRange,
      },
      { new: true }
    );
    if (!dashboard)
      return { error: { message: "Dashboard non trouvé." }, status: 404 };
    return { data: dashboard };
  },
  async deleteDashboard(id: string) {
    const dashboard = await Dashboard.findByIdAndDelete(id);
    if (!dashboard)
      return { error: { message: "Dashboard non trouvé." }, status: 404 };
    return { data: { message: "Dashboard supprimé." } };
  },
  async debugWidgets() {
    return await Widget.find({}, { widgetId: 1, _id: 1, title: 1 });
  },
  async listUserDashboards(userId: string) {
    return await Dashboard.find({ ownerId: userId });
  },
};

export default dashboardService;
