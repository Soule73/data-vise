/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import {
  aggregate,
  // getLabels, getLegendPosition, getTitle, getTitleAlign
} from "@utils/chartUtils";
import { useMultiBucketProcessor } from "@hooks/common/useMultiBucketProcessor";

export function useTableWidgetLogic(data: any[], config: any) {
  // Process data with multi-bucket system
  const processedData = useMultiBucketProcessor(data, config);

  const hasMetrics = Array.isArray(config.metrics) && config.metrics.length > 0;
  const hasBucket = config.bucket && config.bucket.field;
  const hasMultiBuckets = Array.isArray(config.buckets) && config.buckets.length > 0;

  const { columns, displayData } = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    let columns: { key: string; label: string }[] = [];
    let displayData: any[] = [];

    // Support multi-bucket system
    if (hasMultiBuckets && hasMetrics && processedData && processedData.length > 0) {
      // Colonnes pour buckets
      const bucketColumns = config.buckets.map((bucket: any) => ({
        key: bucket.field,
        label: bucket.label || bucket.field,
      }));

      // Colonnes pour métriques
      const metricColumns = config.metrics.map((m: any) => ({
        key: m.field,
        label: m.label || m.field,
      }));

      columns = [...bucketColumns, ...metricColumns];

      displayData = processedData.map((item: any) => {
        const row: any = {};

        // Ajouter les valeurs de buckets
        if (typeof item.key === 'object') {
          Object.assign(row, item.key);
        } else {
          // Single bucket key
          row[config.buckets[0].field] = item.key;
        }

        // Ajouter les valeurs de métriques
        item.metrics.forEach((metric: any, index: number) => {
          const metricConfig = config.metrics[index];
          if (metricConfig) {
            row[metricConfig.field] = metric.value;
          }
        });

        return row;
      });
    }
    // Legacy support
    else if (hasMetrics && hasBucket && config.bucket && config.metrics) {
      const bucketLabel = config.bucket.label || config.bucket.field;
      columns = [
        { key: config.bucket.field, label: bucketLabel },
        ...config.metrics.map((m: any) => ({
          key: m.field,
          label: m.label || m.field,
        })),
      ];
      const groups: Record<string, any[]> = {};
      safeData.forEach((row: any) => {
        const key = String(row[config.bucket.field]);
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });
      displayData = Object.entries(groups).map(([bucketVal, rows]) => {
        const summary: any = { [config.bucket.field]: bucketVal };
        config.metrics.forEach((metric: any) => {
          summary[metric.field] = aggregate(rows, metric.agg, metric.field);
        });
        return summary;
      });
    } else if (Array.isArray(config.columns) && config.columns.length > 0) {
      columns = config.columns.map((col: any) => ({
        key: col.key,
        label: col.label || col.key,
      }));
      if (config.groupBy && typeof config.groupBy === "string") {
        const groupKey = config.groupBy as string;
        const groups: Record<string, any[]> = {};
        safeData.forEach((row: any) => {
          const key = String(row[groupKey]);
          if (!groups[key]) groups[key] = [];
          groups[key].push(row);
        });
        displayData = Object.entries(groups).map(([groupVal, rows]) => {
          const summary: any = { [groupKey]: groupVal, count: rows.length };
          columns.forEach((col: any) => {
            if (col.key !== groupKey) {
              const nums = rows
                .map((r: any) => Number(r[col.key]))
                .filter((v: number) => !isNaN(v));
              if (nums.length === rows.length && nums.length > 0) {
                summary[col.key] = nums.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
              } else {
                summary[col.key] = rows[0][col.key] ?? "";
              }
            }
          });
          return summary;
        });
      } else {
        displayData = safeData;
      }
    }
    return { columns, displayData };
  }, [hasMetrics, hasBucket, hasMultiBuckets, config.bucket, config.buckets, config.metrics, config.columns, config.groupBy, data, processedData]);

  // Détermination du titre à afficher
  let tableTitle = "Tableau";
  if (config.widgetParams && config.widgetParams.title) {
    tableTitle = config.widgetParams.title;
  } else if (hasMultiBuckets && hasMetrics) {
    const bucketLabels = config.buckets
      .map((bucket: any) => bucket.label || bucket.field)
      .join(", ");
    tableTitle = `Tableau groupé par ${bucketLabels}`;
  } else if (hasBucket && hasMetrics) {
    const bucketLabel =
      config.bucket && config.bucket.label
        ? config.bucket.label
        : config.bucket
          ? config.bucket.field
          : "";
    tableTitle = `Tableau groupé par ${bucketLabel}`;
  } else if (config.groupBy) {
    tableTitle = `Tableau groupé par ${config.groupBy}`;
  }

  return { columns, displayData, tableTitle };
}
