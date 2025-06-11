import { useMemo } from "react";

import type { ChartOptions, ChartData } from "chart.js";
import { aggregate, getLabels, getLegendPosition, getTitle, getTitleAlign } from "@/core/utils/chartUtils";

export function useBarChartLogic(data: any[], config: any) {
  const labels = useMemo(() => getLabels(data, config.bucket?.field), [data, config.bucket?.field]);
  function getValues(metric: any) {
    return labels.map((labelVal: string) => {
      const rows = data.filter((row: any) => row[config.bucket.field] === labelVal);
      return aggregate(rows, metric.agg, metric.field);
    });
  }
  const showValues = config.widgetParams?.showValues ?? config.showValues ?? false;
  const stacked = config.widgetParams?.stacked ?? config.stacked ?? false;
  const labelFormat = config.widgetParams?.labelFormat || config.labelFormat || "{label}: {value}";
  const datasets = useMemo(() => config.metrics.map((metric: any, idx: number) => {
    const values = getValues(metric);
    const style = (config.metricStyles && config.metricStyles[idx]) || {};
    return {
      label: metric.label || metric.field,
      data: values,
      backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
      borderWidth: style.borderWidth || 1,
      borderColor: style.borderColor || undefined,
      barThickness: style.barThickness || undefined,
      borderRadius: style.borderRadius || 0,
    };
  }), [labels, config.metrics, config.metricStyles]);
  const chartData: ChartData<"bar"> = useMemo(() => ({ labels, datasets }), [labels, datasets]);
  const legendPosition = getLegendPosition(config);
  const title = getTitle(config);
  const titleAlign = getTitleAlign(config);
  const xLabel = config.widgetParams?.xLabel;
  const yLabel = config.widgetParams?.yLabel;
  const showGrid = config.widgetParams?.showGrid ?? config.showGrid ?? true;
  const isHorizontal = config.widgetParams?.horizontal ?? config.horizontal ?? false;
  const indexAxis: "x" | "y" = isHorizontal ? "y" : "x";
  // Correction : ne pas dupliquer la clé plugins dans l'objet options
  const pluginsOptions = showValues
    ? {
        datalabels: undefined,
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context: any) {
              const label = context.label;
              const value = context.parsed.y;
              return labelFormat
                .replace("{label}", label)
                .replace("{value}", String(value));
            },
          },
        },
      }
    : {};
  const options: ChartOptions<"bar"> = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        display: config.widgetParams?.legend !== false && config.legend !== false,
        position: legendPosition as "top" | "left" | "right" | "bottom",
      },
      title: title
        ? {
            display: true,
            text: title,
            position: "top",
            align: titleAlign as "start" | "center" | "end",
          }
        : undefined,
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: import("chart.js").TooltipItem<"bar">) => {
            const label = context.label;
            const value = context.parsed.y;
            if (showValues) {
              return labelFormat
                .replace("{label}", label)
                .replace("{value}", String(value));
            }
            return `${label}: ${value}`;
          },
        },
      },
      ...pluginsOptions,
    },
    indexAxis,
    scales: {
      x: {
        grid: { display: showGrid },
        title: xLabel ? { display: true, text: xLabel } : undefined,
      },
      y: {
        grid: { display: showGrid },
        stacked: stacked,
        title: yLabel ? { display: true, text: yLabel } : undefined,
      },
    },
    animation: false,
  }), [legendPosition, title, titleAlign, xLabel, yLabel, showGrid, stacked, indexAxis, showValues, labelFormat, pluginsOptions]);
  return {
    chartData,
    options,
  };
}
