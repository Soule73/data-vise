import { useLineChartLogic } from "@hooks/visualizations/charts";
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
import InvalideConfigWidget from "@components/widgets/InvalideConfigWidget";
import NoDataWidget from "@components/widgets/NoDataWidget";
import type { LineChartWidgetProps } from "@type/widgetTypes";

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
}: LineChartWidgetProps) {
  const { chartData, options, showNativeValues, valueLabelsPlugin } =
    useLineChartLogic({ data, config });

  if (
    !data ||
    !config.metrics ||
    !config.buckets ||
    !Array.isArray(config.metrics) ||
    !config.buckets.length ||
    !config.buckets[0]?.field
  ) {
    return <InvalideConfigWidget />;
  }

  if (data.length === 0) {
    return (
      <NoDataWidget
        icon={
          <PresentationChartLineIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
        }
      />
    );
  }

  return (
    <div className=" bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Line
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        plugins={showNativeValues ? [valueLabelsPlugin] : []}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
