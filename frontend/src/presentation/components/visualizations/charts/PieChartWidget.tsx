import "@/core/chartjs-register";
import { usePieChartLogic } from "@/core/hooks/visualizations/optimized";
import { Pie } from "react-chartjs-2";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import { InvalideConfigWidget } from "./InvalideConfigWidget";
import NoDataWidget from "./NoDataWidget";
import type { PieChartConfig } from "@/core/types/visualization";

export default function PieChartWidget({
  data,
  config,
  // @ts-expect-error : Unused variable in edit mode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  editMode,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  config: PieChartConfig;
  editMode?: boolean;
}) {
  const { chartData, options, showNativeValues, valueLabelsPlugin } =
    usePieChartLogic(data, config);

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

  return (
    <div className="shadow bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Pie
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        plugins={showNativeValues ? [valueLabelsPlugin] : []}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
