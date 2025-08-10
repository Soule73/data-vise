import { useEffect, useMemo, useState } from "react";
import type {
  Filter,
  KPIGroupWidgetConfig,
  MetricStyleConfig,
} from "@type/visualization";
import type { Metric } from "@type/metric-bucket-types";

/**
 * Hook pour gérer un groupe de KPI avec support multi-bucket
 * Note: Ce hook gère la configuration UI, le traitement des données
 * se fait dans les KPI individuels via useKPIWidgetVM avec les utilitaires kpiUtils
 */
export function useKPIGroupVM(config: KPIGroupWidgetConfig): {
  gridColumns: number;
  metrics: Metric[];
  metricStyles: MetricStyleConfig[];
  filters: Filter[] | undefined;
  groupTitle: string;
  widgetParamsList: Array<Record<string, unknown>>;
  hasMultiBuckets: boolean;
  bucketsConfig: unknown[];
} {
  const [gridColumns, setGridColumns] = useState(1);
  const columns = (typeof config.widgetParams?.columns === 'number' ? config.widgetParams.columns : undefined) || 2;
  const groupTitle = (typeof config.widgetParams?.title === 'string' ? config.widgetParams.title : undefined) || "KPI Group";

  // Gestion responsive des colonnes
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

  // Extraction des métriques
  const metrics: Metric[] = useMemo(
    () => (Array.isArray(config.metrics) ? config.metrics : []),
    [config.metrics]
  );
  
  // Extraction des styles de métriques
  const metricStyles = useMemo<MetricStyleConfig[]>(
    () => (Array.isArray(config.metricStyles) ? config.metricStyles : []),
    [config.metricStyles]
  );
  
  // Extraction des filtres
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

  // Configuration des paramètres pour chaque KPI individuel
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
