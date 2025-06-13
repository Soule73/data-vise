import { useLineChartLogic } from "@/core/hooks/visualizations/useLineChartVM";
import { PresentationChartLineIcon } from "@heroicons/react/24/outline";
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
import InvalideConfigWidget from "./InvalideConfigWidget";
import NoDataWidget from "./NoDataWidget";

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
      <InvalideConfigWidget />
    )
  }

  if (data.length === 0) {
    return (
      <NoDataWidget
        icon={<PresentationChartLineIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />}
      />
    )
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
};

