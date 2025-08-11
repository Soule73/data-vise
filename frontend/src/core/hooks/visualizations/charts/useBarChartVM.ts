import { useChartLogic } from "@hooks/visualizations/charts/useChartVM";
import { createBarChartDataset } from "@utils/charts/chartDatasetUtils";
import type { BarChartVM, BarChartWidgetProps } from "@type/widgetTypes";




export function useBarChartLogic({
    data,
    config,
}: BarChartWidgetProps): BarChartVM {
    const result = useChartLogic<"bar">({
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
