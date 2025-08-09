/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { BarChartConfig } from "@/core/types/visualization";
import { useChartLogic } from "./useChartLogic";

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
    customOptionsCreator: (params) => ({
      scales: {
        x: {
          stacked: params.stacked === true,
        },
        y: {
          stacked: params.stacked === true,
        },
      },
      indexAxis: params.horizontal ? "y" : "x",
    }),
  });

  return {
    chartData: result.chartData,
    options: result.options,
    showNativeValues: result.showNativeValues,
    valueLabelsPlugin: result.valueLabelsPlugin,
  };
}
