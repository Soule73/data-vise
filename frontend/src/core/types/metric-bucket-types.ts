// ======================================================
// 7. Métriques & Buckets
// ======================================================

export interface MetricConfig {
  agg: string;
  field: string;
  label?: string;
}

export interface BucketConfig {
  field: string;
  type?: string;
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

export interface ScatterMetricConfig extends MetricConfig {
  x: string;
  y: string;
}

export interface BubbleMetricConfig extends MetricConfig {
  x: string;
  y: string;
  r: string;
}
