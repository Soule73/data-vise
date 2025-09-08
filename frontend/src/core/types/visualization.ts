import type {
  BubbleMetricConfig,
  Metric,
  RadarMetricConfig,
  ScatterMetricConfig,
  MultiBucketConfig,
} from "@type/metricBucketTypes";

// --- Base params communs à la plupart des visualisations ---
export interface BaseChartParams {
  title?: string;
  legend?: boolean;
  legendPosition?: "top" | "bottom" | "left" | "right";
}

// Bar chart : https://www.chartjs.org/docs/latest/charts/bar.html
export interface BarChartParams extends BaseChartParams {
  xLabel?: string;
  yLabel?: string;
  showGrid?: boolean;
  stacked?: boolean;
  labelFormat?: string;
  showValues?: boolean;
  horizontal?: boolean;
  tooltipFormat?: string;
  labelColor?: string;
  labelFontSize?: number;
}

// Line chart : https://www.chartjs.org/docs/latest/charts/line.html
export interface LineChartParams extends BaseChartParams {
  xLabel?: string;
  yLabel?: string;
  showGrid?: boolean;
  labelFormat?: string;
  showValues?: boolean;
  showPoints?: boolean;
  tension?: number;
  fill?: boolean;
  borderWidth?: number;
  pointStyle?: "circle" | "rect" | "triangle" | "cross" | "crossRot";
  stepped?: boolean;
  borderDash?: number[];
  borderRadius?: number;
  borderColor?: string;
  tooltipFormat?: string;
  labelColor?: string;
  labelFontSize?: number;
  stacked?: boolean;
}

// Pie/Doughnut chart : https://www.chartjs.org/docs/latest/charts/doughnut.html
export interface PieChartParams extends BaseChartParams {
  cutout?: string | number; // pour doughnut
  labelFormat?: string;
  showValues?: boolean;
  tooltipFormat?: string;
  borderWidth?: number;
  borderColor?: string;
  /**
   * Liste de couleurs à utiliser pour chaque part du pie chart (indexées dans l'ordre des labels)
   */
  colors?: string[];
}

// Scatter chart : https://www.chartjs.org/docs/latest/charts/scatter.html
export interface ScatterChartParams extends BaseChartParams {
  xLabel?: string;
  yLabel?: string;
  showPoints?: boolean;
  borderWidth?: number; // Ajouté pour cohérence widget
  pointStyle?: "circle" | "rect" | "triangle" | "cross" | "crossRot";
}

// Bubble chart : https://www.chartjs.org/docs/latest/charts/bubble.html
export interface BubbleChartParams extends ScatterChartParams {
  borderWidth?: number; // Ajouté pour cohérence widget
}

// Radar chart : https://www.chartjs.org/docs/latest/charts/radar.html
export interface RadarChartParams extends BaseChartParams {
  borderWidth?: number; // Épaisseur de la bordure du radar
  // Pas d'options d'axes, juste legend et title
}

export interface KPIWidgetParams {
  title?: string;
  valueColor?: string;
  titleColor?: string;
  showTrend?: boolean;
  showValue?: boolean;
  format?: "number" | "currency" | "percent";
  currency?: string;
  decimals?: number;
  trendType?: "arrow" | "line";
  showPercent?: boolean;
  trendThreshold?: number;
  labelColor?: string;
  labelFontSize?: number;
  tooltipFormat?: string;
}

export interface KPIGroupWidgetParams {
  title?: string;
  columns?: number;
  showTrend?: boolean;
  showValue?: boolean;
  format?: "number" | "currency" | "percent";
  currency?: string;
  decimals?: number;
  trendType?: "arrow" | "line";
  showPercent?: boolean;
  trendThreshold?: number;
  titleColor?: string;
}

export interface CardWidgetParams {
  title?: string;
  description?: string;
  showIcon?: boolean;
  icon?: string;
}

export interface TableWidgetParams {
  pageSize?: number;
  title?: string;
}

// Type générique pour fallback ou usage transversal
export type WidgetParams =
  | BarChartParams
  | LineChartParams
  | PieChartParams
  | ScatterChartParams
  | BubbleChartParams
  | RadarChartParams
  | KPIWidgetParams
  | KPIGroupWidgetParams
  | CardWidgetParams
  | TableWidgetParams;

export interface MetricStyle {
  color?: string; // Couleur de la métrique (remplissage pour bar/line/pie)
  barThickness?: number; // Épaisseur de la barre pour les graphiques à barres
  borderRadius?: number; // Rayon de la bordure pour les graphiques à barres
  borderWidth?: number; // Épaisseur bordure par métrique
  opacity?: number; // Opacité de la métrique
  iconColor?: string; // Couleur de l'icône pour les widgets KPI
  valueColor?: string; // Couleur de la valeur pour les widgets KPI
  descriptionColor?: string; // Couleur de la description pour les widgets KPI
  showPoints?: boolean; // Afficher les points pour les graphiques
  showValues?: boolean; // Afficher les valeurs pour les graphiques
  fill?: boolean; // Remplissage des zones pour les graphiques
  stepped?: boolean; // Graphique en escalier
  pointStyle?: "circle" | "rect" | "triangle" | "cross" | "crossRot"; // Style des points pour les graphiques
  borderDash?: number[] | [];
  borderColor?: string; // Couleur de bordure par métrique
}

export type FilterOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'starts_with' | 'ends_with';

export interface Filter {
  field: string; // Champ sur lequel appliquer le filtre
  operator?: FilterOperator;
  value: string | number | readonly string[] | undefined;
}


export interface MetricStyleConfig {
  [key: string]: MetricStyle;
}

// Classe de base pour la configuration d'un widget
export abstract class WidgetConfigBase<
  TParams = WidgetParams,
  TStyles = MetricStyleConfig,
  TFilters = Filter[]
> {
  metrics:
    | Metric[]
    | ScatterMetricConfig[]
    | BubbleMetricConfig[]
    | RadarMetricConfig[];
  buckets?: MultiBucketConfig[];
  widgetParams?: TParams;
  metricStyles?: TStyles;
  globalFilters?: Filter[];
  constructor({
    metrics,
    buckets,
    widgetParams,
    metricStyles,
    globalFilters,
  }: {
    metrics: Metric[];
    buckets?: MultiBucketConfig[];
    widgetParams?: TParams;
    metricStyles?: TStyles;
    filters?: TFilters;
    globalFilters?: Filter[];
  }) {
    this.metrics = metrics;
    this.buckets = buckets;
    this.buckets = buckets;
    this.widgetParams = widgetParams;
    this.metricStyles = metricStyles;
    this.globalFilters = globalFilters;
  }
}

export class BarChartConfig extends WidgetConfigBase<BarChartParams> { }

export class LineChartConfig extends WidgetConfigBase<LineChartParams> { }

export class PieChartConfig extends WidgetConfigBase<PieChartParams> { }

// Interfaces spécialisées pour les graphiques avec types de métriques spécifiques
export interface ScatterChartConfig extends Omit<WidgetConfigBase<ScatterChartParams>, 'metrics'> {
  metrics: ScatterMetricConfig[];
  globalFilters?: Filter[];
}

export interface BubbleChartConfig extends Omit<WidgetConfigBase<BubbleChartParams>, 'metrics'> {
  metrics: BubbleMetricConfig[];
  globalFilters?: Filter[];
}

export interface RadarChartConfig extends Omit<WidgetConfigBase<RadarChartParams>, 'metrics'> {
  metrics: RadarMetricConfig[];
  globalFilters?: Filter[];
}
export class KPIWidgetConfig extends WidgetConfigBase<KPIWidgetParams> { }
export class KPIGroupWidgetConfig extends WidgetConfigBase<KPIGroupWidgetParams> { }
export class CardWidgetConfig extends WidgetConfigBase<CardWidgetParams> { }
export class TableWidgetConfig extends WidgetConfigBase<TableWidgetParams> {
  columns?: { key: string; label: string }[];
  pageSize?: number;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  constructor(params: {
    metrics: Metric[];
    buckets?: MultiBucketConfig[];
    columns?: { key: string; label: string }[];
    pageSize?: number;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    widgetParams?: WidgetParams;
    metricStyles?: MetricStyleConfig;
    filters?: Filter[];
  }) {
    super(params);
    this.columns = params.columns;
    this.pageSize = params.pageSize;
    this.height = params.height;
    this.minWidth = params.minWidth;
    this.minHeight = params.minHeight;
    this.maxWidth = params.maxWidth;
    this.maxHeight = params.maxHeight;
  }
}

