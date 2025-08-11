import { useMemo } from "react";
import { useMultiBucketProcessor } from "@hooks/common/useMultiBucketProcessor";
import type { Metric } from "@type/metricBucketTypes";
import type { FilterableConfig, KPIWidgetProps, KPIWidgetVM, StylableConfig } from "@type/widgetTypes";
import {
  applyKPIFilters,
  calculateKPIValue,
  calculateKPITrend,
  formatKPIValue,
  getKPITrendColor,
  getKPITitle,
  getKPIValueColor,
  getKPIWidgetParams,
} from "@utils/kpi/kpiUtils";

export function useKPIWidgetVM({
  data,
  config,
}: KPIWidgetProps): KPIWidgetVM {

  // Filtrage des données avec l'utilitaire
  const filteredData = useMemo(() => {
    return applyKPIFilters(data, config as FilterableConfig);
  }, [data, config]);

  // Traitement des données avec le système multi-bucket
  const processedData = useMultiBucketProcessor(filteredData, config);

  // Récupération de la première métrique
  const metric: Metric | undefined = config.metrics?.[0];

  // Calcul de la valeur avec l'utilitaire
  const value = useMemo(() => {
    return calculateKPIValue(metric, filteredData, processedData);
  }, [filteredData, metric, processedData]);

  // Extraction du titre et des paramètres
  const title = getKPITitle(config, metric, "KPI");

  const valueColor = getKPIValueColor(config as StylableConfig);

  const titleColor = (config.widgetParams as Record<string, unknown>)?.titleColor as string || "#2563eb";

  const {
    showTrend,
    showValue,
    format,
    currency,
    decimals,
    trendType,
    showPercent,
    threshold,
  } = getKPIWidgetParams(config as { widgetParams?: Record<string, unknown> });

  // Calcul des données de tendance avec l'utilitaire
  const { trend, trendValue, trendPercent } = useMemo(() => {
    return calculateKPITrend(metric, filteredData, showTrend);
  }, [showTrend, metric, filteredData]);

  // Fonctions utilitaires locales
  function formatValue(val: number) {
    return formatKPIValue(val, format, decimals, currency);
  }

  function getTrendColor() {
    return getKPITrendColor(trend, trendPercent, threshold);
  }

  return {
    filteredData,
    value,
    title,
    valueColor,
    titleColor,
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
