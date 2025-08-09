/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { LineChartConfig } from "@/core/types/visualization";
import { useChartLogic } from "./useChartLogic";

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
    customDatasetCreator: (metric, idx, values) => {
      const style = config.metricStyles?.[idx] || {};
      return {
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
        borderColor: style.borderColor || style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
        borderWidth: style.borderWidth ?? 2,
        fill: style.fill || false,
        tension: config.widgetParams?.tension || 0,
        pointStyle: style.pointStyle || "circle",
        stepped: style.stepped || false,
        borderDash: (style.borderDash as number[]) || [],
      };
    },
    customOptionsCreator: (params) => ({
      scales: {
        x: {
          stacked: params.stacked === true,
        },
        y: {
          stacked: params.stacked === true,
        },
      },
      elements: {
        point: {
          radius: params.showPoints === false ? 0 : 3,
        },
      },
    }),
  });

  return {
    chartData: result.chartData,
    options: result.options,
    showNativeValues: result.showNativeValues,
    valueLabelsPlugin: result.valueLabelsPlugin,
  };
}
