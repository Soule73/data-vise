import type { WidgetType } from "@type/widgetTypes";
import { WIDGET_DATA_CONFIG } from "@adapters/visualizations";
import type { Metric } from "@type/metricBucketTypes";

/**
 * Génère un label automatique pour une métrique
 */
export function generateMetricAutoLabel(
    metric: Metric,
    widgetType: WidgetType,
    field: "agg" | "field",
    value: string
): string {
    const widgetConfig = WIDGET_DATA_CONFIG[widgetType];

    const aggLabel = widgetConfig?.metrics?.allowedAggs?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a: any) => a.value === (field === "agg" ? value : metric.agg)
    )?.label || (field === "agg" ? value : metric.agg);

    const fieldLabel = field === "field" ? value : metric.field;
    return `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""}`;
}

/**
 * Met à jour une métrique avec un nouveau champ et génère son label automatiquement
 */
export function updateMetricWithAutoLabel(
    metrics: Metric[],
    idx: number,
    field: "agg" | "field",
    value: string,
    widgetType: WidgetType
): Metric[] {
    const newMetrics = [...metrics];
    newMetrics[idx] = { ...newMetrics[idx], [field]: value };

    const autoLabel = generateMetricAutoLabel(newMetrics[idx], widgetType, field, value);
    newMetrics[idx].label = autoLabel;

    return newMetrics;
}

/**
 * Réorganise les métriques par drag & drop
 */
export function reorderMetrics(metrics: Metric[], fromIndex: number, toIndex: number): Metric[] {
    if (fromIndex === toIndex) return metrics;

    const newMetrics = [...metrics];
    const [removed] = newMetrics.splice(fromIndex, 1);
    newMetrics.splice(toIndex, 0, removed);

    return newMetrics;
}
