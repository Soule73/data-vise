import { useMemo } from "react";
import type { KPIWidgetConfig } from "@/core/types/visualization";
import type { MetricConfig } from "@/core/types/metric-bucket-types";
import type { KPIWidgetVM } from "@/core/types/widget-types";

export function useKPIWidgetVM(
  data: Record<string, unknown>[],
  config: KPIWidgetConfig
): KPIWidgetVM {
  // Filtrage des données si un filtre est défini
  const filteredData = useMemo(() => {
    if (Array.isArray(config.filters) && config.filters.length > 0) {
      return config.filters.reduce((acc: Record<string, unknown>[], filter) => {
        if (!filter.field || filter.value === undefined || filter.value === "")
          return acc;
        return acc.filter(
          (row: Record<string, unknown>) =>
            String(row[filter.field]) === String(filter.value)
        );
      }, data);
    }
    return data;
  }, [data, config.filters]);
  const metric: MetricConfig | undefined = config.metrics?.[0];
  const value = useMemo(() => {
    if (!metric || !filteredData || filteredData.length === 0) return 0;
    const field = metric.field;
    const agg = metric.agg;
    const values = filteredData.map(
      (row: Record<string, unknown>) => Number(row[field]) || 0
    );
    if (agg === "sum") return values.reduce((a: number, b: number) => a + b, 0);
    if (agg === "avg")
      return values.reduce((a: number, b: number) => a + b, 0) / values.length;
    if (agg === "min") return Math.min(...values);
    if (agg === "max") return Math.max(...values);
    if (agg === "count") return values.length;
    return values[0];
  }, [filteredData, metric]);
  const title =
    config.widgetParams?.title || metric?.label || metric?.field || "KPI";
  const valueColor =
    config.metricStyles?.[0]?.valueColor ||
    config.widgetParams?.valueColor ||
    "#2563eb";
  const showTrend = config.widgetParams?.showTrend !== false;
  const showValue = config.widgetParams?.showValue !== false;
  const format = config.widgetParams?.format || "number";
  const currency = config.widgetParams?.currency || "€";
  const decimals = config.widgetParams?.decimals ?? 2;
  const trendType = config.widgetParams?.trendType || "arrow";
  const showPercent = config.widgetParams?.showPercent === true;
  const threshold = config.widgetParams?.trendThreshold ?? 0;
  const { trend, trendValue, trendPercent } = useMemo(() => {
    let trend: "up" | "down" | null = null;
    let trendValue = 0;
    let trendPercent = 0;
    if (showTrend && metric && filteredData && filteredData.length > 1) {
      const field = metric.field;
      const last = Number(filteredData[filteredData.length - 1][field]) || 0;
      const prev = Number(filteredData[filteredData.length - 2][field]) || 0;
      const diff = last - prev;
      trend = diff !== 0 ? (diff > 0 ? "up" : "down") : null;
      trendValue = diff;
      if (prev !== 0) {
        trendPercent = (diff / Math.abs(prev)) * 100;
      }
    }
    return { trend, trendValue, trendPercent };
  }, [showTrend, metric, filteredData]);
  function formatValue(val: number) {
    if (format === "currency")
      return val
        .toLocaleString(undefined, {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: decimals,
        })
        .replace("EUR", currency);
    if (format === "percent") return (val * 100).toFixed(decimals) + "%";
    return val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  function getTrendColor() {
    if (trend === null) return "";
    if (threshold && Math.abs(trendPercent) >= threshold) {
      return trend === "up" ? "text-green-700" : "text-red-700";
    }
    return trend === "up" ? "text-green-500" : "text-red-500";
  }
  return {
    filteredData,
    value,
    title,
    valueColor,
    showTrend,
    showValue,
    format,
    currency,
    decimals,
    trendType,
    showPercent,
    threshold,
    trend,
    trendValue,
    trendPercent,
    formatValue,
    getTrendColor,
  };
}
