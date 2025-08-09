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
        customDatasetCreator: (metric, idx, values, labels) => {
            const style = config.metricStyles?.[idx] || {};

            // Pour les graphiques en secteurs, chaque segment a sa propre couleur
            const colors = labels.map((_, index) =>
                `hsl(${(index * 40) % 360}, 70%, 60%)`
            );

            return {
                type: 'pie' as const,
                label: metric.label || `${metric.agg}(${metric.field})`,
                data: values,
                backgroundColor: colors,
                borderColor: colors.map(color => style.borderColor || color),
                borderWidth: style.borderWidth ?? 1,
                hoverOffset: 4,
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
