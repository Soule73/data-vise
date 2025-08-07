/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BarChartConfig,
  LineChartConfig,
  PieChartConfig,
  TableWidgetConfig,
  ScatterChartConfig,
  BubbleChartConfig,
  RadarChartConfig,
  KPIWidgetConfig,
  KPIGroupWidgetConfig,
  CardWidgetConfig,
  Filter,
} from "@/core/types/visualization";
import type {
  BubbleMetricConfig,
  BucketConfig,
  MetricConfig,
  RadarMetricConfig,
  ScatterMetricConfig,
} from "./metric-bucket-types";

export interface Widget {
  _id?: string;
  widgetId: string;
  title: string;
  type: WidgetType;
  dataSourceId: string;
  config?: Record<string, any>;
  ownerId: string;
  visibility: "public" | "private";
  history?: WidgetHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
  isUsed?: boolean;
}

export interface WidgetHistoryItem {
  userId: string;
  date: string;
  action: "create" | "update" | "delete";
  changes?: Record<string, any>;
}

export type WidgetType =
  | "bar"
  | "pie"
  | "table"
  | "line"
  | "scatter"
  | "bubble"
  | "radar"
  | "kpi"
  | "kpi_group"
  | "card";

type BaseVisualizationWidgetPropsMap = {
  data: Record<string, any>[];
  editMode?: boolean;
};
export type VisualizationWidgetPropsMap = {
  bar: BaseVisualizationWidgetPropsMap & {
    config: BarChartConfig;
  };
  line: BaseVisualizationWidgetPropsMap & {
    config: LineChartConfig;
  };
  pie: BaseVisualizationWidgetPropsMap & {
    config: PieChartConfig;
  };
  table: BaseVisualizationWidgetPropsMap & {
    config: TableWidgetConfig;
  };
  scatter: BaseVisualizationWidgetPropsMap & {
    config: ScatterChartConfig;
  };
  bubble: BaseVisualizationWidgetPropsMap & {

    config: BubbleChartConfig;
  };
  radar: BaseVisualizationWidgetPropsMap & {
    config: RadarChartConfig;
  };
  kpi: BaseVisualizationWidgetPropsMap & {
    config: KPIWidgetConfig;
  };
  kpi_group: BaseVisualizationWidgetPropsMap & {
    config: KPIGroupWidgetConfig;
  };
  card: BaseVisualizationWidgetPropsMap & {
    config: CardWidgetConfig;
  };
};

export type VisualizationWidgetProps<T extends WidgetType = WidgetType> =
  VisualizationWidgetPropsMap[T];

export interface WidgetDefinition<
  T extends WidgetType = WidgetType,
  TConfig = any
> {
  type: T;
  label: string;
  component: React.ComponentType<VisualizationWidgetProps<T>>;
  configSchema: TConfig;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  allowMultipleMetrics?: boolean;
  hideBucket?: boolean;
  enableFilter?: boolean;
}

export interface WidgetConfig {
  metrics:
  | MetricConfig[]
  | ScatterMetricConfig[]
  | BubbleMetricConfig[]
  | RadarMetricConfig[];
  filter?: Filter;
  bucket: BucketConfig;
}

export interface WidgetMetricStyleConfigSectionProps<
  TMetric =
  | MetricConfig
  | ScatterMetricConfig
  | BubbleMetricConfig
  | RadarMetricConfig,
  TMetricStyle = any
> {
  type: WidgetType;
  metrics: TMetric[];
  metricStyles: TMetricStyle[];
  handleMetricStyleChange: (
    metricIdx: number,
    field: string,
    value: any
  ) => void;
}

export interface WidgetParamsConfigSectionProps<TConfig = any> {
  type: WidgetType;
  config: TConfig;
  handleConfigChange: (field: string, value: any) => void;
}

export interface WidgetStyleConfigSectionProps<TConfig = any> {
  type: WidgetType;
  config: TConfig;
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
}

export interface WidgetConfigTabsProps {
  tab: "data" | "metricsAxes" | "params";
  setTab: (tab: "data" | "metricsAxes" | "params") => void;
}

export interface WidgetConfigFooterProps {
  step: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export interface WidgetSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (widget: Widget) => void;
}

export interface WidgetSaveTitleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  setTitle: (t: string) => void;
  error: string;
  setError: (e: string) => void;
  onConfirm: () => void;
  loading: boolean;
  visibility: "public" | "private";
  setVisibility: (p: "public" | "private") => void;
}

export interface WidgetCreateSelectorResult {
  type: WidgetType;
  sourceId: string;
}

export interface WidgetFormInitialValues<TConfig = any> {
  type?: WidgetType;
  config?: TConfig;
  title?: string;
  sourceId?: string;
  columns?: string[];
  dataPreview?: Record<string, any>[];
  visibility?: "public" | "private";
  disableAutoConfig?: boolean;
}

export interface WidgetScatterDataConfigSectionProps {
  metrics: ScatterMetricConfig[];
  columns: string[];
  handleConfigChange: (
    field: string,
    value:
      | string
      | number
      | boolean
      | ScatterMetricConfig
      | ScatterMetricConfig[]
  ) => void;
}

export interface WidgetRadarDataConfigSectionProps {
  metrics: RadarMetricConfig[];
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
  configSchema: { dataConfig: WidgetDataConfig };
  data?: Record<string, any>[];
}

export interface WidgetBubbleDataConfigSectionProps {
  metrics: BubbleMetricConfig[];
  columns: string[];
  handleConfigChange: (
    field: string,
    value: BubbleMetricConfig[] | BubbleMetricConfig
  ) => void;
}

export interface MetricStyleFieldSchema {
  label?: string;
  default?: string | number | boolean;
  inputType?: "color" | "number" | "text";
}

export interface WidgetKPIGroupDataConfigSectionProps
  extends WidgetDataConfigSectionProps {
  data?: Record<string, any>[];
}

export interface WidgetDataConfigSectionFixedProps
  extends WidgetDataConfigSectionProps {
  type: WidgetType;
  data?: Record<string, any>[]; // Ajout de la prop data
}

export interface VisualizationTypeSelectorProps {
  type: string;
  setType: (type: WidgetType) => void;
}

export interface KPIWidgetVM {
  filteredData: Record<string, unknown>[];
  value: number;
  title: string;
  valueColor: string;
  showTrend: boolean;
  showValue: boolean;
  format: string;
  currency: string;
  decimals: number;
  trendType: string;
  showPercent: boolean;
  threshold: number;
  trend: "up" | "down" | null;
  trendValue: number;
  trendPercent: number;
  formatValue: (val: number) => string;
  getTrendColor: () => string;
}

export interface WidgetMetricConfigSchema {
  label: string;
  allowMultiple?: boolean;
  allowedAggs?: Array<{ value: string; label: string }>;
  defaultAgg?: string;
}

export interface WidgetBucketConfigSchema {
  label: string;
  allow?: boolean;
  allowedAggs?: Array<{ value: string; label: string }>;
  defaultAgg?: string;
}

export interface WidgetDataConfig {
  metrics: WidgetMetricConfigSchema;
  bucket?: WidgetBucketConfigSchema;
  groupByFields?: string[];
  axisFields?: string[];
}

// Utilisation dans les props:
export interface WidgetDataConfigSectionProps<
  TDataConfig = WidgetDataConfig,
  TConfig = WidgetConfig
> {
  dataConfig: TDataConfig;
  config: TConfig;
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
  handleDragStart: (idx: number) => void;
  handleDragOver: (idx: number, e: React.DragEvent) => void;
  handleDrop: (idx: number) => void;
  handleMetricAggOrFieldChange?: (
    idx: number,
    field: "agg" | "field",
    value: string
  ) => void;
}

