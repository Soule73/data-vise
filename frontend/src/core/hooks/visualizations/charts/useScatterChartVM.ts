import { useMemo } from "react";
import type { ChartData, TooltipItem } from "chart.js";
import { createScatterChartDataset } from "@utils/charts/chartDatasetUtils";
import { createBaseOptions, mergeOptions } from "@utils/charts/chartConfigUtils";
import { mergeWidgetParams } from "@utils/widgets/widgetParamsUtils";
import { prepareMetricStyles } from "@utils/charts/chartDatasetUtils";
import { getCustomChartOptions } from "@utils/charts/chartOptionsUtils";
import type { ScatterMetricConfig } from "@type/metricBucketTypes";
import {
    processScatterMetrics,
    validateScatterConfiguration,
    generateScatterMetricLabel,
    calculateScatterScales
} from "@utils/charts/scatterChartUtils";
import type { ScatterChartVM, ScatterChartWidgetProps } from "@type/widgetTypes";

export function useScatterChartLogic({
    data,
    config,
}: ScatterChartWidgetProps): ScatterChartVM {

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

    // Traitement des métriques scatter avec filtres
    const processedMetrics = useMemo(() => {
        return processScatterMetrics(data, validMetrics as ScatterMetricConfig[], config.globalFilters);
    }, [data, validMetrics, config.globalFilters]);

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
                        label: (context: TooltipItem<"scatter">) => {
                            const dataPoint = context.raw as { x: number; y: number };
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
