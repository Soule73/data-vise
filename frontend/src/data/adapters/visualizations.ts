import BarChartWidget from "@/presentation/components/visualizations/charts/BarChartWidget";
import LineChartWidget from "@/presentation/components/visualizations/charts/LineChartWidget";
import PieChartWidget from "@/presentation/components/visualizations/charts/PieChartWidget";
import TableWidget from "@/presentation/components/visualizations/table/TableWidget";
import { BarChartConfig, LineChartConfig, PieChartConfig, TableWidgetConfig } from "@/core/types/visualization";
import type { WidgetDefinition, WidgetType } from "@/core/types/ui";


export const WIDGETS: Record<WidgetType, WidgetDefinition> = {
  bar: {
    type: 'bar',
    label: 'Bar Chart',
    component: BarChartWidget,
    configSchema: BarChartConfig,
  },
  line: {
    type: 'line',
    label: 'Line Chart',
    component: LineChartWidget,
    configSchema: LineChartConfig,
  },
  pie: {
    type: 'pie',
    label: 'Pie Chart',
    component: PieChartWidget,
    configSchema: PieChartConfig,
  },
  table: {
    type: 'table',
    label: 'Table',
    component: TableWidget,
    configSchema: TableWidgetConfig,
  },
};

// Champs de configuration communs factorisés
const COMMON_FIELDS = {
  color: { label: 'Couleur', inputType: 'color', default: '#2563eb' },
  legend: { label: 'Afficher la légende', inputType: 'checkbox', default: true },
  title: { label: 'Titre du graphique', inputType: 'text', default: '' },
  showGrid: { label: 'Afficher la grille', inputType: 'checkbox', default: true },
  showValues: { label: 'Afficher les valeurs', inputType: 'checkbox', default: false },
  labelFormat: { label: 'Format des labels', inputType: 'text', default: '{label}: {value} ({percent}%)' },
  tooltipFormat: { label: 'Format des tooltips', inputType: 'text', default: '{label}: {value}' },
  legendPosition: {
    label: 'Position de la légende', inputType: 'select', options: [
      { value: 'top', label: 'Haut' },
      { value: 'left', label: 'Gauche' },
      { value: 'right', label: 'Droite' },
      { value: 'bottom', label: 'Bas' },
    ], default: 'top'
  },
  titleAlign: {
    label: 'Alignement du titre', inputType: 'select', options: [
      { value: 'start', label: 'Début' },
      { value: 'center', label: 'Centre' },
      { value: 'end', label: 'Fin' },
    ], default: 'center'
  },
};

// Nettoyage des doublons dans WIDGET_CONFIG_FIELDS
export const WIDGET_CONFIG_FIELDS: Record<string, { label: string; default?: any; inputType?: string; options?: any[] }> = {
  xField: { label: 'Champ X', inputType: 'select' },
  yField: { label: 'Champ Y', inputType: 'select' },
  groupBy: { label: 'Grouper par', inputType: 'select' },
  valueField: { label: 'Champ valeur', inputType: 'select' },
  nameField: { label: 'Champ nom', inputType: 'select' },
  columns: { label: 'Colonnes', inputType: 'table-columns', default: [] },
  pageSize: { label: 'Taille de page', inputType: 'number', default: 10 },
  stacked: { label: 'Empiler', inputType: 'checkbox', default: false },
  horizontal: { label: 'Horizontal', inputType: 'checkbox', default: false },
  cutout: { label: 'Trous (doughnut)', inputType: 'text', default: '0%' },
  showPoints: { label: 'Afficher les points', inputType: 'checkbox', default: true },
  tension: { label: 'Courbure (tension)', inputType: 'number', default: 0 },
  fill: { label: 'Remplir sous la ligne', inputType: 'checkbox', default: false },
  labelColor: { label: 'Couleur des labels', inputType: 'color', default: '#000000' },
  labelFontSize: { label: 'Taille de police des labels', inputType: 'number', default: 12 },
  borderColor: { label: 'Couleur de bordure', inputType: 'color', default: '#000000' },
  borderWidth: { label: 'Épaisseur bordure', inputType: 'number', default: 1 },
  barThickness: { label: 'Épaisseur des barres', inputType: 'number', default: undefined },
  borderRadius: { label: 'Arrondi des barres', inputType: 'number', default: 0 },
  borderDash: { label: 'Pointillés (ex: 5,5)', inputType: 'text', default: '' },
  stepped: { label: 'Ligne en escalier', inputType: 'checkbox', default: false },
  pointStyle: {
    label: 'Style des points', inputType: 'select', options: [
      { value: 'circle', label: 'Cercle' },
      { value: 'rect', label: 'Rectangle' },
      { value: 'rectRounded', label: 'Rectangle arrondi' },
      { value: 'rectRot', label: 'Rectangle tourné' },
      { value: 'cross', label: 'Croix' },
      { value: 'crossRot', label: 'Croix tournée' },
      { value: 'star', label: 'Étoile' },
      { value: 'line', label: 'Ligne' },
      { value: 'dash', label: 'Tiret' },
    ], default: 'circle'
  },
  colors: { label: 'Couleurs (tableau)', inputType: 'color-array', default: [] },
  xLabel: { label: "Label de l'axe X", inputType: 'text', default: '' },
  yLabel: { label: "Label de l'axe Y", inputType: 'text', default: '' },
  ...COMMON_FIELDS,
};

// Métadonnées dynamiques pour la configuration des metrics et buckets selon le type de widget
const COMMON_AGGS = [
  { value: 'none', label: 'Valeur brute' },
  { value: 'sum', label: 'Somme' },
  { value: 'avg', label: 'Moyenne' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'count', label: 'Nombre' },
];

const COMMON_METRICS = {
  allowMultiple: true,
  defaultAgg: 'sum',
  allowedAggs: COMMON_AGGS,
  label: 'Métriques',
};

const COMMON_BUCKET = {
  allow: true,
  label: 'Champ de groupement',
  typeLabel: 'x',
};

export const WIDGET_DATA_CONFIG: Record<WidgetType, {
  metrics: typeof COMMON_METRICS | (typeof COMMON_METRICS & { allowMultiple: false; label: string });
  bucket: typeof COMMON_BUCKET & { label: string; typeLabel?: string };
}> = {
  bar: {
    metrics: COMMON_METRICS,
    bucket: { ...COMMON_BUCKET, label: 'Champ de groupement (axe X)' },
  },
  line: {
    metrics: COMMON_METRICS,
    bucket: { ...COMMON_BUCKET, label: 'Champ de groupement (axe X)' },
  },
  pie: {
    metrics: { ...COMMON_METRICS, allowMultiple: false, label: 'Métrique' },
    bucket: { ...COMMON_BUCKET, label: 'Champ de groupement (part)', typeLabel: 'part' },
  },
  table: {
    metrics: COMMON_METRICS,
    bucket: COMMON_BUCKET,
  },
};
