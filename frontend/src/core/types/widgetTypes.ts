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
  MetricStyleConfig,
} from "@type/visualization";
import type {
  BubbleMetricConfig,
  Metric,
  RadarMetricConfig,
  ScatterMetricConfig,
  MultiBucketConfig,
  DatasetFilter,
} from "@type/metricBucketTypes";
import type { ReactNode } from "react";
import type { DataSource } from "@type/dataSource";
import type { ChartData, ChartOptions } from "chart.js";

export type ChartType = "bar" | "line" | "pie" | "scatter" | "bubble" | "radar";

export interface GroupFieldConfig {
  xField?: string;
  nameField?: string;
  valueField?: string;
  dataConfig?: {
    groupByFields?: string[];
    axisFields?: string[];
  };
  [key: string]: unknown;
}
export interface ColumnFieldConfig {
  columns?: Array<string | { key: string; label: string }>;
}

/**
 * Configuration par défaut pour un widget avec buckets multiples
 */
export interface DefaultWidgetConfig {
  metrics: Metric[];
  buckets: MultiBucketConfig[];
}

/**
 * Interface pour les configurations de widget avec support des buckets multiples
 */
export interface MultiBucketCompatibleConfig {
  buckets?: MultiBucketConfig[];
  [key: string]: any;
}


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
  component: React.ComponentType<React.ComponentType<Widget> | any>;
  configSchema: TConfig;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  allowMultipleMetrics?: boolean;
  hideBucket?: boolean;
  enableFilter?: boolean;
}

// Interfaces spécialisées pour les widgets avec types stricts
export interface ScatterWidgetDefinition extends Omit<WidgetDefinition, 'component'> {
  type: 'scatter';
  component: React.ComponentType<ScatterChartWidgetProps>;
}

export interface BubbleWidgetDefinition extends Omit<WidgetDefinition, 'component'> {
  type: 'bubble';
  component: React.ComponentType<BubbleChartWidgetProps>;
}

export interface RadarWidgetDefinition extends Omit<WidgetDefinition, 'component'> {
  type: 'radar';
  component: React.ComponentType<RadarChartWidgetProps>;
}

export interface WidgetConfig {
  metrics:
  | Metric[]
  | ScatterMetricConfig[]
  | BubbleMetricConfig[]
  | RadarMetricConfig[];
  filter?: Filter;
  globalFilters?: Filter[]; // Filtres globaux pour les graphiques spécialisés
  buckets?: MultiBucketConfig[]; // Buckets multiples
}

export interface WidgetMetricStyleConfigSectionProps<
  TMetric =
  | Metric
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
  data?: Record<string, any>[];
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
  data?: any[];
  handleConfigChange: (
    field: string,
    value: BubbleMetricConfig[] | BubbleMetricConfig | any
  ) => void;
  config?: any;
  availableFields?: string[];
}

export interface MetricStyleFieldSchema {
  label?: string;
  default?: string | number | boolean | string[];
  inputType?: "color" | "number" | "text" | "color-array" | "select" | "checkbox";
  options?: { value: string; label: string }[];
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
  buckets?: WidgetBucketConfigSchema;
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


export interface WidgetProps {
  data: Record<string, any>[];
}

export interface PieChartWidgetProps extends WidgetProps {
  config: PieChartConfig;
}

export interface RadarChartWidgetProps extends WidgetProps {
  config: RadarChartConfig;
}

export interface BarChartWidgetProps extends WidgetProps {
  config: BarChartConfig;
}

export interface LineChartWidgetProps extends WidgetProps {
  config: LineChartConfig;
}

export interface RadarChartWidgetProps extends WidgetProps {
  config: RadarChartConfig;
}

export interface BarChartWidgetProps extends WidgetProps {
  config: BarChartConfig;
}

export interface LineChartWidgetProps extends WidgetProps {
  config: LineChartConfig;
}

export interface BubbleChartWidgetProps extends WidgetProps {
  config: BubbleChartConfig;
}

export interface ScatterChartWidgetProps extends WidgetProps {
  config: ScatterChartConfig;
}

export interface KPIWidgetProps extends WidgetProps {
  config: KPIWidgetConfig;
}

export interface KPIGroupWidgetProps extends WidgetProps {
  config: KPIGroupWidgetConfig;
}

export interface CardWidgetProps extends WidgetProps {
  config: CardWidgetConfig;
}

export interface TableWidgetProps extends WidgetProps {
  config: TableWidgetConfig;
}


/// Section interfaces pour les hooks de visualization
interface BaseChartWidgetVM {
  chartData: ChartData;
  options: ChartOptions;
  showNativeValues: boolean;
  valueLabelsPlugin: any;
}

export interface UseChartVM {
  chartType: ChartType;
  data: Record<string, any>[];
  config: BaseChartConfig;
  customDatasetCreator?: (metric: Metric, idx: number, values: number[], labels: string[], widgetParams: any, metricStyle: any) => any;
  customOptionsCreator?: (params: any) => Partial<ChartOptions>;
}

export interface BarChartVM extends BaseChartWidgetVM {
  chartData: ChartData<"bar">;
  options: ChartOptions<"bar">;
}

export interface LineChartVM extends BaseChartWidgetVM {
  chartData: ChartData<"line">;
  options: ChartOptions<"line">;
}

export interface PieChartVM extends BaseChartWidgetVM {
  chartData: ChartData<"pie">;
  options: ChartOptions<"pie">;
}

export interface BubbleChartVM extends BaseChartWidgetVM {
  chartData: ChartData<"bubble">;
  options: ChartOptions<"bubble">;
  validDatasets: any[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface RadarChartVM extends BaseChartWidgetVM {
  chartData: ChartData<"radar">;
  options: ChartOptions<"radar">;
  validDatasets: any[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface ScatterChartVM extends BaseChartWidgetVM {
  chartData: ChartData<"scatter">;
  options: ChartOptions<"scatter">;
  validDatasets: any[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}


export interface TableWidgetVM {
  columns: TableColumn[];
  displayData: Record<string, any>[];
  tableTitle: string;
}


export interface CardWidgetVM {
  formattedValue: string;
  title: string;
  description: string;
  iconColor: string;
  valueColor: string;
  descriptionColor: string;
  showIcon: boolean;
  IconComponent: React.ElementType;
}

export interface KPIWidgetVM {
  filteredData: Record<string, unknown>[];
  value: number;
  title: string;
  valueColor: string;
  titleColor: string;
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


export interface KPIGroupWidgetVM {
  gridColumns: number;
  metrics: Metric[];
  metricStyles: MetricStyleConfig[];
  filters: Filter[] | undefined;
  groupTitle: string;
  widgetParamsList: Array<Record<string, unknown>>;
  hasMultiBuckets: boolean;
  bucketsConfig: unknown[];
}

export interface DatasetSectionProps<T> {
  title: string;
  datasets: T[];
  onDatasetsChange: (datasets: T[]) => void;
  renderDatasetContent: (dataset: T, index: number, onUpdate: (updatedDataset: T) => void) => ReactNode;
  createNewDataset: () => T;
  getDatasetLabel?: (dataset: T, index: number) => string;
  minDatasets?: number;
}

export interface WidgetFormLayoutProps {
  // Header
  title: string;
  isLoading: boolean;
  onSave: () => void;
  onCancel?: () => void;
  saveButtonText?: string;
  showCancelButton?: boolean;

  // Widget preview

  WidgetComponent: any;

  dataPreview: any[];

  config: any;

  metricsWithLabels: any[];
  isPreviewReady: boolean;

  // Configuration
  type: WidgetType;
  tab: "data" | "metricsAxes" | "params";
  setTab: (tab: "data" | "metricsAxes" | "params") => void;
  columns: string[];

  handleConfigChange: (field: string, value: any) => void;
  handleDragStart: (idx: number) => void;
  handleDragOver: (idx: number, e: React.DragEvent) => void;
  handleDrop: (idx: number) => void;

  handleMetricAggOrFieldChange: (idx: number, field: "agg" | "field", value: any) => void;

  handleMetricStyleChange: (idx: number, field: string, value: any) => void;

  // Modal
  showSaveModal: boolean;
  setShowSaveModal: (show: boolean) => void;
  widgetTitle: string;
  setWidgetTitle: (title: string) => void;
  visibility: "public" | "private";
  setVisibility: (visibility: "public" | "private") => void;
  widgetTitleError: string;
  setWidgetTitleError: (error: string) => void;
  onModalConfirm: () => void;

  // Errors
  error?: string;

  // Optional content
  additionalHeaderContent?: ReactNode;
}

export interface WidgetTypeSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (sourceId: string, type: WidgetType) => void;
  sources: DataSource[];
  loading?: boolean;
}


/**
 * Interface pour le contexte de validation d'un graphique
 */
export interface ChartValidationContext {
  chartType: ChartType;
  data: Record<string, any>[];
  metrics?: Metric[];
  buckets?: MultiBucketConfig[];
}

/**
 * Interface pour le résultat de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Interface pour les données processées
 */
export interface ProcessedDataContext {
  bucketHierarchy: any[];
  labels: string[];
  splitData: {
    series: any[];
  };
}

export interface DatasetCreationContext {
  chartType: ChartType;
  labels: string[];
  widgetParams: any;
  metrics: Metric[];
  metricStyles: any[];
  processedData: any;
  getValues: (metric: Metric) => number[];
}

export interface UseWidgetAutoConfigProps {
  widgetType: WidgetType;
  columns: string[];
  data?: Record<string, unknown>[];
  currentConfig: {
    buckets?: MultiBucketConfig[];
    metrics?: Metric[];
  };
  onConfigChange: (field: string, value: unknown) => void;
  autoInitialize?: boolean;
}


export interface BaseChartConfig {
  metrics?: Metric[];
  buckets?: MultiBucketConfig[];
  metricStyles?: any;
  widgetParams?: any;
  globalFilters?: Filter[];
}



/**
 * Interface pour les configurations de widget avec filtre
 */
export interface FilterableConfig {
  globalFilters?: Filter[];
}

/**
 * Interface pour les configurations de widget avec styles
 */
export interface StylableConfig {
  metricStyles?: MetricStyleConfig | MetricStyleConfig[];
  widgetParams?: Record<string, unknown>;
}

/**
 * Types pour les configurations de tableau
 */
export interface TableColumn {
  key: string;
  label: string;
}

export interface TableConfig {
  metrics?: any[];
  buckets?: any[];
  columns?: any[];
  widgetParams?: any;
  globalFilters?: any[];
}

export interface TableDataResult {
  columns: TableColumn[];
  displayData: any[];
}



// Interface commune pour les propriétés partagées
export interface BaseFilter {
  field: string;
  value: string | number | readonly string[] | undefined;
  operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'starts_with' | 'ends_with';
}

// Type union pour supporter les deux types de filtres
export type FilterType = Filter | DatasetFilter;

export interface BaseFilterConfigProps<T extends FilterType & BaseFilter> {
  filters: T[];
  columns: string[];
  data?: Record<string, unknown>[];
  onFiltersChange: (filters: T[]) => void;
  title: string;
  description: string;
  createNewFilter: (columns: string[]) => T;
  // Props optionnelles pour customisation
  prefix?: string; // Préfixe pour les IDs et noms des champs
  className?: string;
}

// Options pour les opérateurs (communes aux deux types)
export const OPERATOR_OPTIONS = [
  { value: "equals", label: "Égal à" },
  { value: "not_equals", label: "Différent de" },
  { value: "contains", label: "Contient" },
  { value: "not_contains", label: "Ne contient pas" },
  { value: "greater_than", label: "Supérieur à" },
  { value: "less_than", label: "Inférieur à" },
  { value: "greater_equal", label: "Supérieur ou égal" },
  { value: "less_equal", label: "Inférieur ou égal" },
  { value: "starts_with", label: "Commence par" },
  { value: "ends_with", label: "Finit par" },
];

export interface DatasetFiltersConfigProps {
  filters: DatasetFilter[];
  columns: string[];
  data?: Record<string, any>[];
  onFiltersChange: (filters: DatasetFilter[]) => void;
  datasetIndex: number;
}

export interface GlobalFiltersConfigProps {
  filters: Filter[];
  columns: string[];
  data?: Record<string, any>[];
  onFiltersChange: (filters: Filter[]) => void;
}