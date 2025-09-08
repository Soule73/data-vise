import { useEffect, useMemo, useState } from "react";
import type {
  Filter,
  KPIGroupWidgetConfig,
  MetricStyleConfig,
} from "@type/visualization";
import type { Metric } from "@type/metricBucketTypes";
import type { KPIGroupWidgetVM } from "@type/widgetTypes";

/**
 * Hook pour gérer un groupe de KPI avec support multi-bucket
 * Note: Ce hook gère la configuration UI, le traitement des données
 * se fait dans les KPI individuels via useKPIWidgetVM avec les utilitaires kpiUtils
 */
export function useKPIGroupVM(config: KPIGroupWidgetConfig): KPIGroupWidgetVM {

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

  // Extraction des filtres globaux
  const filters = useMemo<Filter[] | undefined>(
    () => config.globalFilters,
    [config.globalFilters]
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
      metrics.map((metric, idx) => {

        const metricStyle = Array.isArray(metricStyles) ? metricStyles[idx] : undefined;

        const baseParams = config.widgetParams as Record<string, unknown> || {};

        return {
          ...baseParams,
          title: metric.label || metric.field || `KPI ${idx + 1}`,
          valueColor: metricStyle?.valueColor || baseParams.valueColor || "#2563eb",
          buckets: hasMultiBuckets ? bucketsConfig : undefined,
        };
      }),
    [metrics, config.widgetParams, metricStyles, hasMultiBuckets, bucketsConfig]
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
