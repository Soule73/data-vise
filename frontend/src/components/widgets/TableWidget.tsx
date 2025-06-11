import { useMemo } from "react";
import Table from "@/components/Table";

export interface TableWidgetConfig {
  columns?: { key: string; label: string }[];
  pageSize?: number;
  groupBy?: string;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  metrics?: { agg: string; field: string; label?: string }[];
  bucket?: { field: string; type?: string; label?: string };
  widgetParams?: { title?: string };
}

function aggregate(rows: any[], agg: string, field: string) {
  if (agg === "none") {
    if (rows.length === 1) return rows[0][field];
    const found = rows.find((r) => r[field] !== undefined && r[field] !== null);
    return found ? found[field] : "";
  }
  const nums = rows.map((r) => Number(r[field])).filter((v) => !isNaN(v));
  if (agg === "sum") return nums.reduce((a, b) => a + b, 0);
  if (agg === "avg")
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  if (agg === "min") return nums.length ? Math.min(...nums) : 0;
  if (agg === "max") return nums.length ? Math.max(...nums) : 0;
  if (agg === "count") return rows.length;
  return "";
}

export default function TableWidget({
  data,
  config,
}: {
  data: any[];
  config: TableWidgetConfig;
  editMode?: boolean;
}) {
  const safeData = Array.isArray(data) ? data : [];

  // Mode metrics/bucket (nouveau)
  const hasMetrics = Array.isArray(config.metrics) && config.metrics.length > 0;
  const hasBucket = config.bucket && config.bucket.field;

  // Utilisation de useMemo pour stabiliser columns et displayData
  const { columns, displayData } = useMemo(() => {
    let columns: { key: string; label: string }[] = [];
    let displayData: any[] = [];
    if (hasMetrics && hasBucket && config.bucket && config.metrics) {
      const bucketLabel = config.bucket.label || config.bucket.field;
      columns = [
        { key: config.bucket.field, label: bucketLabel },
        ...config.metrics.map((m) => ({
          key: m.field,
          label: m.label || m.field,
        })),
      ];
      const groups: Record<string, any[]> = {};
      safeData.forEach((row) => {
        const key = String(row[config.bucket!.field]);
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });
      displayData = Object.entries(groups).map(([bucketVal, rows]) => {
        const summary: any = { [config.bucket!.field]: bucketVal };
        config.metrics!.forEach((metric) => {
          summary[metric.field] = aggregate(rows, metric.agg, metric.field);
        });
        return summary;
      });
    } else if (Array.isArray(config.columns) && config.columns.length > 0) {
      columns = config.columns.map((col) => ({
        key: col.key,
        label: col.label || col.key,
      }));
      if (config.groupBy && typeof config.groupBy === "string") {
        const groupKey = config.groupBy as string;
        const groups: Record<string, any[]> = {};
        safeData.forEach((row) => {
          const key = String(row[groupKey]);
          if (!groups[key]) groups[key] = [];
          groups[key].push(row);
        });
        displayData = Object.entries(groups).map(([groupVal, rows]) => {
          const summary: any = { [groupKey]: groupVal, count: rows.length };
          columns.forEach((col) => {
            if (col.key !== groupKey) {
              const nums = rows
                .map((r) => Number(r[col.key]))
                .filter((v) => !isNaN(v));
              if (nums.length === rows.length && nums.length > 0) {
                summary[col.key] = nums.reduce((a, b) => a + b, 0);
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

  if (!columns.length) {
    return (
      <div className="text-xs text-gray-500">
        Aucune configuration valide pour le tableau.
      </div>
    );
  }

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

  return (
    // <div className="bg-white dark:bg-gray-900 overflow-hidden min-w-full h-full min-h-full max-h-full">
    <Table
      columns={columns}
      name={tableTitle}
      data={displayData}
      emptyMessage="Aucune donnée."
      paginable={true}
      searchable={true}
      rowPerPage={config.pageSize || 5}
    />
    // </div>
  );
}
