/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData, TooltipItem } from "chart.js";
import type { PieChartConfig } from '@/core/types/visualization';
import { useChartLogic } from './useChartLogic';

export function usePieChartLogic(
    data: Record<string, any>[],
    config: PieChartConfig
): {
    chartData: ChartData<"pie">;
    options: ChartOptions<"pie">;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
} {

    const result = useChartLogic({
        chartType: "pie",
        data,
        config,
        customDatasetCreator: (metric, _idx, values, labels, widgetParams, style) => {
            const defaultColors = widgetParams.colors || [
                "#6366f1", "#f59e42", "#10b981", "#ef4444", "#fbbf24",
                "#3b82f6", "#a21caf", "#14b8a6", "#eab308", "#f472b6"
            ];

            const colors = labels.map((_, index) =>
                style.color || defaultColors[index % defaultColors.length] || `hsl(${(index * 40) % 360}, 70%, 60%)`
            );

            return {
                type: 'pie' as const,
                label: metric.label || `${metric.agg}(${metric.field})`,
                data: values,
                backgroundColor: colors,
                borderColor: colors.map(color =>
                    widgetParams.borderColor || style.borderColor || color
                ),
                borderWidth: widgetParams.borderWidth || (style.borderWidth ?? 1),
                hoverOffset: 4,
                cutout: widgetParams.cutout || "0%",
            };
        },
        customOptionsCreator: (params) => ({
            plugins: {
                legend: {
                    display: params.legend !== false,
                    position: params.legendPosition || 'top',
                },
                tooltip: {
                    callbacks: {
                        label: (context: TooltipItem<"pie">) => {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        },
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
    };
};
