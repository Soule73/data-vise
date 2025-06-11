import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import type { ChartOptions, ChartData } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export interface PieChartConfig {
  valueField: string;
  nameField: string;
  colorScheme?: string;
}

export interface MetricConfig {
  agg: string;
  field: string;
  label?: string;
}
export interface BucketConfig {
  field: string;
  type?: string;
}

export default function PieChartWidget({
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
        Sélectionnez la métrique et le champ de groupement.
      </div>
    );
  }
  // On ne prend que la première métrique pour le pie (classique)
  const metric = config.metrics[0] || { agg: "sum", field: "", label: "" };
  const labels = Array.from(
    new Set(data.map((row: any) => row[config.bucket.field]))
  );
  function aggregate(rows: any[], agg: string, field: string) {
    if (agg === "none") {
      if (rows.length === 1) return rows[0][field];
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
  const values = labels.map((labelVal) => {
    const rows = data.filter(
      (row: any) => row[config.bucket.field] === labelVal
    );
    return aggregate(rows, metric.agg, metric.field);
  });
  // Palette de couleurs simple ou personnalisée
  const defaultColors = [
    "#6366f1",
    "#f59e42",
    "#10b981",
    "#ef4444",
    "#fbbf24",
    "#3b82f6",
    "#a21caf",
    "#14b8a6",
    "#eab308",
    "#f472b6",
  ];
  // Gestion DRY des couleurs personnalisées (par part)
  let backgroundColor: string[] = defaultColors;
  // 1. Tableau de couleurs fourni (priorité)
  const customColors =
    config.metricStyles?.[0]?.colors || config.widgetParams?.colors;
  if (Array.isArray(customColors) && customColors.length > 0) {
    backgroundColor = labels.map(
      (_, i) => customColors[i % customColors.length]
    );
  } else if (config.metricStyles?.[0]?.color) {
    // 2. Couleur unique fournie
    if (labels.length === 1) {
      backgroundColor = [config.metricStyles[0].color];
    } else {
      // Plusieurs parts : on garde la palette
      backgroundColor = defaultColors;
    }
  } else if (config.color) {
    // 3. Couleur unique globale
    if (labels.length === 1) {
      backgroundColor = [config.color];
    } else {
      backgroundColor = defaultColors;
    }
  }
  // Helper pour valider la position de la légende
  const legendPosition =
    config.widgetParams?.legendPosition || config.legendPosition || "top";
  // Helper pour valider l'alignement du titre
  const title = config.widgetParams?.title || config.title;
  const titleAlign =
    config.widgetParams?.titleAlign || config.titleAlign || "center";

  const chartData: ChartData<"pie"> = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColor,
        borderWidth: config.metricStyles?.[0]?.borderWidth || 1,
        borderColor: config.metricStyles?.[0]?.borderColor || undefined,
        borderRadius: config.metricStyles?.[0]?.borderRadius || 0,
        // datalabels retiré du dataset
      },
    ],
  };
  // Gestion DRY du format du tooltip
  const tooltipFormat =
    config.widgetParams?.tooltipFormat ||
    config.tooltipFormat ||
    "{label}: {value} ({percent}%)";
  const cutout = config.widgetParams?.cutout || config.cutout || undefined;
  const labelFormat =
    config.widgetParams?.labelFormat ||
    config.labelFormat ||
    "{label}: {value} ({percent}%)";
  const showValues =
    config.metricStyles?.[0]?.showValues ??
    config.widgetParams?.showValues ??
    config.showValues ??
    false;

  // Plugin natif pour afficher les valeurs sur chaque part si showValues
  const showNativeValues = showValues && labels.length > 0 && values.length > 0;
  const valueLabelsPlugin = {
    id: "pieValueLabelsPlugin",
    afterDraw(chart: ChartJSInstance) {
      if (!showNativeValues) return;
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      meta.data.forEach((arc: any, i: number) => {
        const value = values[i];
        if (value == null || isNaN(value)) return;
        const percent =
          values.reduce((a, b) => a + b, 0) > 0
            ? ((value / values.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
            : "0.0";
        const label = labelFormat
          .replace("{label}", labels[i])
          .replace("{value}", String(value))
          .replace("{percent}", percent);
        // Position centrale de la part
        const pos = arc.getCenterPoint();
        ctx.save();
        ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = backgroundColor[i] || "#333";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeText(label, pos.x, pos.y);
        ctx.fillStyle = "#fff";
        ctx.fillText(label, pos.x, pos.y);
        ctx.restore();
      });
    },
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    interaction: { mode: "nearest", intersect: true },
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
          label: function (context) {
            const label = context.label;
            const value = context.parsed;
            const percent =
              values.reduce((a, b) => a + b, 0) > 0
                ? ((value / values.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
                : "0.0";
            return tooltipFormat
              .replace("{label}", label)
              .replace("{value}", String(value))
              .replace("{percent}", percent);
          },
        },
      },
      // datalabels: supprimé
    },
    cutout: cutout,
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-x-auto">
      <Pie
        className="w-full max-w-full h-auto p-1 md:p-2"
        data={chartData}
        options={options}
        plugins={showNativeValues ? [valueLabelsPlugin] : []}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
