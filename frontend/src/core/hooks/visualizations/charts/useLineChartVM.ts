import { useChartLogic } from "@hooks/visualizations/charts/useChartVM";
import { createLineChartDataset } from "@utils/charts/chartDatasetUtils";
import type { LineChartVM, LineChartWidgetProps } from "@type/widgetTypes";

export function useLineChartLogic({
    data,
    config,
}: LineChartWidgetProps): LineChartVM {

    const result = useChartLogic<"line">({
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
