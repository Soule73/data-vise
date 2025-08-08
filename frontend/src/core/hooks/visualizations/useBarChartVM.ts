/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback } from "react";
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
import { useMultiBucketProcessor } from "@/core/utils/multiBucketProcessor";

export function useBarChartLogic(
  data: Record<string, any>[],
  config: BarChartConfig
): { chartData: ChartData<"bar">; options: ChartOptions<"bar"> } {

  // Utiliser le processeur de buckets multiples
  const processedData = useMultiBucketProcessor(data, config);

  // Fallback vers l'ancien système pour compatibilité
  const labels = useMemo(
    () => {
      if (processedData.labels.length > 0) {
        return processedData.labels;
      }
      return getLabels(data, config.bucket?.field || '');
    },
    [processedData.labels, data, config.bucket?.field]
  );

  const getValues = useCallback(
    (metric: MetricConfig) => {
      if (processedData.bucketHierarchy.length === 0) {
        // Pas de buckets, agréger toutes les données
        return [aggregate(data, metric.agg, metric.field)];
      }

      // Utiliser le premier niveau de buckets
      const firstLevel = processedData.bucketHierarchy[0];
      return firstLevel.buckets.map(bucket => {
        return aggregate(bucket.data, metric.agg, metric.field);
      });
    },
    [processedData, data]
  );
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
    () => {
      // Gérer les split series (séries multiples)
      if (processedData.splitData.series.length > 0) {
        return processedData.splitData.series.map((splitItem, idx) => {
          const metric = config.metrics[0] as MetricConfig; // Utiliser la première métrique
          const values = labels.map(label => {
            const bucketData = splitItem.data.filter(row =>
              row[processedData.bucketHierarchy[0]?.bucket.field] === label
            );
            return aggregate(bucketData, metric.agg, metric.field);
          });

          const style = (config.metricStyles && config.metricStyles[idx]) || {};

          return {
            label: splitItem.key,
            data: values,
            backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
            borderWidth: style.borderWidth ?? 1,
            borderColor: style.borderColor || undefined,
            barThickness: style.barThickness || undefined,
            borderRadius: style.borderRadius || 0,
            stack: stacked ? 'stack0' : `stack${idx}`,
          };
        });
      }

      // Mode normal : un dataset par métrique
      return config.metrics.map((metric: MetricConfig, idx: number) => {
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
      });
    },
    [config.metrics, config.metricStyles, getValues, stacked, processedData, labels]
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
  const pluginsOptions = useMemo(() => (
    showValues
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
      : {}
  ), [showValues, labelFormat]);
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
    [widgetParams.legend, legendPosition, labelColor, labelFontSize, title, titleAlign, pluginsOptions, indexAxis, showGrid, xLabel, stacked, yLabel, showValues, labelFormat, isXTimestamps, labels, xAllSameDay]
  );
  return {
    chartData,
    options,
  };
}
