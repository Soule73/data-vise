/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metric } from "@type/metric-bucket-types";
import { aggregate, getLabels } from "@utils/chartUtils";
import type { ProcessedDataContext } from "@type/widget-types";


/**
 * Obtient les labels pour le graphique
 */
export function getChartLabels(
    processedData: ProcessedDataContext,
    data: Record<string, any>[],
    bucketField?: string
): string[] {
    if (processedData.labels.length > 0) {
        return processedData.labels;
    }
    return getLabels(data, bucketField || '');
}

/**
 * Crée une fonction pour obtenir les valeurs d'une métrique
 */
export function createGetValuesFunction(
    processedData: ProcessedDataContext,
    data: Record<string, any>[]
) {
    return (metric: Metric): number[] => {
        if (processedData.bucketHierarchy.length === 0) {
            return [aggregate(data, metric.agg, metric.field)];
        }

        const firstLevel = processedData.bucketHierarchy[0];
        return firstLevel.buckets.map((bucket: any) => {
            return aggregate(bucket.data, metric.agg, metric.field);
        });
    };
}

/**
 * Valide et normalise les métriques
 */
export function validateMetrics(metrics?: Metric[]): Metric[] {
    if (!Array.isArray(metrics)) {
        return [];
    }

    return metrics.filter(metric =>
        metric &&
        typeof metric === 'object' &&
        metric.field &&
        metric.agg
    );
}

/**
 * Crée des labels par défaut si aucun n'est fourni
 */
export function createDefaultLabels(dataLength: number): string[] {
    return Array.from({ length: dataLength }, (_, i) => `Série ${i + 1}`);
}

/**
 * Formate une valeur selon le format spécifié
 */
export function formatValue(
    value: number,
    format: string,
    label?: string,
    total?: number
): string {
    let formatted = format;

    // Remplacements standards
    formatted = formatted.replace('{value}', value.toString());
    if (label) {
        formatted = formatted.replace('{label}', label);
    }

    // Calcul du pourcentage si total fourni
    if (total && total > 0) {
        const percentage = ((value / total) * 100).toFixed(1);
        formatted = formatted.replace('{percent}', percentage);
    }

    return formatted;
}

/**
 * Agrège toutes les valeurs d'un dataset pour calculer le total
 */
export function calculateDatasetTotal(data: number[]): number {
    return data.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
}

/**
 * Vérifie si les données sont valides pour la visualisation
 */
export function validateChartData(
    labels: string[],
    datasets: any[]
): boolean {
    return (
        Array.isArray(labels) &&
        labels.length > 0 &&
        Array.isArray(datasets) &&
        datasets.length > 0 &&
        datasets.every(dataset =>
            dataset &&
            Array.isArray(dataset.data) &&
            dataset.data.length === labels.length
        )
    );
}
