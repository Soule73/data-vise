import { useMemo } from "react";
import * as HeroIcons from "@heroicons/react/24/outline";

export function useCardWidgetVM(data: any[], config: any) {
  // On prend la première métrique configurée
  const metric = config.metrics?.[0];
  const value = useMemo(() => {
    if (!metric || !data || data.length === 0) return 0;
    const field = metric.field;
    const agg = metric.agg;
    const values = data.map((row: any) => Number(row[field]) || 0);
    if (agg === "sum") return values.reduce((a, b) => a + b, 0);
    if (agg === "avg") return values.reduce((a, b) => a + b, 0) / values.length;
    if (agg === "min") return Math.min(...values);
    if (agg === "max") return Math.max(...values);
    if (agg === "count") return values.length;
    return values[0];
  }, [data, metric]);

  const title =
    config.widgetParams?.title || metric?.label || metric?.field || "Synthèse";
  const description = config.widgetParams?.description || "";
  const iconColor = config.metricStyles?.[0]?.iconColor || "#6366f1";
  const valueColor = config.metricStyles?.[0]?.valueColor || "#2563eb";
  const descriptionColor =
    config.metricStyles?.[0]?.descriptionColor || "#6b7280";
  const showIcon = config.widgetParams?.showIcon !== false;
  const iconName = config.widgetParams?.icon || "ChartBarIcon";
  const IconComponent =
    HeroIcons[iconName as keyof typeof HeroIcons] || HeroIcons.ChartBarIcon;

  return {
    value,
    title,
    description,
    iconColor,
    valueColor,
    descriptionColor,
    showIcon,
    IconComponent,
  };
}
