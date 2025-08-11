/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { WidgetType } from "@type/widget-types";
import type { Filter } from "@type/visualization";
import type {
  Metric,
  ScatterMetricConfig,
  BubbleMetricConfig,
  RadarMetricConfig,
} from "@type/metricBucketTypes";
import type { ColumnFieldConfig, GroupFieldConfig } from "@type/widgetTypes";

// Extraction de tous les champs utilisés par les métriques, y compris x, y, r pour scatter/bubble
function extractAllMetricFields(
  metrics?:
    | Metric[]
    | ScatterMetricConfig[]
    | BubbleMetricConfig[]
    | RadarMetricConfig[]
): string[] {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap(
    (
      m:
        | Metric
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
      if (typeof (m as Metric).field === "string")
        scatterFields.push((m as Metric).field);
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

function extractAllGroupFields(config: GroupFieldConfig): string[] {
  const groupFields: string[] = [];
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
    | Metric[]
    | ScatterMetricConfig[]
    | BubbleMetricConfig[]
    | RadarMetricConfig[];
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
