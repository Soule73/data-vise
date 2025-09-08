/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BubbleMetricConfig } from "@type/metricBucketTypes";
import type { Filter } from "@type/visualization";
import { applyAllFilters } from "@utils/filterUtils";

/**
 * Utilitaires spécialisés pour les graphiques bubble
 */

/**
 * Génère un label formaté pour une métrique bubble
 */
export function generateBubbleMetricLabel(metric: BubbleMetricConfig): string {
    if (metric.label && metric.label.trim()) {
        return metric.label;
    }

    // Générer automatiquement le label basé sur les champs x, y, r
    const parts = [];
    if (metric.x) parts.push(`X: ${metric.x}`);
    if (metric.y) parts.push(`Y: ${metric.y}`);
    if (metric.r) parts.push(`R: ${metric.r}`);

    return parts.length > 0 ? parts.join(', ') : 'Bubble Dataset';
}

/**
 * Valide la configuration d'une métrique bubble
 */
export function validateBubbleMetric(metric: BubbleMetricConfig): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!metric.x || metric.x.trim() === '') {
        errors.push("Le champ X doit être spécifié");
    }

    if (!metric.y || metric.y.trim() === '') {
        errors.push("Le champ Y doit être spécifié");
    }

    if (!metric.r || metric.r.trim() === '') {
        errors.push("Le champ R (rayon) doit être spécifié");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valide la configuration complète du bubble chart
 */
export function validateBubbleConfiguration(metrics: BubbleMetricConfig[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!metrics.length) {
        errors.push("Au moins un dataset doit être configuré");
        return { isValid: false, errors, warnings };
    }

    // Valider chaque métrique
    metrics.forEach((metric, index) => {
        const validation = validateBubbleMetric(metric);
        if (!validation.isValid) {
            errors.push(`Dataset ${index + 1}: ${validation.errors.join(', ')}`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Convertit les données pour le format bubble de Chart.js
 */
export function convertToBubbleData(
    data: Record<string, any>[],
    metric: BubbleMetricConfig
): Array<{ x: number; y: number; r: number }> {
    if (!data.length || !metric.x || !metric.y || !metric.r) {
        return [];
    }

    return data.map(row => {
        const x = Number(row[metric.x!]) || 0;
        const y = Number(row[metric.y!]) || 0;
        const r = Number(row[metric.r!]) || 1; // Minimum radius of 1

        return { x, y, r };
    }).filter(point =>
        // Filtrer les points avec des valeurs invalides
        !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.r) && point.r > 0
    );
}

/**
 * Traite toutes les métriques bubble et retourne les datasets avec filtres appliqués
 */
export function processBubbleMetrics(
    data: Record<string, any>[],
    metrics: BubbleMetricConfig[],
    globalFilters?: Filter[]
): Array<{
    metric: BubbleMetricConfig;
    bubbleData: Array<{ x: number; y: number; r: number }>;
    index: number;
}> {
    return metrics.map((metric, index) => {
        // Appliquer les filtres globaux et les filtres spécifiques au dataset
        const filteredData = applyAllFilters(data, globalFilters, metric.datasetFilters);

        return {
            metric,
            bubbleData: convertToBubbleData(filteredData, metric),
            index
        };
    });
}

/**
 * Calcule les échelles optimales pour le bubble chart
 */
export function calculateBubbleScales(
    data: Record<string, any>[],
    metrics: BubbleMetricConfig[]
): {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    rMin: number;
    rMax: number;
} {
    if (!data.length || !metrics.length) {
        return { xMin: 0, xMax: 100, yMin: 0, yMax: 100, rMin: 1, rMax: 10 };
    }

    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let rMin = Infinity, rMax = -Infinity;

    metrics.forEach(metric => {
        const bubbleData = convertToBubbleData(data, metric);

        bubbleData.forEach(point => {
            xMin = Math.min(xMin, point.x);
            xMax = Math.max(xMax, point.x);
            yMin = Math.min(yMin, point.y);
            yMax = Math.max(yMax, point.y);
            rMin = Math.min(rMin, point.r);
            rMax = Math.max(rMax, point.r);
        });
    });

    // Fallback si aucune donnée valide
    if (!isFinite(xMin)) xMin = 0;
    if (!isFinite(xMax)) xMax = 100;
    if (!isFinite(yMin)) yMin = 0;
    if (!isFinite(yMax)) yMax = 100;
    if (!isFinite(rMin)) rMin = 1;
    if (!isFinite(rMax)) rMax = 10;

    // Ajouter une marge de 10%
    const xMargin = (xMax - xMin) * 0.1;
    const yMargin = (yMax - yMin) * 0.1;

    return {
        xMin: xMin - xMargin,
        xMax: xMax + xMargin,
        yMin: yMin - yMargin,
        yMax: yMax + yMargin,
        rMin,
        rMax
    };
}
