import type { ProcessedBucketItem } from "@type/metricBucketTypes";
import type { Metric } from "@type/metricBucketTypes";
import { applyAllFilters } from "@utils/filterUtils";
import type { FilterableConfig, StylableConfig } from "@type/widgetTypes";



/**
 * Applique les filtres aux données
 */
export function applyKPIFilters(
    data: Record<string, unknown>[],
    config: FilterableConfig
): Record<string, unknown>[] {
    let baseData = data;

    // Priorité aux filtres globaux (nouveau système)
    if (config.globalFilters && config.globalFilters.length > 0) {
        baseData = applyAllFilters(baseData, config.globalFilters, []);
    }

    return baseData;
}

/**
 * Calcule la valeur d'une métrique à partir des données ou des buckets traités
 */
export function calculateKPIValue(
    metric: Metric | undefined,
    filteredData: Record<string, unknown>[],
    processedData: ProcessedBucketItem[] | null
): number {
    if (!metric) return 0;

    // Support multi-bucket system
    if (processedData && processedData.length > 0) {
        const values = processedData.map((item: ProcessedBucketItem) => {
            const metricData = item.metrics[0]; // Première métrique
            return metricData?.value || 0;
        });

        return aggregateValues(values, metric.agg);
    }

    // Fallback legacy
    if (!filteredData || filteredData.length === 0) return 0;

    const field = metric.field;
    const values = filteredData.map(
        (row: Record<string, unknown>) => Number(row[field]) || 0
    );

    return aggregateValues(values, metric.agg);
}

/**
 * Agrège un tableau de valeurs selon le type d'agrégation
 */
export function aggregateValues(values: number[], aggregationType: string): number {
    if (values.length === 0) return 0;

    switch (aggregationType) {
        case "sum":
            return values.reduce((a: number, b: number) => a + b, 0);
        case "avg":
            return values.reduce((a: number, b: number) => a + b, 0) / values.length;
        case "min":
            return Math.min(...values);
        case "max":
            return Math.max(...values);
        case "count":
            return values.length;
        default:
            return values[0] || 0;
    }
}

/**
 * Extrait la couleur de valeur depuis widgetParams
 */
export function getKPIValueColor(config: StylableConfig, defaultColor: string = "#2563eb"): string {
    // Accès direct aux paramètres du widget
    const valueColor = config.widgetParams?.valueColor;
    return (typeof valueColor === 'string' ? valueColor : undefined) || defaultColor;
}

/**
 * Extrait les couleurs pour les widgets Card depuis widgetParams
 */
export function getCardColors(config: StylableConfig): {
    iconColor: string;
    valueColor: string;
    descriptionColor: string;
} {
    const params = config.widgetParams || {};

    const iconColor = (typeof params.iconColor === 'string' ? params.iconColor : undefined) || "#6366f1";
    const valueColor = (typeof params.valueColor === 'string' ? params.valueColor : undefined) || "#2563eb";
    const descriptionColor = (typeof params.descriptionColor === 'string' ? params.descriptionColor : undefined) || "#6b7280";

    return { iconColor, valueColor, descriptionColor };
}

/**
 * Calcule les données de tendance pour un KPI
 */
export function calculateKPITrend(
    metric: Metric | undefined,
    filteredData: Record<string, unknown>[],
    showTrend: boolean
): {
    trend: "up" | "down" | null;
    trendValue: number;
    trendPercent: number;
} {
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
}

/**
 * Formate une valeur selon le format spécifié
 */
export function formatKPIValue(
    value: number,
    format: string = "number",
    decimals: number = 2,
    currency: string = "€"
): string {
    if (format === "currency") {
        return value
            .toLocaleString(undefined, {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: decimals,
            })
            .replace("EUR", currency);
    }

    if (format === "percent") {
        return (value * 100).toFixed(decimals) + "%";
    }

    return value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Obtient la couleur de tendance selon le type et le seuil
 */
export function getKPITrendColor(
    trend: "up" | "down" | null,
    trendPercent: number,
    threshold: number = 0
): string {
    if (trend === null) return "";

    if (threshold && Math.abs(trendPercent) >= threshold) {
        return trend === "up" ? "text-green-700" : "text-red-700";
    }

    return trend === "up" ? "text-green-500" : "text-red-500";
}

/**
 * Extrait le titre d'un widget KPI
 */
export function getKPITitle(
    config: { widgetParams?: { title?: string } },
    metric: Metric | undefined,
    defaultTitle: string = "KPI"
): string {
    return config.widgetParams?.title || metric?.label || metric?.field || defaultTitle;
}

/**
 * Extrait les paramètres communs d'un widget KPI
 */
export function getKPIWidgetParams(config: { widgetParams?: Record<string, unknown> }): {
    showTrend: boolean;
    showValue: boolean;
    format: string;
    currency: string;
    decimals: number;
    trendType: string;
    showPercent: boolean;
    threshold: number;
} {
    const params = config.widgetParams || {};

    return {
        showTrend: params.showTrend !== false,
        showValue: params.showValue !== false,
        format: (typeof params.format === 'string' ? params.format : undefined) || "number",
        currency: (typeof params.currency === 'string' ? params.currency : undefined) || "€",
        decimals: (typeof params.decimals === 'number' ? params.decimals : undefined) ?? 2,
        trendType: (typeof params.trendType === 'string' ? params.trendType : undefined) || "arrow",
        showPercent: params.showPercent === true,
        threshold: (typeof params.trendThreshold === 'number' ? params.trendThreshold : undefined) ?? 0,
    };
}
