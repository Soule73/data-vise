import type { BucketConfig, MultiBucketConfig } from '@/core/types/metric-bucket-types';
import { createDefaultBucket } from './bucketUtils';

/**
 * Convertit un ancien bucket en nouveau bucket multiple
 */
export function migrateLegacyBucket(legacyBucket: BucketConfig): MultiBucketConfig {
    return {
        field: legacyBucket.field,
        label: legacyBucket.label,
        type: 'terms', // L'ancien système était équivalent à 'terms'
        order: 'desc',
        size: 10,
        minDocCount: 1
    };
}

/**
 * Convertit une liste de nouveaux buckets en ancien bucket (pour compatibilité)
 */
export function migrateToLegacyBucket(buckets: MultiBucketConfig[]): BucketConfig | undefined {
    if (buckets.length === 0) {
        return undefined;
    }

    // Prend le premier bucket de type 'terms' s'il existe
    const termsBucket = buckets.find(b => b.type === 'terms') || buckets[0];

    return {
        field: termsBucket.field,
        label: termsBucket.label,
        type: termsBucket.type
    };
}

/**
 * Assure que le config a des buckets multiples, en migrant depuis l'ancien système si nécessaire
 */
export function ensureMultiBuckets(config: {
    bucket?: BucketConfig;
    buckets?: MultiBucketConfig[];
}): MultiBucketConfig[] {
    // Si on a déjà des buckets multiples, les retourner
    if (config.buckets && config.buckets.length > 0) {
        return config.buckets;
    }

    // Si on a un ancien bucket, le migrer
    if (config.bucket && config.bucket.field) {
        return [migrateLegacyBucket(config.bucket)];
    }

    // Sinon, retourner un tableau vide
    return [];
}

/**
 * Initialise les buckets par défaut pour un type de widget
 */
export function initializeDefaultBuckets(
    widgetType: string,
    columns: string[]
): MultiBucketConfig[] {
    // Pour la plupart des widgets, on commence avec un bucket 'terms'
    if (columns.length === 0) {
        return [];
    }

    const defaultBucket = createDefaultBucket('terms', columns[0]);

    // Certains types de widgets peuvent avoir des configurations spéciales
    switch (widgetType) {
        case 'pie': {
            // Les graphiques en secteurs utilisent généralement un seul bucket de type 'terms'
            defaultBucket.size = 5; // Limiter le nombre de secteurs
            return [defaultBucket];
        }

        case 'histogram': {
            // Les histogrammes peuvent utiliser des buckets numériques
            const numericColumns = columns.filter(() => {
                // Ici on devrait idéalement vérifier le type des données
                return true; // Simplification pour l'instant
            });

            if (numericColumns.length > 0) {
                return [createDefaultBucket('histogram', numericColumns[0])];
            }
            return [defaultBucket];
        }

        case 'line':
        case 'bar':
            // Les graphiques linéaires et à barres peuvent bénéficier de buckets temporels
            return [defaultBucket];

        default:
            return [defaultBucket];
    }
}

/**
 * Valide que la configuration des buckets est compatible avec le type de widget
 */
export function validateBucketsForWidget(
    buckets: MultiBucketConfig[],
    widgetType: string
): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Vérifications générales
    if (buckets.length === 0) {
        warnings.push('Aucun bucket configuré');
    }

    // Vérifications spécifiques par type de widget
    switch (widgetType) {
        case 'pie':
            if (buckets.length > 1) {
                warnings.push('Les graphiques en secteurs ne supportent généralement qu\'un seul bucket');
            }
            if (buckets.some(b => b.type !== 'terms')) {
                warnings.push('Les graphiques en secteurs fonctionnent mieux avec des buckets de type "terms"');
            }
            break;

        case 'table':
            // Les tables peuvent gérer plusieurs buckets
            break;

        case 'kpi':
            if (buckets.length > 0) {
                warnings.push('Les widgets KPI n\'utilisent généralement pas de buckets');
            }
            break;
    }

    return {
        isValid: warnings.length === 0,
        warnings
    };
}
