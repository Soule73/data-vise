/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useMultiBucketProcessor as useMultiBucketProcessorUtils } from "@utils/multiBucketProcessor";
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
  // Process data with multi-bucket system using the utils function
  const processedData = useMultiBucketProcessorUtils(data, config);

  // Détection du type de configuration
  const configType = detectTableConfigType(config);
  const { hasMetrics, hasMultiBuckets, hasLegacyBucket } = configType;

  // Traitement des données selon le type de configuration
  const { columns, displayData } = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];

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
  }, [hasMetrics, hasLegacyBucket, hasMultiBuckets, config, data, processedData]);

  // Génération du titre
  const tableTitle = useMemo(() =>
    generateTableTitle(config, configType),
    [config, configType]
  );

  return { columns, displayData, tableTitle };
}
