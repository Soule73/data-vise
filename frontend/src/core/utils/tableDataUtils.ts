/* eslint-disable @typescript-eslint/no-explicit-any */
import { aggregate } from "@utils/chartUtils";
import { formatLabelsForDisplay } from "@utils/chartDataUtils";
import type { ProcessedData } from "@type/metric-bucket-types";

/**
 * Types pour les configurations de tableau
 */
export interface TableColumn {
    key: string;
    label: string;
}

export interface TableConfig {
    metrics?: any[];
    bucket?: any;
    buckets?: any[];
    columns?: any[];
    groupBy?: string;
    widgetParams?: any;
}

export interface TableDataResult {
    columns: TableColumn[];
    displayData: any[];
}

/**
 * Détecte le type de configuration de tableau
 */
export function detectTableConfigType(config: TableConfig) {
    const hasMetrics = Array.isArray(config.metrics) && config.metrics.length > 0;
    const hasMultiBuckets = Array.isArray(config.buckets) && config.buckets.length > 0;
    const hasLegacyBucket = config.bucket && config.bucket.field;
    const hasColumns = Array.isArray(config.columns) && config.columns.length > 0;

    return {
        hasMetrics,
        hasMultiBuckets,
        hasLegacyBucket,
        hasColumns,
    };
}

/**
 * Crée les colonnes pour les buckets
 */
export function createBucketColumns(buckets: any[]): TableColumn[] {
    return buckets.map((bucket: any) => ({
        key: bucket.field,
        label: bucket.label || bucket.field,
    }));
}

/**
 * Crée les colonnes pour les métriques
 */
export function createMetricColumns(metrics: any[]): TableColumn[] {
    return metrics.map((metric: any) => ({
        key: metric.field,
        label: metric.label || metric.field,
    }));
}

/**
 * Crée les colonnes automatiquement depuis les données
 */
export function createAutoColumns(data: any[]): TableColumn[] {
    if (!data || data.length === 0) return [];

    const firstRow = data[0];
    const keys = Object.keys(firstRow);

    return keys.map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
    }));
}

/**
 * Formate les labels spécifiquement pour l'affichage dans les tableaux
 * Utilise l'utilitaire de formatage de date existant
 */
export function formatTableLabels(labels: string[]): string[] {
    return formatLabelsForDisplay(labels);
}

/**
 * Formate une valeur individuelle pour l'affichage dans le tableau
 * Particulièrement utile pour les dates dans les cellules
 */
export function formatTableCellValue(value: any): any {
    if (typeof value === 'string') {
        // Essayer de formater comme une date si c'est un format de date reconnu
        const formatted = formatLabelsForDisplay([value]);
        return formatted[0];
    }
    return value;
}

/**
 * Traite les données multi-buckets
 */
export function processMultiBucketData(
    processedData: ProcessedData,
    config: TableConfig,
    hasMetrics: boolean
): TableDataResult {
    const groupedData = processedData.groupedData || [];
    const rawLabels = processedData.labels || [];

    if (groupedData.length === 0 || rawLabels.length === 0) {
        return { columns: [], displayData: [] };
    }

    // Formater les labels pour un meilleur affichage (dates, etc.)
    const formattedLabels = formatTableLabels(rawLabels);

    // Créer les colonnes
    const bucketColumns = createBucketColumns(config.buckets || []);
    const metricColumns = hasMetrics ? createMetricColumns(config.metrics || []) : [];
    const countColumn = !hasMetrics ? [{ key: '_doc_count', label: 'Nombre' }] : [];

    const columns = [...bucketColumns, ...metricColumns, ...countColumn];

    // Créer les données d'affichage
    const displayData = formattedLabels.map((label: string, index: number) => {
        const row: any = {};

        // Ajouter la valeur du bucket principal avec le label formaté
        const primaryBucketField = config.buckets![0].field;
        row[primaryBucketField] = label;

        // Ajouter les valeurs de métriques si présentes
        if (hasMetrics && config.metrics) {
            const groupData = groupedData[index];
            config.metrics.forEach((metric: any) => {
                row[metric.field] = groupData?.[metric.field] ?? 0;
            });
        }

        // Ajouter le count si pas de métriques
        if (!hasMetrics) {
            const groupData = groupedData[index];
            row['_doc_count'] = groupData?._doc_count ?? 0;
        }

        return row;
    });

    return { columns, displayData };
}

/**
 * Traite les données avec bucket legacy
 */
export function processLegacyBucketData(
    data: any[],
    config: TableConfig
): TableDataResult {
    if (!config.bucket || !config.metrics) {
        return { columns: [], displayData: [] };
    }

    const bucketLabel = config.bucket.label || config.bucket.field;

    const columns = [
        { key: config.bucket.field, label: bucketLabel },
        ...createMetricColumns(config.metrics),
    ];

    // Grouper les données par bucket
    const groups: Record<string, any[]> = {};
    data.forEach((row: any) => {
        const key = String(row[config.bucket.field]);
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
    });

    // Agréger les métriques
    const rawDisplayData = Object.entries(groups).map(([bucketVal, rows]) => {
        const summary: any = { [config.bucket.field]: bucketVal };
        config.metrics!.forEach((metric: any) => {
            summary[metric.field] = aggregate(rows, metric.agg, metric.field);
        });
        return summary;
    });

    // Formater les labels des buckets si ce sont des dates
    const bucketValues = rawDisplayData.map(row => row[config.bucket.field]);
    const formattedBucketValues = formatTableLabels(bucketValues);
    
    const displayData = rawDisplayData.map((row, index) => ({
        ...row,
        [config.bucket.field]: formattedBucketValues[index]
    }));

    return { columns, displayData };
}

/**
 * Traite les données avec colonnes personnalisées
 */
export function processCustomColumnsData(
    data: any[],
    config: TableConfig
): TableDataResult {
    if (!config.columns) {
        return { columns: [], displayData: [] };
    }

    const columns = config.columns.map((col: any) => ({
        key: col.key,
        label: col.label || col.key,
    }));

    let displayData: any[] = [];

    if (config.groupBy && typeof config.groupBy === "string") {
        // Grouper par un champ spécifique
        displayData = processGroupByData(data, config.groupBy, columns);
    } else {
        // Données brutes
        displayData = data;
    }

    return { columns, displayData };
}

/**
 * Traite les données avec groupBy
 */
function processGroupByData(
    data: any[],
    groupKey: string,
    columns: TableColumn[]
): any[] {
    const groups: Record<string, any[]> = {};

    data.forEach((row: any) => {
        const key = String(row[groupKey]);
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
    });

    const rawData = Object.entries(groups).map(([groupVal, rows]) => {
        const summary: any = { [groupKey]: groupVal, count: rows.length };

        columns.forEach((col: any) => {
            if (col.key !== groupKey) {
                const nums = rows
                    .map((r: any) => Number(r[col.key]))
                    .filter((v: number) => !isNaN(v));

                if (nums.length === rows.length && nums.length > 0) {
                    summary[col.key] = nums.reduce((a: number, b: number) => a + b, 0);
                } else {
                    summary[col.key] = rows[0][col.key] ?? "";
                }
            }
        });

        return summary;
    });

    // Formater les labels du groupKey si ce sont des dates
    const groupValues = rawData.map(row => row[groupKey]);
    const formattedGroupValues = formatTableLabels(groupValues);
    
    return rawData.map((row, index) => ({
        ...row,
        [groupKey]: formattedGroupValues[index]
    }));
}

/**
 * Traite les données brutes (sans configuration spécifique)
 */
export function processRawData(data: any[]): TableDataResult {
    if (!data || data.length === 0) {
        return { columns: [], displayData: [] };
    }

    const columns = createAutoColumns(data);
    
    // Formater les valeurs des cellules (notamment les dates)
    const displayData = data.map(row => {
        const formattedRow: any = {};
        Object.keys(row).forEach(key => {
            formattedRow[key] = formatTableCellValue(row[key]);
        });
        return formattedRow;
    });
    
    return { columns, displayData };
}

/**
 * Génère le titre du tableau selon la configuration
 */
export function generateTableTitle(config: TableConfig, configType: ReturnType<typeof detectTableConfigType>): string {
    // Titre personnalisé prioritaire
    if (config.widgetParams?.title) {
        return config.widgetParams.title;
    }

    const { hasMetrics, hasMultiBuckets, hasLegacyBucket } = configType;

    // Multi-buckets
    if (hasMultiBuckets && config.buckets) {
        const bucketLabels = config.buckets
            .map((bucket: any) => bucket.label || bucket.field)
            .join(", ");

        if (hasMetrics) {
            return `Tableau groupé par ${bucketLabels}`;
        } else {
            return `Décompte par ${bucketLabels}`;
        }
    }

    // Legacy bucket
    if (hasLegacyBucket && hasMetrics && config.bucket) {
        const bucketLabel = config.bucket.label || config.bucket.field;
        return `Tableau groupé par ${bucketLabel}`;
    }

    // Group by
    if (config.groupBy) {
        return `Tableau groupé par ${config.groupBy}`;
    }

    // Cas génériques
    if (hasMetrics) {
        return "Tableau des métriques";
    }

    return "Tableau des données";
}

/**
 * Valide la configuration d'un widget tableau
 */
export function validateTableConfig(config: TableConfig, data: any[]): boolean {
    if (!data || data.length === 0) return false;

    return (
        // Cas 1: Multi-buckets avec ou sans métriques
        (Array.isArray(config.buckets) && config.buckets.length > 0) ||
        // Cas 2: Legacy bucket avec métriques
        (config.bucket && config.bucket.field && Array.isArray(config.metrics) && config.metrics.length > 0) ||
        // Cas 3: Configuration colonne directe
        (Array.isArray(config.columns) && config.columns.length > 0) ||
        // Cas 4: Données brutes (toujours valide si on a des données)
        true
    );
}
