import { useMemo } from "react";
import * as HeroIcons from "@heroicons/react/24/outline";
import { useMultiBucketProcessor } from "@hooks/common/useMultiBucketProcessor";
import type { Metric } from "@type/metricBucketTypes";
import {
  applyKPIFilters,
  calculateKPIValue,
  getCardColors,
  getKPITitle,
  getKPIWidgetParams,
  formatKPIValue,
} from "@utils/kpi/kpiUtils";
import type { CardWidgetProps, CardWidgetVM, FilterableConfig, StylableConfig } from "@type/widgetTypes";

export function useCardWidgetVM({
  data,
  config,
}: CardWidgetProps): CardWidgetVM {

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

  // Extraction des informations du widget
  const title = getKPITitle(config, metric, "Synthèse");

  const description = (typeof config.widgetParams?.description === 'string' ? config.widgetParams.description : undefined) || "";

  // Extraction des couleurs avec l'utilitaire
  const { iconColor, valueColor, descriptionColor } = getCardColors(config as StylableConfig);

  // Extraction des paramètres d'affichage et de formatage
  const showIcon = config.widgetParams?.showIcon !== false;

  const iconName = (typeof config.widgetParams?.icon === 'string' ? config.widgetParams.icon : undefined) || "ChartBarIcon";
  const IconComponent = HeroIcons[iconName as keyof typeof HeroIcons] || HeroIcons.ChartBarIcon;

  // Extraction des paramètres de formatage depuis widgetParams
  const { format, decimals, currency } = getKPIWidgetParams(config as { widgetParams?: Record<string, unknown> });

  // Formatage de la valeur
  const formattedValue = formatKPIValue(value, format, decimals, currency);

  return {
    formattedValue,
    title,
    description,
    iconColor,
    valueColor,
    descriptionColor,
    showIcon,
    IconComponent,
  };
}
