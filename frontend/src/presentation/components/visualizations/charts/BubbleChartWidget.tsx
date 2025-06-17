import { Bubble } from "react-chartjs-2";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "./InvalideConfigWidget";
import NoDataWidget from "./NoDataWidget";
import { useBubbleChartLogic } from "@/core/hooks/visualizations/useBubbleChartVM";
import type { BubbleChartConfig } from "@/core/types/visualization";

export default function BubbleChartWidget({
  data,
  config,
  //@ts-ignore
  editMode,
}: {
  data: Record<string, any>[];
  config: BubbleChartConfig;
  editMode?: boolean;
}) {
  const { chartData, options, validDatasets } = useBubbleChartLogic(
    data,
    config
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
    <div className="bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Bubble
        className="w-full max-w-full h-auto p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
