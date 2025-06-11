import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartOptions, ChartData } from "chart.js";
import type { Chart as ChartJSInstance } from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface LineChartConfig {
  xField: string;
  yField: string;
  color?: string;
  legend?: boolean;
  title?: string;
  showPoints?: boolean;
  showGrid?: boolean;
  tension?: number;
  borderWidth?: number;
  fill?: boolean;
  legendPosition?: "top" | "left" | "right" | "bottom";
  titleAlign?: "start" | "center" | "end";
  labelColor?: string;
  labelFontSize?: number;
  labelFormat?: string;
  tooltipFormat?: string;
  showValues?: boolean;
  xLabel?: string; // Ajouté pour le label de l'axe x
  yLabel?: string; // Ajouté pour le label de l'axe y
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

export default function LineChartWidget({
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
  // Gestion DRY des options showPoints, fill, stepped, showValues (hors du map)
  const showPoints =
    config.metricStyles &&
    config.metricStyles[0] &&
    config.metricStyles[0].showPoints !== undefined
      ? config.metricStyles[0].showPoints
      : config.widgetParams?.showPoints !== undefined
      ? config.widgetParams.showPoints
      : config.showPoints !== undefined
      ? config.showPoints
      : true;
  const showValues =
    config.metricStyles &&
    config.metricStyles[0] &&
    config.metricStyles[0].showValues !== undefined
      ? config.metricStyles[0].showValues
      : config.widgetParams?.showValues !== undefined
      ? config.widgetParams.showValues
      : config.showValues !== undefined
      ? config.showValues
      : false;
  const fill =
    config.metricStyles &&
    config.metricStyles[0] &&
    config.metricStyles[0].fill !== undefined
      ? config.metricStyles[0].fill
      : config.widgetParams?.fill !== undefined
      ? config.widgetParams.fill
      : config.fill !== undefined
      ? config.fill
      : false;
  const stepped =
    config.metricStyles &&
    config.metricStyles[0] &&
    config.metricStyles[0].stepped !== undefined
      ? config.metricStyles[0].stepped
      : config.widgetParams?.stepped !== undefined
      ? config.widgetParams.stepped
      : config.stepped !== undefined
      ? config.stepped
      : false;
  const datasets = config.metrics.map((metric: any, idx: number) => {
    const values = labels.map((labelVal) => {
      const rows = data.filter(
        (row: any) => row[config.bucket.field] === labelVal
      );
      return aggregate(rows, metric.agg, metric.field);
    });
    // Récupérer le style spécifique à la métrique
    const style = (config.metricStyles && config.metricStyles[idx]) || {};
    // Gestion des options avancées
    let borderDash: number[] | undefined = undefined;
    if (
      style.borderDash ||
      config.widgetParams?.borderDash ||
      config.borderDash
    ) {
      const dashStr =
        style.borderDash ||
        config.widgetParams?.borderDash ||
        config.borderDash;
      if (dashStr && typeof dashStr === "string") {
        borderDash = dashStr
          .split(",")
          .map((v: string) => parseInt(v.trim(), 10))
          .filter((n: number) => !isNaN(n));
      }
    }
    // Gestion de la couleur de remplissage (fillColor)
    const fillColor =
      style.fillColor ||
      config.widgetParams?.fillColor ||
      config.fillColor ||
      (style.color ||
        config.widgetParams?.color ||
        `hsl(${(idx * 60) % 360}, 70%, 60%)`) + "33";
    return {
      label: metric.label || metric.field,
      data: values,
      borderColor:
        style.color ||
        config.widgetParams?.color ||
        `hsl(${(idx * 60) % 360}, 70%, 60%)`,
      backgroundColor: fill ? fillColor : undefined,
      borderWidth: style.borderWidth || config.widgetParams?.borderWidth || 2,
      borderRadius:
        style.borderRadius || config.widgetParams?.borderRadius || 0,
      pointStyle:
        style.pointStyle || config.widgetParams?.pointStyle || undefined,
      pointBorderColor:
        style.borderColor || config.widgetParams?.borderColor || undefined,
      borderDash,
      stepped,
      fill,
      // pointRadius et datalabels sont maintenant gérés dans options
    };
  });
  const chartData: ChartData<"line"> = { labels, datasets };
  // Désactivation stricte de datalabels si un dataset est vide
  const hasData =
    labels.length > 0 &&
    datasets.length > 0 &&
    datasets.every((ds: any) => Array.isArray(ds.data) && ds.data.length > 0);
  const legendPosition =
    config.widgetParams?.legendPosition || config.legendPosition || "top";
  const title = config.widgetParams?.title || config.title;
  const titleAlign =
    config.widgetParams?.titleAlign || config.titleAlign || "center";
  const xLabel = config.widgetParams?.xLabel;
  const yLabel = config.widgetParams?.yLabel;
  const showGrid = config.widgetParams?.showGrid ?? config.showGrid ?? true;
  // Empilement (stacked)
  const stacked = config.widgetParams?.stacked ?? config.stacked ?? false;
  const tension = config.widgetParams?.tension ?? config.tension ?? 0;
  const options: ChartOptions<"line"> = {
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
            color: config.widgetParams?.labelColor,
            font: config.widgetParams?.labelFontSize
              ? { size: config.widgetParams.labelFontSize }
              : undefined,
          }
        : undefined,
      tooltip: {
        enabled: true,
        callbacks:
          config.widgetParams?.tooltipFormat || config.tooltipFormat
            ? {
                label: function (context) {
                  const label = context.label;
                  const value = context.parsed.y;
                  return (
                    config.widgetParams?.tooltipFormat ||
                    config.tooltipFormat ||
                    "{label}: {value}"
                  )
                    .replace("{label}", label)
                    .replace("{value}", String(value));
                },
              }
            : undefined,
      },
      // datalabels supprimé
    },
    elements: {
      point: { radius: showPoints ? 3 : 0 },
      line: {
        borderWidth: config.borderWidth || 2,
        tension,
        // fill et stepped sont gérés par dataset
      },
    },
    scales: {
      x: {
        grid: { display: showGrid },
        title: xLabel ? { display: true, text: xLabel } : undefined,
        stacked,
      },
      y: {
        grid: { display: showGrid },
        title: yLabel ? { display: true, text: yLabel } : undefined,
        stacked,
      },
    },
  };
  // Nettoyage des props inutilisées liées à datalabels
  // Ajout de l'affichage natif des valeurs sur chaque point si showValues
  const showNativeValues = showValues && hasData;
  // Scriptable plugin Chart.js pour afficher les valeurs sur chaque point
  const valueLabelsPlugin = {
    id: "valueLabelsPlugin",
    afterDatasetsDraw(chart: ChartJSInstance) {
      if (!showNativeValues) return;
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset: any, i: number) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((point: any, j: number) => {
          const value = dataset.data[j];
          if (value == null || isNaN(value)) return;
          const labelFormat =
            config.widgetParams?.labelFormat || config.labelFormat || "{value}";
          const label = labelFormat.replace("{value}", value);
          ctx.save();
          ctx.font = "bold 11px sans-serif";
          ctx.fillStyle = dataset.borderColor || "#333";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(label, point.x, point.y - 6);
          ctx.restore();
        });
      });
    },
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-x-auto">
      <Line
        className="w-full max-w-full h-auto p-1 md:p-2"
        data={chartData}
        options={options}
        plugins={showNativeValues ? [valueLabelsPlugin] : []}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
