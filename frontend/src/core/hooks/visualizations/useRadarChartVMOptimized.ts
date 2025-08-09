/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { RadarChartConfig } from "@/core/types/visualization";
import { useChartLogic } from "./useChartLogic";

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

    const result = useChartLogic({
        chartType: "radar",
        data,
        config,
        customDatasetCreator: (metric, idx, values, _labels, widgetParams, style) => {
            return {
                type: 'radar' as const,
                label: metric.label || `${metric.agg}(${metric.field})`,
                data: values,
                backgroundColor: style.color ?
                    `${style.color}40` :
                    `hsl(${(idx * 60) % 360}, 70%, 60%, 0.25)`,
                borderColor: style.borderColor || style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
                borderWidth: style.borderWidth ?? widgetParams.borderWidth ?? 2,
                pointStyle: style.pointStyle || widgetParams.pointStyle || 'circle',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: style.fill !== false,
                tension: 0.1,
                opacity: style.opacity || 0.7,
            };
        },
        customOptionsCreator: (params) => ({
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        display: params.showGrid !== false,
                    },
                    ticks: {
                        display: params.showTicks !== false,
                    },
                },
            },
            elements: {
                point: {
                    radius: params.pointRadius || 3,
                },
                line: {
                    borderWidth: params.borderWidth || 2,
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
