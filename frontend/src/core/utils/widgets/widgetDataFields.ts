/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Filter } from "@type/visualization";
import type {
  Metric,
  ScatterMetricConfig,
  BubbleMetricConfig,
  RadarMetricConfig,
  MultiBucketConfig,
} from "@type/metricBucketTypes";

// Extraction de tous les champs utilisés par les métriques, incluant les champs spécialisés
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
      const metricFields: string[] = [];

      // Scatter/Bubble : champs x, y, r
      if (typeof (m as ScatterMetricConfig).x === "string")
        metricFields.push((m as ScatterMetricConfig).x);
      if (typeof (m as ScatterMetricConfig).y === "string")
        metricFields.push((m as ScatterMetricConfig).y);
      if (typeof (m as BubbleMetricConfig).r === "string")
        metricFields.push((m as BubbleMetricConfig).r);

      // Radar : champs fields (array)
      if (Array.isArray((m as RadarMetricConfig).fields))
        metricFields.push(
          ...((m as RadarMetricConfig).fields as string[]).filter(Boolean)
        );

      // Métrique standard : field
      if (typeof (m as Metric).field === "string")
        metricFields.push((m as Metric).field);

      // Filtres dataset pour métriques spécialisées
      if (Array.isArray((m as any).datasetFilters)) {
        metricFields.push(
          ...extractDatasetFilterFields((m as any).datasetFilters)
        );
      }

      return metricFields;
    }
  );
}

// Extraction des champs des filtres dataset
function extractDatasetFilterFields(datasetFilters: any[] = []): string[] {
  if (!Array.isArray(datasetFilters)) return [];
  return datasetFilters
    .map((filter: any) => filter.field || null)
    .filter((field: string | null): field is string => !!field);
}

// Extraction des champs des buckets multiples
function extractBucketFields(buckets: MultiBucketConfig[] = []): string[] {
  if (!Array.isArray(buckets)) return [];
  return buckets
    .map((bucket: MultiBucketConfig) => bucket.field || null)
    .filter((field: string | null): field is string => !!field);
}

// Extraction de tous les champs de colonnes (table)
function extractAllColumnFields(config: { columns?: Array<string | { key: string; label: string }> }): string[] {
  if (Array.isArray(config.columns)) {
    return config.columns
      .map((c: string | { key: string; label: string }) => (typeof c === "string" ? c : c.key))
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
    globalFilters?: Filter[];
    buckets?: MultiBucketConfig[];
    [key: string]: any;
  },
): string[] {
  if (!config) return [];

  // 1. Colonnes explicites (table)
  const columnFields = extractAllColumnFields(config);

  // 2. Champs de métriques (incluant champs spécialisés et datasetFilters)
  const metricFields = extractAllMetricFields(config.metrics);

  // 3. Champs de filtres locaux
  const filterFields = extractAllFilterFields(config.filters);

  // 4. Champs de filtres globaux
  const globalFilterFields = extractAllFilterFields(config.globalFilters);

  // 5. Champs des buckets multiples
  const bucketFields = extractBucketFields(config.buckets);

  // 6. Agrégation finale avec déduplication
  const allFields = [
    ...columnFields,
    ...metricFields,
    ...filterFields,
    ...globalFilterFields,
    ...bucketFields,
  ].filter(Boolean);

  return Array.from(new Set(allFields));
}
