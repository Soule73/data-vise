import BarChartWidget from "./BarChartWidget";
import LineChartWidget from "./LineChartWidget";
import PieChartWidget from "./PieChartWidget";
import TableWidget from "./TableWidget";

export type WidgetType = 'bar' | 'pie' | 'table' | 'line';

export interface WidgetDefinition {
  type: WidgetType;
  label: string;
  component: React.ComponentType<any>;
  configSchema: any; // Pour validation/config UI future (zod ou autre)
}

export const WIDGETS: Record<WidgetType, WidgetDefinition> = {
  bar: {
    type: 'bar',
    label: 'Bar Chart',
    component: BarChartWidget,
    configSchema: {
      metrics: 'MetricConfig[]',
      bucket: 'BucketConfig',
      metricStyles: {
        color: 'string?',
        borderWidth: 'number?',
        borderColor: 'string?',
        barThickness: 'number?',
        borderRadius: 'number?',
      },
      widgetParams: {
        legend: 'boolean?',
        legendPosition: 'string?',
        title: 'string?',
        titleAlign: 'string?',
        showGrid: 'boolean?',
        showValues: 'boolean?',
        stacked: 'boolean?',
        horizontal: 'boolean?',
        labelFormat: 'string?',
        tooltipFormat: 'string?',
        xLabel: 'string?',
        yLabel: 'string?',
        // cutout supprimé (non supporté par bar)
        // fill supprimé (non supporté par bar)
      },
    },
  },
  line: {
    type: 'line',
    label: 'Line Chart',
    component: LineChartWidget,
    configSchema: {
      metrics: 'MetricConfig[]',
      bucket: 'BucketConfig',
      metricStyles: {
        color: 'string?',
        borderWidth: 'number?',
        borderColor: 'string?',
        pointStyle: 'string?',
        borderDash: 'string?',
        borderRadius: 'number?',
        stepped: 'boolean?',
        fillColor: 'string?',
      },
      widgetParams: {
        legend: 'boolean?',
        legendPosition: 'string?',
        title: 'string?',
        titleAlign: 'string?',
        showGrid: 'boolean?',
        showPoints: 'boolean?',
        showValues: 'boolean?',
        stacked: 'boolean?',
        tension: 'number?',
        fill: 'boolean?',
        labelFormat: 'string?',
        tooltipFormat: 'string?',
        xLabel: 'string?',
        yLabel: 'string?',
        stepped: 'boolean?',
        // cutout supprimé (non supporté par line)
      },
    },
  },
  pie: {
    type: 'pie',
    label: 'Pie Chart',
    component: PieChartWidget,
    configSchema: {
      metrics: 'MetricConfig[]',
      bucket: 'BucketConfig',
      metricStyles: {
        color: 'string?',
        colors: 'string[]?', // Ajouté pour permettre un tableau de couleurs par part
        borderWidth: 'number?',
        borderColor: 'string?',
        borderRadius: 'number?',
      },
      widgetParams: {
        legend: 'boolean?',
        legendPosition: 'string?',
        title: 'string?',
        titleAlign: 'string?',
        cutout: 'string?',
        // showValues: 'boolean?',
        labelFormat: 'string?',
        tooltipFormat: 'string?',
        colors: 'string[]?', // Ajouté pour permettre un tableau de couleurs global
        // xLabel, yLabel, stacked, horizontal, showGrid, showPoints, tension, fill supprimés (non supportés par pie)
      },
    },
  },
  table: {
    type: 'table',
    label: 'Table',
    component: TableWidget,
    configSchema: {
      metrics: 'MetricConfig[]',
      bucket: 'BucketConfig',
      columns: 'ColumnConfig[]',
      pageSize: 'number?',
      groupBy: 'string?',
      widgetParams: {
        title: 'string?',
      },
    },
  },
};

// Nettoyage des doublons dans WIDGET_CONFIG_FIELDS
export const WIDGET_CONFIG_FIELDS: Record<string, { label: string; default?: any; inputType?: string; options?: any[] }> = {
  xField: { label: 'Champ X', inputType: 'select' },
  yField: { label: 'Champ Y', inputType: 'select' },
  color: { label: 'Couleur', inputType: 'color', default: '#2563eb' },
  groupBy: { label: 'Grouper par', inputType: 'select' },
  valueField: { label: 'Champ valeur', inputType: 'select' },
  nameField: { label: 'Champ nom', inputType: 'select' },
  columns: { label: 'Colonnes', inputType: 'table-columns', default: [] },
  pageSize: { label: 'Taille de page', inputType: 'number', default: 10 },
  legend: { label: 'Afficher la légende', inputType: 'checkbox', default: true },
  title: { label: 'Titre du graphique', inputType: 'text', default: '' },
  showGrid: { label: 'Afficher la grille', inputType: 'checkbox', default: true },
  showValues: { label: 'Afficher les valeurs', inputType: 'checkbox', default: false },
  stacked: { label: 'Empiler', inputType: 'checkbox', default: false },
  horizontal: { label: 'Horizontal', inputType: 'checkbox', default: false },
  cutout: { label: 'Trous (doughnut)', inputType: 'text', default: '0%' },
  showPoints: { label: 'Afficher les points', inputType: 'checkbox', default: true },
  tension: { label: 'Courbure (tension)', inputType: 'number', default: 0 },
  fill: { label: 'Remplir sous la ligne', inputType: 'checkbox', default: false },
  labelColor: { label: 'Couleur des labels', inputType: 'color', default: '#000000' },
  labelFontSize: { label: 'Taille de police des labels', inputType: 'number', default: 12 },
  labelFormat: { label: 'Format des labels', inputType: 'text', default: '{label}: {value} ({percent}%)' },
  tooltipFormat: { label: 'Format des tooltips', inputType: 'text', default: '{label}: {value}' },
  legendPosition: { label: 'Position de la légende', inputType: 'select', options: [
    { value: 'top', label: 'Haut' },
    { value: 'left', label: 'Gauche' },
    { value: 'right', label: 'Droite' },
    { value: 'bottom', label: 'Bas' },
  ], default: 'top' },
  titleAlign: { label: 'Alignement du titre', inputType: 'select', options: [
    { value: 'start', label: 'Début' },
    { value: 'center', label: 'Centre' },
    { value: 'end', label: 'Fin' },
  ], default: 'center' },
  xLabel: { label: "Label de l'axe X", inputType: 'text', default: '' },
  yLabel: { label: "Label de l'axe Y", inputType: 'text', default: '' },
  borderColor: { label: 'Couleur de bordure', inputType: 'color', default: '#000000' },
  borderWidth: { label: 'Épaisseur bordure', inputType: 'number', default: 1 },
  barThickness: { label: 'Épaisseur des barres', inputType: 'number', default: undefined },
  borderRadius: { label: 'Arrondi des barres', inputType: 'number', default: 0 },
  borderDash: { label: 'Pointillés (ex: 5,5)', inputType: 'text', default: '' },
  stepped: { label: 'Ligne en escalier', inputType: 'checkbox', default: false },
  pointStyle: { label: 'Style des points', inputType: 'select', options: [
    { value: 'circle', label: 'Cercle' },
    { value: 'rect', label: 'Rectangle' },
    { value: 'rectRounded', label: 'Rectangle arrondi' },
    { value: 'rectRot', label: 'Rectangle tourné' },
    { value: 'cross', label: 'Croix' },
    { value: 'crossRot', label: 'Croix tournée' },
    { value: 'star', label: 'Étoile' },
    { value: 'line', label: 'Ligne' },
    { value: 'dash', label: 'Tiret' },
  ], default: 'circle' },
  colors: { label: 'Couleurs (tableau)', inputType: 'color-array', default: [] },
};

// Métadonnées dynamiques pour la configuration des metrics et buckets selon le type de widget
export const WIDGET_DATA_CONFIG: Record<WidgetType, {
  metrics: {
    allowMultiple: boolean;
    defaultAgg: string;
    allowedAggs: { value: string; label: string }[];
    label: string;
  };
  bucket: {
    allow: boolean;
    label: string;
    typeLabel?: string;
  };
}> = {
  bar: {
    metrics: {
      allowMultiple: true,
      defaultAgg: 'sum',
      allowedAggs: [
        { value: 'none', label: 'Valeur brute' },
        { value: 'sum', label: 'Somme' },
        { value: 'avg', label: 'Moyenne' },
        { value: 'min', label: 'Min' },
        { value: 'max', label: 'Max' },
        { value: 'count', label: 'Nombre' },
      ],
      label: 'Métriques',
    },
    bucket: {
      allow: true,
      label: 'Champ de groupement (axe X)',
      typeLabel: 'x',
    },
  },
  line: {
    metrics: {
      allowMultiple: true,
      defaultAgg: 'sum',
      allowedAggs: [
        { value: 'none', label: 'Valeur brute' },
        { value: 'sum', label: 'Somme' },
        { value: 'avg', label: 'Moyenne' },
        { value: 'min', label: 'Min' },
        { value: 'max', label: 'Max' },
        { value: 'count', label: 'Nombre' },
      ],
      label: 'Métriques',
    },
    bucket: {
      allow: true,
      label: 'Champ de groupement (axe X)',
      typeLabel: 'x',
    },
  },
  pie: {
    metrics: {
      allowMultiple: false,
      defaultAgg: 'sum',
      allowedAggs: [
        { value: 'none', label: 'Valeur brute' },
        { value: 'sum', label: 'Somme' },
        { value: 'avg', label: 'Moyenne' },
        { value: 'min', label: 'Min' },
        { value: 'max', label: 'Max' },
        { value: 'count', label: 'Nombre' },
      ],
      label: 'Métrique',
    },
    bucket: {
      allow: true,
      label: 'Champ de groupement (part)',
      typeLabel: 'part',
    },
  },
  table: {
    metrics: {
      allowMultiple: true,
      defaultAgg: 'sum',
      allowedAggs: [
        { value: 'none', label: 'Valeur brute' },
        { value: 'sum', label: 'Somme' },
        { value: 'avg', label: 'Moyenne' },
        { value: 'min', label: 'Min' },
        { value: 'max', label: 'Max' },
        { value: 'count', label: 'Nombre' },
      ],
      label: 'Métriques',
    },
    bucket: {
      allow: true,
      label: 'Champ de groupement',
      typeLabel: 'x',
    },
  },
};
