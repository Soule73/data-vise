import type { WidgetType } from "@/core/types/widget-types";

// Extraction récursive de tous les fields dans metrics (y compris imbriqués)
function extractAllMetricFields(metrics: any): string[] {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap((m: any) => {
    if (Array.isArray(m.metrics)) {
      return extractAllMetricFields(m.metrics);
    } else if (typeof m.field === "string") {
      return [m.field];
    } else if (Array.isArray(m.fields)) {
      return m.fields.filter(Boolean);
    }
    return [];
  });
}

// Extraction de tous les champs de groupement (bucket, groupBy, xField, nameField, valueField...)
function extractAllGroupFields(config: any): string[] {
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
function extractAllColumnFields(config: any): string[] {
  if (Array.isArray(config.columns)) {
    return config.columns
      .map((c: any) => (typeof c === "string" ? c : c.key))
      .filter(Boolean);
  }
  return [];
}

// Extraction de tous les champs de filtre (field uniquement)
function extractAllFilterFields(filters: any): string[] {
  if (Array.isArray(filters)) {
    return filters
      .map((f: any) => (f && typeof f.field === "string" ? f.field : null))
      .filter((v: string | null): v is string => !!v);
  } else if (filters && typeof filters === "object") {
    if (typeof filters.field === "string") {
      return [filters.field];
    }
  }
  return [];
}

export function getWidgetDataFields(
  //@ts-ignore
  type: WidgetType,
  config: any
): string[] {
  if (!config) return [];
  let fields: string[] = [];

  // 1. Champs de groupement (bucket, groupBy, xField, nameField, valueField, dataConfig...)
  const groupFields = extractAllGroupFields(config);

  // 2. Colonnes explicites (table)
  const columnFields = extractAllColumnFields(config);

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
