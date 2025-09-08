/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metric } from "@type/metricBucketTypes";
import { aggregate, getLabels } from "@utils/charts/chartUtils";
import type { ProcessedDataContext } from "@type/widgetTypes";


/**
 * Obtient les labels pour le graphique
 */
export function getChartLabels(
    processedData: ProcessedDataContext,
    data: Record<string, any>[],
    bucketField?: string
): string[] {
    if (processedData.labels.length > 0) {
        // Utiliser les labels formatés du processeur si disponibles
        return processedData.labels;
    }

    // Fallback vers les labels bruts et les formater
    const rawLabels = getLabels(data, bucketField || '');
    return formatLabelsForDisplay(rawLabels);
}

/**
 * Formate les labels pour un meilleur affichage selon leur type
 */
export function formatLabelsForDisplay(labels: string[]): string[] {
    return labels.map(label => {
        // Détecter et formater les dates ISO avec timezone
        if (typeof label === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.test(label)) {
            const date = new Date(label);
            if (!isNaN(date.getTime())) {
                return formatDateLabel(date, detectDateInterval(labels));
            }
        }

        // Détecter et formater les dates simples (YYYY-MM-DD)
        if (typeof label === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(label)) {
            const date = new Date(label);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
        }

        // Détecter et formater les dates mois (YYYY-MM)
        if (typeof label === 'string' && /^\d{4}-\d{2}$/.test(label)) {
            const [year, month] = label.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        }

        // Détecter et formater les semaines (YYYY-WXX)
        if (typeof label === 'string' && /^\d{4}-W\d{1,2}$/.test(label)) {
            const match = label.match(/(\d{4})-W(\d{1,2})/);
            if (match) {
                return `Semaine ${match[2]}, ${match[1]}`;
            }
        }

        return label;
    });
}

/**
 * Détecte l'intervalle de temps basé sur les patterns des labels
 */
function detectDateInterval(labels: string[]): 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' {
    if (labels.length === 0) return 'day';

    const firstLabel = labels[0];

    // Détecter par pattern
    if (/^\d{4}$/.test(firstLabel)) return 'year';
    if (/^\d{4}-\d{2}$/.test(firstLabel)) return 'month';
    if (/^\d{4}-W\d{1,2}$/.test(firstLabel)) return 'week';
    if (/^\d{4}-\d{2}-\d{2}$/.test(firstLabel)) return 'day';
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:00:00/.test(firstLabel)) return 'hour';
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00/.test(firstLabel)) return 'minute';

    return 'day';
}

/**
 * Formate un label de date selon l'intervalle détecté
 */
function formatDateLabel(date: Date, interval: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute'): string {
    switch (interval) {
        case 'year':
            return date.getFullYear().toString();
        case 'month':
            return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        case 'day':
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        case 'hour':
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) + `, ${date.getHours()}h`;
        case 'minute':
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) + `, ${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`;
        default:
            return date.toLocaleDateString('fr-FR');
    }
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
