/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { BubbleChartConfig } from "@type/visualization";
import { useChartLogic } from "@hooks/visualizations/charts/useChartLogic";
import { createBubbleChartDataset } from "@utils/chartDatasetUtils";

export function useBubbleChartLogic(
    data: Record<string, any>[],
    config: BubbleChartConfig
): {
    chartData: ChartData<"bubble">;
    options: ChartOptions<"bubble">;
    showNativeValues: boolean;
    valueLabelsPlugin: any;
    validDatasets: any[];
} {

    const result = useChartLogic({
        chartType: "bubble",
        data,
        config,
        customDatasetCreator: (metric, idx, values, labels, widgetParams, style) => {
            return createBubbleChartDataset(metric, idx, values, labels, widgetParams, style);
        },
    });

    return {
        chartData: result.chartData,
        options: result.options,
        showNativeValues: result.showNativeValues,
        valueLabelsPlugin: result.valueLabelsPlugin,
        validDatasets: result.validDatasets,
    };
};
