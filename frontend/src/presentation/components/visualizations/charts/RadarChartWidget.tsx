import { Radar } from "react-chartjs-2";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "@components/widgets/InvalideConfigWidget";
import NoDataWidget from "@components/widgets/NoDataWidget";
import { useRadarChartLogic } from "@hooks/visualizations/charts";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import type { RadarChartWidgetProps } from "@type/widgetTypes";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);


export default function RadarChartWidget({
  data,
  config,
}: RadarChartWidgetProps) {
  const { chartData, options, validDatasets } = useRadarChartLogic(
    {
      data,
      config
    }
  );
  if (
    !data ||
    !config.metrics ||
    !Array.isArray(config.metrics) ||
    validDatasets.length === 0
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
      <Radar
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
