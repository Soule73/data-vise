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
} from "@type/visualization";
import type {
  BubbleMetricConfig,
  BucketConfig,
  MetricConfig,
  RadarMetricConfig,
  ScatterMetricConfig,
  MultiBucketConfig,
} from "@type/metric-bucket-types";

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
  description: string;
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
  bucket?: BucketConfig; // Legacy pour compatibilité
  buckets?: MultiBucketConfig[]; // Nouveaux buckets multiples
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
  availableTabs?: { key: string; label: string }[];
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
      | any
  ) => void;
  config?: any;
  availableFields?: string[];
}

export interface WidgetRadarDataConfigSectionProps {
  metrics: RadarMetricConfig[];
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
  configSchema: { dataConfig: WidgetDataConfig };
  data?: Record<string, any>[];
  config?: any;
  availableFields?: string[];
}

export interface WidgetBubbleDataConfigSectionProps {
  metrics: BubbleMetricConfig[];
  columns: string[];
  handleConfigChange: (
    field: string,
    value: BubbleMetricConfig[] | BubbleMetricConfig | any
  ) => void;
  config?: any;
  availableFields?: string[];
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
  data?: Record<string, any>[];
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
  allowMultiple?: boolean;
  allowedTypes?: Array<{ value: string; label: string }>;
  allowedAggs?: Array<{ value: string; label: string }>;
  defaultAgg?: string;
}

export interface WidgetDataConfig {
  metrics: WidgetMetricConfigSchema;
  bucket?: WidgetBucketConfigSchema; // Legacy pour compatibilité
  buckets?: WidgetBucketConfigSchema; // Nouveaux buckets multiples
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


export interface CommonWidgetFormState {
  // Core state
  type: WidgetType;
  setType: (type: WidgetType) => void;
  sourceId: string;
  setSourceId: (sourceId: string) => void;

  config: any;

  setConfig: (config: any) => void;

  // Data state
  columns: string[];
  setColumns: (columns: string[]) => void;

  dataPreview: any[];

  setDataPreview: (data: any[]) => void;

  // UI state
  step: number;
  setStep: (step: number) => void;
  tab: "data" | "metricsAxes" | "params";
  setTab: (tab: "data" | "metricsAxes" | "params") => void;
  showSaveModal: boolean;
  setShowSaveModal: (show: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // Widget properties
  title: string;
  setTitle: (title: string) => void;
  widgetTitle: string;
  setWidgetTitle: (title: string) => void;
  visibility: "public" | "private";
  setVisibility: (visibility: "public" | "private") => void;
  widgetTitleError: string;
  setWidgetTitleError: (error: string) => void;

  // Error handling
  error: string;
  setError: (error: string) => void;

  // Advanced features

  WidgetComponent: any;

  metricsWithLabels: any[];
  isPreviewReady: boolean;
  sourceOptions: { value: string; label: string }[];

  // Handlers

  handleConfigChange: (field: string, value: any) => void;
  handleDragStart: (idx: number) => void;
  handleDragOver: (idx: number, e: React.DragEvent) => void;
  handleDrop: (idx: number) => void;

  handleMetricAggOrFieldChange: (idx: number, field: "agg" | "field", value: any) => void;

  handleMetricStyleChange: (idx: number, field: string, value: any) => void;
  loadSourceColumns: () => Promise<void>;
}


export interface ChartWidgetProps {
  data: Record<string, any>[];
  editMode?: boolean;
}

export interface PieChartWidgetProps extends ChartWidgetProps {
  config: PieChartConfig;
}

export interface RadarChartWidgetProps extends ChartWidgetProps {
  config: RadarChartConfig;
}

export interface BarChartWidgetProps extends ChartWidgetProps {
  config: BarChartConfig;
}

export interface LineChartWidgetProps extends ChartWidgetProps {
  config: LineChartConfig;
}

export interface RadarChartWidgetProps extends ChartWidgetProps {
  config: RadarChartConfig;
}

export interface BarChartWidgetProps extends ChartWidgetProps {
  config: BarChartConfig;
}

export interface LineChartWidgetProps extends ChartWidgetProps {
  config: LineChartConfig;
}

export interface BubbleChartWidgetProps extends ChartWidgetProps {
  config: BubbleChartConfig;
}

export interface ScatterChartWidgetProps extends ChartWidgetProps {
  config: ScatterChartConfig;
}
