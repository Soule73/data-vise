import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "../charts/InvalideConfigWidget";
import NoDataWidget from "../charts/NoDataWidget";
import KPIWidget from "./KPIWidget";
import { useKPIGroupVM } from "@/core/hooks/visualizations/useKPIGroupVM";
import { useEffect, useState } from "react";

export default function KPIGroupWidget({
  data,
  config,
}: {
  data: any[];
  config: any;
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

  const {
    metrics,
    metricStyles,
    filters,
    columns,
    // groupTitle,
    widgetParamsList,
  } = useKPIGroupVM(config);

  // Responsive columns: 1 colonne sur mobile, columns à partir de sm
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
    // <div className="flex flex-col items-center justify-between h-full w-full">
    //   {/* <span className="text-xs mt-2 h-4">{groupTitle}</span> */}
    <div
      className="grid gap-4 w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      }}
    >
      {metrics.map((metric: any, idx: number) => (
        <KPIWidget
          key={idx}
          data={data}
          config={{
            metrics: [metric],
            metricStyles: [metricStyles[idx] || {}],
            filter: filters[idx] || undefined, // applique le filtre spécifique à chaque KPI
            widgetParams: widgetParamsList[idx],
          }}
        />
      ))}
    </div>
    // {/* </div> */}
  );
}
