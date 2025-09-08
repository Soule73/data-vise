/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScatterMetricConfig } from "@type/metricBucketTypes";
import type { Filter } from "@type/visualization";
import { applyAllFilters } from "@utils/filterUtils";

/**
 * Utilitaires spécialisés pour les graphiques scatter
 */

/**
 * Génère un label formaté pour une métrique scatter
 */
export function generateScatterMetricLabel(metric: ScatterMetricConfig): string {
    if (metric.label && metric.label.trim()) {
        return metric.label;
    }

    // Générer automatiquement le label basé sur les champs x, y
    const parts = [];
    if (metric.x) parts.push(`X: ${metric.x}`);
    if (metric.y) parts.push(`Y: ${metric.y}`);

    return parts.length > 0 ? parts.join(', ') : 'Scatter Dataset';
}

/**
 * Valide la configuration d'une métrique scatter
 */
export function validateScatterMetric(metric: ScatterMetricConfig): {
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

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valide la configuration complète du scatter chart
 */
export function validateScatterConfiguration(metrics: ScatterMetricConfig[]): {
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
        const validation = validateScatterMetric(metric);
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
 * Convertit les données pour le format scatter de Chart.js
 */
export function convertToScatterData(
    data: Record<string, any>[],
    metric: ScatterMetricConfig
): Array<{ x: number; y: number }> {
    if (!data.length || !metric.x || !metric.y) {
        return [];
    }

    return data.map(row => {
        const x = Number(row[metric.x!]) || 0;
        const y = Number(row[metric.y!]) || 0;

        return { x, y };
    }).filter(point =>
        // Filtrer les points avec des valeurs invalides
        !isNaN(point.x) && !isNaN(point.y)
    );
}

/**
 * Traite toutes les métriques scatter et retourne les datasets avec filtres appliqués
 */
export function processScatterMetrics(
    data: Record<string, any>[],
    metrics: ScatterMetricConfig[],
    globalFilters?: Filter[]
): Array<{
    metric: ScatterMetricConfig;
    scatterData: Array<{ x: number; y: number }>;
    index: number;
}> {
    return metrics.map((metric, index) => {
        // Appliquer les filtres globaux et les filtres spécifiques au dataset
        const filteredData = applyAllFilters(data, globalFilters, metric.datasetFilters);

        return {
            metric,
            scatterData: convertToScatterData(filteredData, metric),
            index
        };
    });
}

/**
 * Calcule les échelles optimales pour le scatter chart
 */
export function calculateScatterScales(
    data: Record<string, any>[],
    metrics: ScatterMetricConfig[]
): {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
} {
    if (!data.length || !metrics.length) {
        return { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };
    }

    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;

    metrics.forEach(metric => {
        const scatterData = convertToScatterData(data, metric);

        scatterData.forEach(point => {
            xMin = Math.min(xMin, point.x);
            xMax = Math.max(xMax, point.x);
            yMin = Math.min(yMin, point.y);
            yMax = Math.max(yMax, point.y);
        });
    });

    // Fallback si aucune donnée valide
    if (!isFinite(xMin)) xMin = 0;
    if (!isFinite(xMax)) xMax = 100;
    if (!isFinite(yMin)) yMin = 0;
    if (!isFinite(yMax)) yMax = 100;

    // Ajouter une marge de 10%
    const xMargin = (xMax - xMin) * 0.1;
    const yMargin = (yMax - yMin) * 0.1;

    return {
        xMin: xMin - xMargin,
        xMax: xMax + xMargin,
        yMin: yMin - yMargin,
        yMax: yMax + yMargin,
    };
}
