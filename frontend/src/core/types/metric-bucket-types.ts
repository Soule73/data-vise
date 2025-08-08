interface Base {
  label?: string;
  field: string;
}

export interface MetricConfig extends Base {
  agg: string;
}

// Types de buckets supportés (comme Kibana)
export type BucketType = 
  | "terms"       // Groupement par valeurs (split rows)
  | "date_histogram" // Groupement par dates
  | "histogram"   // Groupement par intervalles numériques
  | "range"       // Groupement par plages
  | "split_series" // Division en séries (split series)
  | "split_chart"; // Division en graphiques séparés

export interface BucketConfig extends Base {
  type?: BucketType;
  bucketType?: BucketType; // Alias pour compatibilité
  // Configuration spécifique par type
  interval?: string | number; // Pour date_histogram et histogram
  ranges?: Array<{ from?: number; to?: number; label?: string }>; // Pour range
  size?: number; // Nombre max de buckets pour terms
  order?: 'asc' | 'desc' | { [key: string]: 'asc' | 'desc' }; // Ordre de tri
  orderBy?: string; // Champ de tri (_count, _key, ou métrique)
}

// Configuration avancée des buckets avec types multiples
export interface MultiBucketConfig {
  xAxis?: BucketConfig;      // Axe X principal (ex: dates)
  splitSeries?: BucketConfig; // Division en séries (couleurs différentes)
  splitRows?: BucketConfig;   // Division en lignes (graphiques empilés)
  splitCharts?: BucketConfig; // Division en graphiques séparés
}

// Types de colonnes détectés automatiquement
export type ColumnType = 
  | "string" 
  | "number" 
  | "date" 
  | "boolean" 
  | "object" 
  | "array";

export interface ColumnInfo {
  name: string;
  type: ColumnType;
  sample?: unknown; // Exemple de valeur
  nullable?: boolean; // Peut contenir null
  unique?: boolean; // Valeurs uniques
  cardinality?: number; // Nombre de valeurs distinctes
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
