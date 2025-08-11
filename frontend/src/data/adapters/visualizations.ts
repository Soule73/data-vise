import BarChartWidget from "@components/visualizations/charts/BarChartWidget";
import LineChartWidget from "@components/visualizations/charts/LineChartWidget";
import PieChartWidget from "@components/visualizations/charts/PieChartWidget";
import TableWidget from "@components/visualizations/table/TableWidget";
import ScatterChartWidget from "@components/visualizations/charts/ScatterChartWidget";
import BubbleChartWidget from "@components/visualizations/charts/BubbleChartWidget";
import RadarChartWidget from "@components/visualizations/charts/RadarChartWidget";
import KPIWidget from "@components/visualizations/kpi/KPIWidget";
import KPIGroupWidget from "@components/visualizations/kpi/KPIGroupWidget";
import CardWidget from "@components/visualizations/kpi/CardWidget";
import {
  BarChartConfig,
  LineChartConfig,
  PieChartConfig,
  TableWidgetConfig,
} from "@type/visualization";
import type { WidgetDefinition, WidgetType } from "@type/widgetTypes";
import {
  ChartBarIcon,
  ChartPieIcon,
  TableCellsIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  PresentationChartLineIcon,
  RectangleGroupIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import * as HeroIcons from "@heroicons/react/24/outline";

/**
 * Palette de couleurs par défaut pour les graphiques
 */
export const DEFAULT_CHART_COLORS = [
  "#6366f1", "#f59e42", "#10b981", "#ef4444", "#fbbf24",
  "#3b82f6", "#a21caf", "#14b8a6", "#eab308", "#f472b6"
];

// Styles communs pour les métriques (charts)
const COMMON_METRIC_STYLES = {
  color: { default: "#2563eb", inputType: "color", label: "Couleur" },
};

// Params communs pour les widgets (charts)
const COMMON_WIDGET_PARAMS = {
  title: { default: "", inputType: "text", label: "Titre du graphique" },
  legendPosition: {
    default: "top",
    inputType: "select",
    label: "Position de la légende",
    options: [
      { value: "top", label: "Haut" },
      { value: "left", label: "Gauche" },
      { value: "right", label: "Droite" },
      { value: "bottom", label: "Bas" },
    ],
  },
  xLabel: { default: "", inputType: "text", label: "Label de l'axe X" },
  yLabel: { default: "", inputType: "text", label: "Label de l'axe Y" },
  labelFormat: {
    default: "{label}: {value} ({percent}%)",
    inputType: "text",
    label: "Format des labels",
  },
  tooltipFormat: {
    default: "{label}: {value}",
    inputType: "text",
    label: "Format des tooltips",
  },
  titleAlign: {
    default: "center",
    inputType: "select",
    label: "Alignement du titre",
    options: [
      { value: "start", label: "Début" },
      { value: "center", label: "Centre" },
      { value: "end", label: "Fin" },
    ],
  },
  labelFontSize: {
    default: 12,
    inputType: "number",
    label: "Taille de police des labels",
  },
  labelColor: {
    default: "#000000",
    inputType: "color",
    label: "Couleur des labels",
  },
  legend: {
    default: true,
    inputType: "checkbox",
    label: "Afficher la légende",
  },
  showGrid: {
    default: true,
    inputType: "checkbox",
    label: "Afficher la grille",
  },
  showValues: {
    default: false,
    inputType: "checkbox",
    label: "Afficher les valeurs",
  },
};

export const WIDGETS: Record<WidgetType, WidgetDefinition> = {
  bar: {
    type: "bar",
    label: "Bar Chart",
    description: "Un graphique à barres montrant les données",
    component: BarChartWidget,
    icon: ChartBarIcon,
    enableFilter: true,
    configSchema: {
      ...BarChartConfig,
      globalFilters: {
        type: "array",
        label: "Filtres globaux",
        itemSchema: {
          field: { inputType: "select", label: "Champ" },
          operator: { inputType: "select", label: "Opérateur" },
          value: { inputType: "select", label: "Valeur" },
        },
        default: [],
      },
      metricStyles: {
        ...COMMON_METRIC_STYLES,
        borderColor: {
          default: "#000000",
          inputType: "color",
          label: "Couleur de bordure",
        },
        barThickness: {
          default: undefined,
          inputType: "number",
          label: "Épaisseur des barres",
        },
        borderRadius: {
          default: 0,
          inputType: "number",
          label: "Arrondi des barres",
        },
        borderWidth: {
          default: 1,
          inputType: "number",
          label: "Épaisseur bordure",
        },
      },
      widgetParams: {
        ...COMMON_WIDGET_PARAMS,
        stacked: {
          default: false,
          inputType: "checkbox",
          label: "Empiler les barres",
        },
        horizontal: {
          default: false,
          inputType: "checkbox",
          label: "Barres horizontales",
        },
      },
    },
  },
  line: {
    type: "line",
    label: "Line Chart",
    description: "Un graphique linéaire montrant les tendances dans les données",
    component: LineChartWidget,
    icon: ArrowTrendingUpIcon,
    enableFilter: true,
    configSchema: {
      ...LineChartConfig,
      globalFilters: {
        type: "array",
        label: "Filtres globaux",
        itemSchema: {
          field: { inputType: "select", label: "Champ" },
          operator: { inputType: "select", label: "Opérateur" },
          value: { inputType: "select", label: "Valeur" },
        },
        default: [],
      },
      metricStyles: {
        ...COMMON_METRIC_STYLES,
        borderColor: {
          default: "#000000",
          inputType: "color",
          label: "Couleur de bordure",
        },
        borderWidth: {
          default: 1,
          inputType: "number",
          label: "Épaisseur bordure",
        },
        borderRadius: {
          default: 0,
          inputType: "number",
          label: "Arrondi des lignes",
        },
        fill: {
          default: false,
          inputType: "checkbox",
          label: "Remplir sous la ligne",
        },
        stepped: {
          default: false,
          inputType: "checkbox",
          label: "Ligne en escalier",
        },
        pointStyle: {
          default: "circle",
          inputType: "select",
          label: "Style des points",
          options: [
            { value: "circle", label: "Cercle" },
            { value: "rect", label: "Rectangle" },
            { value: "rectRounded", label: "Rectangle arrondi" },
            { value: "rectRot", label: "Rectangle tourné" },
            { value: "cross", label: "Croix" },
            { value: "crossRot", label: "Croix tournée" },
            { value: "star", label: "Étoile" },
            { value: "line", label: "Ligne" },
            { value: "dash", label: "Tiret" },
          ],
        },
        borderDash: {
          default: "",
          inputType: "text",
          label: "Pointillés (ex: 5,5)",
        },
      },
      widgetParams: {
        ...COMMON_WIDGET_PARAMS,
        showPoints: {
          default: true,
          inputType: "checkbox",
          label: "Afficher les points",
        },
        tension: {
          default: 0,
          inputType: "number",
          label: "Courbure (tension)",
        },
        stacked: {
          default: false,
          inputType: "checkbox",
          label: "Empiler les lignes",
        },
      },
    },
  },
  pie: {
    type: "pie",
    label: "Pie Chart",
    description: "Un graphique circulaire montrant la répartition des données",
    component: PieChartWidget,
    icon: ChartPieIcon,
    allowMultipleMetrics: false,
    enableFilter: true,
    configSchema: {
      ...PieChartConfig,
      globalFilters: {
        type: "array",
        label: "Filtres globaux",
        itemSchema: {
          field: { inputType: "select", label: "Champ" },
          operator: { inputType: "select", label: "Opérateur" },
          value: { inputType: "select", label: "Valeur" },
        },
        default: [],
      },
      metricStyles: {
        colors: {
          default: DEFAULT_CHART_COLORS,
          inputType: "color-array",
          label: "Couleurs des parts (pie)",
        },
        borderColor: {
          default: "#000000",
          inputType: "color",
          label: "Couleur de bordure",
        },
        borderWidth: {
          default: 1,
          inputType: "number",
          label: "Épaisseur bordure",
        },
      },
      widgetParams: {
        // On retire xLabel et yLabel du pie chart et showGrid
        ...Object.fromEntries(Object.entries(COMMON_WIDGET_PARAMS).filter(([k]) => k !== "xLabel" && k !== "yLabel" && k !== "showGrid")),
        cutout: { default: "0%", inputType: "text", label: "Trous (doughnut)" },
      },
    },
  },
  table: {
    type: "table",
    label: "Table",
    description: "Un tableau montrant les données sous forme de grille",
    component: TableWidget,
    icon: TableCellsIcon,
    enableFilter: true,
    configSchema: {
      ...TableWidgetConfig,
      globalFilters: {
        type: "array",
        label: "Filtres globaux",
        itemSchema: {
          field: { inputType: "select", label: "Champ" },
          operator: { inputType: "select", label: "Opérateur" },
          value: { inputType: "select", label: "Valeur" },
        },
        default: [],
      },
      metricStyles: {},
      widgetParams: {
        pageSize: { default: 10, inputType: "number", label: "Taille de page" },
        title: { default: "", inputType: "text", label: "Titre du tableau" },
      },
    },
  },
  scatter: {
    type: "scatter",
    label: "Scatter Chart",
    description: "Un graphique de dispersion montrant la relation entre deux variables",
    component: ScatterChartWidget,
    icon: ArrowTrendingUpIcon,
    enableFilter: true, // Permettre les filtres globaux
    configSchema: {
      metricStyles: {
        ...COMMON_METRIC_STYLES,
        borderColor: {
          default: "#000000",
          inputType: "color",
          label: "Couleur de bordure",
        },
        borderWidth: {
          default: 1,
          inputType: "number",
          label: "Épaisseur bordure",
        },
        opacity: { default: 0.7, inputType: "number", label: "Opacité (0-1)" },
        pointStyle: {
          default: "circle",
          inputType: "select",
          label: "Style des points",
          options: [
            { value: "circle", label: "Cercle" },
            { value: "rect", label: "Rectangle" },
            { value: "rectRounded", label: "Rectangle arrondi" },
            { value: "rectRot", label: "Rectangle tourné" },
            { value: "cross", label: "Croix" },
            { value: "crossRot", label: "Croix tournée" },
            { value: "star", label: "Étoile" },
            { value: "line", label: "Ligne" },
            { value: "dash", label: "Tiret" },
          ],
        },
        pointRadius: {
          default: 3,
          inputType: "number",
          label: "Taille des points",
        },
        pointHoverRadius: {
          default: 5,
          inputType: "number",
          label: "Taille hover points",
        },
      },
      widgetParams: {
        ...COMMON_WIDGET_PARAMS,
        showPoints: {
          default: true,
          inputType: "checkbox",
          label: "Afficher les points",
        },
        xLabel: {
          default: "",
          inputType: "text",
          label: "Label axe X",
        },
        yLabel: {
          default: "",
          inputType: "text",
          label: "Label axe Y",
        },
      },
    },
  },
  bubble: {
    type: "bubble",
    label: "Bubble Chart",
    description: "Un graphique à bulles montrant la relation entre trois variables",
    component: BubbleChartWidget,
    icon: ChatBubbleLeftIcon,
    enableFilter: true, // Permettre les filtres globaux
    configSchema: {
      metricStyles: {
        ...COMMON_METRIC_STYLES,
        borderColor: {
          default: "#000000",
          inputType: "color",
          label: "Couleur de bordure",
        },
        borderWidth: {
          default: 1,
          inputType: "number",
          label: "Épaisseur bordure",
        },
        opacity: { default: 0.7, inputType: "number", label: "Opacité (0-1)" },
        pointStyle: {
          default: "circle",
          inputType: "select",
          label: "Style des points",
          options: [
            { value: "circle", label: "Cercle" },
            { value: "rect", label: "Rectangle" },
            { value: "rectRounded", label: "Rectangle arrondi" },
            { value: "rectRot", label: "Rectangle tourné" },
            { value: "cross", label: "Croix" },
            { value: "crossRot", label: "Croix tournée" },
            { value: "star", label: "Étoile" },
            { value: "line", label: "Ligne" },
            { value: "dash", label: "Tiret" },
          ],
        },
        pointRadius: {
          default: 5,
          inputType: "number",
          label: "Taille des points",
        },
        pointHoverRadius: {
          default: 7,
          inputType: "number",
          label: "Taille hover points",
        },
      },
      widgetParams: {
        ...COMMON_WIDGET_PARAMS,
        showPoints: {
          default: true,
          inputType: "checkbox",
          label: "Afficher les points",
        },
        xLabel: {
          default: "",
          inputType: "text",
          label: "Label axe X",
        },
        yLabel: {
          default: "",
          inputType: "text",
          label: "Label axe Y",
        },
      },
    },
  },
  radar: {
    type: "radar",
    label: "Radar Chart",
    description: "Un graphique radar montrant la répartition des données",
    component: RadarChartWidget,
    icon: ArrowTrendingUpIcon,
    enableFilter: true, // Permettre les filtres globaux
    configSchema: {
      metricStyles: {
        ...COMMON_METRIC_STYLES,
        borderColor: {
          default: "#000000",
          inputType: "color",
          label: "Couleur de bordure",
        },
        borderWidth: {
          default: 2,
          inputType: "number",
          label: "Épaisseur bordure",
        },
        opacity: { default: 0.25, inputType: "number", label: "Opacité (0-1)" },
        fill: {
          default: true,
          inputType: "checkbox",
          label: "Remplir la zone",
        },
        pointStyle: {
          default: "circle",
          inputType: "select",
          label: "Style des points",
          options: [
            { value: "circle", label: "Cercle" },
            { value: "rect", label: "Rectangle" },
            { value: "rectRounded", label: "Rectangle arrondi" },
            { value: "rectRot", label: "Rectangle tourné" },
            { value: "cross", label: "Croix" },
            { value: "crossRot", label: "Croix tournée" },
            { value: "star", label: "Étoile" },
            { value: "line", label: "Ligne" },
            { value: "dash", label: "Tiret" },
          ],
        },
      },
      widgetParams: {
        // On retire xLabel, yLabel et showGrid du radar
        ...Object.fromEntries(Object.entries(COMMON_WIDGET_PARAMS).filter(([k]) => k !== "xLabel" && k !== "yLabel" && k !== "showGrid")),
        pointRadius: {
          default: 4,
          inputType: "number",
          label: "Taille des points",
        },
        pointHoverRadius: {
          default: 6,
          inputType: "number",
          label: "Taille des points au survol",
        },
      },
    },
  },
  kpi: {
    type: "kpi",
    label: "KPI (Valeur clé)",
    description: "Un indicateur clé de performance affichant une valeur unique",
    component: KPIWidget,
    icon: PresentationChartLineIcon,
    allowMultipleMetrics: false,
    hideBucket: true,
    enableFilter: true,
    configSchema: {
      metricStyles: {},
      globalFilters: {
        type: "array",
        label: "Filtres globaux",
        itemSchema: {
          field: { inputType: "select", label: "Champ" },
          operator: { inputType: "select", label: "Opérateur" },
          value: { inputType: "select", label: "Valeur" },
        },
        default: [],
      },
      widgetParams: {
        title: { default: "", inputType: "text", label: "Titre du KPI" },
        valueColor: {
          default: "#2563eb",
          inputType: "color",
          label: "Couleur de la valeur",
        },
        titleColor: {
          default: "#2563eb",
          inputType: "color",
          label: "Couleur du titre",
        },
        showTrend: {
          default: true,
          inputType: "checkbox",
          label: "Afficher la tendance",
        },
        showValue: {
          default: true,
          inputType: "checkbox",
          label: "Afficher la valeur",
        },
        format: {
          default: "number",
          inputType: "select",
          label: "Format d'affichage",
          options: [
            { value: "number", label: "Nombre" },
            { value: "currency", label: "Devise" },
            { value: "percent", label: "Pourcentage" },
          ],
        },
        decimals: {
          default: 2,
          inputType: "number",
          label: "Nombre de décimales",
        },
        currency: {
          default: "€",
          inputType: "text",
          label: "Symbole de devise",
        },
        trendType: {
          default: "arrow",
          inputType: "select",
          label: "Type de tendance",
          options: [
            { value: "arrow", label: "Flèche" },
            { value: "icon", label: "Icône" },
            { value: "text", label: "Texte" },
          ],
        },
        showPercent: {
          default: false,
          inputType: "checkbox",
          label: "Afficher pourcentage de tendance",
        },
        trendThreshold: {
          default: 0,
          inputType: "number",
          label: "Seuil de tendance (%)",
        },
      },
    },
  },
  kpi_group: {
    type: "kpi_group",
    label: "KPI Group (Groupe de KPIs)",
    description: "Un groupe d'indicateurs clés de performance",
    component: KPIGroupWidget,
    icon: Squares2X2Icon,
    allowMultipleMetrics: true,
    hideBucket: true,
    enableFilter: true,
    configSchema: {
      metricStyles: {
        valueColor: {
          default: "#2563eb",
          inputType: "color",
          label: "Couleur de la valeur",
        },
      },
      globalFilters: {
        type: "array",
        label: "Filtres globaux",
        itemSchema: {
          field: { inputType: "select", label: "Champ" },
          operator: { inputType: "select", label: "Opérateur" },
          value: { inputType: "select", label: "Valeur" },
        },
        default: [],
      },
      widgetParams: {
        title: { default: "", inputType: "text", label: "Titre du groupe" },
        columns: {
          default: 2,
          inputType: "number",
          label: "Colonnes",
        },
        // Paramètres KPI partagés par tous les KPI du groupe
        showTrend: {
          default: true,
          inputType: "checkbox",
          label: "Afficher la tendance",
        },
        showValue: {
          default: true,
          inputType: "checkbox",
          label: "Afficher la valeur",
        },
        format: {
          default: "number",
          inputType: "select",
          label: "Format d'affichage",
          options: [
            { value: "number", label: "Nombre" },
            { value: "currency", label: "Devise" },
            { value: "percent", label: "Pourcentage" },
          ],
        },
        decimals: {
          default: 2,
          inputType: "number",
          label: "Nombre de décimales",
        },
        currency: {
          default: "€",
          inputType: "text",
          label: "Symbole de devise",
        },
        trendType: {
          default: "arrow",
          inputType: "select",
          label: "Type de tendance",
          options: [
            { value: "arrow", label: "Flèche" },
            { value: "icon", label: "Icône" },
            { value: "text", label: "Texte" },
          ],
        },
        showPercent: {
          default: false,
          inputType: "checkbox",
          label: "Afficher pourcentage de tendance",
        },
        trendThreshold: {
          default: 0,
          inputType: "number",
          label: "Seuil de tendance (%)",
        },
        titleColor: {
          default: "#2563eb",
          inputType: "color",
          label: "Couleur du titre",
        },
      },
    },
  },
  card: {
    type: "card",
    label: "Card (Carte synthèse)",
    description: "Une carte synthèse affichant des informations clés",
    component: CardWidget,
    icon: RectangleGroupIcon,
    allowMultipleMetrics: false,
    hideBucket: true,
    enableFilter: true,
    configSchema: {
      metricStyles: {},
      globalFilters: {
        type: "array",
        label: "Filtres globaux",
        itemSchema: {
          field: { inputType: "select", label: "Champ" },
          operator: { inputType: "select", label: "Opérateur" },
          value: { inputType: "select", label: "Valeur" },
        },
        default: [],
      },
      widgetParams: {
        title: { default: "", inputType: "text", label: "Titre de la carte" },
        description: { default: "", inputType: "text", label: "Description" },
        iconColor: {
          default: "#6366f1",
          inputType: "color",
          label: "Couleur de l'icône",
        },
        valueColor: {
          default: "#2563eb",
          inputType: "color",
          label: "Couleur de la valeur",
        },
        descriptionColor: {
          default: "#6b7280",
          inputType: "color",
          label: "Couleur de la description",
        },
        showIcon: {
          default: true,
          inputType: "checkbox",
          label: "Afficher une icône",
        },
        icon: {
          label: "Icône",
          inputType: "select",
          default: "ChartBarIcon",
          options: Object.keys(HeroIcons).map((k) => ({
            value: k,
            label: k.replace(/Icon$/, ""),
          })),
        },
        format: {
          default: "number",
          inputType: "select",
          label: "Format d'affichage",
          options: [
            { value: "number", label: "Nombre" },
            { value: "currency", label: "Devise" },
            { value: "percent", label: "Pourcentage" },
          ],
        },
        decimals: {
          default: 2,
          inputType: "number",
          label: "Nombre de décimales",
        },
        currency: {
          default: "€",
          inputType: "text",
          label: "Symbole de devise",
        },
      },
    },
  },
};

// Champs de configuration communs factorisés
const COMMON_FIELDS = {
  title: { label: "Titre du graphique", inputType: "text", default: "" },
  color: { label: "Couleur", inputType: "color", default: "#2563eb" },
  legend: {
    label: "Afficher la légende",
    inputType: "checkbox",
    default: true,
  },
  showGrid: {
    label: "Afficher la grille",
    inputType: "checkbox",
    default: true,
  },
  showValues: {
    label: "Afficher les valeurs",
    inputType: "checkbox",
    default: false,
  },
  labelFormat: {
    label: "Format des labels",
    inputType: "text",
    default: "{label}: {value} ({percent}%)",
  },
  tooltipFormat: {
    label: "Format des tooltips",
    inputType: "text",
    default: "{label}: {value}",
  },
  legendPosition: {
    label: "Position de la légende",
    inputType: "select",
    options: [
      { value: "top", label: "Haut" },
      { value: "left", label: "Gauche" },
      { value: "right", label: "Droite" },
      { value: "bottom", label: "Bas" },
    ],
    default: "top",
  },
  titleAlign: {
    label: "Alignement du titre",
    inputType: "select",
    options: [
      { value: "start", label: "Début" },
      { value: "center", label: "Centre" },
      { value: "end", label: "Fin" },
    ],
    default: "center",
  },
};

export const WIDGET_CONFIG_FIELDS: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { label: string; default?: any; inputType?: string; options?: any[] }
> = {
  xField: { label: "Champ X", inputType: "select" },
  yField: { label: "Champ Y", inputType: "select" },
  groupBy: { label: "Grouper par", inputType: "select" },
  valueField: { label: "Champ valeur", inputType: "select" },
  nameField: { label: "Champ nom", inputType: "select" },
  columns: { label: "Colonnes", inputType: "table-columns", default: [] },
  pageSize: { label: "Taille de page", inputType: "number", default: 10 },
  stacked: { label: "Empiler", inputType: "checkbox", default: false },
  horizontal: { label: "Horizontal", inputType: "checkbox", default: false },
  cutout: { label: "Trous (doughnut)", inputType: "text", default: "0%" },
  showPoints: {
    label: "Afficher les points",
    inputType: "checkbox",
    default: true,
  },
  tension: { label: "Courbure (tension)", inputType: "number", default: 0 },
  fill: {
    label: "Remplir sous la ligne",
    inputType: "checkbox",
    default: false,
  },
  labelColor: {
    label: "Couleur des labels",
    inputType: "color",
    default: "#000000",
  },
  labelFontSize: {
    label: "Taille de police des labels",
    inputType: "number",
    default: 12,
  },
  borderColor: {
    label: "Couleur de bordure",
    inputType: "color",
    default: "#000000",
  },
  borderWidth: { label: "Épaisseur bordure", inputType: "number", default: 1 },
  barThickness: {
    label: "Épaisseur des barres",
    inputType: "number",
    default: undefined,
  },
  borderRadius: {
    label: "Arrondi des barres",
    inputType: "number",
    default: 0,
  },
  borderDash: { label: "Pointillés (ex: 5,5)", inputType: "text", default: "" },
  stepped: {
    label: "Ligne en escalier",
    inputType: "checkbox",
    default: false,
  },
  pointStyle: {
    label: "Style des points",
    inputType: "select",
    options: [
      { value: "circle", label: "Cercle" },
      { value: "rect", label: "Rectangle" },
      { value: "rectRounded", label: "Rectangle arrondi" },
      { value: "rectRot", label: "Rectangle tourné" },
      { value: "cross", label: "Croix" },
      { value: "crossRot", label: "Croix tournée" },
      { value: "star", label: "Étoile" },
      { value: "line", label: "Ligne" },
      { value: "dash", label: "Tiret" },
    ],
    default: "circle",
  },
  colors: {
    label: "Couleurs (tableau)",
    inputType: "color-array",
    default: [],
  },
  xLabel: { label: "Label de l'axe X", inputType: "text", default: "" },
  yLabel: { label: "Label de l'axe Y", inputType: "text", default: "" },
  valueColor: {
    label: "Couleur de la valeur",
    inputType: "color",
    default: "#2563eb",
  },
  showTrend: {
    label: "Afficher la tendance",
    inputType: "checkbox",
    default: true,
  },
  icon: {
    label: "Icône",
    inputType: "select",
    default: "ChartBarIcon",
    options: Object.keys(HeroIcons).map((k) => ({
      value: k,
      label: k.replace(/Icon$/, ""),
    })),
  },
  // minBubbleSize et maxBubbleSize supprimés
  ...COMMON_FIELDS,
};

// Métadonnées dynamiques pour la configuration des metrics et buckets selon le type de widget
const COMMON_AGGS = [
  { value: "none", label: "Valeur brute" },
  { value: "sum", label: "Somme" },
  { value: "avg", label: "Moyenne" },
  { value: "min", label: "Min" },
  { value: "max", label: "Max" },
  { value: "count", label: "Nombre" },
];

const COMMON_METRICS = {
  allowMultiple: true,
  defaultAgg: "sum",
  allowedAggs: COMMON_AGGS,
  label: "Métriques",
};

// const COMMON_BUCKET = {
//   allow: true,
//   label: "Champ de groupement",
//   typeLabel: "x",
// };

// Configuration commune pour les buckets multiples
const COMMON_MULTI_BUCKETS = {
  allow: true,
  allowMultiple: true,
  label: "Buckets",
  allowedTypes: [
    { value: 'terms', label: 'Termes' },
    { value: 'histogram', label: 'Histogramme' },
    { value: 'date_histogram', label: 'Histogramme de dates' },
    { value: 'range', label: 'Plages' },
    { value: 'split_series', label: 'Diviser en séries' },
    { value: 'split_rows', label: 'Diviser en lignes' },
    { value: 'split_chart', label: 'Diviser en graphiques' },
  ],
};

export const WIDGET_DATA_CONFIG: Record<
  WidgetType,
  {
    metrics:
    | typeof COMMON_METRICS
    | (typeof COMMON_METRICS & { allowMultiple: false; label: string });
    buckets?: typeof COMMON_MULTI_BUCKETS & { label?: string };
  }
> = {
  bar: {
    metrics: COMMON_METRICS,
    buckets: { ...COMMON_MULTI_BUCKETS, label: "Buckets" },
  },
  line: {
    metrics: COMMON_METRICS,
    buckets: { ...COMMON_MULTI_BUCKETS, label: "Buckets" },
  },
  pie: {
    metrics: { ...COMMON_METRICS, allowMultiple: false, label: "Métrique" },
    buckets: {
      ...COMMON_MULTI_BUCKETS,
      allowMultiple: false,
      label: "Groupement",
      allowedTypes: [
        { value: 'terms', label: 'Termes' },
        { value: 'range', label: 'Plages' },
      ]
    },
  },
  table: {
    metrics: COMMON_METRICS,
    buckets: { ...COMMON_MULTI_BUCKETS, label: "Groupements" },
  },
  scatter: {
    metrics: COMMON_METRICS,
    buckets: { ...COMMON_MULTI_BUCKETS, allow: false },
  },
  bubble: {
    metrics: COMMON_METRICS,
    buckets: { ...COMMON_MULTI_BUCKETS, allow: false },
  },
  radar: {
    metrics: COMMON_METRICS,
    buckets: { ...COMMON_MULTI_BUCKETS, allow: false },
  },
  kpi: {
    metrics: { ...COMMON_METRICS, allowMultiple: false, label: "Métrique" },
    buckets: { ...COMMON_MULTI_BUCKETS, allow: false },
  },
  kpi_group: {
    metrics: { ...COMMON_METRICS, allowMultiple: true, label: "KPIs" },
    buckets: { ...COMMON_MULTI_BUCKETS, allow: false },
  },
  card: {
    metrics: { ...COMMON_METRICS, allowMultiple: false, label: "Métrique" },
    buckets: { ...COMMON_MULTI_BUCKETS, allowMultiple: false, label: "Groupement" },
  },
};
