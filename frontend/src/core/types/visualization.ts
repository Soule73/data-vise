import type { BucketConfig, MetricConfig } from "./metric-bucket-types";

// Classe de base pour la configuration d'un widget
export abstract class WidgetConfigBase<
  TParams = unknown,
  TStyles = unknown,
  TFilters = unknown,
  TDataConfig = unknown
> {
  metrics: MetricConfig[];
  bucket: BucketConfig;
  widgetParams?: TParams;
  metricStyles?: TStyles;
  filters?: TFilters;
  dataConfig?: TDataConfig;
  constructor(params: {
    metrics: MetricConfig[];
    bucket: BucketConfig;
    widgetParams?: TParams;
    metricStyles?: TStyles;
    filters?: TFilters;
    dataConfig?: TDataConfig;
  }) {
    this.metrics = params.metrics;
    this.bucket = params.bucket;
    this.widgetParams = params.widgetParams;
    this.metricStyles = params.metricStyles;
    this.filters = params.filters;
    this.dataConfig = params.dataConfig;
  }
}

export class BarChartConfig extends WidgetConfigBase {}
export class LineChartConfig extends WidgetConfigBase {}
export class PieChartConfig extends WidgetConfigBase {}
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
  constructor(params: {
    metrics: MetricConfig[];
    bucket: BucketConfig;
    columns?: { key: string; label: string }[];
    pageSize?: number;
    groupBy?: string;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    widgetParams?: unknown;
    metricStyles?: unknown;
    filters?: unknown;
    dataConfig?: unknown;
  }) {
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
export class ScatterChartConfig extends WidgetConfigBase {}
export class BubbleChartConfig extends WidgetConfigBase {}
export class RadarChartConfig extends WidgetConfigBase {}
export class KPIWidgetConfig extends WidgetConfigBase {}
export class KPIGroupWidgetConfig extends WidgetConfigBase {}
export class CardWidgetConfig extends WidgetConfigBase {}
