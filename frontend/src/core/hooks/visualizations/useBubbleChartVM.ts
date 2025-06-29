import { useMemo } from "react";
import type { ChartOptions, ChartData } from "chart.js";
import type { BubbleChartConfig } from "@/core/types/visualization";
import type { BubbleMetricConfig } from "@/core/types/metric-bucket-types";
import {
  isIsoTimestamp,
  allSameDay,
  formatXTicksLabel,
} from "@/core/utils/chartUtils";
import type { BubbleChartParams } from "@/core/types/visualization";

export function useBubbleChartLogic(
  data: Record<string, any>[],
  config: BubbleChartConfig
): {
  chartData: ChartData<"bubble">;
  options: ChartOptions<"bubble">;
  validDatasets: BubbleMetricConfig[];
} {
  // Extraction stricte des params
  const widgetParams: BubbleChartParams = config.widgetParams ?? {};

  const validDatasets = useMemo(
    () =>
      Array.isArray(config.metrics)
        ? (config.metrics.filter(
            (ds: any) => ds.x && ds.y && ds.r
          ) as BubbleMetricConfig[])
        : [],
    [config.metrics]
  );

  const datasets = useMemo(
    () =>
      validDatasets.map((ds: BubbleMetricConfig, i: number) => {
        let color =
          config.metricStyles?.[i]?.color || `hsl(${(i * 60) % 360}, 70%, 60%)`;
        let opacity = config.metricStyles?.[i]?.opacity ?? 0.7;
        if (typeof color === "string" && color.startsWith("#") && opacity < 1) {
          const hex = color.replace("#", "");
          const bigint = parseInt(hex, 16);
          const r = (bigint >> 16) & 255;
          const g = (bigint >> 8) & 255;
          const b = bigint & 255;
          color = `rgba(${r},${g},${b},${opacity})`;
        }
        return {
          label: ds.label || `Dataset ${i + 1}`,
          data: data.map((row: any) => ({
            x: Number(row[ds.x]),
            y: Number(row[ds.y]),
            r: Number(row[ds.r]) || 8,
          })),
          backgroundColor: color,
          borderColor: config.metricStyles?.[i]?.borderColor || undefined,
          borderWidth: config.metricStyles?.[i]?.borderWidth ?? 1,
        };
      }),
    [validDatasets, data, config.metricStyles]
  );

  const chartTitle = widgetParams.title || "";
  const showLegend =
    widgetParams.legend !== undefined ? widgetParams.legend : true;
  const xLabel = widgetParams.xLabel || "";
  const yLabel = widgetParams.yLabel || "";

  // Récupération des labels X (pour les tooltips)
  const labels = useMemo(() => {
    const xLabels = new Set<string>();
    data.forEach((row: any) => {
      const xValue = row[validDatasets[0]?.x];
      if (xValue) xLabels.add(String(xValue));
    });
    return Array.from(xLabels);
  }, [data, validDatasets]);

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

  const chartData: ChartData<"bubble"> = useMemo(
    () => ({ datasets }),
    [datasets]
  );

  const options: ChartOptions<"bubble"> = useMemo(
    () => ({
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: showLegend },
        title: chartTitle
          ? {
              display: true,
              text: chartTitle,
            }
          : undefined,
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context: any) {
              const d = context.raw;
              return `x: ${d.x}, y: ${d.y}, r: ${d.r}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: true },
          title: xLabel ? { display: true, text: xLabel } : undefined,
          ticks: {
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
          title: yLabel ? { display: true, text: yLabel } : undefined,
          grid: { display: true },
        },
      },
    }),
    [showLegend, chartTitle, xLabel, yLabel, isXTimestamps, labels, xAllSameDay]
  );

  return { chartData, options, validDatasets };
}
