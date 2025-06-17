import { useMemo } from "react";

export function useKPIGroupVM(config: any) {
  const metrics = useMemo(
    () => (Array.isArray(config.metrics) ? config.metrics : []),
    [config.metrics]
  );
  const metricStyles = useMemo(
    () => (Array.isArray(config.metricStyles) ? config.metricStyles : []),
    [config.metricStyles]
  );
  const filters = useMemo(
    () => (Array.isArray(config.filters) ? config.filters : []),
    [config.filters]
  );
  const columns = config.widgetParams?.columns || 2;
  const groupTitle = config.widgetParams?.title || "KPI Group";

  const widgetParamsList = useMemo(
    () =>
      metrics.map((metric: any, idx: number) => ({
        ...config.widgetParams,
        title: metric.title || metric.label || metric.field || `KPI ${idx + 1}`,
        description: metric.description || "",
      })),
    [metrics, config.widgetParams]
  );

  return {
    metrics,
    metricStyles,
    filters,
    columns,
    groupTitle,
    widgetParamsList,
  };
}
