/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback } from "react";
import type { ChartOptions, ChartData } from "chart.js";
import type { BarChartConfig } from "@/core/types/visualization";
import type { MetricConfig } from "@/core/types/metric-bucket-types";
import type { BarChartParams } from "@/core/types/visualization";
import {
    aggregate,
    getLegendPosition,
    getTitle,
    getTitleAlign,
    formatTooltipValue,
} from "@/core/utils/chartUtils";
import { useMultiBucketProcessor } from "@/core/utils/multiBucketProcessor";

export function useBarChartLogic(
    data: Record<string, any>[],
    config: BarChartConfig
): { chartData: ChartData<"bar">; options: ChartOptions<"bar"> } {

    // Utiliser le processeur de buckets multiples
    const processedData = useMultiBucketProcessor(data, config);

    // Calculer les valeurs pour chaque métrique
    const getValues = useCallback(
        (metric: MetricConfig) => {
            if (processedData.bucketHierarchy.length === 0) {
                // Pas de buckets, agréger toutes les données
                return [aggregate(data, metric.agg, metric.field)];
            }

            // Utiliser le premier niveau de buckets pour l'instant
            const firstLevel = processedData.bucketHierarchy[0];
            return firstLevel.buckets.map(bucket => {
                return aggregate(bucket.data, metric.agg, metric.field);
            });
        },
        [processedData, data]
    );

    // Extraction stricte des params
    const widgetParams: BarChartParams = config.widgetParams ?? {};
    const showValues = widgetParams.showValues ?? false;
    const stacked = widgetParams.stacked ?? false;
    const labelFormat = widgetParams.labelFormat || "{label}: {value}";
    const labelColor = widgetParams.labelColor;
    const labelFontSize = widgetParams.labelFontSize;

    // Gérer les split series (séries multiples)
    const datasets = useMemo(() => {
        if (processedData.splitData.series.length > 0) {
            // Mode split series : créer un dataset par série
            return processedData.splitData.series.map((splitItem, idx) => {
                const metric = config.metrics[0] as MetricConfig; // Utiliser la première métrique
                const values = processedData.labels.map(label => {
                    const bucketData = splitItem.data.filter(row =>
                        row[processedData.bucketHierarchy[0]?.bucket.field] === label
                    );
                    return aggregate(bucketData, metric.agg, metric.field);
                });

                const style = (config.metricStyles && config.metricStyles[idx]) || {};

                return {
                    label: splitItem.key,
                    data: values,
                    backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                    borderWidth: style.borderWidth ?? 1,
                    borderColor: style.borderColor || undefined,
                    barThickness: style.barThickness || undefined,
                    borderRadius: style.borderRadius || 0,
                    stack: stacked ? 'stack0' : `stack${idx}`,
                };
            });
        }

        // Mode normal : un dataset par métrique
        return config.metrics.map((metric: MetricConfig, idx: number) => {
            const values = getValues(metric);
            const style = (config.metricStyles && config.metricStyles[idx]) || {};

            return {
                label: metric.label || metric.field,
                data: values,
                backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderWidth: style.borderWidth ?? 1,
                borderColor: style.borderColor || undefined,
                barThickness: style.barThickness || undefined,
                borderRadius: style.borderRadius || 0,
                stack: stacked ? 'stack0' : `stack${idx}`,
            };
        });
    }, [config.metrics, config.metricStyles, getValues, stacked, processedData]);

    const chartData: ChartData<"bar"> = useMemo(
        () => ({
            labels: processedData.labels,
            datasets
        }),
        [processedData.labels, datasets]
    );

    const legendPosition = getLegendPosition(config);
    const title = getTitle(config);
    const titleAlign = getTitleAlign(config);
    const xLabel = widgetParams.xLabel;
    const yLabel = widgetParams.yLabel;
    const showGrid = widgetParams.showGrid ?? true;
    const isHorizontal = widgetParams.horizontal ?? false;
    const indexAxis: "x" | "y" = isHorizontal ? "y" : "x";

    const pluginsOptions = useMemo(() => (
        showValues
            ? {
                datalabels: undefined,
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context: any) {
                            const label = formatTooltipValue(context.label);
                            const value = context.parsed.y;
                            return labelFormat
                                .replace("{label}", label)
                                .replace("{value}", String(value))
                                .replace("{percent}", "");
                        },
                    },
                },
            }
            : {
                datalabels: undefined,
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context: any) {
                            const label = formatTooltipValue(context.label);
                            const value = isHorizontal ? context.parsed.x : context.parsed.y;
                            return labelFormat
                                .replace("{label}", label)
                                .replace("{value}", String(value))
                                .replace("{percent}", "");
                        },
                    },
                },
            }
    ), [showValues, labelFormat, isHorizontal]);

    const options: ChartOptions<"bar"> = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            indexAxis,
            plugins: {
                legend: {
                    display: (config.widgetParams as BarChartParams)?.legend ?? true,
                    position: legendPosition,
                },
                title: {
                    display: !!title,
                    text: title,
                    align: titleAlign,
                    color: labelColor,
                    font: {
                        size: labelFontSize,
                    },
                },
                ...pluginsOptions,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: !!xLabel,
                        text: xLabel,
                    },
                    grid: {
                        display: showGrid,
                    },
                    stacked: stacked,
                },
                y: {
                    display: true,
                    title: {
                        display: !!yLabel,
                        text: yLabel,
                    },
                    grid: {
                        display: showGrid,
                    },
                    stacked: stacked,
                },
            },
        }),
        [
            indexAxis,
            config.widgetParams,
            legendPosition,
            title,
            titleAlign,
            labelColor,
            labelFontSize,
            pluginsOptions,
            xLabel,
            yLabel,
            showGrid,
            stacked,
        ]
    );

    return { chartData, options };
}
