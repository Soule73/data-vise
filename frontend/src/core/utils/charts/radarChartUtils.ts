/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RadarMetricConfig } from "@type/metricBucketTypes";
import type { Filter } from "@type/visualization";
import { applyAllFilters } from "@utils/filterUtils";

/**
 * Utilitaires spécialisés pour les graphiques radar
 */

/**
 * Génère un label formaté pour une métrique radar
 */
export function generateRadarMetricLabel(metric: RadarMetricConfig): string {
    if (metric.label && metric.label.trim()) {
        return metric.label;
    }

    // Générer automatiquement le label basé sur l'agrégation et les champs
    const fieldsStr = metric.fields && metric.fields.length > 0
        ? metric.fields.join(', ')
        : 'champs';

    return `${metric.agg}(${fieldsStr})`;
}

/**
 * Extrait les labels (axes) du radar à partir des métriques
 * Utilise l'union de tous les champs de tous les datasets
 */
export function getRadarLabels(metrics: RadarMetricConfig[]): string[] {
    if (!metrics.length) {
        return [];
    }

    // Créer l'union de tous les champs de tous les datasets
    const allFields = new Set<string>();

    metrics.forEach((metric) => {
        (metric.fields || []).forEach(field => {
            const stringField = typeof field === 'string' ? field : String(field);
            allFields.add(stringField);
        });
    });

    return Array.from(allFields);
}/**
 * Calcule la valeur agrégée pour un champ spécifique
 */
export function calculateRadarFieldValue(
    data: Record<string, any>[],
    field: string,
    aggregation: string
): number {
    if (!data.length) return 0;

    switch (aggregation) {
        case 'sum':
            return data.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);

        case 'avg': {
            const sum = data.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
            return sum / data.length;
        }

        case 'count':
            return data.filter(row =>
                row[field] !== null &&
                row[field] !== undefined
            ).length;

        case 'min':
            return Math.min(...data.map(row => Number(row[field]) || 0));

        case 'max':
            return Math.max(...data.map(row => Number(row[field]) || 0));

        default:
            return data.length;
    }
}

/**
 * Calcule toutes les valeurs pour les axes d'une métrique radar
 * S'assure que les valeurs correspondent à tous les labels (axes) du radar
 */
export function calculateRadarMetricValues(
    data: Record<string, any>[],
    metric: RadarMetricConfig,
    allLabels: string[]
): number[] {
    // Calculer les valeurs pour chaque label du radar
    const values = allLabels.map((label) => {
        // Vérifier si ce dataset a des données pour ce label
        const hasField = (metric.fields || []).includes(label);

        if (!hasField) {
            return 0; // Valeur par défaut si ce dataset n'a pas ce champ
        }

        return calculateRadarFieldValue(data, label, metric.agg);
    });

    return values;
}/**
 * Traite toutes les métriques radar et retourne les datasets avec filtres appliqués
 */
export function processRadarMetrics(
    data: Record<string, any>[],
    metrics: RadarMetricConfig[],
    globalFilters?: Filter[]
): Array<{
    metric: RadarMetricConfig;
    values: number[];
    index: number;
}> {
    // Obtenir tous les labels (union des champs)
    const allLabels = getRadarLabels(metrics);

    return metrics.map((metric, index) => {
        // Appliquer les filtres globaux et les filtres spécifiques au dataset
        const filteredData = applyAllFilters(data, globalFilters, metric.datasetFilters);

        return {
            metric,
            values: calculateRadarMetricValues(filteredData, metric, allLabels),
            index
        };
    });
}

/**
 * Valide la configuration d'une métrique radar
 */
export function validateRadarMetric(metric: RadarMetricConfig): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!metric.fields || metric.fields.length === 0) {
        errors.push("Au moins un champ doit être sélectionné pour les axes");
    }

    if (!metric.agg) {
        errors.push("Une agrégation doit être spécifiée");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valide la configuration complète du radar chart
 */
export function validateRadarConfiguration(metrics: RadarMetricConfig[]): {
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
        const validation = validateRadarMetric(metric);
        if (!validation.isValid) {
            errors.push(`Dataset ${index + 1}: ${validation.errors.join(', ')}`);
        }
    });

    // Vérifier la cohérence des champs entre datasets
    const firstFields = metrics[0].fields || [];
    const hasInconsistentFields = metrics.some(metric => {
        const fields = metric.fields || [];
        return fields.length !== firstFields.length ||
            !fields.every(field => firstFields.includes(field));
    });

    if (hasInconsistentFields) {
        warnings.push("Les datasets ont des champs différents, cela peut créer un radar déséquilibré");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
