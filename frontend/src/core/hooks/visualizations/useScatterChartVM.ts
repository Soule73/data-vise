import { useMemo } from "react";
import type { ScatterChartConfig } from "@/core/types/visualization";
import type { ScatterMetricConfig } from "@/core/types/metric-bucket-types";
import type { ChartOptions, ChartData, ChartDataset } from "chart.js";
import {
  isIsoTimestamp,
  allSameDay,
  formatXTicksLabel,
} from "@/core/utils/chartUtils";

function isScatterMetricConfig(metric: unknown): metric is ScatterMetricConfig {
  return (
    typeof metric === "object" &&
    metric !== null &&
    "x" in metric &&
    "y" in metric
  );
}

export function useScatterChartLogic(
  data: Record<string, unknown>[],
  config: ScatterChartConfig
): {
  chartData: ChartData<"scatter">;
  options: ChartOptions<"scatter">;
  validDatasets: ScatterMetricConfig[];
} {
  const validDatasets = useMemo<ScatterMetricConfig[]>(
    () =>
      Array.isArray(config.metrics)
        ? config.metrics.filter(isScatterMetricConfig)
        : [],
    [config.metrics]
  );
  const datasets = useMemo<ChartDataset<"scatter">[]>(
    () =>
      validDatasets.map((ds, i) => {
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
          data: data.map((row) => ({
            x: Number(row[ds.x]),
            y: Number(row[ds.y]),
          })),
          backgroundColor: color,
          borderColor: config.metricStyles?.[i]?.borderColor || undefined,
          borderWidth: config.metricStyles?.[i]?.borderWidth || 1,
        } as ChartDataset<"scatter">;
      }),
    [validDatasets, data, config.metricStyles]
  );

  // Récupération des labels X (valeurs de la première série de données)
  const labels = useMemo<string[]>(() => {
    const ds = validDatasets[0];
    return ds ? data.map((row) => String(row[ds.x] ?? "")) : [];
  }, [validDatasets, data]);

  // Détection si les labels X sont des timestamps ISO
  const isXTimestamps = useMemo(() => {
    if (!labels || labels.length === 0) return false;
    return isIsoTimestamp(labels[0]);
  }, [labels]);
  const xAllSameDay = useMemo(() => {
    if (!isXTimestamps || !labels || labels.length === 0) return false;
    return allSameDay(labels as string[]);
  }, [isXTimestamps, labels]);

  const chartData: ChartData<"scatter"> = useMemo(
    () => ({ datasets }),
    [datasets]
  );
  const options: ChartOptions<"scatter"> = useMemo(
    () => ({
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: config.widgetParams?.legend !== false },
        title: config.widgetParams?.title
          ? {
              display: true,
              text: config.widgetParams.title,
            }
          : undefined,
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context: any) {
              const d = context.raw;
              return `x: ${d.x}, y: ${d.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: true },
          title: config.widgetParams?.xLabel
            ? { display: true, text: config.widgetParams.xLabel }
            : undefined,
          ticks: {
            callback: (_: any, idx: number) =>
              isXTimestamps
                ? formatXTicksLabel(labels[idx] as string, xAllSameDay)
                : labels[idx],
            maxRotation: 45,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
          },
        },
        y: {
          title: config.widgetParams?.yLabel
            ? { display: true, text: config.widgetParams.yLabel }
            : undefined,
          grid: { display: true },
        },
      },
    }),
    [config.widgetParams, validDatasets, isXTimestamps, labels, xAllSameDay]
  );

  return { chartData, options, validDatasets };
}
