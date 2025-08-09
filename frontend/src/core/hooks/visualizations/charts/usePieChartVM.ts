/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { PieChartConfig } from '@type/visualization';
import { useChartLogic } from '@hooks/visualizations/charts/useChartLogic';
import { createPieChartDataset } from '@utils/chartDatasetUtils';

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
            return createPieChartDataset(metric, values, labels, widgetParams, style);
        },
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
};
