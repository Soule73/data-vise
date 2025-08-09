/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { LineChartConfig } from "@type/visualization";
import { useChartLogic } from "@hooks/visualizations/charts/useChartLogic";
import { createLineChartDataset } from "@utils/chartDatasetUtils";

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
        customDatasetCreator: (metric, idx, values, labels, widgetParams, style) => {
            return createLineChartDataset(metric, idx, values, labels, widgetParams, style);
        },
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
}
