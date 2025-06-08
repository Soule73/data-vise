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

export default function LineChartWidget({
  data,
  config,
}: {
  data: any[];
  config: LineChartConfig;
}) {
  if (!data || !config.xField || !config.yField) {
    return (
      <div className="text-xs text-gray-500">
        Sélectionnez les champs pour afficher le graphique.
      </div>
    );
  }
  // Agréger les données par xField
  const aggregated: Record<string, number> = {};
  data.forEach((row: any) => {
    const x = row[config.xField];
    const y = Number(row[config.yField]) || 0;
    if (x in aggregated) {
      aggregated[x] += y;
    } else {
      aggregated[x] = y;
    }
  });
  const labels = Object.keys(aggregated);
  const values = Object.values(aggregated);
  // Helpers pour valider les valeurs autorisées
  const allowedLegendPositions = ["top", "left", "right", "bottom"] as const;
  const legendPosition = allowedLegendPositions.includes(
    config.legendPosition as any
  )
    ? (config.legendPosition as (typeof allowedLegendPositions)[number])
    : "top";
  const allowedTitleAlign = ["start", "center", "end"] as const;
  const titleAlign = allowedTitleAlign.includes(config.titleAlign as any)
    ? (config.titleAlign as (typeof allowedTitleAlign)[number])
    : "center";

  const chartData = {
    labels,
    datasets: [
      {
        label: config.yField,
        data: values,
        borderColor: config.color || "#6366f1",
        backgroundColor: (config.color || "#6366f1") + "33",
        tension: config.tension || 0.3,
        fill: !!config.fill,
        pointRadius: config.showPoints === false ? 0 : 3,
        borderWidth: config.borderWidth || 2,
        datalabels: config.showValues
          ? {
              color: config.labelColor || "#222",
              font: { size: config.labelFontSize || 12 },
              formatter: (value: number, ctx: any) => {
                if (config.labelFormat) {
                  const label = ctx.chart.data.labels[ctx.dataIndex];
                  return config.labelFormat
                    .replace("{label}", label)
                    .replace("{value}", String(value));
                }
                return String(value);
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
            position: "top" as "top",
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
                return (config.tooltipFormat || "{label}: {value}")
                  .replace("{label}", label)
                  .replace("{value}", String(value));
              },
            }
          : undefined,
      },
    },
    elements: {
      point: { radius: config.showPoints === false ? 0 : 3 },
      line: {
        borderWidth: config.borderWidth || 2,
        tension: config.tension || 0,
        fill: !!config.fill,
      },
    },
    scales: {
      x: {
        grid: { display: config.showGrid !== false },
        title: config.xLabel
          ? { display: true, text: config.xLabel }
          : undefined,
      },
      y: {
        grid: { display: config.showGrid !== false },
        title: config.yLabel
          ? { display: true, text: config.yLabel }
          : undefined,
      },
    },
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded w-full h-full flex items-center justify-center">
      <Line
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
