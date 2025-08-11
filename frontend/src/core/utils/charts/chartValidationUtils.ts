/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChartData, ChartOptions } from "chart.js";
import type { ChartType, ChartValidationContext, ValidationResult } from "@type/widgetTypes";



/**
 * Valide les données d'entrée pour un graphique
 */
export function validateChartInput(context: ChartValidationContext): ValidationResult {
    const { chartType, data, metrics, buckets } = context;
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation des données de base
    if (!Array.isArray(data) || data.length === 0) {
        errors.push("Aucune donnée fournie");
    }

    // Validation du type de graphique
    const validChartTypes: ChartType[] = ['bar', 'line', 'pie', 'scatter', 'bubble', 'radar'];
    if (!validChartTypes.includes(chartType)) {
        errors.push(`Type de graphique invalide: ${chartType}`);
    }

    // Validation des métriques
    if (!metrics || metrics.length === 0) {
        errors.push("Aucune métrique définie");
    } else {
        metrics.forEach((metric, index) => {
            if (!metric.field) {
                errors.push(`Métrique ${index + 1}: champ manquant`);
            }
            if (!metric.agg) {
                errors.push(`Métrique ${index + 1}: agrégation manquante`);
            }
        });
    }

    // Validation des buckets pour les graphiques multi-séries
    if (chartType !== 'pie' && chartType !== 'radar') {
        if (!buckets || buckets.length === 0) {
            warnings.push("Aucun bucket défini - les données seront agrégées");
        }
    }

    // Validation spécifique pour pie chart
    if (chartType === 'pie') {
        if (metrics && metrics.length > 1) {
            warnings.push("Les graphiques pie supportent une seule métrique");
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Valide les données finales du graphique avant rendu
 */
export function validateFinalChartData(
    chartData: ChartData<any>,
    options: ChartOptions<any>
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation des labels
    if (!chartData.labels || chartData.labels.length === 0) {
        errors.push("Aucun label défini");
    }

    // Validation des datasets
    if (!chartData.datasets || chartData.datasets.length === 0) {
        errors.push("Aucun dataset défini");
    } else {
        chartData.datasets.forEach((dataset, index) => {
            if (!dataset.data || dataset.data.length === 0) {
                warnings.push(`Dataset ${index + 1}: aucune donnée`);
            }
            if (dataset.data && chartData.labels && dataset.data.length !== chartData.labels.length) {
                errors.push(`Dataset ${index + 1}: nombre de données incompatible avec les labels`);
            }
        });
    }

    // Validation des options
    if (!options) {
        warnings.push("Aucune option de graphique définie");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Nettoie et normalise les données avant traitement
 */
export function sanitizeChartData(data: Record<string, any>[]): Record<string, any>[] {
    return data
        .filter(row => row !== null && row !== undefined)
        .map(row => {
            const cleanRow: Record<string, any> = {};

            Object.keys(row).forEach(key => {
                const value = row[key];

                // Nettoyer les valeurs numériques
                if (typeof value === 'string' && !isNaN(Number(value))) {
                    cleanRow[key] = Number(value);
                } else if (typeof value === 'number' && isFinite(value)) {
                    cleanRow[key] = value;
                } else if (value !== null && value !== undefined) {
                    cleanRow[key] = value;
                }
            });

            return cleanRow;
        });
}

/**
 * Applique des corrections automatiques aux configurations invalides
 */
export function autoFixChartConfig(context: ChartValidationContext): ChartValidationContext {
    const fixed = { ...context };

    // Auto-fix pour pie chart avec plusieurs métriques
    if (fixed.chartType === 'pie' && fixed.metrics && fixed.metrics.length > 1) {
        fixed.metrics = [fixed.metrics[0]]; // Garder seulement la première métrique
    }

    // Auto-fix pour les données vides
    if (!fixed.data || fixed.data.length === 0) {
        fixed.data = [];
    }

    // Auto-fix pour les métriques manquantes
    if (!fixed.metrics || fixed.metrics.length === 0) {
        // Essayer de créer une métrique par défaut basée sur les données
        const sampleRow = fixed.data[0];
        if (sampleRow) {
            const numericField = Object.keys(sampleRow).find(key =>
                typeof sampleRow[key] === 'number'
            );
            if (numericField) {
                fixed.metrics = [{
                    field: numericField,
                    agg: 'sum' as const,
                    label: numericField
                }];
            }
        }
    }

    return fixed;
}

/**
 * Calcule des statistiques sur les données du graphique
 */
export function calculateChartStats(chartData: ChartData<any>) {
    const stats = {
        totalDatasets: chartData.datasets?.length || 0,
        totalLabels: chartData.labels?.length || 0,
        totalDataPoints: 0,
        hasEmptyDatasets: false,
        maxValue: -Infinity,
        minValue: Infinity,
    };

    if (chartData.datasets) {
        chartData.datasets.forEach(dataset => {
            if (dataset.data) {
                stats.totalDataPoints += dataset.data.length;

                if (dataset.data.length === 0) {
                    stats.hasEmptyDatasets = true;
                }

                dataset.data.forEach((value: any) => {
                    if (typeof value === 'number') {
                        stats.maxValue = Math.max(stats.maxValue, value);
                        stats.minValue = Math.min(stats.minValue, value);
                    }
                });
            }
        });
    }

    return stats;
}
