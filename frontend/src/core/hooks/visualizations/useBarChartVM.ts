import { useMemo } from "react";
import type { ChartOptions, ChartData, TooltipItem } from "chart.js";
import type { BarChartConfig } from "@/core/types/visualization";
import type { MetricConfig } from "@/core/types/metric-bucket-types";
import type { BarChartParams } from "@/core/types/visualization";
import {
  aggregate,
  getLabels,
  getLegendPosition,
  getTitle,
  getTitleAlign,
  isIsoTimestamp,
  allSameDay,
  formatXTicksLabel,
  formatTooltipValue,
} from "@/core/utils/chartUtils";

export function useBarChartLogic(
  data: Record<string, any>[],
  config: BarChartConfig
): { chartData: ChartData<"bar">; options: ChartOptions<"bar"> } {
  const labels = useMemo(
    () => getLabels(data, config.bucket?.field),
    [data, config.bucket?.field]
  );
  function getValues(metric: MetricConfig) {
    return labels.map((labelVal: string) => {
      const rows = data.filter(
        (row: any) => row[config.bucket.field] === labelVal
      );
      return aggregate(rows, metric.agg, metric.field);
    });
  }
  // Extraction stricte des params
  const widgetParams: BarChartParams = config.widgetParams ?? {};
  const showValues = widgetParams.showValues ?? false;
  const stacked = widgetParams.stacked ?? false;
  const labelFormat = widgetParams.labelFormat || "{label}: {value}";
  // const barThickness = widgetParams.barThickness;
  // const borderRadius = widgetParams.borderRadius ?? 0;
  // const borderColor = widgetParams.borderColor;
  // const fillColor = widgetParams.backgroundColor;
  const labelColor = widgetParams.labelColor;
  const labelFontSize = widgetParams.labelFontSize;

  const datasets = useMemo(
    () =>
      config.metrics.map((metric: MetricConfig, idx: number) => {
        const values = getValues(metric);
        const style = (config.metricStyles && config.metricStyles[idx]) || {};
        return {
          label: metric.label || metric.field,
          data: values,
          backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
          borderWidth: style.borderWidth ?? 1,
          borderColor: style.borderColor || undefined,
          barThickness: style.barThickness || undefined,
          borderRadius: style.borderRadius || 0,
          // Correction stack: si non empilé, chaque dataset a un stack différent
          stack: stacked ? undefined : `stack${idx}`,
        };
      }),
    [labels, config.metrics, config.metricStyles, stacked]
  );
  const chartData: ChartData<"bar"> = useMemo(
    () => ({ labels, datasets }),
    [labels, datasets]
  );
  const legendPosition = getLegendPosition(config);
  const title = getTitle(config);
  const titleAlign = getTitleAlign(config);
  const xLabel = widgetParams.xLabel;
  const yLabel = widgetParams.yLabel;
  const showGrid = widgetParams.showGrid ?? true;
  const isHorizontal = widgetParams.horizontal ?? false;
  const indexAxis: "x" | "y" = isHorizontal ? "y" : "x";
  // Correction : ne pas dupliquer la clé plugins dans l'objet options
  const pluginsOptions = showValues
    ? {
      datalabels: undefined,
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            const label = formatTooltipValue(context.label);
            const value = context.parsed.y;
            // Pas de percent pour bar, mais on laisse le placeholder pour compat future
            return labelFormat
              .replace("{label}", label)
              .replace("{value}", String(value))
              .replace("{percent}", "");
          },
        },
      },
    }
    : {};
  const isXTimestamps = useMemo(() => {
    if (!labels || labels.length === 0) return false;
    return isIsoTimestamp(labels[0]);
  }, [labels]);
  const xAllSameDay = useMemo(() => {
    if (!isXTimestamps || !labels || labels.length === 0) return false;
    return allSameDay(labels);
  }, [isXTimestamps, labels]);

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      animation: false,
      plugins: {
        legend: {
          display: widgetParams.legend !== false,
          position: legendPosition as "top" | "left" | "right" | "bottom",
          labels: {
            color: labelColor,
            font: labelFontSize ? { size: labelFontSize } : undefined,
          },
        },
        title: title
          ? {
            display: true,
            text: title,
            position: "top",
            align: titleAlign as "start" | "center" | "end",
            color: labelColor,
            font: labelFontSize ? { size: labelFontSize } : undefined,
          }
          : undefined,
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context: TooltipItem<"bar">) => {
              const label = context.label;
              const value = context.parsed.y;
              if (showValues) {
                return labelFormat
                  .replace("{label}", label)
                  .replace("{value}", String(value))
                  .replace("{percent}", "");
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
          stacked,
          ticks: {
            color: labelColor,
            font: labelFontSize ? { size: labelFontSize } : undefined,
            callback: (_: any, idx: number) =>
              isXTimestamps
                ? formatXTicksLabel(labels[idx], xAllSameDay)
                : labels[idx],
            maxRotation: 45,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
          },
        },
        y: {
          grid: { display: showGrid },
          stacked: stacked,
          title: yLabel ? { display: true, text: yLabel } : undefined,
          ticks: {
            color: labelColor,
            font: labelFontSize ? { size: labelFontSize } : undefined,
          },
        },
      },
    }),
    [
      legendPosition,
      title,
      titleAlign,
      xLabel,
      yLabel,
      showGrid,
      stacked,
      indexAxis,
      showValues,
      labelFormat,
      pluginsOptions,
      labelColor,
      labelFontSize,
      labels,
      isXTimestamps,
      xAllSameDay,
    ]
  );
  return {
    chartData,
    options,
  };
}
