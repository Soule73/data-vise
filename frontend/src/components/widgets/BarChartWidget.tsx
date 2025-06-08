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
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

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
}) {
  if (!data || !config.xField || !config.yField) {
    return (
      <div className="text-xs text-gray-500">
        Sélectionnez les champs pour afficher le graphique.
      </div>
    );
  }
  // Gestion du groupBy : si défini, on crée un dataset par valeur unique de groupBy
  let chartData;
  if (config.groupBy) {
    // Trouver toutes les valeurs uniques de groupBy
    const groupValues = Array.from(
      new Set(data.map((row: any) => row[config.groupBy]))
    );
    // Trouver toutes les valeurs uniques de xField (labels)
    const labels = Array.from(
      new Set(data.map((row: any) => row[config.xField]))
    );
    // Générer un dataset par valeur de groupBy
    const datasets = groupValues.map((groupVal, idx) => {
      // Pour chaque label, trouver la valeur correspondante dans le groupe
      const values = labels.map((label) => {
        const found = data.find(
          (row: any) =>
            row[config.groupBy] === groupVal && row[config.xField] === label
        );
        return found ? found[config.yField] : 0;
      });
      return {
        label: groupVal,
        data: values,
        backgroundColor: config.color || `hsl(${(idx * 60) % 360}, 70%, 60%)`,
        datalabels: config.showValues
          ? {
              color: config.labelColor || "#222",
              font: { size: config.labelFontSize || 12 },
              formatter: (value: number, ctx: any) => {
                if (config.labelFormat) {
                  const label = ctx.chart.data.labels[ctx.dataIndex];
                  return config.labelFormat
                    .replace("{label}", label)
                    .replace("{value}", value);
                }
                return value;
              },
            }
          : undefined,
      };
    });
    chartData = { labels, datasets };
  } else {
    // Cas simple : un seul dataset
    const labels = data.map((row: any) => row[config.xField]);
    const values = data.map((row: any) => row[config.yField]);
    chartData = {
      labels,
      datasets: [
        {
          label: config.yField,
          data: values,
          backgroundColor: config.color || "#6366f1",
          datalabels: config.showValues
            ? {
                color: config.labelColor || "#222",
                font: { size: config.labelFontSize || 12 },
                formatter: (value: number, ctx: any) => {
                  if (config.labelFormat) {
                    const label = ctx.chart.data.labels[ctx.dataIndex];
                    return config.labelFormat
                      .replace("{label}", label)
                      .replace("{value}", value);
                  }
                  return value;
                },
              }
            : undefined,
        },
      ],
    };
  }
  // Helpers pour valider les valeurs autorisées
  const allowedLegendPositions = ["top", "left", "right", "bottom"] as const;
  const legendPosition: "top" | "left" | "right" | "bottom" =
    allowedLegendPositions.includes(config.legendPosition)
      ? config.legendPosition
      : "top";
  const allowedTitleAlign = ["start", "center", "end"] as const;
  const titleAlign: "start" | "center" | "end" = allowedTitleAlign.includes(
    config.titleAlign
  )
    ? config.titleAlign
    : "center";

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: config.legend !== false,
        position: legendPosition,
      },
      title: config.title
        ? {
            display: true,
            text: config.title,
            position: "top" as "top", // typage littéral strict
            align: titleAlign,
          }
        : undefined,
      tooltip: {
        enabled: true,
        callbacks: config.tooltipFormat
          ? {
              label: function (context: any) {
                const label = context.label;
                const value = context.parsed.y;
                return config.tooltipFormat
                  .replace("{label}", label)
                  .replace("{value}", value);
              },
            }
          : undefined,
      },
    },
    indexAxis: config.horizontal ? "y" : ("x" as "x" | "y"),
    scales: {
      x: {
        grid: { display: config.showGrid !== false },
        title: config.xLabel
          ? { display: true, text: config.xLabel }
          : undefined,
      },
      y: {
        grid: { display: config.showGrid !== false },
        stacked: !!config.stacked,
        title: config.yLabel
          ? { display: true, text: config.yLabel }
          : undefined,
      },
    },
    barThickness: config.barThickness || undefined,
    borderRadius: config.borderRadius || 0,
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded w-full h-full flex items-center justify-center">
      <Bar
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
