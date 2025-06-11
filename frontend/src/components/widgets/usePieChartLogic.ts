import { useMemo } from "react";
import {
  aggregate,
  getLabels,
  getColors,
  getLegendPosition,
  getTitle,
  getTitleAlign,
} from "./chartUtils";
import type { ChartOptions, ChartData } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";

export function usePieChartLogic(data: any[], config: any) {
  // On ne prend que la première métrique pour le pie (classique)
  const metric = config.metrics?.[0] || { agg: "sum", field: "", label: "" };
  const labels = useMemo(() => getLabels(data, config.bucket?.field), [data, config.bucket?.field]);
  const values = useMemo(
    () =>
      labels.map((labelVal: string) => {
        const rows = data.filter((row: any) => row[config.bucket.field] === labelVal);
        return aggregate(rows, metric.agg, metric.field);
      }),
    [labels, data, config.bucket?.field, metric.agg, metric.field]
  );
  const backgroundColor = useMemo(() => getColors(labels, config, 0), [labels, config]);
  const legendPosition = getLegendPosition(config);
  const title = getTitle(config);
  const titleAlign = getTitleAlign(config);
  const chartData: ChartData<"pie"> = useMemo(() => ({
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColor,
        borderWidth: config.metricStyles?.[0]?.borderWidth || 1,
        borderColor: config.metricStyles?.[0]?.borderColor || undefined,
        borderRadius: config.metricStyles?.[0]?.borderRadius || 0,
      },
    ],
  }), [labels, values, backgroundColor, config.metricStyles]);

  // Tooltip, cutout, labelFormat, showValues
  const tooltipFormat = config.widgetParams?.tooltipFormat || config.tooltipFormat || "{label}: {value} ({percent}%)";
  const cutout = config.widgetParams?.cutout || config.cutout || undefined;
  const labelFormat = config.widgetParams?.labelFormat || config.labelFormat || "{label}: {value} ({percent}%)";
  const showValues = config.metricStyles?.[0]?.showValues ?? config.widgetParams?.showValues ?? config.showValues ?? false;
  const showNativeValues = showValues && labels.length > 0 && values.length > 0;

  // Plugin natif pour afficher les valeurs sur chaque part si showValues
  const valueLabelsPlugin = useMemo(() => ({
    id: "pieValueLabelsPlugin",
    afterDraw(chart: ChartJSInstance) {
      if (!showNativeValues) return;
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      meta.data.forEach((arc: any, i: number) => {
        const value = values[i];
        if (value == null || isNaN(value)) return;
        const percent =
          values.reduce((a, b) => a + b, 0) > 0
            ? ((value / values.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
            : "0.0";
        const label = labelFormat
          .replace("{label}", labels[i])
          .replace("{value}", String(value))
          .replace("{percent}", percent);
        const pos = arc.getCenterPoint();
        ctx.save();
        ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = backgroundColor[i] || "#333";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeText(label, pos.x, pos.y);
        ctx.fillStyle = "#fff";
        ctx.fillText(label, pos.x, pos.y);
        ctx.restore();
      });
    },
  }), [showNativeValues, values, labelFormat, labels, backgroundColor]);

  const options: ChartOptions<"pie"> = useMemo(() => ({
    responsive: true,
    interaction: { mode: "nearest", intersect: true },
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
          label: function (context) {
            const label = context.label;
            const value = context.parsed;
            const percent =
              values.reduce((a, b) => a + b, 0) > 0
                ? ((value / values.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
                : "0.0";
            return tooltipFormat
              .replace("{label}", label)
              .replace("{value}", String(value))
              .replace("{percent}", percent);
          },
        },
      },
    },
    cutout: cutout,
  }), [legendPosition, title, titleAlign, tooltipFormat, cutout, values, config]);

  return {
    chartData,
    options,
    showNativeValues,
    valueLabelsPlugin,
  };
}
