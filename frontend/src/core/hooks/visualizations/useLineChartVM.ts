import { useMemo } from "react";
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
import type { LineChartConfig } from "@/core/types/visualization";
import type { MetricConfig } from "@/core/types/metric-bucket-types";
import type { ChartDataset, ChartOptions, ChartData } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";
import type { LineChartParams } from "@/core/types/visualization";

export function useLineChartLogic(
  data: Record<string, unknown>[],
  config: LineChartConfig
): {
  chartData: ChartData<"line">;
  options: ChartOptions<"line">;
  showNativeValues: boolean;
  valueLabelsPlugin: {
    id: string;
    afterDatasetsDraw: (chart: ChartJSInstance) => void;
  };
} {
  const labels = useMemo(
    () => getLabels(data, config.bucket?.field),
    [data, config.bucket?.field]
  );
  function getValues(metric: MetricConfig): number[] {
    return labels.map((labelVal: string) => {
      const rows = data.filter((row) => row[config.bucket.field] === labelVal);
      return aggregate(rows, metric.agg, metric.field);
    });
  }
  // Extraction stricte des params globaux
  const widgetParams: LineChartParams = config.widgetParams ?? {};
  const tension = widgetParams.tension ?? 0;
  const showPoints = widgetParams.showPoints ?? true;
  const showValues = widgetParams.showValues ?? false;
  const labelColor = widgetParams.labelColor;
  const labelFontSize = widgetParams.labelFontSize;

  // Les styles sont strictement par-métrique
  const datasets = useMemo<ChartDataset<"line">[]>(
    () =>
      config.metrics.map((metric: MetricConfig, idx: number) => {
        const values = getValues(metric);
        const style = (config.metricStyles && config.metricStyles[idx]) || {};
        return {
          label: metric.label || metric.field,
          data: values,
          borderColor:
            style.borderColor ||
            style.color ||
            `hsl(${(idx * 60) % 360}, 70%, 60%)`,
          backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
          borderWidth: style.borderWidth ?? 1,
          pointStyle: style.pointStyle || undefined,
          fill: style.fill ?? false,
          stepped: style.stepped ?? false,
          borderRadius: style.borderRadius ?? 0,
          borderDash: style.borderDash ?? undefined,
          tension: tension,
          pointRadius: showPoints ? 3 : 0,
          pointHoverRadius: showPoints ? 5 : 0,
        } as ChartDataset<"line">;
      }),
    [labels, config.metrics, config.metricStyles, tension, showPoints]
  );
  const chartData: ChartData<"line"> = useMemo(
    () => ({ labels, datasets }),
    [labels, datasets]
  );
  const hasData =
    labels.length > 0 &&
    datasets.length > 0 &&
    datasets.every((ds) => Array.isArray(ds.data) && ds.data.length > 0);
  const legendPosition = getLegendPosition(config);
  const title = getTitle(config);
  const titleAlign = getTitleAlign(config);
  // xLabel dynamique : si non renseigné, utiliser le label du champ de regroupement
  let xLabel = config.widgetParams?.xLabel || config.bucket?.field || "";
  const yLabel = config.widgetParams?.yLabel || "";
  const showGrid = config.widgetParams?.showGrid ?? true;
  const stacked = config.widgetParams?.stacked ?? false;
  // Détection si les labels X sont des timestamps ISO
  const isXTimestamps = useMemo(() => {
    if (!labels || labels.length === 0) return false;
    return isIsoTimestamp(labels[0]);
  }, [labels]);
  // Détection si tous les labels X sont le même jour (pour formatage court)
  const xAllSameDay = useMemo(() => {
    if (!isXTimestamps || !labels || labels.length === 0) return false;
    return allSameDay(labels);
  }, [isXTimestamps, labels]);
  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      animation: false,
      plugins: {
        legend: {
          display: config.widgetParams?.legend !== false,
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
            label: function (context) {
              // context.label = valeur de l'axe X, context.parsed.y = valeur Y
              const xVal = context.label;
              const yVal = context.parsed.y;
              const xFormatted = formatTooltipValue(xVal);
              return `${xFormatted}: ${yVal}`;
            },
          },
        },
      },
      elements: {
        point: { radius: showPoints ? 3 : 0 },
        line: {
          borderWidth: config.widgetParams?.borderWidth || 2,
          tension,
        },
      },
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
          title: yLabel ? { display: true, text: yLabel } : undefined,
          stacked,
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
      tension,
      showPoints,
      config,
      isXTimestamps,
      labels,
      xAllSameDay,
      labelColor,
      labelFontSize,
    ]
  );
  const showNativeValues = showValues && hasData;
  const valueLabelsPlugin = useMemo(
    () => ({
      id: "valueLabelsPlugin",
      afterDatasetsDraw(chart: ChartJSInstance) {
        if (!showNativeValues) return;
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          // On caste dataset en ChartDataset<'line'> pour accéder à .data typée
          const lineDataset = dataset as ChartDataset<"line">;
          meta.data.forEach((point: any, j: number) => {
            const value = (lineDataset.data as number[])[j];
            if (value == null || isNaN(value)) return;
            const labelFormat = config.widgetParams?.labelFormat || "{value}";
            const label = labelFormat.replace("{value}", String(value));
            ctx.save();
            ctx.font = "bold 11px sans-serif";
            ctx.fillStyle = (lineDataset.borderColor as string) || "#333";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(label, point.x, point.y - 6);
            ctx.restore();
          });
        });
      },
    }),
    [showNativeValues, config, datasets]
  );
  return {
    chartData,
    options,
    showNativeValues,
    valueLabelsPlugin,
  };
}
