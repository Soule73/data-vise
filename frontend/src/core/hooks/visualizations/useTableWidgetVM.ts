import { useMemo } from "react";
import { useMultiBucketProcessor as useMultiBucketProcessorUtils } from "@utils/bucketMetrics/multiBucketProcessor";
import { applyAllFilters } from "@utils/filterUtils";
import {
  detectTableConfigType,
  processMultiBucketData,
  processRawData,
  generateTableTitle,
} from "@utils/kpi/tableDataUtils";
import type { TableWidgetProps, TableWidgetVM } from "@type/widgetTypes";

export function useTableWidgetLogic({
  data,
  config,
}: TableWidgetProps): TableWidgetVM {

  // Application des filtres globaux en premier
  const filteredData = useMemo(() => {
    if (config.globalFilters && config.globalFilters.length > 0) {
      return applyAllFilters(data, config.globalFilters, []);
    }
    return data;
  }, [data, config.globalFilters]);


  const processedData = useMultiBucketProcessorUtils(filteredData, config);

  // Détection du type de configuration
  const configType = detectTableConfigType(config);

  const { hasMetrics, hasMultiBuckets } = configType;

  const { columns, displayData } = useMemo(() => {

    const safeData = Array.isArray(filteredData) ? filteredData : [];

    if (hasMultiBuckets && processedData) {
      return processMultiBucketData(processedData, config, hasMetrics);
    }

    return processRawData(safeData);

  }, [hasMetrics, hasMultiBuckets, config, filteredData, processedData]);

  const tableTitle = useMemo(() =>
    generateTableTitle(config, configType),
    [config, configType]
  );

  return { columns, displayData, tableTitle };
}
