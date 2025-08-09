import { useMemo } from "react";
import { processMultiBucketData } from "@utils/multiBucketProcessor";
import type {
    BarChartConfig,
    LineChartConfig,
    PieChartConfig
} from "@type/visualization";

export interface ProcessedBucketItem {
    key: string | Record<string, string>;
    metrics: Array<{
        value: number;
        field: string;
        agg: string;
    }>;
    count: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupportedConfig = BarChartConfig | LineChartConfig | PieChartConfig | any;

export interface ProcessedBucketItem {
    key: string | Record<string, string>;
    metrics: Array<{
        value: number;
        field: string;
        agg: string;
    }>;
    count: number;
}

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
