import { useMemo } from "react";
import { aggregate, getLabels, getLegendPosition, getTitle, getTitleAlign } from "@/core/utils/chartUtils";

import type { ChartOptions, ChartData } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";

export function useLineChartLogic(data: any[], config: any) {
  const labels = useMemo(() => getLabels(data, config.bucket?.field), [data, config.bucket?.field]);
  function getValues(metric: any) {
    return labels.map((labelVal: string) => {
      const rows = data.filter((row: any) => row[config.bucket.field] === labelVal);
      return aggregate(rows, metric.agg, metric.field);
    });
  }
  // Gestion DRY des options showPoints, fill, stepped, showValues (hors du map)
  const showPoints =
    config.metricStyles &&
    config.metricStyles[0] &&
    config.metricStyles[0].showPoints !== undefined
      ? config.metricStyles[0].showPoints
      : config.widgetParams?.showPoints !== undefined
      ? config.widgetParams.showPoints
      : config.showPoints !== undefined
      ? config.showPoints
      : true;
  const showValues =
    config.metricStyles &&
    config.metricStyles[0] &&
    config.metricStyles[0].showValues !== undefined
      ? config.metricStyles[0].showValues
      : config.widgetParams?.showValues !== undefined
      ? config.widgetParams.showValues
      : config.showValues !== undefined
      ? config.showValues
      : false;
  const fill =
    config.metricStyles &&
    config.metricStyles[0] &&
    config.metricStyles[0].fill !== undefined
      ? config.metricStyles[0].fill
      : config.widgetParams?.fill !== undefined
      ? config.widgetParams.fill
      : config.fill !== undefined
      ? config.fill
      : false;
  const stepped =
    config.metricStyles &&
    config.metricStyles[0] &&
    config.metricStyles[0].stepped !== undefined
      ? config.metricStyles[0].stepped
      : config.widgetParams?.stepped !== undefined
      ? config.widgetParams.stepped
      : config.stepped !== undefined
      ? config.stepped
      : false;
  const datasets = useMemo(() => config.metrics.map((metric: any, idx: number) => {
    const values = getValues(metric);
    const style = (config.metricStyles && config.metricStyles[idx]) || {};
    let borderDash: number[] | undefined = undefined;
    if (
      style.borderDash ||
      config.widgetParams?.borderDash ||
      config.borderDash
    ) {
      const dashStr =
        style.borderDash ||
        config.widgetParams?.borderDash ||
        config.borderDash;
      if (dashStr && typeof dashStr === "string") {
        borderDash = dashStr
          .split(",")
          .map((v: string) => parseInt(v.trim(), 10))
          .filter((n: number) => !isNaN(n));
      }
    }
    const fillColor =
      style.fillColor ||
      config.widgetParams?.fillColor ||
      config.fillColor ||
      (style.color ||
        config.widgetParams?.color ||
        `hsl(${(idx * 60) % 360}, 70%, 60%)`) + "33";
    return {
      label: metric.label || metric.field,
      data: values,
      borderColor:
        style.color ||
        config.widgetParams?.color ||
        `hsl(${(idx * 60) % 360}, 70%, 60%)`,
      backgroundColor: fill ? fillColor : undefined,
      borderWidth: style.borderWidth || config.widgetParams?.borderWidth || 2,
      borderRadius:
        style.borderRadius || config.widgetParams?.borderRadius || 0,
      pointStyle:
        style.pointStyle || config.widgetParams?.pointStyle || undefined,
      pointBorderColor:
        style.borderColor || config.widgetParams?.borderColor || undefined,
      borderDash,
      stepped,
      fill,
    };
  }), [labels, config.metrics, config.metricStyles, fill, stepped, config]);
  const chartData: ChartData<"line"> = useMemo(() => ({ labels, datasets }), [labels, datasets]);
  const hasData =
    labels.length > 0 &&
    datasets.length > 0 &&
    datasets.every((ds: any) => Array.isArray(ds.data) && ds.data.length > 0);
  const legendPosition = getLegendPosition(config);
  const title = getTitle(config);
  const titleAlign = getTitleAlign(config);
  const xLabel = config.widgetParams?.xLabel;
  const yLabel = config.widgetParams?.yLabel;
  const showGrid = config.widgetParams?.showGrid ?? config.showGrid ?? true;
  const stacked = config.widgetParams?.stacked ?? config.stacked ?? false;
  const tension = config.widgetParams?.tension ?? config.tension ?? 0;
  const options: ChartOptions<"line"> = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        display:
          config.widgetParams?.legend !== false && config.legend !== false,
        position: legendPosition as "top" | "left" | "right" | "bottom",
      },
      title: title
        ? {
            display: true,
            text: title,
            position: "top",
            align: titleAlign as "start" | "center" | "end",
            color: config.widgetParams?.labelColor,
            font: config.widgetParams?.labelFontSize
              ? { size: config.widgetParams.labelFontSize }
              : undefined,
          }
        : undefined,
      tooltip: {
        enabled: true,
        callbacks:
          config.widgetParams?.tooltipFormat || config.tooltipFormat
            ? {
                label: function (context) {
                  const label = context.label;
                  const value = context.parsed.y;
                  return (
                    config.widgetParams?.tooltipFormat ||
                    config.tooltipFormat ||
                    "{label}: {value}"
                  )
                    .replace("{label}", label)
                    .replace("{value}", String(value));
                },
              }
            : undefined,
      },
    },
    elements: {
      point: { radius: showPoints ? 3 : 0 },
      line: {
        borderWidth: config.borderWidth || 2,
        tension,
      },
    },
    scales: {
      x: {
        grid: { display: showGrid },
        title: xLabel ? { display: true, text: xLabel } : undefined,
        stacked,
      },
      y: {
        grid: { display: showGrid },
        title: yLabel ? { display: true, text: yLabel } : undefined,
        stacked,
      },
    },
  }), [legendPosition, title, titleAlign, xLabel, yLabel, showGrid, stacked, tension, showPoints, config]);
  const showNativeValues = showValues && hasData;
  const valueLabelsPlugin = useMemo(() => ({
    id: "valueLabelsPlugin",
    afterDatasetsDraw(chart: ChartJSInstance) {
      if (!showNativeValues) return;
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset: any, i: number) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((point: any, j: number) => {
          const value = dataset.data[j];
          if (value == null || isNaN(value)) return;
          const labelFormat =
            config.widgetParams?.labelFormat || config.labelFormat || "{value}";
          const label = labelFormat.replace("{value}", value);
          ctx.save();
          ctx.font = "bold 11px sans-serif";
          ctx.fillStyle = dataset.borderColor || "#333";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(label, point.x, point.y - 6);
          ctx.restore();
        });
      });
    },
  }), [showNativeValues, config, datasets]);
  return {
    chartData,
    options,
    showNativeValues,
    valueLabelsPlugin,
  };
}
