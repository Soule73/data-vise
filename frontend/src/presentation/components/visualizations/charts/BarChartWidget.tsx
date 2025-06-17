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
import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "./InvalideConfigWidget";
import NoDataWidget from "./NoDataWidget";
import type { BarChartConfig } from "@/core/types/visualization";

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
  //@ts-ignore
  editMode,
}: {
  data: Record<string, any>[];
  config: BarChartConfig;
  editMode?: boolean;
}) {
  if (
    !data ||
    !config.metrics ||
    !config.bucket ||
    !Array.isArray(config.metrics) ||
    !config.bucket.field
  ) {
    return <InvalideConfigWidget />;
  }

  if (data.length === 0) {
    return (
      <NoDataWidget
        icon={
          <ChartBarIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
        }
      />
    );
  }
  const { chartData, options } = useBarChartLogic(data, config);

  return (
    <div className="shadow bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Bar
        className="w-full max-w-full h-auto p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
