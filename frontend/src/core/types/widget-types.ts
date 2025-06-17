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
} from "@/core/types/visualization";
import type { Widget } from "@/core/models/Widget";

// ======================================================
// 1. Widgets & Configuration
// ======================================================

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

export type VisualizationWidgetPropsMap = {
  bar: {
    data: Record<string, unknown>[];
    config: BarChartConfig;
    editMode?: boolean;
  };
  line: {
    data: Record<string, unknown>[];
    config: LineChartConfig;
    editMode?: boolean;
  };
  pie: {
    data: Record<string, unknown>[];
    config: PieChartConfig;
    editMode?: boolean;
  };
  table: {
    data: Record<string, unknown>[];
    config: TableWidgetConfig;
    editMode?: boolean;
  };
  scatter: {
    data: Record<string, unknown>[];
    config: ScatterChartConfig;
    editMode?: boolean;
  };
  bubble: {
    data: Record<string, unknown>[];
    config: BubbleChartConfig;
    editMode?: boolean;
  };
  radar: {
    data: Record<string, unknown>[];
    config: RadarChartConfig;
    editMode?: boolean;
  };
  kpi: {
    data: Record<string, unknown>[];
    config: KPIWidgetConfig;
    editMode?: boolean;
  };
  kpi_group: {
    data: Record<string, unknown>[];
    config: KPIGroupWidgetConfig;
    editMode?: boolean;
  };
  card: {
    data: Record<string, unknown>[];
    config: CardWidgetConfig;
    editMode?: boolean;
  };
};

export type VisualizationWidgetProps<T extends WidgetType = WidgetType> =
  VisualizationWidgetPropsMap[T];

export interface WidgetDefinition<
  T extends WidgetType = WidgetType,
  TConfig = unknown
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

// --- Widget Configuration Sections

export interface WidgetDataConfigSectionProps<
  TDataConfig = unknown,
  TConfig = unknown
> {
  dataConfig: TDataConfig;
  config: TConfig;
  columns: string[];
  handleConfigChange: (field: string, value: unknown) => void;
  handleDragStart: (idx: number) => void;
  handleDragOver: (idx: number, e: React.DragEvent) => void;
  handleDrop: (idx: number) => void;
  handleMetricAggOrFieldChange?: (
    idx: number,
    field: "agg" | "field",
    value: string
  ) => void;
}

export interface WidgetMetricStyleConfigSectionProps<
  TMetric = unknown,
  TMetricStyle = unknown
> {
  type: WidgetType;
  metrics: TMetric[];
  metricStyles: TMetricStyle[];
  handleMetricStyleChange: (
    metricIdx: number,
    field: string,
    value: unknown
  ) => void;
}

export interface WidgetParamsConfigSectionProps<TConfig = unknown> {
  type: WidgetType;
  config: TConfig;
  handleConfigChange: (field: string, value: unknown) => void;
}

export interface WidgetStyleConfigSectionProps<TConfig = unknown> {
  type: WidgetType;
  config: TConfig;
  columns: string[];
  handleConfigChange: (field: string, value: unknown) => void;
}

// --- Widget Modals & Selecteurs

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

export interface WidgetFormInitialValues<TConfig = unknown> {
  type?: WidgetType;
  config?: TConfig;
  title?: string;
  sourceId?: string;
  columns?: string[];
  dataPreview?: Record<string, unknown>[];
  visibility?: "public" | "private";
  disableAutoConfig?: boolean;
}
