/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatLabelsForDisplay } from "@utils/charts/chartDataUtils";
import type { ProcessedData } from "@type/metricBucketTypes";
import type { TableColumn, TableConfig, TableDataResult } from "@type/widgetTypes";


/**
 * Détecte le type de configuration de tableau
 */
export function detectTableConfigType(config: TableConfig) {
    const hasMetrics = Array.isArray(config.metrics) && config.metrics.length > 0;
    const hasMultiBuckets = Array.isArray(config.buckets) && config.buckets.length > 0;
    const hasColumns = Array.isArray(config.columns) && config.columns.length > 0;

    return {
        hasMetrics,
        hasMultiBuckets,
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

    const { hasMetrics, hasMultiBuckets } = configType;

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
        // Cas 2: Configuration colonne directe
        (Array.isArray(config.columns) && config.columns.length > 0) ||
        // Cas 3: Données brutes (toujours valide si on a des données)
        true
    );
}
