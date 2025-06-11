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
import { useBarChartLogic } from "./useBarChartLogic";

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
  const { chartData, options } = useBarChartLogic(data, config);

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
