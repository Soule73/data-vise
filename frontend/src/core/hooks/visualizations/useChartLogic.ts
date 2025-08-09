/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback } from "react";
import type { ChartOptions, ChartData, TooltipItem } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";
import {
  aggregate,
  getLabels,
  getLegendPosition,
  getTitle,
  getTitleAlign,
  isIsoTimestamp,
  allSameDay,
  formatXTicksLabel,
} from "@/core/utils/chartUtils";
import { useMultiBucketProcessor } from "@/core/utils/multiBucketProcessor";
import type { MetricConfig } from "@/core/types/metric-bucket-types";

export type ChartType = "bar" | "line" | "pie" | "scatter" | "bubble" | "radar";

export interface BaseChartConfig {
  metrics?: MetricConfig[];
  bucket?: { field: string };
  buckets?: any[];
  metricStyles?: any;
  widgetParams?: any;
}

export interface UseChartLogicOptions {
  chartType: ChartType;
  data: Record<string, any>[];
  config: BaseChartConfig;
  customDatasetCreator?: (metric: MetricConfig, idx: number, values: number[], labels: string[]) => any;
  customOptionsCreator?: (params: any) => Partial<ChartOptions>;
}

/**
 * Hook commun optimisé pour toutes les visualisations Chart.js
 */
export function useChartLogic({
  chartType,
  data,
  config,
  customDatasetCreator,
  customOptionsCreator,
}: UseChartLogicOptions) {
  // Utiliser le processeur de buckets multiples
  const processedData = useMultiBucketProcessor(data, config);

  // Labels communs
  const labels = useMemo(() => {
    if (processedData.labels.length > 0) {
      return processedData.labels;
    }
    return getLabels(data, config.bucket?.field || '');
  }, [processedData.labels, data, config.bucket?.field]);

  // Fonction commune pour obtenir les valeurs
  const getValues = useCallback(
    (metric: MetricConfig): number[] => {
      if (processedData.bucketHierarchy.length === 0) {
        return [aggregate(data, metric.agg, metric.field)];
      }

      const firstLevel = processedData.bucketHierarchy[0];
      return firstLevel.buckets.map(bucket => {
        return aggregate(bucket.data, metric.agg, metric.field);
      });
    },
    [processedData, data]
  );

  // Paramètres communs mémorisés
  const widgetParams = useMemo(() => config.widgetParams ?? {}, [config.widgetParams]);

  // Gestion des couleurs communes
  const getDatasetColor = useCallback((idx: number, style?: any) => {
    if (style?.color) return style.color;
    
    // Couleurs par défaut selon le type de chart
    const defaultColors = {
      bar: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
      line: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
      pie: undefined, // Géré séparément
      scatter: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
      bubble: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
      radar: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
    };
    
    return defaultColors[chartType];
  }, [chartType]);

  // Datasets communs
  const datasets = useMemo(() => {
    const metrics = config.metrics || [];
    const styles = Array.isArray(config.metricStyles) ? config.metricStyles : (config.metricStyles ? Object.values(config.metricStyles) : []);

    // Gestion spéciale pour les split series
    if (processedData.splitData.series.length > 0) {
      return processedData.splitData.series.map((splitItem, idx) => {
        const metric = metrics[0] || { agg: "sum", field: "", label: "" };
        const values = labels.map(label => {
          const bucketData = splitItem.data.filter(row =>
            row[processedData.bucketHierarchy[0]?.bucket.field] === label
          );
          return aggregate(bucketData, metric.agg, metric.field);
        });

        const style = styles[idx] || {};
        
        if (customDatasetCreator) {
          return customDatasetCreator(metric, idx, values, labels);
        }

        // Dataset par défaut
        return createDefaultDataset(chartType, {
          label: splitItem.key,
          data: values,
          backgroundColor: getDatasetColor(idx, style),
          borderColor: style.borderColor || getDatasetColor(idx, style),
          borderWidth: style.borderWidth ?? 1,
          ...style,
        });
      });
    }

    // Datasets normaux
    return metrics.map((metric, idx) => {
      const values = getValues(metric);
      const style = styles[idx] || {};

      if (customDatasetCreator) {
        return customDatasetCreator(metric, idx, values, labels);
      }

      return createDefaultDataset(chartType, {
        label: metric.label || `${metric.agg}(${metric.field})`,
        data: values,
        backgroundColor: getDatasetColor(idx, style),
        borderColor: style.borderColor || getDatasetColor(idx, style),
        borderWidth: style.borderWidth ?? 1,
        ...style,
      });
    });
  }, [
    config.metrics,
    config.metricStyles,
    labels,
    getValues,
    processedData,
    chartType,
    customDatasetCreator,
    getDatasetColor,
  ]);

  // Options communes
  const options = useMemo(() => {
    const baseOptions = createBaseOptions(chartType, widgetParams, labels);
    
    if (customOptionsCreator) {
      const customOptions = customOptionsCreator(widgetParams);
      return mergeOptions(baseOptions, customOptions);
    }
    
    return baseOptions;
  }, [chartType, widgetParams, labels, customOptionsCreator]);

  // Plugin commun pour affichage des valeurs
  const valueLabelsPlugin = useMemo(() => {
    return createValueLabelsPlugin(chartType, widgetParams.showValues);
  }, [chartType, widgetParams.showValues]);

  // Données du chart
  const chartData: ChartData<any> = useMemo(() => ({
    labels,
    datasets,
  }), [labels, datasets]);

  return {
    chartData,
    options,
    showNativeValues: widgetParams.showValues === true,
    valueLabelsPlugin,
    processedData,
    labels,
    getValues,
    validDatasets: config.metrics || [], // Pour compatibilité
  };
}

/**
 * Crée un dataset par défaut selon le type de chart
 */
function createDefaultDataset(chartType: ChartType, baseDataset: any) {
  const typeSpecific = {
    bar: {
      barThickness: baseDataset.barThickness,
      borderRadius: baseDataset.borderRadius || 0,
    },
    line: {
      fill: baseDataset.fill || false,
      tension: baseDataset.tension || 0,
      pointStyle: baseDataset.pointStyle || "circle",
      stepped: baseDataset.stepped || false,
      borderDash: baseDataset.borderDash ? 
        baseDataset.borderDash.split(',').map((n: string) => parseInt(n.trim())) : 
        undefined,
    },
    pie: {
      // Géré différemment pour pie
    },
    scatter: {
      pointStyle: baseDataset.pointStyle || "circle",
      showLine: false,
    },
    bubble: {
      pointStyle: baseDataset.pointStyle || "circle",
    },
    radar: {
      fill: baseDataset.fill !== false,
      pointStyle: baseDataset.pointStyle || "circle",
    },
  };

  return {
    ...baseDataset,
    ...typeSpecific[chartType],
  };
}

/**
 * Crée les options de base pour un chart
 */
function createBaseOptions(chartType: ChartType, params: any, labels: string[]): ChartOptions<any> {
  const baseOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: params.legend !== false,
        position: getLegendPosition(params.legendPosition),
      },
      title: {
        display: !!params.title,
        text: getTitle(params.title),
        align: getTitleAlign(params.titleAlign),
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<any>) => {
            const value = context.parsed.y ?? context.parsed;
            return `${context.dataset.label || ""}: ${value}`;
          },
        },
      },
    },
  };

  // Options spécifiques au type
  if (chartType === "bar" || chartType === "line") {
    const isTimeSeries = labels.length > 0 && isIsoTimestamp(labels[0]) && allSameDay(labels);
    
    baseOptions.scales = {
      x: {
        display: true,
        title: {
          display: !!params.xLabel,
          text: params.xLabel || "",
        },
        ticks: {
          callback: (_: any, index: number) => {
            return formatXTicksLabel(labels[index], isTimeSeries);
          },
        },
        grid: {
          display: params.showGrid !== false,
        },
      },
      y: {
        display: true,
        title: {
          display: !!params.yLabel,
          text: params.yLabel || "",
        },
        beginAtZero: true,
        stacked: params.stacked === true,
        grid: {
          display: params.showGrid !== false,
        },
      },
    };

    if (params.horizontal) {
      baseOptions.indexAxis = "y";
    }
  }

  return baseOptions;
}

/**
 * Fusionne les options personnalisées avec les options de base
 */
function mergeOptions(baseOptions: any, customOptions: any): any {
  // Fusion profonde simple
  return {
    ...baseOptions,
    ...customOptions,
    plugins: {
      ...baseOptions.plugins,
      ...customOptions.plugins,
    },
    scales: {
      ...baseOptions.scales,
      ...customOptions.scales,
    },
  };
}

/**
 * Crée le plugin d'affichage des valeurs
 */
function createValueLabelsPlugin(chartType: ChartType, showValues: boolean) {
  if (!showValues) {
    return {
      id: "valueLabels",
      afterDatasetsDraw: () => {},
    };
  }

  return {
    id: "valueLabels",
    afterDatasetsDraw: (chart: ChartJSInstance) => {
      const ctx = chart.ctx;
      ctx.save();
      
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        
        meta.data.forEach((element, index) => {
          const value = dataset.data[index];
          if (value === null || value === undefined) return;
          
          const x = element.x;
          const y = element.y;
          
          ctx.fillStyle = '#374151';
          ctx.font = '12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = chartType === "bar" ? 'bottom' : 'middle';
          
          const displayValue = typeof value === 'number' ? 
            value.toLocaleString() : 
            String(value);
            
          ctx.fillText(displayValue, x, chartType === "bar" ? y - 5 : y);
        });
      });
      
      ctx.restore();
    },
  };
}
