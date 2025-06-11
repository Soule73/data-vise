import { useLineChartLogic } from "@/core/hooks/visualizations/useLineChartVM";
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
  const { chartData, options, showNativeValues, valueLabelsPlugin } =
    useLineChartLogic(data, config);
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
