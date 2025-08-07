/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { WidgetType } from "@/core/types/widget-types";
import type { Filter } from "../types/visualization";
import type {
  MetricConfig,
  ScatterMetricConfig,
  BubbleMetricConfig,
  RadarMetricConfig,
  BucketConfig,
} from "@/core/types/metric-bucket-types";

// Extraction de tous les champs utilisés par les métriques, y compris x, y, r pour scatter/bubble
function extractAllMetricFields(
  metrics?:
    | MetricConfig[]
    | ScatterMetricConfig[]
    | BubbleMetricConfig[]
    | RadarMetricConfig[]
): string[] {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap(
    (
      m:
        | MetricConfig
        | ScatterMetricConfig
        | BubbleMetricConfig
        | RadarMetricConfig
    ) => {
      const scatterFields: string[] = [];
      // Scatter/Bubble : x, y, r
      if (typeof (m as ScatterMetricConfig).x === "string")
        scatterFields.push((m as ScatterMetricConfig).x);
      if (typeof (m as ScatterMetricConfig).y === "string")
        scatterFields.push((m as ScatterMetricConfig).y);
      if (typeof (m as BubbleMetricConfig).r === "string")
        scatterFields.push((m as BubbleMetricConfig).r);
      // Radar : fields (array)
      if (Array.isArray((m as RadarMetricConfig).fields))
        scatterFields.push(
          ...((m as RadarMetricConfig).fields as string[]).filter(Boolean)
        );
      // Standard metric : field
      if (typeof (m as MetricConfig).field === "string")
        scatterFields.push((m as MetricConfig).field);
      // Récursif pour sous-métriques
      if (
        typeof m === "object" &&
        m !== null &&
        "metrics" in m &&
        Array.isArray((m as any).metrics)
      ) {
        scatterFields.push(...extractAllMetricFields((m as any).metrics));
      }
      return scatterFields;
    }
  );
}

// Extraction de tous les champs de groupement (bucket, groupBy, xField, nameField, valueField...)
interface GroupFieldConfig {
  bucket?: BucketConfig;
  xField?: string;
  groupBy?: string;
  nameField?: string;
  valueField?: string;
  dataConfig?: {
    groupByFields?: string[];
    axisFields?: string[];
  };
  [key: string]: unknown;
}
function extractAllGroupFields(config: GroupFieldConfig): string[] {
  const groupFields: string[] = [];
  if (config.bucket?.field) groupFields.push(config.bucket.field);
  if (config.xField) groupFields.push(config.xField);
  if (config.groupBy) groupFields.push(config.groupBy);
  if (config.nameField) groupFields.push(config.nameField);
  if (config.valueField) groupFields.push(config.valueField);
  // DataConfig (radar, etc.)
  if (config.dataConfig) {
    if (Array.isArray(config.dataConfig.groupByFields)) {
      groupFields.push(...config.dataConfig.groupByFields);
    }
    if (Array.isArray(config.dataConfig.axisFields)) {
      groupFields.push(...config.dataConfig.axisFields);
    }
  }
  return groupFields.filter(Boolean);
}

// Extraction de tous les champs de colonnes (table)
interface ColumnFieldConfig {
  columns?: Array<string | { key: string; label: string }>;
}
function extractAllColumnFields(config: ColumnFieldConfig): string[] {
  if (Array.isArray(config.columns)) {
    return config.columns
      .map((c) => (typeof c === "string" ? c : c.key))
      .filter(Boolean);
  }
  return [];
}

// Extraction de tous les champs de filtre (field uniquement)
function extractAllFilterFields(filters: Filter[] = []): string[] {
  if (!Array.isArray(filters)) return [];
  return filters
    .map((f: Filter) => f.field || null)
    .filter((v: string | null): v is string => !!v);
}

export function getWidgetDataFields(
  config: {
    metrics?:
    | MetricConfig[]
    | ScatterMetricConfig[]
    | BubbleMetricConfig[]
    | RadarMetricConfig[];
    bucket?: BucketConfig;
    columns?: Array<string | { key: string; label: string }>;
    filters?: Filter[];
    [key: string]: any;
  },
  // type?: WidgetType
): string[] {
  if (!config) return [];
  let fields: string[] = [];

  // 1. Champs de groupement (bucket, groupBy, xField, nameField, valueField, dataConfig...)
  const groupFields = extractAllGroupFields(config as GroupFieldConfig);

  // 2. Colonnes explicites (table)
  const columnFields = extractAllColumnFields(config as ColumnFieldConfig);

  // 3. Champs de métriques (récursif, gère tous les cas)
  const metricFields = extractAllMetricFields(config.metrics);

  // 4. Champs de filtres (field uniquement, tous les filtres)
  const filterFields = extractAllFilterFields(config.filters);

  // 5. Agrégation finale
  fields = [
    ...groupFields,
    ...columnFields,
    ...metricFields,
    ...filterFields,
  ].filter(Boolean);

  // Déduplique les champs
  return Array.from(new Set(fields));
}
