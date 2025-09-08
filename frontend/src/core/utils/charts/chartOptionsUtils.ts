/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartOptions, TooltipItem } from "chart.js";
import type { ChartType } from "@type/widgetTypes";

/**
 * Crée les options personnalisées pour bar chart
 */
export function createBarChartOptions(params: any): Partial<ChartOptions<"bar">> {
    return {
        scales: {
            x: {
                stacked: params.stacked === true,
            },
            y: {
                stacked: params.stacked === true,
            },
        },
        indexAxis: params.horizontal ? "y" : "x",
    };
}

/**
 * Crée les options personnalisées pour line chart
 */
export function createLineChartOptions(params: any): Partial<ChartOptions<"line">> {
    return {
        scales: {
            x: {
                stacked: params.stacked === true,
            },
            y: {
                stacked: params.stacked === true,
            },
        },
        elements: {
            point: {
                radius: params.showPoints === false ? 0 : 3,
            },
        },
    };
}

/**
 * Crée les options personnalisées pour pie chart
 */
export function createPieChartOptions(params: any): Partial<ChartOptions<"pie">> {
    return {
        plugins: {
            legend: {
                display: params.legend !== false,
                position: params.legendPosition || 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<"pie">) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };
}

/**
 * Crée les options personnalisées pour scatter chart
 */
export function createScatterChartOptions(): Partial<ChartOptions<"scatter">> {
    return {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
            },
            y: {},
        },
    };
}

/**
 * Crée les options personnalisées pour bubble chart
 */
export function createBubbleChartOptions(): Partial<ChartOptions<"bubble">> {
    return {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
            },
            y: {},
        },
    };
}

/**
 * Crée les options personnalisées pour radar chart
 */
export function createRadarChartOptions(params: any): Partial<ChartOptions<"radar">> {
    return {
        scales: {
            r: {
                beginAtZero: true,
                grid: {
                    display: params.showGrid !== false,
                },
                ticks: {
                    display: params.showTicks !== false,
                },
            },
        },
        elements: {
            point: {
                radius: params.pointRadius || 3,
            },
            line: {
                borderWidth: params.borderWidth || 2,
            },
        },
    };
}

/**
 * Factory function pour obtenir les bonnes options selon le type de chart
 */
export function getCustomChartOptions(
    chartType: ChartType,
    params: any
): Partial<ChartOptions<any>> {
    switch (chartType) {
        case 'bar':
            return createBarChartOptions(params);
        case 'line':
            return createLineChartOptions(params);
        case 'pie':
            return createPieChartOptions(params);
        case 'scatter':
            return createScatterChartOptions();
        case 'bubble':
            return createBubbleChartOptions();
        case 'radar':
            return createRadarChartOptions(params);
        default:
            return {};
    }
}
