import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export interface PieChartConfig {
  valueField: string;
  nameField: string;
  colorScheme?: string;
}

export default function PieChartWidget({
  data,
  config,
}: {
  data: any[];
  config: any;
}) {
  if (!data || !config.valueField || !config.nameField) {
    return (
      <div className="text-xs text-gray-500">
        Sélectionnez les champs pour afficher le graphique.
      </div>
    );
  }
  // Agréger les données par nameField
  const aggregated: Record<string, number> = {};
  data.forEach((row: any) => {
    const name = row[config.nameField];
    const value = Number(row[config.valueField]) || 0;
    if (name in aggregated) {
      aggregated[name] += value;
    } else {
      aggregated[name] = value;
    }
  });
  const labels = Object.keys(aggregated);
  const values = Object.values(aggregated);
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
  const backgroundColor = defaultColors;
  // Helper pour valider la position de la légende
  const allowedLegendPositions = ["top", "left", "right", "bottom"] as const;
  const legendPosition: "top" | "left" | "right" | "bottom" =
    allowedLegendPositions.includes(config.legendPosition)
      ? config.legendPosition
      : "top";
  // Helper pour valider l'alignement du titre
  const allowedTitleAlign = ["start", "center", "end"] as const;
  const titleAlign: "start" | "center" | "end" = allowedTitleAlign.includes(
    config.titleAlign
  )
    ? config.titleAlign
    : "center";

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColor,
        cutout: config.cutout || undefined,
        borderWidth: config.borderWidth || 1,
        // Couleur des labels sur le graphique (si showValues)
        datalabels: config.showValues
          ? {
              color: config.labelColor || "#222",
              font: { size: config.labelFontSize || 12 },
              formatter: (value: number, ctx: any) => {
                if (config.labelFormat) {
                  // Format custom, ex: "{label}: {value} ({percent}%)"
                  const label = ctx.chart.data.labels[ctx.dataIndex];
                  const percent = (
                    (value / values.reduce((a, b) => a + b, 0)) *
                    100
                  ).toFixed(1);
                  return config.labelFormat
                    .replace("{label}", label)
                    .replace("{value}", value)
                    .replace("{percent}", percent);
                }
                return value;
              },
            }
          : undefined,
      },
    ],
  };
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
                const value = context.parsed;
                const percent = (
                  (value / values.reduce((a, b) => a + b, 0)) *
                  100
                ).toFixed(1);
                return config.tooltipFormat
                  .replace("{label}", label)
                  .replace("{value}", String(value))
                  .replace("{percent}", percent);
              },
            }
          : undefined,
      },
      // datalabels plugin (si installé)
    },
  };
  return (
    <div
      className="bg-white dark:bg-gray-900 rounded w-full h-full flex items-center justify-center
    
    "
    >
      <Pie
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
