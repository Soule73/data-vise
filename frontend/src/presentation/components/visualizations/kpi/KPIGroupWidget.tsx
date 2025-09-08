import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "@components/widgets/InvalideConfigWidget";
import NoDataWidget from "@components/widgets/NoDataWidget";
import KPIWidget from "@components/visualizations/kpi/KPIWidget";
import { useKPIGroupVM } from "@hooks/visualizations/kpi/useKPIGroupVM";
import type { Metric } from "@type/metricBucketTypes";
import type { KPIGroupWidgetProps } from "@type/widgetTypes";

export default function KPIGroupWidget({
  data,
  config,
}: KPIGroupWidgetProps) {
  const { metrics, gridColumns, widgetParamsList } =
    useKPIGroupVM(config);

  if (
    !data ||
    !config.metrics ||
    !Array.isArray(config.metrics) ||
    !config.metrics[0]
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
    <div
      className="grid gap-4 w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      }}
    >
      {metrics.map((metric: Metric, idx: number) => (
        <KPIWidget
          key={idx}
          data={data}
          config={{
            metrics: [metric],
            globalFilters: config.globalFilters,
            widgetParams: widgetParamsList[idx],
            buckets: config.buckets,
          }}
        />
      ))}
    </div>
  );
}
