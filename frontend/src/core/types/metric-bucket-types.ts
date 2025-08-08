interface Base {
  label?: string;
  field: string;
}
export interface MetricConfig extends Base {
  agg: string;
}

export interface BucketConfig extends Base {
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

export interface BucketUIState {
  collapsedBuckets: Record<string | number, boolean>;
  toggleBucketCollapse: (idx: string | number) => void;
  setBucketCollapsed: (collapsed: Record<string | number, boolean>) => void;
  resetBuckets: () => void;
}

export interface ScatterMetricConfig extends MetricConfig {
  x: string;
  y: string;
}

export interface BubbleMetricConfig extends ScatterMetricConfig {
  r: string;
}

export interface RadarMetricConfig extends MetricConfig {
  fields: string[];
  groupBy?: string;
  groupByValue?: string;
}

export interface MetricLabelState {
  metricLabels: string[];
  setMetricLabel: (idx: number, label: string) => void;
  setAllMetricLabels: (labels: string[]) => void;
}

export interface MetricUICollapseState {
  collapsedMetrics: Record<string | number, boolean>;
  toggleCollapse: (idx: string | number) => void;
  setCollapsed: (collapsed: Record<string | number, boolean>) => void;
  reset: () => void;
}
