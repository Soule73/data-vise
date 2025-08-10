/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import type { ChartOptions, ChartData } from "chart.js";
import type { BubbleChartConfig } from "@type/visualization";
import { createBubbleChartDataset } from "@utils/chartDatasetUtils";
import { createBaseOptions, mergeOptions } from "@utils/chartConfigUtils";
import { mergeWidgetParams } from "@utils/widgetParamsUtils";
import { prepareMetricStyles } from "@utils/chartDatasetUtils";
import { getCustomChartOptions } from "@utils/chartOptionsUtils";
import type { BubbleMetricConfig } from "@type/metric-bucket-types";
import {
    processBubbleMetrics,
    validateBubbleConfiguration,
    generateBubbleMetricLabel,
    calculateBubbleScales
} from "@utils/bubbleChartUtils";

export function useBubbleChartLogic(
    data: Record<string, any>[],
    config: BubbleChartConfig
): {
    chartData: ChartData<"bubble">;
    options: ChartOptions<"bubble">;
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
        validateBubbleConfiguration(validMetrics as BubbleMetricConfig[]),
        [validMetrics]
    );

    // Traitement des métriques bubble
    const processedMetrics = useMemo(() => {
        return processBubbleMetrics(data, validMetrics as BubbleMetricConfig[]);
    }, [data, validMetrics]);

    // Calcul des échelles optimales
    const scales = useMemo(() => {
        return calculateBubbleScales(data, validMetrics as BubbleMetricConfig[]);
    }, [data, validMetrics]);

    // Création des datasets avec labels correctement formatés
    const datasets = useMemo(() => {
        return processedMetrics.map(({ metric, bubbleData, index }) => {
            // S'assurer que la métrique a un label correct pour les tooltips
            const metricWithLabel = {
                ...metric,
                label: metric.label || generateBubbleMetricLabel(metric)
            };

            const style = metricStyles[index] || {};
            return createBubbleChartDataset(metricWithLabel, index, bubbleData, [], widgetParams, style);
        });
    }, [processedMetrics, widgetParams, metricStyles]);

    // Options du chart avec formatage correct des tooltips
    const options = useMemo(() => {
        const baseOptions = createBaseOptions("bubble", widgetParams, []);

        // Utiliser les options customisées du bubble
        const customOptions = getCustomChartOptions("bubble", widgetParams);
        const mergedOptions = mergeOptions(baseOptions, customOptions);

        // Options spécifiques au bubble chart
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
                            return `${datasetLabel}: (${dataPoint.x}, ${dataPoint.y}, ${dataPoint.r})`;
                        },
                    },
                },
            },
        };
    }, [widgetParams, scales]);

    const chartData: ChartData<"bubble"> = useMemo(() => ({
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
