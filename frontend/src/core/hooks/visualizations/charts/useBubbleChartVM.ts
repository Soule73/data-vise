import { useMemo } from "react";
import type { ChartData, TooltipItem } from "chart.js";
import { createBubbleChartDataset } from "@utils/charts/chartDatasetUtils";
import { createBaseOptions, mergeOptions } from "@utils/charts/chartConfigUtils";
import { mergeWidgetParams } from "@utils/widgets/widgetParamsUtils";
import { prepareMetricStyles } from "@utils/charts/chartDatasetUtils";
import { getCustomChartOptions } from "@utils/charts/chartOptionsUtils";
import type { BubbleMetricConfig } from "@type/metricBucketTypes";
import {
    processBubbleMetrics,
    validateBubbleConfiguration,
    generateBubbleMetricLabel,
    calculateBubbleScales
} from "@utils/charts/bubbleChartUtils";
import type { BubbleChartVM, BubbleChartWidgetProps } from "@type/widgetTypes";

export function useBubbleChartLogic({
    data,
    config,
}: BubbleChartWidgetProps): BubbleChartVM {
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

    // Traitement des métriques bubble avec filtres
    const processedMetrics = useMemo(() => {
        return processBubbleMetrics(data, validMetrics as BubbleMetricConfig[], config.globalFilters);
    }, [data, validMetrics, config.globalFilters]);

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
                        label: (context: TooltipItem<"bubble">) => {
                            const dataPoint = context.raw as { x: number; y: number; r: number };
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
