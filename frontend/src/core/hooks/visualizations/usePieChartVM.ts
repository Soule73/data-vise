import { useMemo } from "react";
import {
  aggregate,
  getColors,
  getLabels,
  getLegendPosition,
  getTitle,
  getTitleAlign,
} from "@/core/utils/chartUtils";
import type { PieChartConfig } from "@/core/types/visualization";
import type { MetricConfig } from "@/core/types/metric-bucket-types";
import type { ChartOptions, ChartData, ChartDataset } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";
import type { PieChartParams } from "@/core/types/visualization";

export function usePieChartLogic(
  data: Record<string, unknown>[],
  config: PieChartConfig
): {
  chartData: ChartData<"pie">;
  options: ChartOptions<"pie">;
  showNativeValues: boolean;
  valueLabelsPlugin: {
    id: string;
    afterDraw: (chart: ChartJSInstance) => void;
  };
} {
  // Extraction stricte des params
  const widgetParams: PieChartParams = config.widgetParams ?? {};
  // On ne prend que la première métrique pour le pie (classique)
  const metric: MetricConfig = config.metrics?.[0] || {
    agg: "sum",
    field: "",
    label: "",
  };
  const labels = useMemo(
    () => getLabels(data, config.bucket?.field),
    [data, config.bucket?.field]
  );
  const values = useMemo<number[]>(
    () =>
      labels.map((labelVal: string) => {
        const rows = data.filter(
          (row) => row[config.bucket.field] === labelVal
        );
        return aggregate(rows, metric.agg, metric.field);
      }),
    [labels, data, config.bucket?.field, metric.agg, metric.field]
  );
  const backgroundColor = useMemo<string[]>(
    () =>
      config.widgetParams &&
      Array.isArray(config.widgetParams.colors) &&
      config.widgetParams.colors.length > 0
        ? labels.map(
            (_, i) =>
              config.widgetParams!.colors![
                i % config.widgetParams!.colors!.length
              ]
          )
        : getColors(labels, config, 0),
    [labels, config]
  );
  const legendPosition = getLegendPosition(config);
  const title = getTitle(config);
  const titleAlign = getTitleAlign(config);
  const color = config.metricStyles?.[0]?.color || backgroundColor;
  const chartData: ChartData<"pie"> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor,
          borderWidth: widgetParams.borderWidth ?? 1,
          borderColor: widgetParams.borderColor ?? "#000000",
        } as ChartDataset<"pie">,
      ],
    }),
    [
      labels,
      values,
      backgroundColor,
      widgetParams.borderWidth,
      widgetParams.borderColor,
    ]
  );
  // Tooltip, cutout, labelFormat, showValues
  const tooltipFormat =
    widgetParams.tooltipFormat || "{label}: {value} ({percent}%)";
  const cutout = widgetParams.cutout || undefined;
  const labelFormat =
    widgetParams.labelFormat || "{label}: {value} ({percent}%)";
  const showValues =
    config.metricStyles?.[0]?.showValues ?? widgetParams.showValues ?? false;
  const showNativeValues = showValues && labels.length > 0 && values.length > 0;
  // Plugin natif pour afficher les valeurs sur chaque part si showValues
  const valueLabelsPlugin = useMemo(
    () => ({
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
          ctx.fillStyle = Array.isArray(color) ? color[i] : color || "#333";
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
    }),
    [showNativeValues, values, labelFormat, labels, color]
  );
  const options: ChartOptions<"pie"> = useMemo(
    () => ({
      responsive: true,
      animation: false,
      interaction: { mode: "nearest", intersect: true },
      plugins: {
        legend: {
          display: config.widgetParams?.legend !== false,
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
                  ? ((value / values.reduce((a, b) => a + b, 0)) * 100).toFixed(
                      1
                    )
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
    }),
    [legendPosition, title, titleAlign, tooltipFormat, cutout, values, config]
  );
  return {
    chartData,
    options,
    showNativeValues,
    valueLabelsPlugin,
  };
}
