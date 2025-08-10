/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import type { ChartOptions, ChartData } from "chart.js";
import type { ScatterChartConfig } from "@type/visualization";
import { createScatterChartDataset } from "@utils/chartDatasetUtils";
import { createBaseOptions, mergeOptions } from "@utils/chartConfigUtils";
import { mergeWidgetParams } from "@utils/widgetParamsUtils";
import { prepareMetricStyles } from "@utils/chartDatasetUtils";
import { getCustomChartOptions } from "@utils/chartOptionsUtils";
import type { ScatterMetricConfig } from "@type/metric-bucket-types";
import {
    processScatterMetrics,
    validateScatterConfiguration,
    generateScatterMetricLabel,
    calculateScatterScales
} from "@utils/scatterChartUtils";

export function useScatterChartLogic(
    data: Record<string, any>[],
    config: ScatterChartConfig
): {
    chartData: ChartData<"scatter">;
    options: ChartOptions<"scatter">;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
    validDatasets: any[];
    isValid: boolean;
    validationErrors: string[];
    validationWarnings: string[];
} {
    // Paramètres du widget
    const widgetParams = useMemo(() => mergeWidgetParams(config.widgetParams), [config.widgetParams]);

    // Métriques et styles
    const validMetrics = useMemo(() => config.metrics || [], [config.metrics]);
    const metricStyles = useMemo(() => prepareMetricStyles(config.metricStyles), [config.metricStyles]);

    // Validation de la configuration
    const validation = useMemo(() =>
        validateScatterConfiguration(validMetrics as ScatterMetricConfig[]),
        [validMetrics]
    );

    // Traitement des métriques scatter
    const processedMetrics = useMemo(() => {
        return processScatterMetrics(data, validMetrics as ScatterMetricConfig[]);
    }, [data, validMetrics]);

    // Calcul des échelles optimales
    const scales = useMemo(() => {
        return calculateScatterScales(data, validMetrics as ScatterMetricConfig[]);
    }, [data, validMetrics]);

    // Création des datasets avec labels correctement formatés
    const datasets = useMemo(() => {
        return processedMetrics.map(({ metric, scatterData, index }) => {
            // S'assurer que la métrique a un label correct pour les tooltips
            const metricWithLabel = {
                ...metric,
                label: metric.label || generateScatterMetricLabel(metric)
            };

            const style = metricStyles[index] || {};
            return createScatterChartDataset(metricWithLabel, index, scatterData, [], widgetParams, style);
        });
    }, [processedMetrics, widgetParams, metricStyles]);

    // Options du chart avec formatage correct des tooltips
    const options = useMemo(() => {
        const baseOptions = createBaseOptions("scatter", widgetParams, []);

        // Utiliser les options customisées du scatter
        const customOptions = getCustomChartOptions("scatter", widgetParams);
        const mergedOptions = mergeOptions(baseOptions, customOptions);

        // Options spécifiques au scatter chart
        return {
            ...mergedOptions,
            scales: {
                ...mergedOptions.scales,
                x: {
                    ...mergedOptions.scales?.x,
                    type: 'linear' as const,
                    position: 'bottom' as const,
                    min: scales.xMin,
                    max: scales.xMax,
                    title: {
                        display: !!widgetParams.xLabel,
                        text: widgetParams.xLabel || 'X',
                    },
                },
                y: {
                    ...mergedOptions.scales?.y,
                    type: 'linear' as const,
                    min: scales.yMin,
                    max: scales.yMax,
                    title: {
                        display: !!widgetParams.yLabel,
                        text: widgetParams.yLabel || 'Y',
                    },
                },
            },
            plugins: {
                ...mergedOptions.plugins,
                tooltip: {
                    ...mergedOptions.plugins?.tooltip,
                    callbacks: {
                        label: (context: any) => {
                            const dataPoint = context.raw;
                            const datasetLabel = context.dataset.label || '';
                            return `${datasetLabel}: (${dataPoint.x}, ${dataPoint.y})`;
                        },
                    },
                },
            },
        };
    }, [widgetParams, scales]);

    const chartData: ChartData<"scatter"> = useMemo(() => ({
        datasets,
    }), [datasets]);

    return {
        chartData,
        options,
        showNativeValues: widgetParams.showValues === true,
        valueLabelsPlugin: null,
        validDatasets: validMetrics,
        isValid: validation.isValid,
        validationErrors: validation.errors,
        validationWarnings: validation.warnings,
    };
};
