/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { RadarChartConfig } from "@type/visualization";
import { useChartLogic } from "@hooks/visualizations/charts/useChartLogic";
import { createRadarChartDataset } from "@utils/chartDatasetUtils";

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
        customDatasetCreator: (metric, idx, values, labels, widgetParams, style) => {
            return createRadarChartDataset(metric, idx, values, labels, widgetParams, style);
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
