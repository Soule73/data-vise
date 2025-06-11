import type { BucketConfig, MetricConfig } from "./ui";

// Classe de base pour la configuration d'un widget
export abstract class WidgetConfigBase {
    metrics: MetricConfig[];
    bucket: BucketConfig;
    widgetParams?: Record<string, any>;
    constructor(params: { metrics: MetricConfig[]; bucket: BucketConfig; widgetParams?: Record<string, any> }) {
        this.metrics = params.metrics;
        this.bucket = params.bucket;
        this.widgetParams = params.widgetParams;
    }
}

export class BarChartConfig extends WidgetConfigBase {
    metricStyles?: Record<string, any>;
    constructor(params: { metrics: MetricConfig[]; bucket: BucketConfig; metricStyles?: Record<string, any>; widgetParams?: Record<string, any> }) {
        super(params);
        this.metricStyles = params.metricStyles;
    }
}

export class LineChartConfig extends WidgetConfigBase {
    metricStyles?: Record<string, any>;
    constructor(params: { metrics: MetricConfig[]; bucket: BucketConfig; metricStyles?: Record<string, any>; widgetParams?: Record<string, any> }) {
        super(params);
        this.metricStyles = params.metricStyles;
    }
}

export class PieChartConfig extends WidgetConfigBase {
    metricStyles?: Record<string, any>;
    constructor(params: { metrics: MetricConfig[]; bucket: BucketConfig; metricStyles?: Record<string, any>; widgetParams?: Record<string, any> }) {
        super(params);
        this.metricStyles = params.metricStyles;
    }
}

export class TableWidgetConfig extends WidgetConfigBase {
    columns?: { key: string; label: string }[];
    pageSize?: number;
    groupBy?: string;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    constructor(params: { metrics: MetricConfig[]; bucket: BucketConfig; columns?: { key: string; label: string }[]; pageSize?: number; groupBy?: string; width?: string | number; height?: string | number; minWidth?: string | number; minHeight?: string | number; maxWidth?: string | number; maxHeight?: string | number; widgetParams?: Record<string, any> }) {
        super(params);
        this.columns = params.columns;
        this.pageSize = params.pageSize;
        this.groupBy = params.groupBy;
        this.width = params.width;
        this.height = params.height;
        this.minWidth = params.minWidth;
        this.minHeight = params.minHeight;
        this.maxWidth = params.maxWidth;
        this.maxHeight = params.maxHeight;
    }
}
