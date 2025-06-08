import Dashboard from '../models/Dashboard';
import Widget from '../models/Widget';

const dashboardService = {
  async getMyDashboard(userId: string) {
    let dashboard = await Dashboard.findOne({ userId });
    if (!dashboard) {
      dashboard = await Dashboard.create({ userId, ownerId: userId, title: 'Mon dashboard', layout: [] });
    }
    const layout = dashboard.layout || [];
    const widgetIds = layout.map((item: any) => item.widgetId);
    const widgets = await Widget.find({ widgetId: { $in: widgetIds } });
    const widgetMap = new Map(widgets.map(w => [w.widgetId, w]));
    const notFound = widgetIds.filter(id => !widgetMap.has(id));
    if (notFound.length > 0) {
      console.warn('Widget(s) non trouvés pour le dashboard:', notFound);
    }
    const enrichedLayout = layout.map((item: any) => {
      const base = item._doc ? item._doc : item;
      return {
        widgetId: base.widgetId,
        w: base.w,
        h: base.h,
        x: base.x,
        y: base.y,
        widget: widgetMap.get(base.widgetId) || null
      };
    });
    return { data: { ...dashboard.toObject(), layout: enrichedLayout } };
  },
  async createDashboard(userId: string, body: any) {
    const dashboard = await Dashboard.create({
      userId,
      title: body.title || 'Nouveau dashboard',
      layout: body.layout || [],
      ownerId: userId,
      history: [{ userId, date: new Date(), action: 'create', changes: { title: body.title, layout: body.layout } }]
    });
    return { data: dashboard };
  },
  async getDashboardById(id: string) {
    const dashboard = await Dashboard.findById(id);
    if (!dashboard) return { error: { message: 'Dashboard non trouvé.' }, status: 404 };
    return { data: dashboard };
  },
  async updateDashboard(id: string, body: any) {
    const dashboard = await Dashboard.findById(id);
    if (!dashboard) return { error: { message: 'Dashboard non trouvé.' }, status: 404 };
    const old = dashboard.toObject();
    const changes: Record<string, any> = {};
    for (const key of ['title', 'layout', 'visibility']) {
      if (body[key] !== undefined && JSON.stringify(body[key]) !== JSON.stringify((old as any)[key])) {
        changes[key] = { before: (old as any)[key], after: body[key] };
      }
    }
    if (Object.keys(changes).length > 0 && body.userId) {
      if (!dashboard.history) dashboard.history = [];
      dashboard.history.push({ userId: body.userId, date: new Date(), action: 'update', changes });
    }
    Object.assign(dashboard, body);
    await dashboard.save();
    return { data: dashboard };
  },
  async deleteDashboard(id: string) {
    const dashboard = await Dashboard.findByIdAndDelete(id);
    if (!dashboard) return { error: { message: 'Dashboard non trouvé.' }, status: 404 };
    return { data: { message: 'Dashboard supprimé.' } };
  },
  async debugWidgets() {
    return await Widget.find({}, { widgetId: 1, _id: 1, title: 1 });
  },
  async listUserDashboards(userId: string) {
    return await Dashboard.find({ ownerId: userId });
  },
};

export default dashboardService;
