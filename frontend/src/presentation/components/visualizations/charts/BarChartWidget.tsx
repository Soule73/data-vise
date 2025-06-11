import { useBarChartLogic } from "@/core/hooks/visualizations/useBarChartVM";
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
