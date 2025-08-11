import { useMemo } from "react";
import { processMultiBucketData } from "@utils/bucketMetrics/multiBucketProcessor";
import type { ProcessedBucketItem, SupportedConfig } from "@type/metricBucketTypes";


/**
 * Hook pour traiter les données avec le système multi-bucket
 */
export function useMultiBucketProcessor(
    data: Record<string, unknown>[],
    config: SupportedConfig
): ProcessedBucketItem[] | null {
    return useMemo(() => {
        // Vérifier si on utilise le nouveau système multi-bucket
        const hasMultiBuckets = Array.isArray(config.buckets) && config.buckets.length > 0;

        if (!hasMultiBuckets || !Array.isArray(data) || data.length === 0) {
            return null;
        }

        try {
            return processMultiBucketData(data, config);
        } catch (error) {
            console.error("Erreur lors du traitement multi-bucket:", error);
            return null;
        }
    }, [data, config]);
}
