/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { ScatterChartConfig } from "@/core/types/visualization";
import { useChartLogic } from "./useChartLogic";

export function useScatterChartLogic(
    data: Record<string, any>[],
    config: ScatterChartConfig
): {
    chartData: ChartData<"scatter">;
    options: ChartOptions<"scatter">;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
} {

    const result = useChartLogic({
        chartType: "scatter",
        data,
        config,
        customDatasetCreator: (metric, idx, values, _labels, widgetParams, style) => {
            return {
                type: 'scatter' as const,
                label: metric.label || `${metric.agg}(${metric.field})`,
                data: values,
                backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderColor: style.borderColor || style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderWidth: widgetParams.borderWidth || (style.borderWidth ?? 1),
                pointStyle: style.pointStyle || widgetParams.pointStyle || 'circle',
                pointRadius: widgetParams.showPoints !== false ? 5 : 0,
                pointHoverRadius: widgetParams.showPoints !== false ? 7 : 0,
                showLine: false,
                opacity: style.opacity || 0.7,
            };
        },
        customOptionsCreator: () => ({
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                },
                y: {
                },
            },
        }),
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
};
