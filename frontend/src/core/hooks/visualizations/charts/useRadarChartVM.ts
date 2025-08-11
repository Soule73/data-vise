import { useMemo } from "react";
import type { ChartData } from "chart.js";
import { createRadarChartDataset } from "@utils/charts/chartDatasetUtils";
import { createBaseOptions, mergeOptions } from "@utils/charts/chartConfigUtils";
import { mergeWidgetParams } from "@utils/widgets/widgetParamsUtils";
import { prepareMetricStyles } from "@utils/charts/chartDatasetUtils";
import { getCustomChartOptions } from "@utils/charts/chartOptionsUtils";
import type { RadarMetricConfig } from "@type/metricBucketTypes";
import {
    getRadarLabels,
    processRadarMetrics,
    validateRadarConfiguration,
    generateRadarMetricLabel
} from "@utils/charts/radarChartUtils";
import type { RadarChartVM, RadarChartWidgetProps } from "@type/widgetTypes";

export function useRadarChartLogic({
    data,
    config,
}: RadarChartWidgetProps): RadarChartVM {
    // Paramètres du widget
    const widgetParams = useMemo(() => mergeWidgetParams(config.widgetParams), [config.widgetParams]);

    // Métriques et styles
    const validMetrics = useMemo(() => config.metrics || [], [config.metrics]);

    const metricStyles = useMemo(() => prepareMetricStyles(config.metricStyles), [config.metricStyles]);

    // Validation de la configuration
    const validation = useMemo(() =>
        validateRadarConfiguration(validMetrics as RadarMetricConfig[]),
        [validMetrics]
    );

    // Labels du radar (axes)
    const labels = useMemo(() => {
        return getRadarLabels(validMetrics as RadarMetricConfig[]);
    }, [validMetrics]);

    // Traitement des métriques radar avec filtres
    const processedMetrics = useMemo(() => {
        return processRadarMetrics(data, validMetrics as RadarMetricConfig[], config.globalFilters);
    }, [data, validMetrics, config.globalFilters]);

    // Création des datasets avec labels correctement formatés
    const datasets = useMemo(() => {
        return processedMetrics.map(({ metric, values, index }) => {
            // S'assurer que la métrique a un label correct pour les tooltips
            const metricWithLabel = {
                ...metric,
                label: metric.label || generateRadarMetricLabel(metric)
            };

            const style = metricStyles[index] || {};
            return createRadarChartDataset(metricWithLabel, index, values, labels, widgetParams, style);
        });
    }, [processedMetrics, labels, widgetParams, metricStyles]);

    // Options du chart avec formatage correct des tooltips
    const options = useMemo(() => {
        const baseOptions = createBaseOptions("radar", widgetParams, labels);

        // Utiliser les options customisées du radar (avec formatage des tooltips)
        const customOptions = getCustomChartOptions("radar", widgetParams);
        const mergedOptions = mergeOptions(baseOptions, customOptions);

        // Options spécifiques au radar (surcharger si nécessaire)
        return {
            ...mergedOptions,
            scales: {
                ...mergedOptions.scales,
                r: {
                    ...mergedOptions.scales?.r,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)',
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                        },
                    },
                },
            },
        };
    }, [widgetParams, labels]);

    const chartData: ChartData<"radar"> = useMemo(() => ({
        labels,
        datasets,
    }), [labels, datasets]);

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
