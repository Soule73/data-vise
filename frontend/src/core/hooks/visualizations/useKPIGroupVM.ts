import { useEffect, useMemo, useState } from "react";
import type {
  Filter,
  KPIGroupWidgetConfig,
  MetricStyleConfig,
} from "@/core/types/visualization";
import type { MetricConfig } from "@/core/types/metric-bucket-types";

/**
 * Hook pour gérer un groupe de KPI avec support multi-bucket
 * Note: Ce hook gère la configuration UI, le traitement des données
 * se fait dans les KPI individuels via useKPIWidgetVM
 */
export function useKPIGroupVM(config: KPIGroupWidgetConfig): {
  gridColumns: number;
  metrics: MetricConfig[];
  metricStyles: MetricStyleConfig[];
  filters: Filter[] | undefined;
  groupTitle: string;
  widgetParamsList: Array<Record<string, unknown>>;
  hasMultiBuckets: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bucketsConfig: any;
} {
  const [gridColumns, setGridColumns] = useState(1);
  const columns = config.widgetParams?.columns || 2;
  const groupTitle = config.widgetParams?.title || "KPI Group";

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setGridColumns(1);
      } else {
        setGridColumns(columns);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  const metrics: MetricConfig[] = useMemo(
    () => (Array.isArray(config.metrics) ? config.metrics : []),
    [config.metrics]
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metricStyles = useMemo<any[]>(
    () => (Array.isArray(config.metricStyles) ? config.metricStyles : []),
    [config.metricStyles]
  );
  const filters = useMemo<Filter[] | undefined>(
    () => config.filters,
    [config.filters]
  );

  // Support multi-bucket
  const hasMultiBuckets = useMemo(() => {
    return Array.isArray(config.buckets) && config.buckets.length > 0;
  }, [config.buckets]);

  const bucketsConfig = useMemo(() => {
    return config.buckets || [];
  }, [config.buckets]);

  const widgetParamsList = useMemo<Array<Record<string, unknown>>>(
    () =>
      metrics.map((metric, idx) => ({
        ...config.widgetParams,
        title: metric.label || metric.field || `KPI ${idx + 1}`,
        description: "",
        // Transmettre la config buckets à chaque KPI individuel
        buckets: hasMultiBuckets ? bucketsConfig : undefined,
      })),
    [metrics, config.widgetParams, hasMultiBuckets, bucketsConfig]
  );

  return {
    gridColumns,
    metrics,
    metricStyles,
    filters,
    groupTitle,
    widgetParamsList,
    hasMultiBuckets,
    bucketsConfig,
  };
}
