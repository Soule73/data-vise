
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, TooltipItem } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";
import {
    isIsoTimestamp,
    allSameDay,
    formatXTicksLabel,
} from "@utils/charts/chartUtils";
import type { ChartType } from "@type/widgetTypes";

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
        const isTimeSeries = labels.length > 0 && isIsoTimestamp(labels[0]);
        const isSameDay = isTimeSeries && allSameDay(labels);

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
                        return formatXTicksLabel(labels[index], isSameDay);
                    },
                    maxRotation: 45,
                    minRotation: 0,
                } : {
                    maxRotation: 45,
                    minRotation: 0,
                },
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
        // Configuration tooltip spécifique pour radar
        baseOptions.plugins!.tooltip = {
            callbacks: {
                label: (context: TooltipItem<any>) => {
                    // Pour radar, context.parsed est un objet {r: valeur}
                    const value = context.parsed.r || context.parsed;
                    const format = params.tooltipFormat || "{label}: {value}";
                    return format
                        .replace("{label}", context.dataset.label || "")
                        .replace("{value}", value.toString());
                },
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

export {
    createDefaultDataset,
    createBaseOptions,
    mergeOptions,
    createValueLabelsPlugin
}