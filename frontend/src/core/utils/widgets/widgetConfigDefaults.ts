import type { DefaultWidgetConfig, WidgetType } from '@type/widgetTypes';
import type { MultiBucketConfig, Metric } from '@type/metricBucketTypes';
import { createDefaultBucket } from '@utils/bucketMetrics/bucketUtils';



/**
 * Crée une configuration par défaut pour un type de widget donné
 */
export function createDefaultWidgetConfig(
    widgetType: WidgetType,
    columns: string[],
    data?: Record<string, unknown>[]
): DefaultWidgetConfig {
    const numericColumns = getNumericColumns(columns, data);
    const dateColumns = getDateColumns(columns, data);
    const textColumns = getTextColumns(columns, data);

    // Métriques par défaut
    const defaultMetrics: Metric[] = [];

    // Ajouter une métrique numérique par défaut
    if (numericColumns.length > 0) {
        defaultMetrics.push({
            field: numericColumns[0],
            agg: getDefaultAggregation(widgetType),
            label: `${getDefaultAggregation(widgetType)}(${numericColumns[0]})`
        });
    }

    // Buckets par défaut selon le type de widget
    const defaultBuckets: MultiBucketConfig[] = [];

    switch (widgetType) {
        case 'bar':
        case 'line': {
            // Pour les graphiques à barres et linéaires, préférer une dimension temporelle ou catégorielle
            if (dateColumns.length > 0) {
                defaultBuckets.push(createDefaultBucket('date_histogram', dateColumns[0]));
            } else if (textColumns.length > 0) {
                defaultBuckets.push(createDefaultBucket('terms', textColumns[0]));
            }
            break;
        }

        case 'pie': {
            // Pour les graphiques en secteurs, utiliser une dimension catégorielle
            if (textColumns.length > 0) {
                const bucket = createDefaultBucket('terms', textColumns[0]);
                bucket.size = 5; // Limiter le nombre de secteurs
                defaultBuckets.push(bucket);
            }
            break;
        }

        case 'table': {
            // Pour les tables, on peut avoir plusieurs buckets
            if (textColumns.length > 0) {
                defaultBuckets.push(createDefaultBucket('terms', textColumns[0]));
            }
            if (textColumns.length > 1) {
                defaultBuckets.push(createDefaultBucket('terms', textColumns[1]));
            }
            break;
        }

        case 'scatter':
        case 'bubble': {
            // Pour les graphiques de dispersion, pas de buckets par défaut
            // Les axes X et Y sont gérés séparément
            break;
        }

        case 'kpi':
        case 'kpi_group': {
            // Les KPI n'utilisent généralement pas de buckets
            break;
        }

        default: {
            // Bucket générique par défaut
            if (columns.length > 0) {
                defaultBuckets.push(createDefaultBucket('terms', columns[0]));
            }
            break;
        }
    }

    // Bucket legacy pour compatibilité
    return {
        metrics: defaultMetrics,
        buckets: defaultBuckets,
    };
}

/**
 * Obtient l'agrégation par défaut pour un type de widget
 */
function getDefaultAggregation(widgetType: WidgetType): string {
    switch (widgetType) {
        case 'kpi':
            return 'sum';
        case 'bar':
        case 'line':
        case 'pie':
            return 'sum';
        case 'table':
            return 'count';
        default:
            return 'sum';
    }
}

/**
 * Détecte les colonnes numériques à partir des données
 */
function getNumericColumns(columns: string[], data?: Record<string, unknown>[]): string[] {
    if (!data || data.length === 0) {
        // Heuristique basée sur les noms de colonnes
        return columns.filter(col =>
            /^(count|sum|avg|total|amount|price|value|qty|quantity|number|num)$/i.test(col) ||
            /_(count|sum|avg|total|amount|price|value|qty|quantity|number|num)$/i.test(col)
        );
    }

    // Analyse des données réelles
    const sampleRow = data[0];
    return columns.filter(col => {
        const value = sampleRow[col];
        return typeof value === 'number' && !isNaN(value);
    });
}

/**
 * Détecte les colonnes de date à partir des données
 */
function getDateColumns(columns: string[], data?: Record<string, unknown>[]): string[] {
    if (!data || data.length === 0) {
        // Heuristique basée sur les noms de colonnes
        return columns.filter(col =>
            /^(date|time|created|updated|timestamp)$/i.test(col) ||
            /_at$/i.test(col) ||
            /date$/i.test(col)
        );
    }

    // Analyse des données réelles
    const sampleRow = data[0];
    return columns.filter(col => {
        const value = sampleRow[col];
        if (value instanceof Date) return true;
        if (typeof value === 'string') {
            // Tenter de parser comme date
            const parsed = Date.parse(value);
            return !isNaN(parsed);
        }
        return false;
    });
}

/**
 * Détecte les colonnes de texte (catégorielles) à partir des données
 */
function getTextColumns(columns: string[], data?: Record<string, unknown>[]): string[] {
    const numericColumns = getNumericColumns(columns, data);
    const dateColumns = getDateColumns(columns, data);

    // Exclure les colonnes numériques et de date
    return columns.filter(col =>
        !numericColumns.includes(col) && !dateColumns.includes(col)
    );
}

/**
 * Suggestions intelligentes de buckets basées sur les données
 */
export function suggestBuckets(
    columns: string[],
    data?: Record<string, unknown>[],
    currentBuckets: MultiBucketConfig[] = []
): MultiBucketConfig[] {
    const suggestions: MultiBucketConfig[] = [];
    const usedFields = new Set(currentBuckets.map(b => b.field));

    const numericColumns = getNumericColumns(columns, data).filter(col => !usedFields.has(col));
    const dateColumns = getDateColumns(columns, data).filter(col => !usedFields.has(col));
    const textColumns = getTextColumns(columns, data).filter(col => !usedFields.has(col));

    // Suggérer des buckets temporels
    dateColumns.forEach(col => {
        suggestions.push(createDefaultBucket('date_histogram', col));
    });

    // Suggérer des buckets catégoriels
    textColumns.slice(0, 3).forEach(col => { // Limiter à 3 suggestions
        suggestions.push(createDefaultBucket('terms', col));
    });

    // Suggérer des histogrammes pour les colonnes numériques
    numericColumns.slice(0, 2).forEach(col => { // Limiter à 2 suggestions
        suggestions.push(createDefaultBucket('histogram', col));
    });

    return suggestions;
}

/**
 * Valide et optimise une configuration de widget
 */
export function optimizeWidgetConfig(
    config: DefaultWidgetConfig,
    widgetType: WidgetType
): DefaultWidgetConfig {
    const optimized = { ...config };

    // Optimiser selon le type de widget
    switch (widgetType) {
        case 'pie': {
            // Pour les graphiques en secteurs, limiter à un seul bucket de type terms
            if (optimized.buckets.length > 1) {
                optimized.buckets = optimized.buckets
                    .filter(b => b.type === 'terms')
                    .slice(0, 1);
            }

            // Limiter la taille pour éviter trop de secteurs
            optimized.buckets.forEach(bucket => {
                if (bucket.size && bucket.size > 8) {
                    bucket.size = 8;
                }
            });
            break;
        }

        case 'table': {
            // Pour les tables, optimiser l'ordre des buckets
            optimized.buckets.sort((a, b) => {
                // Mettre les buckets temporels en premier
                if (a.type === 'date_histogram' && b.type !== 'date_histogram') return -1;
                if (b.type === 'date_histogram' && a.type !== 'date_histogram') return 1;

                // Puis les buckets catégoriels
                if (a.type === 'terms' && b.type !== 'terms') return -1;
                if (b.type === 'terms' && a.type !== 'terms') return 1;

                return 0;
            });
            break;
        }

        case 'kpi':
        case 'kpi_group': {
            // Les KPI ne devraient pas avoir de buckets
            optimized.buckets = [];
            break;
        }
    }

    return optimized;
}
