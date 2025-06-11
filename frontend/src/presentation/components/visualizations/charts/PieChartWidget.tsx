import { usePieChartLogic } from "@/core/hooks/visualizations/usePieChartVM";
import { Pie } from "react-chartjs-2";

export default function PieChartWidget({
  data,
  config,
}: {
  data: any[];
  config: any;
  editMode?: boolean;
}) {
  const { chartData, options, showNativeValues, valueLabelsPlugin } =
    usePieChartLogic(data, config);

  return (
    <div className="bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-x-auto">
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
