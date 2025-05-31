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
      xField: 'string',
      yField: 'string',
      color: 'string?',
      groupBy: 'string?',
      // Paramètres Chart.js additionnels
      stacked: 'boolean?',
      horizontal: 'boolean?',
      legend: 'boolean?',
      legendPosition: 'string?', // top, left, right, bottom
      title: 'string?',
      titleAlign: 'string?', // start, center, end
      showGrid: 'boolean?',
      showValues: 'boolean?',
      barThickness: 'number?',
      borderRadius: 'number?',
      labelColor: 'string?',
      labelFontSize: 'number?',
      labelFormat: 'string?', // e.g. "{label}: {value} ({percent}%)"
      tooltipFormat: 'string?',
      xLabel: 'string?', // Ajout label axe X
      yLabel: 'string?', // Ajout label axe Y
    },
  },
  pie: {
    type: 'pie',
    label: 'Pie Chart',
    component: PieChartWidget,
    configSchema: {
      valueField: 'string',
      nameField: 'string',
      // Paramètres Chart.js additionnels
      legend: 'boolean?',
      legendPosition: 'string?', // top, left, right, bottom
      title: 'string?',
      titleAlign: 'string?', // start, center, end
      cutout: 'string?', // pour doughnut
      showValues: 'boolean?',
      borderWidth: 'number?',
      labelColor: 'string?',
      labelFontSize: 'number?',
      labelFormat: 'string?', // e.g. "{label}: {value} ({percent}%)"
      tooltipFormat: 'string?',
    },
  },
  table: {
    type: 'table',
    label: 'Table',
    component: TableWidget,
    configSchema: {
      columns: 'ColumnConfig[]', // Modifié pour accepter un tableau d'objets
      pageSize: 'number?',
    },
  },
  line: {
    type: 'line',
    label: 'Line Chart',
    component: LineChartWidget,
    configSchema: {
      xField: 'string',
      yField: 'string',
      color: 'string?',
      // Paramètres Chart.js additionnels
      legend: 'boolean?',
      legendPosition: 'string?', // top, left, right, bottom
      title: 'string?',
      titleAlign: 'string?', // start, center, end
      showPoints: 'boolean?',
      showGrid: 'boolean?',
      tension: 'number?',
      borderWidth: 'number?',
      fill: 'boolean?',
      labelColor: 'string?',
      labelFontSize: 'number?',
      labelFormat: 'string?',
      tooltipFormat: 'string?',
      xLabel: 'string?', // Ajout label axe X
      yLabel: 'string?', // Ajout label axe Y
    },
  },
};

// Table de métadonnées pour chaque champ de config (label, valeur par défaut, type d'input, etc.)
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
  barThickness: { label: 'Épaisseur des barres', inputType: 'number', default: undefined },
  borderRadius: { label: 'Arrondi des barres', inputType: 'number', default: 0 },
  stacked: { label: 'Empiler', inputType: 'checkbox', default: false },
  horizontal: { label: 'Horizontal', inputType: 'checkbox', default: false },
  cutout: { label: 'Trous (doughnut)', inputType: 'text', default: '0%' },
  borderWidth: { label: 'Épaisseur bordure', inputType: 'number', default: 1 },
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
};
