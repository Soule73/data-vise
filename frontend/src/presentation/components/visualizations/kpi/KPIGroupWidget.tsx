import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "../charts/InvalideConfigWidget";
import NoDataWidget from "../charts/NoDataWidget";
import KPIWidget from "./KPIWidget";
import { useKPIGroupVM } from "@/core/hooks/visualizations/useKPIGroupVM";
import { useEffect, useState } from "react";
import type { KPIGroupWidgetConfig } from "@/core/types/visualization";
import type { MetricConfig } from "@/core/types/metric-bucket-types";

export default function KPIGroupWidget({
  data,
  config,
}: {
  data: Record<string, any>[];
  config: KPIGroupWidgetConfig;
}) {
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

  const { metrics, metricStyles, filters, columns, widgetParamsList } =
    useKPIGroupVM(config);

  const [gridColumns, setGridColumns] = useState(1);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setGridColumns(1);
      } else {
        setGridColumns(columns);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  return (
    <div
      className="grid gap-4 w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      }}
    >
      {metrics.map((metric: MetricConfig, idx: number) => (
        <KPIWidget
          key={idx}
          data={data}
          config={{
            metrics: [metric],
            metricStyles: [metricStyles[idx] || {}],
            filters: filters[idx] ? [filters[idx]] : undefined,
            widgetParams: widgetParamsList[idx],
            bucket: config.bucket,
          }}
        />
      ))}
    </div>
  );
}
