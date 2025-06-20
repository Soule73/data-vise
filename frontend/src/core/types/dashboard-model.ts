import type { Widget } from "../types/widget-types";

export type IntervalUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

export interface DashboardTimeRange {
  from?: string; // ISO string (date de début)
  to?: string; // ISO string (date de fin)
  intervalValue?: number; // valeur numérique de l'intervalle (ex: 5)
  intervalUnit?: IntervalUnit; // unité (minute, heure, etc.)
}

export interface Dashboard {
  _id?: string;
  title: string;
  layout: any[];
  ownerId: string;
  autoRefreshInterval: number; // ms
  autoRefreshIntervalValue?: number; // valeur numérique (ex: 5)
  autoRefreshIntervalUnit?: IntervalUnit; // unité (minute, heure, etc.)
  timeRange: DashboardTimeRange;
  visibility?: "public" | "private";
  createdAt?: string;
  updatedAt?: string;
  widgets: Widget[];
  // Partage public
  shareEnabled?: boolean;
  shareId?: string | null;
}
