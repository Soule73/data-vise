import { useBarChartLogic } from "@hooks/visualizations/charts";
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
import InvalideConfigWidget from "@components/widgets/InvalideConfigWidget";
import type { BarChartWidgetProps } from "@type/widgetTypes";
import NoDataWidget from "@components/widgets/NoDataWidget";

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
}: BarChartWidgetProps) {
  const { chartData, options } = useBarChartLogic({ data, config });

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
          <ChartBarIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
        }
      />
    );
  }

  return (
    <div className="shadow bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Bar
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
