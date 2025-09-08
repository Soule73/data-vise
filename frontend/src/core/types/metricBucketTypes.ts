import type { BarChartConfig, LineChartConfig, PieChartConfig } from "@type/visualization";
import type { WidgetDataConfig } from "@type/widgetTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Base {
  label?: string;
  field: string;
}

/**
 * Interface pour une métrique
 */
export interface Metric extends Base {
  agg: string;
  type?: string;
}

// Nouveaux types pour les buckets multiples
export type BucketType =
  | 'terms'           // Groupement par termes (équivalent à l'actuel "champ de groupement")
  | 'histogram'       // Histogramme numérique
  | 'date_histogram'  // Histogramme de dates
  | 'range'          // Plages personnalisées
  | 'split_series'   // Division en séries (équivalent à split series dans Kibana)
  | 'split_rows'     // Division en lignes
  | 'split_chart';   // Division en graphiques séparés

export interface MultiBucketConfig extends Base {
  type: BucketType;
  order?: 'asc' | 'desc';
  size?: number;  // Nombre max d'éléments
  minDocCount?: number;  // Nombre minimum de documents

  // Pour histogram
  interval?: number;

  // Pour date_histogram
  dateInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

  // Pour range
  ranges?: Array<{
    from?: number;
    to?: number;
    label?: string;
  }>;

  // Pour split
  splitType?: 'series' | 'rows' | 'chart';
}

export interface UseMultiBucketsProps {
  config: {
    buckets?: MultiBucketConfig[];
  };
  columns: string[];
  allowMultiple?: boolean;
  onConfigChange: (field: string, value: unknown) => void;
}

export interface BucketUIState {
  collapsedBuckets: Record<string | number, boolean>;
  toggleBucketCollapse: (idx: string | number) => void;
  setBucketCollapsed: (collapsed: Record<string | number, boolean>) => void;
  resetBuckets: () => void;
}

export interface ScatterMetricConfig extends Metric {
  x: string;
  y: string;
  // Filtres spécifiques à ce dataset
  datasetFilters?: DatasetFilter[];
}

export interface BubbleMetricConfig extends ScatterMetricConfig {
  r: string;
}

export interface RadarMetricConfig extends Metric {
  fields: string[];
  // Filtres spécifiques à ce dataset
  datasetFilters?: DatasetFilter[];
}

export interface DatasetFilter {
  field: string;
  value: string | number;
  operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'starts_with' | 'ends_with';
}

export interface MetricUICollapseState {
  collapsedMetrics: Record<string | number, boolean>;
  toggleCollapse: (idx: string | number) => void;
  setCollapsed: (collapsed: Record<string | number, boolean>) => void;
  reset: () => void;
}


export interface BucketConfigComponentProps {
  bucket: MultiBucketConfig;
  index: number;
  // isCollapsed: boolean;
  columns: string[];
  data?: Record<string, unknown>[];
  isOnlyBucket: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  // onToggleCollapse: () => void;
  onUpdate: (bucket: MultiBucketConfig) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export interface CommonMultiBucketSectionProps {
  config?: { buckets?: MultiBucketConfig[] };
  columns: string[];
  availableFields?: string[];
  onConfigChange: (field: string, value: unknown) => void;
  sectionLabel?: string;
  allowMultiple?: boolean;
}

export interface MetricLabelInputProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  id: string;
  metricIndex: number;
}

export interface MultiBucketSectionProps {
  buckets: MultiBucketConfig[];
  columns: string[];
  data?: Record<string, unknown>[];
  allowMultiple?: boolean;
  sectionLabel?: string;
  onBucketsChange: (buckets: MultiBucketConfig[]) => void;
}

/**
 * Types de données pour les buckets multiples
 */
export interface ProcessedData {
  groupedData: Record<string, any>[];
  labels: string[];
  bucketHierarchy: BucketLevel[];
  splitData: SplitData;
}

export interface BucketLevel {
  bucket: MultiBucketConfig;
  level: number;
  buckets: BucketItem[];
  data: Record<string, any>[];
}

export interface BucketItem {
  key: string;
  key_as_string?: string;
  doc_count: number;
  data: Record<string, any>[];
}

export interface SplitData {
  series: SplitItem[];
  rows: SplitItem[];
  charts: SplitItem[];
}

export interface SplitItem {
  key: string;
  data: Record<string, any>[];
  bucket: MultiBucketConfig;
}



export interface ProcessedBucketItem {
  key: string | Record<string, string>;
  metrics: Array<{
    value: number;
    field: string;
    agg: string;
  }>;
  count: number;
}

export type SupportedConfig = BarChartConfig | LineChartConfig | PieChartConfig | any;

export interface ProcessedBucketItem {
  key: string | Record<string, string>;
  metrics: Array<{
    value: number;
    field: string;
    agg: string;
  }>;
  count: number;
}

export interface DefaultMetricConfigSectionProps {
  dataConfig: WidgetDataConfig;
  config: any;
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
  handleMetricAggOrFieldChange?: (idx: number, field: "agg" | "field", value: string) => void;
  allowMultipleMetrics?: boolean;
}