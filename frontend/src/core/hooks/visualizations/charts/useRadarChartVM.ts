/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import type { ChartOptions, ChartData } from "chart.js";
import type { RadarChartConfig } from "@type/visualization";
import { createRadarChartDataset } from "@utils/chartDatasetUtils";
import { createBaseOptions } from "@utils/chartConfigUtils";
import { mergeWidgetParams } from "@utils/widgetParamsUtils";
import { prepareMetricStyles } from "@utils/chartDatasetUtils";
import type { RadarMetricConfig } from "@type/metric-bucket-types";

export function useRadarChartLogic(
    data: Record<string, any>[],
    config: RadarChartConfig
): {
    chartData: ChartData<"radar">;
    options: ChartOptions<"radar">;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
    validDatasets: any[];
} {
    // Paramètres du widget
    const widgetParams = useMemo(() => mergeWidgetParams(config.widgetParams), [config.widgetParams]);
    
    // Métriques et styles
    const validMetrics = useMemo(() => config.metrics || [], [config.metrics]);
    const metricStyles = useMemo(() => prepareMetricStyles(config.metricStyles), [config.metricStyles]);

    // Pour le radar chart, les labels sont les champs sélectionnés dans les datasets
    const labels = useMemo(() => {
        if (!validMetrics.length) return [];

        // Utiliser les champs du premier dataset comme axes du radar
        const firstMetric = validMetrics[0] as RadarMetricConfig;
        return firstMetric.fields || [];
    }, [validMetrics]);

    // Créer les datasets pour chaque métrique radar
    const datasets = useMemo(() => {
        return (validMetrics as RadarMetricConfig[]).map((metric: RadarMetricConfig, idx: number) => {
            // Filtrer les données selon groupBy si spécifié dans le dataset
            let filteredData = data;
            if (metric.groupBy && metric.groupByValue) {
                filteredData = data.filter(row =>
                    String(row[metric.groupBy!]) === metric.groupByValue
                );
            }

            // Calculer les valeurs pour chaque champ (axe du radar)
            const values = (metric.fields || []).map(field => {
                if (!filteredData.length) return 0;

                // Appliquer l'agrégation sur le champ spécifique
                switch (metric.agg) {
                    case 'sum':
                        return filteredData.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
                    case 'avg': {
                        const sum = filteredData.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
                        return sum / filteredData.length;
                    }
                    case 'count':
                        return filteredData.filter(row => row[field] !== null && row[field] !== undefined).length;
                    case 'min':
                        return Math.min(...filteredData.map(row => Number(row[field]) || 0));
                    case 'max':
                        return Math.max(...filteredData.map(row => Number(row[field]) || 0));
                    default:
                        return filteredData.length;
                }
            });

            const style = metricStyles[idx] || {};
            return createRadarChartDataset(metric, idx, values, labels, widgetParams, style);
        });
    }, [validMetrics, data, labels, widgetParams, metricStyles]);

    // Options du chart
    const options = useMemo(() => {
        const baseOptions = createBaseOptions("radar", widgetParams, labels);

        // Options spécifiques au radar
        return {
            ...baseOptions,
            scales: {
                r: {
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
        valueLabelsPlugin: null, // Pas de plugin spécial pour radar
        validDatasets: validMetrics,
    };
};
