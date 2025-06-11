import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartOptions, ChartData } from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
  // SUPPRESSION DU PLUGIN DATALABELS GLOBAL POUR TOUS LES CHARTS
  // ChartJS.register(ChartDataLabels); // LIGNE À SUPPRIMER OU COMMENTER
);

export interface MetricConfig {
  agg: string; // sum, avg, min, max, count
  field: string;
  label?: string;
}
export interface BucketConfig {
  field: string;
  type?: string; // x, split, etc.
}

export interface BarChartConfig {
  xField: string;
  yField: string;
  color?: string;
  groupBy?: string;
}

export default function BarChartWidget({
  data,
  config,
}: {
  data: any[];
  config: any;
  editMode?: boolean;
}) {
  if (
    !data ||
    !config.metrics ||
    !config.bucket ||
    !Array.isArray(config.metrics) ||
    !config.bucket.field
  ) {
    return (
      <div className="text-xs text-gray-500">
        Sélectionnez les métriques et le champ de groupement.
      </div>
    );
  }
  // Préparer les labels (valeurs uniques du bucket)
  const labels = Array.from(
    new Set(data.map((row: any) => row[config.bucket.field]))
  );
  // Pour chaque métrique, calculer les valeurs agrégées par bucket
  function aggregate(rows: any[], agg: string, field: string) {
    if (agg === "none") {
      if (rows.length === 1) return rows[0][field];
      // Si plusieurs lignes, retourne la première valeur non undefined
      const found = rows.find(
        (r) => r[field] !== undefined && r[field] !== null
      );
      return found ? found[field] : "";
    }
    const nums = rows.map((r) => Number(r[field])).filter((v) => !isNaN(v));
    if (agg === "sum") return nums.reduce((a, b) => a + b, 0);
    if (agg === "avg")
      return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    if (agg === "min") return nums.length ? Math.min(...nums) : 0;
    if (agg === "max") return nums.length ? Math.max(...nums) : 0;
    if (agg === "count") return rows.length;
    return "";
  }
  const showValues =
    config.widgetParams?.showValues ?? config.showValues ?? false;
  const stacked = config.widgetParams?.stacked ?? config.stacked ?? false;
  const labelFormat =
    config.widgetParams?.labelFormat ||
    config.labelFormat ||
    "{label}: {value}";
  const datasets = config.metrics.map((metric: any, idx: number) => {
    const values = labels.map((labelVal) => {
      const rows = data.filter(
        (row: any) => row[config.bucket.field] === labelVal
      );
      return aggregate(rows, metric.agg, metric.field);
    });
    const style = (config.metricStyles && config.metricStyles[idx]) || {};
    return {
      label: metric.label || metric.field,
      data: values,
      backgroundColor: style.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
      borderWidth: style.borderWidth || 1,
      borderColor: style.borderColor || undefined,
      barThickness: style.barThickness || undefined,
      borderRadius: style.borderRadius || 0,
    };
  });
  // Désactivation stricte de datalabels si un dataset est vide
  const chartData: ChartData<"bar"> = { labels, datasets };
  // Helpers pour valider les valeurs autorisées
  const legendPosition =
    config.widgetParams?.legendPosition || config.legendPosition || "top";
  const title = config.widgetParams?.title || config.title;
  const titleAlign =
    config.widgetParams?.titleAlign || config.titleAlign || "center";
  const xLabel = config.widgetParams?.xLabel;
  const yLabel = config.widgetParams?.yLabel;
  const showGrid = config.widgetParams?.showGrid ?? config.showGrid ?? true;
  const isHorizontal =
    config.widgetParams?.horizontal ?? config.horizontal ?? false;
  const indexAxis: "x" | "y" = isHorizontal ? "y" : "x";

  // Correction : ne pas dupliquer la clé plugins dans l'objet options
  const pluginsOptions = showValues
    ? {
        datalabels: undefined, // On s'assure que rien n'est injecté
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context: any) {
              const label = context.label;
              const value = context.parsed.y;
              return labelFormat
                .replace("{label}", label)
                .replace("{value}", String(value));
            },
          },
        },
      }
    : {};

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display:
          config.widgetParams?.legend !== false && config.legend !== false,
        position: legendPosition as "top" | "left" | "right" | "bottom",
      },
      title: title
        ? {
            display: true,
            text: title,
            position: "top",
            align: titleAlign as "start" | "center" | "end",
          }
        : undefined,
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: import("chart.js").TooltipItem<"bar">) => {
            const label = context.label;
            const value = context.parsed.y;
            // Si showValues, on affiche la valeur formatée dans le tooltip
            if (showValues) {
              return labelFormat
                .replace("{label}", label)
                .replace("{value}", String(value));
            }
            // Sinon, fallback natif
            return `${label}: ${value}`;
          },
        },
      },
      ...pluginsOptions,
    },
    indexAxis,
    scales: {
      x: {
        grid: { display: showGrid },
        title: xLabel ? { display: true, text: xLabel } : undefined,
      },
      y: {
        grid: { display: showGrid },
        stacked: stacked,
        title: yLabel ? { display: true, text: yLabel } : undefined,
      },
    },
    animation: false,
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Bar
        className="w-full max-w-full h-auto p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
