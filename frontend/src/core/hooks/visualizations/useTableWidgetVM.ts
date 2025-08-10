/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useMultiBucketProcessor as useMultiBucketProcessorUtils } from "@utils/multiBucketProcessor";
import { applyAllFilters } from "@utils/filterUtils";
import {
  detectTableConfigType,
  processMultiBucketData,
  processLegacyBucketData,
  processCustomColumnsData,
  processRawData,
  generateTableTitle,
  type TableConfig,
} from "@utils/tableDataUtils";

export function useTableWidgetLogic(data: any[], config: TableConfig) {
  // Application des filtres globaux en premier
  const filteredData = useMemo(() => {
    if (config.globalFilters && config.globalFilters.length > 0) {
      return applyAllFilters(data, config.globalFilters, []);
    }
    return data;
  }, [data, config.globalFilters]);

  // Process data with multi-bucket system using the utils function
  const processedData = useMultiBucketProcessorUtils(filteredData, config);

  // Détection du type de configuration
  const configType = detectTableConfigType(config);
  const { hasMetrics, hasMultiBuckets, hasLegacyBucket } = configType;

  // Traitement des données selon le type de configuration
  const { columns, displayData } = useMemo(() => {
    const safeData = Array.isArray(filteredData) ? filteredData : [];

    // PRIORITÉ 1: Système multi-buckets moderne
    if (hasMultiBuckets && processedData) {
      return processMultiBucketData(processedData, config, hasMetrics);
    }

    // PRIORITÉ 2: Système legacy single bucket (rétro-compatibilité)
    if (hasLegacyBucket && hasMetrics) {
      return processLegacyBucketData(safeData, config);
    }

    // PRIORITÉ 3: Configuration colonnes personnalisées
    if (Array.isArray(config.columns) && config.columns.length > 0) {
      return processCustomColumnsData(safeData, config);
    }

    // PRIORITÉ 4: Données brutes (aucun groupement configuré)
    return processRawData(safeData);
  }, [hasMetrics, hasLegacyBucket, hasMultiBuckets, config, filteredData, processedData]);

  // Génération du titre
  const tableTitle = useMemo(() =>
    generateTableTitle(config, configType),
    [config, configType]
  );

  return { columns, displayData, tableTitle };
}
