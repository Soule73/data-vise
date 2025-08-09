/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, ChartData } from "chart.js";
import type { ScatterChartConfig } from "@/core/types/visualization";
import { useChartLogic } from "./useChartLogic";

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
    customDatasetCreator: (metric, idx, values) => {
      const style = config.metricStyles?.[idx] || {};
      
      return {
        type: 'scatter' as const,
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
        borderColor: style.borderColor || style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
        borderWidth: style.borderWidth ?? 1,
        pointStyle: style.pointStyle || 'circle',
        pointRadius: 5,
        pointHoverRadius: 7,
        showLine: false,
      };
    },
    customOptionsCreator: (params) => ({
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: !!params.xLabel,
            text: params.xLabel || '',
          },
        },
        y: {
          title: {
            display: !!params.yLabel,
            text: params.yLabel || '',
          },
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
};
