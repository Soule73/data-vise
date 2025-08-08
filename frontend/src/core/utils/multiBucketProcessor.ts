/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MultiBucketConfig, BucketConfig } from '@/core/types/metric-bucket-types';
import { ensureMultiBuckets } from '@/core/utils/bucketMigration';

/**
 * Interface pour les configurations de widget avec support des buckets multiples
 */
export interface MultiBucketCompatibleConfig {
    bucket?: BucketConfig;
    buckets?: MultiBucketConfig[];
    [key: string]: any;
}

/**
 * Processeur de données pour les buckets multiples
 */
export class MultiBucketDataProcessor {
    private data: Record<string, any>[];
    private buckets: MultiBucketConfig[];

    constructor(data: Record<string, any>[], config: MultiBucketCompatibleConfig) {
        this.data = data;
        this.buckets = ensureMultiBuckets(config);
    }

    /**
     * Traite les données selon la configuration des buckets
     */
    processData(): ProcessedData {
        if (this.buckets.length === 0) {
            return {
                groupedData: this.data,
                labels: ['Total'],
                bucketHierarchy: [],
                splitData: { series: [], rows: [], charts: [] }
            };
        }

        // Traiter chaque bucket en séquence
        let processedData = this.data;
        const hierarchy: BucketLevel[] = [];
        const splitData: SplitData = { series: [], rows: [], charts: [] };

        for (let i = 0; i < this.buckets.length; i++) {
            const bucket = this.buckets[i];
            const level = this.processBucketLevel(processedData, bucket, i);
            hierarchy.push(level);

            // Gérer les buckets de type split
            if (bucket.type?.startsWith('split_')) {
                this.handleSplitBucket(bucket, level, splitData);
            }

            processedData = level.data;
        }

        const labels = this.generateLabels(hierarchy);

        return {
            groupedData: processedData,
            labels,
            bucketHierarchy: hierarchy,
            splitData
        };
    }

    /**
     * Traite un niveau de bucket spécifique
     */
    private processBucketLevel(
        data: Record<string, any>[],
        bucket: MultiBucketConfig,
        level: number
    ): BucketLevel {
        switch (bucket.type) {
            case 'terms':
                return this.processTermsBucket(data, bucket, level);
            case 'histogram':
                return this.processHistogramBucket(data, bucket, level);
            case 'date_histogram':
                return this.processDateHistogramBucket(data, bucket, level);
            case 'range':
                return this.processRangeBucket(data, bucket, level);
            case 'split_series':
            case 'split_rows':
            case 'split_chart':
                return this.processSplitBucket(data, bucket, level);
            default:
                return this.processTermsBucket(data, bucket, level);
        }
    }

    /**
     * Traite un bucket de type 'terms'
     */
    private processTermsBucket(
        data: Record<string, any>[],
        bucket: MultiBucketConfig,
        level: number
    ): BucketLevel {
        const grouped = new Map<string, Record<string, any>[]>();

        data.forEach(row => {
            const value = String(row[bucket.field] || '');
            if (!grouped.has(value)) {
                grouped.set(value, []);
            }
            grouped.get(value)!.push(row);
        });

        // Trier et limiter selon la configuration
        const sortedEntries = Array.from(grouped.entries())
            .filter(([, rows]) => rows.length >= (bucket.minDocCount || 1))
            .sort((a, b) => {
                const order = bucket.order === 'asc' ? 1 : -1;
                return order * (a[1].length - b[1].length);
            })
            .slice(0, bucket.size || 10);

        const bucketData = sortedEntries.map(([key, rows]) => ({
            key,
            doc_count: rows.length,
            data: rows
        }));

        return {
            bucket,
            level,
            buckets: bucketData,
            data: data // Les données complètes pour le niveau suivant
        };
    }

    /**
     * Traite un bucket de type 'histogram'
     */
    private processHistogramBucket(
        data: Record<string, any>[],
        bucket: MultiBucketConfig,
        level: number
    ): BucketLevel {
        const interval = bucket.interval || 1;
        const grouped = new Map<number, Record<string, any>[]>();

        data.forEach(row => {
            const value = Number(row[bucket.field] || 0);
            const bucketKey = Math.floor(value / interval) * interval;

            if (!grouped.has(bucketKey)) {
                grouped.set(bucketKey, []);
            }
            grouped.get(bucketKey)!.push(row);
        });

        const sortedEntries = Array.from(grouped.entries())
            .filter(([, rows]) => rows.length >= (bucket.minDocCount || 1))
            .sort((a, b) => a[0] - b[0])
            .slice(0, bucket.size || 50);

        const bucketData = sortedEntries.map(([key, rows]) => ({
            key: `${key}-${key + interval}`,
            doc_count: rows.length,
            data: rows
        }));

        return {
            bucket,
            level,
            buckets: bucketData,
            data: data
        };
    }

    /**
     * Traite un bucket de type 'date_histogram'
     */
    private processDateHistogramBucket(
        data: Record<string, any>[],
        bucket: MultiBucketConfig,
        level: number
    ): BucketLevel {
        // Implémentation simplifiée pour date_histogram
        const grouped = new Map<string, Record<string, any>[]>();

        data.forEach(row => {
            const dateValue = new Date(row[bucket.field]);
            let bucketKey: string;

            // Grouper selon l'intervalle de date
            switch (bucket.dateInterval) {
                case 'year':
                    bucketKey = dateValue.getFullYear().toString();
                    break;
                case 'month':
                    bucketKey = `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'day':
                default:
                    bucketKey = dateValue.toISOString().split('T')[0];
                    break;
            }

            if (!grouped.has(bucketKey)) {
                grouped.set(bucketKey, []);
            }
            grouped.get(bucketKey)!.push(row);
        });

        const sortedEntries = Array.from(grouped.entries())
            .filter(([, rows]) => rows.length >= (bucket.minDocCount || 1))
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(0, bucket.size || 100);

        const bucketData = sortedEntries.map(([key, rows]) => ({
            key,
            doc_count: rows.length,
            data: rows
        }));

        return {
            bucket,
            level,
            buckets: bucketData,
            data: data
        };
    }

    /**
     * Traite un bucket de type 'range'
     */
    private processRangeBucket(
        data: Record<string, any>[],
        bucket: MultiBucketConfig,
        level: number
    ): BucketLevel {
        const ranges = bucket.ranges || [];
        const bucketData = ranges.map(range => {
            const filteredData = data.filter(row => {
                const value = Number(row[bucket.field] || 0);
                const inRange = (range.from === undefined || value >= range.from) &&
                    (range.to === undefined || value < range.to);
                return inRange;
            });

            return {
                key: range.label || `${range.from}-${range.to}`,
                doc_count: filteredData.length,
                data: filteredData
            };
        }).filter(bucketItem => bucketItem.doc_count >= (bucket.minDocCount || 1));

        return {
            bucket,
            level,
            buckets: bucketData,
            data: data
        };
    }

    /**
     * Traite un bucket de type split
     */
    private processSplitBucket(
        data: Record<string, any>[],
        bucket: MultiBucketConfig,
        level: number
    ): BucketLevel {
        // Traiter comme un bucket terms pour le regroupement
        const termsBucket = this.processTermsBucket(data, bucket, level);

        // Le type split sera géré dans handleSplitBucket
        return termsBucket;
    }

    /**
     * Gère les buckets de type split pour séparer les données en séries/lignes/graphiques
     */
    private handleSplitBucket(
        bucket: MultiBucketConfig,
        level: BucketLevel,
        splitData: SplitData
    ): void {
        const splitType = bucket.splitType || bucket.type?.replace('split_', '') as 'series' | 'rows' | 'chart';

        level.buckets.forEach(bucketItem => {
            const splitItem: SplitItem = {
                key: bucketItem.key,
                data: bucketItem.data,
                bucket: bucket
            };

            switch (splitType) {
                case 'series':
                    splitData.series.push(splitItem);
                    break;
                case 'rows':
                    splitData.rows.push(splitItem);
                    break;
                case 'chart':
                    splitData.charts.push(splitItem);
                    break;
            }
        });
    }

    /**
     * Génère les labels finaux à partir de la hiérarchie des buckets
     */
    private generateLabels(hierarchy: BucketLevel[]): string[] {
        if (hierarchy.length === 0) {
            return ['Total'];
        }

        // Pour l'instant, utiliser les labels du premier niveau
        // TODO: Implémenter une logique plus sophistiquée pour les buckets imbriqués
        const firstLevel = hierarchy[0];
        return firstLevel.buckets.map(bucket => bucket.key);
    }
}

/**
 * Types de données pour les buckets multiples
 */
export interface ProcessedData {
    groupedData: Record<string, any>[];
    labels: string[];
    bucketHierarchy: BucketLevel[];
    splitData: SplitData;
}

export interface BucketLevel {
    bucket: MultiBucketConfig;
    level: number;
    buckets: BucketItem[];
    data: Record<string, any>[];
}

export interface BucketItem {
    key: string;
    doc_count: number;
    data: Record<string, any>[];
}

export interface SplitData {
    series: SplitItem[];
    rows: SplitItem[];
    charts: SplitItem[];
}

export interface SplitItem {
    key: string;
    data: Record<string, any>[];
    bucket: MultiBucketConfig;
}

/**
 * Fonction utilitaire pour traiter les données avec des buckets multiples
 */
export function processMultiBucketData(
    data: Record<string, any>[],
    config: MultiBucketCompatibleConfig
): Array<{
    key: string | Record<string, string>;
    metrics: Array<{
        value: number;
        field: string;
        agg: string;
    }>;
    count: number;
}> {
    const processor = new MultiBucketDataProcessor(data, config);
    const processed = processor.processData();

    // Convertir les données groupées en format attendu
    const result: Array<{
        key: string | Record<string, string>;
        metrics: Array<{
            value: number;
            field: string;
            agg: string;
        }>;
        count: number;
    }> = [];

    // Extraire les métriques de la configuration
    const metrics = config.metrics || [];

    // Traiter les données groupées
    if (processed.groupedData && Array.isArray(processed.groupedData)) {
        // Pour les données déjà groupées
        processed.groupedData.forEach((group: any) => {
            const item = {
                key: group.key || 'Unknown',
                metrics: metrics.map((metric: any) => ({
                    value: group[metric.field] || 0,
                    field: metric.field,
                    agg: metric.agg
                })),
                count: group.count || 0
            };
            result.push(item);
        });
    }

    return result;
}

/**
 * Hook pour utiliser le processeur de buckets multiples
 */
export function useMultiBucketProcessor(
    data: Record<string, any>[],
    config: MultiBucketCompatibleConfig
): ProcessedData {
    const processor = new MultiBucketDataProcessor(data, config);
    return processor.processData();
}
