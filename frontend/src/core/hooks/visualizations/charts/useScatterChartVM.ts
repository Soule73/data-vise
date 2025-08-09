/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { ScatterChartConfig } from "@type/visualization";
import { useChartLogic } from "@hooks/visualizations/charts/useChartLogic";
import { createScatterChartDataset } from "@utils/chartDatasetUtils";

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
        customDatasetCreator: (metric, idx, values, labels, widgetParams, style) => {
            return createScatterChartDataset(metric, idx, values, labels, widgetParams, style);
        },
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
    };
};
