import mongoose from "mongoose";
import { IWidget } from "./widgetType";

export interface DashboardLayoutItem {
  widgetId: string;
  width: string; // ex: "48%"
  height: number; // px
  x: number;
  y: number;
  widget?: IWidget;
}

export interface DashboardHistoryItem {
  userId: mongoose.Types.ObjectId;
  date: Date;
  action: "create" | "update" | "delete";
  changes?: Record<string, unknown>;
}

export interface IDashboard extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  layout: DashboardLayoutItem[];
  ownerId: mongoose.Types.ObjectId;
  visibility: "public" | "private";
  createdAt: Date;
  updatedAt: Date;
  history?: DashboardHistoryItem[];
}

export interface DashboardBasePayload {
  title?: string;
  layout?: DashboardLayoutItem[];
  autoRefreshInterval?: number;
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: string;
  timeRange?: unknown;
  visibility?: "public" | "private";
  [key: string]: unknown;
}

export interface DashboardCreatePayload extends DashboardBasePayload {
  title: string;
  layout: DashboardLayoutItem[];
  ownerId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  visibility: "public" | "private";
}

export type DashboardUpdatePayload = Partial<DashboardBasePayload>;
