import { WIDGET_DATA_CONFIG } from "@/data/adapters/visualizations";
import type { WidgetType } from "@/core/types/widget-types";
import { getDefaultMetricStyle } from "./widgetConfigUtils";

/**
 * Met à jour les métriques avec un nouveau champ ou agrégation
 */
export function updateMetricAggOrField(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metrics: any[],
    idx: number,
    field: "agg" | "field",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    widgetType: WidgetType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { updatedMetrics: any[]; autoLabel: string } {
    const newMetrics = [...metrics];
    newMetrics[idx] = { ...newMetrics[idx], [field]: value };

    const widgetConfig = WIDGET_DATA_CONFIG[widgetType];
    const aggLabel =
        widgetConfig.metrics.allowedAggs.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any) => a.value === (field === "agg" ? value : newMetrics[idx].agg)
        )?.label || (field === "agg" ? value : newMetrics[idx].agg);

    const fieldLabel = field === "field" ? value : newMetrics[idx].field;
    const autoLabel = `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""}`;

    newMetrics[idx].label = autoLabel;

    return { updatedMetrics: newMetrics, autoLabel };
}

/**
 * Met à jour les styles de métriques
 */
export function updateMetricStyle(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metricStyles: any[],
    idx: number,
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
    const newStyles = [...metricStyles];
    newStyles[idx] = { ...newStyles[idx], [field]: value };
    return newStyles;
}

/**
 * Synchronise les styles de métriques avec les métriques
 */
export function syncMetricStyles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metrics: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metricStyles: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
    let updatedStyles = [...metricStyles];

    // Ajouter des styles manquants
    if (updatedStyles.length < metrics.length) {
        for (let i = updatedStyles.length; i < metrics.length; i++) {
            updatedStyles.push(getDefaultMetricStyle());
        }
    }

    // Supprimer les styles en excès
    if (updatedStyles.length > metrics.length) {
        updatedStyles = updatedStyles.slice(0, metrics.length);
    }

    return updatedStyles;
}

/**
 * Réorganise les métriques lors du drag & drop
 */
export function reorderMetrics(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metrics: any[],
    fromIndex: number,
    toIndex: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
    const newMetrics = [...metrics];
    const [removed] = newMetrics.splice(fromIndex, 1);
    newMetrics.splice(toIndex, 0, removed);
    return newMetrics;
}

/**
 * Enrichit les métriques avec leurs labels depuis le store
 */
export function enrichMetricsWithLabels(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metrics: any[],
    metricLabels: string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
    return metrics.map((m, idx) => ({
        ...m,
        label: metricLabels[idx] || m.label || `Métrique ${idx + 1}`,
    }));
}

/**
 * Extrait les labels des métriques pour synchronisation avec le store
 */
export function extractMetricLabels(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metrics: any[]
): string[] {
    const labels: string[] = [];
    metrics.forEach((metric: { field: string; type: string; label?: string }, idx: number) => {
        if (metric.label) {
            labels[idx] = metric.label;
        }
    });
    return labels;
}
