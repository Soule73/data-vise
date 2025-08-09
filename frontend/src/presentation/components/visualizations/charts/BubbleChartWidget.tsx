import { Bubble } from "react-chartjs-2";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "@components/widgets/InvalideConfigWidget";
import NoDataWidget from "@components/widgets/NoDataWidget";
import { useBubbleChartLogic } from "@hooks/visualizations/charts/optimized";
import type { BubbleChartWidgetProps } from "@type/widget-types";

export default function BubbleChartWidget({
  data,
  config,
  // @ts-expect-error : Unused variable in edit mode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  editMode,
}: BubbleChartWidgetProps) {
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
    <div className="shadow bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-hidden">
      <Bubble
        className="max-w-full max-h-full p-1 md:p-2"
        data={chartData}
        options={options}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
