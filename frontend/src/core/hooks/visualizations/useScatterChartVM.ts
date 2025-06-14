import { useMemo } from "react";
import type { ChartOptions, ChartData } from "chart.js";

export function useScatterChartLogic(data: any[], config: any) {
  const validDatasets = useMemo(
    () =>
      Array.isArray(config.metrics)
        ? config.metrics.filter((ds: any) => ds.x && ds.y)
        : [],
    [config.metrics]
  );

  const datasets = useMemo(
    () =>
      validDatasets.map((ds: any, i: number) => {
        let color =
          config.metricStyles?.[i]?.color || `hsl(${(i * 60) % 360}, 70%, 60%)`;
        let opacity = config.metricStyles?.[i]?.opacity ?? 0.7;
        if (color.startsWith("#") && opacity < 1) {
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
          })),
          backgroundColor: color,
          borderColor: config.metricStyles?.[i]?.borderColor || undefined,
          borderWidth: config.metricStyles?.[i]?.borderWidth || 1,
        };
      }),
    [validDatasets, data, config.metricStyles]
  );

  const chartTitle = config.widgetParams?.title || "";
  const showLegend =
    config.widgetParams?.legend !== undefined
      ? config.widgetParams.legend
      : true;
  const xLabel = config.widgetParams?.xLabel || "";
  const yLabel = config.widgetParams?.yLabel || "";

  const chartData: ChartData<"scatter"> = useMemo(
    () => ({ datasets }),
    [datasets]
  );

  const options: ChartOptions<"scatter"> = useMemo(
    () => ({
      responsive: true,
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
              return `x: ${d.x}, y: ${d.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: xLabel ? { display: true, text: xLabel } : undefined,
          grid: { display: true },
        },
        y: {
          title: yLabel ? { display: true, text: yLabel } : undefined,
          grid: { display: true },
        },
      },
    }),
    [showLegend, chartTitle, xLabel, yLabel]
  );

  return { chartData, options, validDatasets };
}
