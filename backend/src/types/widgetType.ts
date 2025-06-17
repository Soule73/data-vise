import mongoose from "mongoose";

export interface WidgetHistoryItem {
  userId: mongoose.Types.ObjectId;
  date: Date;
  action: "create" | "update" | "delete";
  changes?: Record<string, unknown>;
}

export interface IWidget extends Document {
  widgetId: string;
  title: string;
  type: string;
  dataSourceId: mongoose.Types.ObjectId;
  config?: Record<string, unknown>;
  ownerId: mongoose.Types.ObjectId;
  visibility: "public" | "private";
  history?: WidgetHistoryItem[];
}

export interface WidgetBasePayload {
  widgetId?: string;
  title?: string;
  type?: string;
  dataSourceId?: mongoose.Types.ObjectId;
  config?: Record<string, unknown>;
  visibility?: "public" | "private";
  userId?: mongoose.Types.ObjectId;
}

export interface WidgetCreatePayload extends WidgetBasePayload {
  widgetId: string;
  title: string;
  type: string;
  dataSourceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

export type WidgetUpdatePayload = Partial<WidgetBasePayload>;
