/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback } from "react";
import type { ChartOptions, ChartData, TooltipItem } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";
import {
    aggregate,
    getLabels,
    isIsoTimestamp,
    allSameDay,
    formatXTicksLabel,
} from "@utils/chartUtils";
import { useMultiBucketProcessor } from "@utils/multiBucketProcessor";
import type { MetricConfig } from "@type/metric-bucket-types";

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
    customDatasetCreator?: (metric: MetricConfig, idx: number, values: number[], labels: string[], widgetParams: any, metricStyle: any) => any;
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
    // Fusion des paramètres avec les valeurs par défaut de l'adaptateur
    const widgetParams = useMemo(() => ({
        // Paramètres par défaut COMMON_WIDGET_PARAMS de l'adaptateur
        title: "",
        legendPosition: "top",
        xLabel: "",
        yLabel: "",
        labelFormat: "{label}: {value} ({percent}%)",
        tooltipFormat: "{label}: {value}",
        titleAlign: "center",
        labelFontSize: 12,
        labelColor: "#000000",
        legend: true,
        showGrid: true,
        showValues: false,

        // Paramètres spécifiques par type de widget selon l'adaptateur
        stacked: false,
        horizontal: false,
        cutout: "0%",
        showPoints: true,
        tension: 0,
        fill: false,
        borderWidth: 1,
        borderColor: "#000000",
        barThickness: undefined,
        borderRadius: 0,
        borderDash: "",
        stepped: false,
        pointStyle: "circle",
        colors: [
            "#6366f1", "#f59e42", "#10b981", "#ef4444", "#fbbf24",
            "#3b82f6", "#a21caf", "#14b8a6", "#eab308", "#f472b6"
        ],

        // Paramètres pour widgets spécialisés
        pageSize: 10,
        columns: 2,
        showTrend: true,
        valueColor: "#2563eb",
        iconColor: "#6366f1",
        descriptionColor: "#6b7280",
        showIcon: true,
        icon: "ChartBarIcon",
        description: "",

        // Fusionner avec les paramètres réels du config (priorité aux valeurs utilisateur)
        ...config.widgetParams,
    }), [config.widgetParams]);

    // Gestion des couleurs communes
    const getDatasetColor = useCallback((idx: number, style?: any) => {
        if (style?.color) return style.color;

        // Couleurs par défaut selon le type de chart
        const defaultColors = {
            bar: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
            line: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
            pie: undefined,
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
                    return customDatasetCreator(metric, idx, values, labels, widgetParams, style);
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
                return customDatasetCreator(metric, idx, values, labels, widgetParams, style);
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
        widgetParams,
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
        validDatasets: config.metrics || [],
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
            borderSkipped: false,
        },
        line: {
            fill: baseDataset.fill !== undefined ? baseDataset.fill : false,
            tension: baseDataset.tension || 0,
            pointStyle: baseDataset.pointStyle || "circle",
            stepped: baseDataset.stepped || false,
            borderDash: Array.isArray(baseDataset.borderDash) ? baseDataset.borderDash :
                (baseDataset.borderDash ? baseDataset.borderDash.split(',').map((n: string) => parseInt(n.trim())) : []),
            pointRadius: baseDataset.pointRadius || 3,
            pointHoverRadius: baseDataset.pointHoverRadius || 5,
            pointBackgroundColor: baseDataset.pointBackgroundColor || baseDataset.backgroundColor,
            pointBorderColor: baseDataset.pointBorderColor || baseDataset.borderColor,
        },
        pie: {
            hoverOffset: 4,
            borderAlign: 'inner',
            cutout: baseDataset.cutout || "0%",
        },
        scatter: {
            pointStyle: baseDataset.pointStyle || "circle",
            showLine: false,
            pointRadius: baseDataset.pointRadius || 5,
            pointHoverRadius: baseDataset.pointHoverRadius || 7,
            opacity: baseDataset.opacity || 0.7,
        },
        bubble: {
            pointStyle: baseDataset.pointStyle || "circle",
            pointRadius: baseDataset.pointRadius || 5,
            pointHoverRadius: baseDataset.pointHoverRadius || 7,
            opacity: baseDataset.opacity || 0.7,
        },
        radar: {
            fill: baseDataset.fill !== false,
            pointStyle: baseDataset.pointStyle || "circle",
            pointRadius: baseDataset.pointRadius || 4,
            pointHoverRadius: baseDataset.pointHoverRadius || 6,
            tension: 0.1,
            opacity: baseDataset.opacity || 0.7,
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
                position: params.legendPosition || "top",
            },
            title: {
                display: !!params.title,
                text: params.title || "",
                align: params.titleAlign || "center",
                color: params.labelColor || "#000000",
                font: {
                    size: params.labelFontSize || 12,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<any>) => {
                        const value = context.parsed.y ?? context.parsed;
                        const format = params.tooltipFormat || "{label}: {value}";
                        return format
                            .replace("{label}", context.dataset.label || "")
                            .replace("{value}", value);
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
                    color: params.labelColor || "#000000",
                    font: {
                        size: params.labelFontSize || 12,
                    },
                },
                stacked: params.stacked === true,
                grid: {
                    display: params.showGrid !== false,
                },
                ticks: isTimeSeries ? {
                    callback: (_: any, index: number) => {
                        return formatXTicksLabel(labels[index], params.labelFormat);
                    },
                } : {},
            },
            y: {
                display: true,
                title: {
                    display: !!params.yLabel,
                    text: params.yLabel || "",
                    color: params.labelColor || "#000000",
                    font: {
                        size: params.labelFontSize || 12,
                    },
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

    // Options spécifiques pour les graphiques pie
    if (chartType === "pie") {
        baseOptions.cutout = params.cutout || "0%";
        baseOptions.plugins!.tooltip = {
            callbacks: {
                label: (context: TooltipItem<any>) => {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    const format = params.labelFormat || "{label}: {value} ({percent}%)";
                    return format
                        .replace("{label}", label)
                        .replace("{value}", value)
                        .replace("{percent}", percentage);
                },
            },
        };
    }

    // Options spécifiques pour scatter et bubble
    if (chartType === "scatter" || chartType === "bubble") {
        baseOptions.scales = {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: !!params.xLabel,
                    text: params.xLabel || '',
                    color: params.labelColor || "#000000",
                    font: {
                        size: params.labelFontSize || 12,
                    },
                },
                grid: {
                    display: params.showGrid !== false,
                },
            },
            y: {
                title: {
                    display: !!params.yLabel,
                    text: params.yLabel || '',
                    color: params.labelColor || "#000000",
                    font: {
                        size: params.labelFontSize || 12,
                    },
                },
                grid: {
                    display: params.showGrid !== false,
                },
            },
        };
    }

    // Options spécifiques pour radar
    if (chartType === "radar") {
        baseOptions.scales = {
            r: {
                beginAtZero: true,
                grid: {
                    display: params.showGrid !== false,
                },
                ticks: {
                    display: params.showTicks !== false,
                    color: params.labelColor || "#000000",
                    font: {
                        size: params.labelFontSize || 12,
                    },
                },
            },
        };
        baseOptions.elements = {
            point: {
                radius: params.pointRadius || 3,
            },
            line: {
                borderWidth: params.borderWidth || 2,
            },
        };
    }

    // Options pour l'affichage des points (line, scatter, bubble, radar)
    if (["line", "scatter", "bubble", "radar"].includes(chartType)) {
        baseOptions.elements = {
            ...baseOptions.elements,
            point: {
                ...baseOptions.elements?.point,
                radius: params.showPoints === false ? 0 : (params.pointRadius || 3),
                hoverRadius: params.showPoints === false ? 0 : (params.pointHoverRadius || 5),
            },
        };
    }

    return baseOptions;
}

/**
 * Fusionne les options personnalisées avec les options de base
 */
function mergeOptions(baseOptions: any, customOptions: any): any {
    // Fusion profonde optimisée pour Chart.js
    const result = { ...baseOptions };

    // Fusionner les plugins
    if (customOptions.plugins) {
        result.plugins = {
            ...baseOptions.plugins,
            ...customOptions.plugins,
        };
    }

    // Fusionner les scales de manière profonde
    if (customOptions.scales) {
        result.scales = { ...baseOptions.scales };

        Object.keys(customOptions.scales).forEach(scaleKey => {
            result.scales[scaleKey] = {
                ...baseOptions.scales?.[scaleKey],
                ...customOptions.scales[scaleKey],
                // Fusionner les title des axes
                title: {
                    ...baseOptions.scales?.[scaleKey]?.title,
                    ...customOptions.scales[scaleKey]?.title,
                },
            };
        });
    }

    // Fusionner les autres propriétés
    Object.keys(customOptions).forEach(key => {
        if (key !== 'plugins' && key !== 'scales') {
            result[key] = customOptions[key];
        }
    });

    return result;
}

/**
 * Crée le plugin d'affichage des valeurs
 */
function createValueLabelsPlugin(chartType: ChartType, showValues: boolean) {
    if (!showValues) {
        return {
            id: "valueLabels",
            afterDatasetsDraw: () => { },
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
