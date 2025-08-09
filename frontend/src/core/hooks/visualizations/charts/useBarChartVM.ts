/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { BarChartConfig } from "@type/visualization";
import { useChartLogic } from "@hooks/visualizations/charts/useChartLogic";

export function useBarChartLogic(
    data: Record<string, any>[],
    config: BarChartConfig
): {
    chartData: ChartData<"bar">;
    options: ChartOptions<"bar">;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
} {

    const result = useChartLogic({
        chartType: "bar",
        data,
        config,
        customDatasetCreator: (metric, idx, values, _labels, widgetParams, style) => {
            return {
                label: metric.label || `${metric.agg}(${metric.field})`,
                data: values,
                backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderColor: style.borderColor || style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 1,
                barThickness: style.barThickness || widgetParams.barThickness,
                borderRadius: style.borderRadius || widgetParams.borderRadius || 0,
                borderSkipped: false,
            };
        },
        customOptionsCreator: (params) => ({
            scales: {
                x: {
                    stacked: params.stacked === true,
                },
                y: {
                    stacked: params.stacked === true,
                },
            },
            indexAxis: params.horizontal ? "y" : "x",
        }),
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
}
