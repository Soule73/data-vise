/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metric } from "@type/metric-bucket-types";
import type { DatasetCreationContext } from "@type/widget-types";
import { createDefaultDataset } from "@utils/chartConfigUtils";
import { getDatasetColor, generateColorsForLabels, addTransparency } from "@utils/chartColorUtils";
import { aggregate } from "@utils/chartUtils";



/**
 * Crée des datasets pour les séries divisées (split series)
 */
export function createSplitSeriesDatasets(
    context: DatasetCreationContext,
    customDatasetCreator?: (metric: Metric, idx: number, values: number[], labels: string[], widgetParams: any, metricStyle: any) => any
): any[] {
    const { chartType, labels, widgetParams, metrics, metricStyles, processedData } = context;

    return processedData.splitData.series.map((splitItem: any, idx: number) => {
        const metric = metrics[0] || { agg: "sum", field: "", label: "" };
        const values = labels.map(label => {
            const bucketData = splitItem.data.filter((row: any) =>
                row[processedData.bucketHierarchy[0]?.bucket.field] === label
            );
            return aggregate(bucketData, metric.agg, metric.field);
        });

        const style = metricStyles[idx] || {};

        if (customDatasetCreator) {
            return customDatasetCreator(metric, idx, values, labels, widgetParams, style);
        }

        // Dataset par défaut
        return createDefaultDataset(chartType, {
            label: splitItem.key,
            data: values,
            backgroundColor: getDatasetColor(chartType, idx, style),
            borderColor: style.borderColor || getDatasetColor(chartType, idx, style),
            borderWidth: style.borderWidth ?? 1,
            ...style,
        });
    });
}

/**
 * Crée des datasets normaux (un par métrique)
 */
export function createMetricDatasets(
    context: DatasetCreationContext,
    customDatasetCreator?: (metric: Metric, idx: number, values: number[], labels: string[], widgetParams: any, metricStyle: any) => any
): any[] {
    const { chartType, labels, widgetParams, metrics, metricStyles, getValues } = context;

    return metrics.map((metric, idx) => {
        const values = getValues(metric);
        const style = metricStyles[idx] || {};

        if (customDatasetCreator) {
            return customDatasetCreator(metric, idx, values, labels, widgetParams, style);
        }

        return createDefaultDataset(chartType, {
            label: metric.label || `${metric.agg}(${metric.field})`,
            data: values,
            backgroundColor: getDatasetColor(chartType, idx, style, style.colors),
            borderColor: style.borderColor || getDatasetColor(chartType, idx, style),
            borderWidth: style.borderWidth ?? 1,
            ...style,
        });
    });
}

/**
 * Logique principale pour créer tous les datasets
 */
export function createChartDatasets(
    context: DatasetCreationContext,
    customDatasetCreator?: (metric: Metric, idx: number, values: number[], labels: string[], widgetParams: any, metricStyle: any) => any
): any[] {
    // Gestion spéciale pour les split series
    if (context.processedData.splitData.series.length > 0) {
        return createSplitSeriesDatasets(context, customDatasetCreator);
    }

    // Datasets normaux
    return createMetricDatasets(context, customDatasetCreator);
}

/**
 * Prépare les styles de métriques (normalise la structure)
 */
export function prepareMetricStyles(metricStyles?: any): any[] {
    if (Array.isArray(metricStyles)) {
        return metricStyles;
    }

    if (metricStyles && typeof metricStyles === 'object') {
        return Object.values(metricStyles);
    }

    return [];
}

/**
 * Crée un dataset spécialisé pour bar chart
 */
export function createBarChartDataset(
    metric: Metric,
    idx: number,
    values: number[],
    _labels: string[],
    widgetParams: any,
    style: any
): any {
    return {
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: getDatasetColor('bar', idx, style, style.colors),
        borderColor: style.borderColor || getDatasetColor('bar', idx, style),
        borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 1,
        barThickness: style.barThickness || widgetParams.barThickness,
        borderRadius: style.borderRadius || widgetParams.borderRadius || 0,
        borderSkipped: false,
    };
}

/**
 * Crée un dataset spécialisé pour line chart
 */
export function createLineChartDataset(
    metric: Metric,
    idx: number,
    values: number[],
    _labels: string[],
    widgetParams: any,
    style: any
): any {
    return {
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: getDatasetColor('line', idx, style, style.colors),
        borderColor: style.borderColor || getDatasetColor('line', idx, style),
        borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 2,
        fill: style.fill !== undefined ? style.fill : widgetParams.fill,
        tension: widgetParams.tension || 0,
        pointStyle: style.pointStyle || widgetParams.pointStyle || "circle",
        stepped: style.stepped || widgetParams.stepped || false,
        borderDash: Array.isArray(style.borderDash) ? style.borderDash :
            (widgetParams.borderDash ? widgetParams.borderDash.split(',').map((n: string) => parseInt(n.trim())) : []),
        pointRadius: widgetParams.showPoints !== false ? 3 : 0,
        pointHoverRadius: widgetParams.showPoints !== false ? 5 : 0,
        pointBackgroundColor: getDatasetColor('line', idx, style),
        pointBorderColor: style.borderColor || getDatasetColor('line', idx, style),
    };
}

/**
 * Crée un dataset spécialisé pour scatter chart
 */
export function createScatterChartDataset(
    metric: Metric,
    idx: number,
    values: number[],
    _labels: string[],
    widgetParams: any,
    style: any
): any {
    return {
        type: 'scatter' as const,
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: getDatasetColor('scatter', idx, style, style.colors),
        borderColor: style.borderColor || getDatasetColor('scatter', idx, style),
        borderWidth: widgetParams.borderWidth || (style.borderWidth ?? 1),
        pointStyle: style.pointStyle || widgetParams.pointStyle || 'circle',
        pointRadius: widgetParams.showPoints !== false ? 5 : 0,
        pointHoverRadius: widgetParams.showPoints !== false ? 7 : 0,
        showLine: false,
        opacity: style.opacity || 0.7,
    };
}

/**
 * Crée un dataset spécialisé pour bubble chart
 */
export function createBubbleChartDataset(
    metric: Metric,
    idx: number,
    values: number[],
    _labels: string[],
    widgetParams: any,
    style: any
): any {
    return {
        type: 'bubble' as const,
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: getDatasetColor('bubble', idx, style, style.colors),
        borderColor: style.borderColor || getDatasetColor('bubble', idx, style),
        borderWidth: widgetParams.borderWidth || (style.borderWidth ?? 1),
        pointStyle: style.pointStyle || widgetParams.pointStyle || 'circle',
        pointRadius: widgetParams.showPoints !== false ? 5 : 0,
        pointHoverRadius: widgetParams.showPoints !== false ? 7 : 0,
        opacity: style.opacity || 0.7,
    };
}

/**
 * Crée un dataset spécialisé pour radar chart
 */
export function createRadarChartDataset(
    metric: Metric,
    idx: number,
    values: number[],
    _labels: string[],
    widgetParams: any,
    style: any
): any {
    const baseColor = getDatasetColor('radar', idx, style, style.colors);
    return {
        type: 'radar' as const,
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: style.color ?
            addTransparency(style.color, 0.25) :
            addTransparency(baseColor, 0.25),
        borderColor: style.borderColor || baseColor,
        borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 2,
        pointStyle: style.pointStyle || widgetParams.pointStyle || 'circle',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: style.fill !== false,
        tension: 0.1,
        opacity: style.opacity || 0.7,
    };
}

/**
 * Crée un dataset spécialisé pour pie chart avec gestion des couleurs multiples
 */
export function createPieChartDataset(
    metric: Metric,
    values: number[],
    labels: string[],
    widgetParams: any,
    style: any
): any {
    const colors = generateColorsForLabels(labels, style.colors);

    return {
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(color =>
            style.borderColor || widgetParams.borderColor || color
        ),
        borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 1,
        cutout: widgetParams.cutout || "0%",
        hoverOffset: 4,
    };
}
