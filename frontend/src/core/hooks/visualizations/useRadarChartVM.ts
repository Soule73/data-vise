/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import type { RadarChartConfig } from "@/core/types/visualization";
import type { ChartOptions, ChartData, ChartDataset } from "chart.js";
import type { RadarMetricConfig } from "@/core/types/metric-bucket-types";
import type { RadarChartParams } from "@/core/types/visualization";
import { formatTooltipValue } from "@/core/utils/chartUtils";

function isRadarMetricConfig(metric: unknown): metric is RadarMetricConfig {
  return (
    typeof metric === "object" &&
    metric !== null &&
    Array.isArray((metric as any).fields) &&
    (metric as any).fields.length > 0
  );
}

export function useRadarChartLogic(
  data: Record<string, unknown>[],
  config: RadarChartConfig
): {
  chartData: ChartData<"radar">;
  options: ChartOptions<"radar">;
  validDatasets: RadarMetricConfig[];
  axisLabels: string[];
} {
  // Extraction stricte des params
  const widgetParams: RadarChartParams = config.widgetParams ?? {};

  const validDatasets = useMemo<RadarMetricConfig[]>(
    () =>
      Array.isArray(config.metrics)
        ? (config.metrics.filter(isRadarMetricConfig) as RadarMetricConfig[])
        : [],
    [config.metrics]
  );

  // Les labels des axes (ex: "axes" ou "features")
  const axisLabels = useMemo<string[]>(() => {
    if (validDatasets.length > 0 && validDatasets[0].fields) {
      return validDatasets[0].fields.map((f: string) => f);
    }
    return [];
  }, [validDatasets]);

  const datasets = useMemo<ChartDataset<"radar">[]>(
    () =>
      validDatasets.map((ds, i) => {
        let color =
          config.metricStyles?.[i]?.color || `hsl(${(i * 60) % 360}, 70%, 60%)`;
        const opacity = config.metricStyles?.[i]?.opacity ?? 0.7;
        if (typeof color === "string" && color.startsWith("#") && opacity < 1) {
          const hex = color.replace("#", "");
          const bigint = parseInt(hex, 16);
          const r = (bigint >> 16) & 255;
          const g = (bigint >> 8) & 255;
          const b = bigint & 255;
          color = `rgba(${r},${g},${b},${opacity})`;
        }
        // Filtrage par groupBy si défini
        let filteredData = data;
        if (ds.groupBy && ds.groupByValue) {
          filteredData = data.filter(
            (row) => row[ds.groupBy!] === ds.groupByValue
          );
        }
        // Pour chaque axe, on agrège la valeur selon l'agg choisie (sum, avg, ...)
        return {
          label: ds.label || `Dataset ${i + 1}`,
          data: axisLabels.map((field: string) => {
            // On supporte l'agrégation (sum, avg, etc.) si ds.agg existe, sinon on prend la première valeur
            if (ds.agg && filteredData.length > 0) {
              if (ds.agg === "sum")
                return filteredData.reduce(
                  (acc: number, row) => acc + (Number(row[field]) || 0),
                  0
                );
              if (ds.agg === "avg")
                return (
                  filteredData.reduce(
                    (acc: number, row) => acc + (Number(row[field]) || 0),
                    0
                  ) / filteredData.length
                );
              if (ds.agg === "min")
                return Math.min(
                  ...filteredData.map((row) => Number(row[field]) || 0)
                );
              if (ds.agg === "max")
                return Math.max(
                  ...filteredData.map((row) => Number(row[field]) || 0)
                );
              if (ds.agg === "count") return filteredData.length;
            }
            // Par défaut, on prend la première valeur trouvée
            return filteredData.length > 0
              ? Number(filteredData[0][field]) || 0
              : 0;
          }),
          backgroundColor: config.metricStyles?.[i]?.color || color,
          borderColor: config.metricStyles?.[i]?.borderColor || undefined,
          borderWidth: config.metricStyles?.[i]?.borderWidth ?? 1,
          pointBackgroundColor: config.metricStyles?.[i]?.color || color,
        } as ChartDataset<"radar">;
      }),
    [validDatasets, data, config.metricStyles, axisLabels]
  );

  const chartData: ChartData<"radar"> = useMemo(
    () => ({
      labels: axisLabels,
      datasets,
    }),
    [datasets, axisLabels]
  );

  const options: ChartOptions<"radar"> = useMemo(
    () => ({
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: widgetParams.legend !== false },
        title: widgetParams.title
          ? {
            display: true,
            text: widgetParams.title,
          }
          : undefined,
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context: any) {
              // context.label = label de l'axe, context.parsed = valeur
              const label = formatTooltipValue(context.label);
              const value = context.parsed;
              return `${label}: ${value}`;
            },
          },
        },
      },
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
        },
      },
    }),
    [widgetParams.legend, widgetParams.title]
  );

  return { chartData, options, validDatasets, axisLabels };
}
