import { useMemo } from "react";
import {
  aggregate,
  // getLabels, getLegendPosition, getTitle, getTitleAlign
} from "@/core/utils/chartUtils";


export function useTableWidgetLogic(data: any[], config: any) {
  const safeData = Array.isArray(data) ? data : [];
  const hasMetrics = Array.isArray(config.metrics) && config.metrics.length > 0;
  const hasBucket = config.bucket && config.bucket.field;

  const { columns, displayData } = useMemo(() => {
    let columns: { key: string; label: string }[] = [];
    let displayData: any[] = [];
    if (hasMetrics && hasBucket && config.bucket && config.metrics) {
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
                summary[col.key] = nums.reduce((a: number, b: number) => a + b, 0);
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
  }, [safeData, config.metrics, config.bucket, config.columns, config.groupBy]);

  // Détermination du titre à afficher
  let tableTitle = "Tableau";
  if (config.widgetParams && config.widgetParams.title) {
    tableTitle = config.widgetParams.title;
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
