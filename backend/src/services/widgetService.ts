import Widget from '../models/Widget';

const widgetService = {
  async list(dashboardId?: any) {
    const filter: any = dashboardId ? { dashboardId } : {};
    return await Widget.find(filter);
  },
  async create({ widgetId, title, type, dataSourceId, config, userId }: any) {
    if (!widgetId || !title || !type || !dataSourceId || !userId) return { error: { message: 'Champs requis manquants.' }, status: 400 };
    const widget = await Widget.create({
      widgetId,
      title,
      type,
      dataSourceId,
      config,
      ownerId: userId,
      history: [{ userId, date: new Date(), action: 'create', changes: { widgetId, title, type, dataSourceId, config } }]
    });
    return { data: widget };
  },
  async update(id: string, body: any) {
    const widget = await Widget.findById(id);
    if (!widget) return { error: { message: 'Widget non trouvé.' }, status: 404 };
    const old = widget.toObject();
    const changes: Record<string, any> = {};
    for (const key of ['title', 'type', 'dataSourceId', 'config', 'visibility']) {
      if (body[key] !== undefined && body[key] !== (old as any)[key]) {
        changes[key] = { before: (old as any)[key], after: body[key] };
      }
    }
    if (Object.keys(changes).length > 0 && body.userId) {
      if (!widget.history) widget.history = [];
      widget.history.push({ userId: body.userId, date: new Date(), action: 'update', changes });
    }
    Object.assign(widget, body);
    await widget.save();
    return { data: widget };
  },
  async remove(id: string) {
    const widget = await Widget.findByIdAndDelete(id);
    if (!widget) return { error: { message: 'Widget non trouvé.' }, status: 404 };
    return { data: { success: true } };
  },
  async getById(id: string) {
    const widget = await Widget.findById(id);
    if (!widget) return { error: { message: 'Widget non trouvé.' }, status: 404 };
    return { data: widget };
  },
};

export default widgetService;
