import Widget from "../models/Widget";
import type {
  IWidget,
  WidgetCreatePayload,
  WidgetUpdatePayload,
} from "@/types/widgetType";
import type { ApiResponse } from "@/types/api";

const widgetService = {
  async list(
    userId?: string
  ): Promise<ApiResponse<IWidget[]>> {
    const widgets = await Widget.find({
      $or: [{ ownerId: userId }, { visibility: "public" }],
    });
    return { data: widgets };
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
    const widget = await Widget.findByIdAndDelete(id);
    if (!widget)
      return { error: { message: "Widget non trouvé." }, status: 404 };
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
