import Widget from "../models/Widget";
import Dashboard from "../models/Dashboard";
import type {
  IWidget,
  WidgetCreatePayload,
  WidgetUpdatePayload,
} from "@/types/widgetType";
import type { ApiResponse } from "@/types/api";

const widgetService = {
  async list(userId?: string): Promise<ApiResponse<IWidget[]>> {
    const widgets = await Widget.find({
      $or: [{ ownerId: userId }, { visibility: "public" }],
    });
    // Pour chaque widget, vérifier s'il est utilisé dans au moins un dashboard
    const widgetsWithUsage = await Promise.all(
      widgets.map(async (w) => {
        const count = await Dashboard.countDocuments({
          layout: { $elemMatch: { widgetId: w.widgetId } },
        });
        return { ...w.toObject(), isUsed: count > 0 };
      })
    );
    return { data: widgetsWithUsage };
  },
  async create(payload: WidgetCreatePayload): Promise<ApiResponse<IWidget>> {
    const { widgetId, title, type, dataSourceId, config, userId } = payload;
    if (!widgetId || !title || !type || !dataSourceId || !userId)
      return { error: { message: "Champs requis manquants." }, status: 400 };
    const widget = await Widget.create({
      widgetId,
      title,
      type,
      dataSourceId,
      config,
      ownerId: userId,
      history: [
        {
          userId,
          date: new Date(),
          action: "create",
          changes: { widgetId, title, type, dataSourceId, config },
        },
      ],
    });
    return { data: widget };
  },
  async update(
    id: string,
    body: WidgetUpdatePayload
  ): Promise<ApiResponse<IWidget>> {
    const widget = await Widget.findById(id);
    if (!widget)
      return { error: { message: "Widget non trouvé." }, status: 404 };
    const old = widget.toObject() as unknown as Record<string, unknown>;
    const changes: Record<string, { before: unknown; after: unknown }> = {};
    for (const key of [
      "title",
      "type",
      "dataSourceId",
      "config",
      "visibility",
    ] as const) {
      if (body[key] !== undefined && body[key] !== old[key]) {
        changes[key] = { before: old[key], after: body[key] };
      }
    }
    if (Object.keys(changes).length > 0 && body.userId) {
      if (!widget.history) widget.history = [];
      widget.history.push({
        userId: body.userId,
        date: new Date(),
        action: "update",
        changes,
      });
    }
    Object.assign(widget, body);
    await widget.save();
    return { data: widget };
  },
  async remove(id: string): Promise<ApiResponse<{ success: boolean }>> {
    // Vérifier si le widget est utilisé dans un dashboard
    const widget = await Widget.findById(id);
    if (!widget)
      return { error: { message: "Widget non trouvé." }, status: 404 };
    const count = await Dashboard.countDocuments({
      layout: { $elemMatch: { widgetId: widget.widgetId } },
    });
    if (count > 0) {
      return {
        error: {
          message:
            "Impossible de supprimer un widget utilisé dans un dashboard.",
        },
        status: 400,
      };
    }
    await Widget.findByIdAndDelete(id);
    return { data: { success: true } };
  },
  async getById(id: string): Promise<ApiResponse<IWidget>> {
    const widget = await Widget.findById(id);
    if (!widget)
      return { error: { message: "Widget non trouvé." }, status: 404 };
    return { data: widget };
  },
};

export default widgetService;
