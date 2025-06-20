import { useScatterChartLogic } from "@/core/hooks/visualizations/useScatterChartVM";
import {
  Chart as ChartJS,
  ScatterController,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "./InvalideConfigWidget";
import NoDataWidget from "./NoDataWidget";
import type { ScatterChartConfig } from "@/core/types/visualization";

ChartJS.register(
  ScatterController,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function ScatterChartWidget({
  data,
  config,
  //@ts-ignore
  editMode,
}: {
  data: Record<string, any>[];
  config: ScatterChartConfig;
  editMode?: boolean;
}) {
  if (
    !data ||
    !config.metrics ||
    !Array.isArray(config.metrics) ||
    data.length === 0
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
  const { chartData, options } = useScatterChartLogic(data, config);
  return (
    <div className="shadow bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Scatter
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
