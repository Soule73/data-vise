import { usePieChartLogic } from "@/core/hooks/visualizations/usePieChartVM";
import { Pie } from "react-chartjs-2";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import { InvalideConfigWidget } from "./InvalideConfigWidget";
import NoDataWidget from "./NoDataWidget";

export default function PieChartWidget({
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
    return <InvalideConfigWidget />;
  }

  if (data.length === 0) {
    return (
      <NoDataWidget
        icon={
          <ChartPieIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
        }
      />
    );
  }
  const { chartData, options, showNativeValues, valueLabelsPlugin } =
    usePieChartLogic(data, config);

  return (
    <div className="bg-white shadow dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-x-auto">
      <Pie
        className="w-full max-w-full h-auto p-1 md:p-2"
        data={chartData}
        options={options}
        plugins={showNativeValues ? [valueLabelsPlugin] : []}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
