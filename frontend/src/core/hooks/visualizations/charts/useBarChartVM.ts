/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { BarChartConfig } from "@type/visualization";
import { useChartLogic } from "@hooks/visualizations/charts/useChartLogic";
import { createBarChartDataset } from "@utils/chartDatasetUtils";

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
        customDatasetCreator: (metric, idx, values, labels, widgetParams, style) => {
            return createBarChartDataset(metric, idx, values, labels, widgetParams, style);
        },
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
}
