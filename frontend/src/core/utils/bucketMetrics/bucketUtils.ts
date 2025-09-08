import type { MultiBucketConfig, BucketType } from '@type/metricBucketTypes';

export const BUCKET_TYPES: Array<{ value: BucketType; label: string; description: string }> = [
    {
        value: 'terms',
        label: 'Termes',
        description: 'Grouper par valeurs de champ (catégories)'
    },
    {
        value: 'histogram',
        label: 'Histogramme',
        description: 'Grouper par intervalles numériques'
    },
    {
        value: 'date_histogram',
        label: 'Histogramme de dates',
        description: 'Grouper par intervalles de temps'
    },
    {
        value: 'range',
        label: 'Plages',
        description: 'Grouper par plages personnalisées'
    },
    {
        value: 'split_series',
        label: 'Diviser en séries',
        description: 'Créer une série par valeur'
    },
    {
        value: 'split_rows',
        label: 'Diviser en lignes',
        description: 'Créer une ligne par valeur'
    },
    {
        value: 'split_chart',
        label: 'Diviser en graphiques',
        description: 'Créer un graphique séparé par valeur'
    }
];

export const DATE_INTERVALS = [
    { value: 'minute', label: 'Minute' },
    { value: 'hour', label: 'Heure' },
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' }
];

export const SORT_ORDERS = [
    { value: 'asc', label: 'Croissant' },
    { value: 'desc', label: 'Décroissant' }
];

/**
 * Crée un bucket par défaut selon le type
 */
export function createDefaultBucket(type: BucketType, field?: string): MultiBucketConfig {
    const base: Partial<MultiBucketConfig> = {
        field: field || '',
        label: '',
        type,
        order: 'desc',
        size: 10,
        minDocCount: 1
    };

    switch (type) {
        case 'histogram':
            return {
                ...base,
                interval: 1
            } as MultiBucketConfig;

        case 'date_histogram':
            return {
                ...base,
                dateInterval: 'day'
            } as MultiBucketConfig;

        case 'range':
            return {
                ...base,
                ranges: [
                    { from: 0, to: 100, label: 'Plage 1' }
                ]
            } as MultiBucketConfig;

        case 'split_series':
            return {
                ...base,
                splitType: 'series',
                size: 5
            } as MultiBucketConfig;

        case 'split_rows':
            return {
                ...base,
                splitType: 'rows',
                size: 5
            } as MultiBucketConfig;

        case 'split_chart':
            return {
                ...base,
                splitType: 'chart',
                size: 4
            } as MultiBucketConfig;

        case 'terms':
        default:
            return base as MultiBucketConfig;
    }
}

/**
 * Valide si un bucket est valide
 */
export function validateBucket(bucket: MultiBucketConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!bucket.field) {
        errors.push('Le champ est requis');
    }

    if (bucket.type === 'histogram' && (!bucket.interval || bucket.interval <= 0)) {
        errors.push('L\'intervalle doit être supérieur à 0');
    }

    if (bucket.type === 'date_histogram' && !bucket.dateInterval) {
        errors.push('L\'intervalle de date est requis');
    }

    if (bucket.type === 'range' && (!bucket.ranges || bucket.ranges.length === 0)) {
        errors.push('Au moins une plage est requise');
    }

    if (bucket.size && bucket.size <= 0) {
        errors.push('La taille doit être supérieure à 0');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Génère un label automatique pour un bucket
 */
export function generateBucketLabel(bucket: MultiBucketConfig): string {
    if (bucket.label) {
        return bucket.label;
    }

    const bucketType = BUCKET_TYPES.find(t => t.value === bucket.type);
    const typeName = bucketType?.label || bucket.type;

    return `${typeName}${bucket.field ? ` · ${bucket.field}` : ''}`;
}

/**
 * Détermine si un bucket nécessite un champ numérique
 */
export function requiresNumericField(bucketType: BucketType): boolean {
    return ['histogram', 'range'].includes(bucketType);
}

/**
 * Détermine si un bucket nécessite un champ de date
 */
export function requiresDateField(bucketType: BucketType): boolean {
    return bucketType === 'date_histogram';
}

/**
 * Filtre les colonnes selon le type de bucket
 */
export function getAvailableColumns(columns: string[], bucketType: BucketType, data?: Record<string, unknown>[]): string[] {
    if (!data || data.length === 0) {
        return columns;
    }

    const sampleRow = data[0];

    return columns.filter(col => {
        const value = sampleRow[col];

        switch (bucketType) {
            case 'histogram':
            case 'range':
                return typeof value === 'number';

            case 'date_histogram':
                return value instanceof Date ||
                    typeof value === 'string' && !isNaN(Date.parse(value));

            default:
                return true;
        }
    });
}

/**
 * Clone un bucket avec de nouvelles propriétés
 */
export function cloneBucket(bucket: MultiBucketConfig, overrides: Partial<MultiBucketConfig> = {}): MultiBucketConfig {
    return {
        ...bucket,
        ...overrides,
        ranges: bucket.ranges ? [...bucket.ranges] : undefined
    };
}
