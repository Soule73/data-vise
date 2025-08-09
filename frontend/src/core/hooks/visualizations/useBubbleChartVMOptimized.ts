/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { BubbleChartConfig } from "@/core/types/visualization";
import { useChartLogic } from "./useChartLogic";

export function useBubbleChartLogic(
    data: Record<string, any>[],
    config: BubbleChartConfig
): {
    chartData: ChartData<"bubble">;
    options: ChartOptions<"bubble">;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
    validDatasets: any[];
} {

    const result = useChartLogic({
        chartType: "bubble",
        data,
        config,
        customDatasetCreator: (metric, idx, values) => {
            const style = config.metricStyles?.[idx] || {};

            return {
                type: 'bubble' as const,
                label: metric.label || `${metric.agg}(${metric.field})`,
                data: values,
                backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderColor: style.borderColor || style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderWidth: style.borderWidth ?? 1,
                pointStyle: style.pointStyle || 'circle',
                pointRadius: 5,
                pointHoverRadius: 7,
            };
        },
        customOptionsCreator: (params) => ({
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: !!params.xLabel,
                        text: params.xLabel || '',
                    },
                },
                y: {
                    title: {
                        display: !!params.yLabel,
                        text: params.yLabel || '',
                    },
                },
            },
        }),
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
        validDatasets: result.validDatasets,
    };
};
