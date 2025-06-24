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
