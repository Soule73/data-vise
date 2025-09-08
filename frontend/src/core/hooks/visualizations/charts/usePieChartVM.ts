import { useChartLogic } from '@hooks/visualizations/charts/useChartVM';
import { createPieChartDataset } from '@utils/charts/chartDatasetUtils';
import type { PieChartVM, PieChartWidgetProps } from "@type/widgetTypes";

export function usePieChartLogic({
    data,
    config,
}: PieChartWidgetProps): PieChartVM {

    const result = useChartLogic<"pie">({
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
