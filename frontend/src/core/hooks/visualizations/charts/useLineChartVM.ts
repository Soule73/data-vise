/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { LineChartConfig } from "@type/visualization";
import { useChartLogic } from "@hooks/visualizations/charts/useChartLogic";

export function useLineChartLogic(
    data: Record<string, any>[],
    config: LineChartConfig
): {
    chartData: ChartData<"line">;
    options: ChartOptions<"line">;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
} {

    const result = useChartLogic({
        chartType: "line",
        data,
        config,
        customDatasetCreator: (metric, idx, values, _labels, widgetParams, style) => {
            return {
                label: metric.label || `${metric.agg}(${metric.field})`,
                data: values,
                backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderColor: style.borderColor || style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 2,
                fill: style.fill !== undefined ? style.fill : widgetParams.fill,
                tension: widgetParams.tension || 0,
                pointStyle: style.pointStyle || widgetParams.pointStyle || "circle",
                stepped: style.stepped || widgetParams.stepped || false,
                borderDash: (style.borderDash as number[]) ||
                    (widgetParams.borderDash ? widgetParams.borderDash.split(',').map((n: string) => parseInt(n.trim())) : []),
                pointRadius: widgetParams.showPoints !== false ? 3 : 0,
                pointHoverRadius: widgetParams.showPoints !== false ? 5 : 0,
                pointBackgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                pointBorderColor: style.borderColor || style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderRadius: style.borderRadius || widgetParams.borderRadius || 0,
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
            elements: {
                point: {
                    radius: params.showPoints === false ? 0 : 3,
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
}
