import { useCallback, useMemo } from 'react';
import { createDefaultBucket } from '@utils/bucketMetrics/bucketUtils';
import type { MultiBucketConfig, UseMultiBucketsProps } from '@type/metricBucketTypes';

// Fonction pour s'assurer que nous avons des buckets multiples
function ensureMultiBuckets(config: { buckets?: MultiBucketConfig[] }): MultiBucketConfig[] {
    return config.buckets || [];
}


export function useMultiBuckets({
    config,
    columns,
    allowMultiple = true,
    onConfigChange,
}: UseMultiBucketsProps) {
    // Assurer que nous avons toujours des buckets multiples
    const currentBuckets = useMemo(() => {
        return ensureMultiBuckets(config);
    }, [config]);

    // Gérer les changements de buckets
    const handleBucketsChange = useCallback((newBuckets: MultiBucketConfig[]) => {
        // Mettre à jour les buckets multiples
        onConfigChange('buckets', newBuckets);
    }, [onConfigChange]);

    // Ajouter un nouveau bucket
    const addBucket = useCallback(() => {
        const newBucket = createDefaultBucket('terms', columns[0] || '');
        const newBuckets = [...currentBuckets, newBucket];
        handleBucketsChange(newBuckets);
    }, [currentBuckets, columns, handleBucketsChange]);

    // Supprimer un bucket
    const removeBucket = useCallback((index: number) => {
        const newBuckets = currentBuckets.filter((_, i) => i !== index);
        handleBucketsChange(newBuckets);
    }, [currentBuckets, handleBucketsChange]);

    // Mettre à jour un bucket
    const updateBucket = useCallback((index: number, updatedBucket: MultiBucketConfig) => {
        const newBuckets = [...currentBuckets];
        newBuckets[index] = updatedBucket;
        handleBucketsChange(newBuckets);
    }, [currentBuckets, handleBucketsChange]);

    // Déplacer un bucket
    const moveBucket = useCallback((fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= currentBuckets.length) return;

        const newBuckets = [...currentBuckets];
        const [movedBucket] = newBuckets.splice(fromIndex, 1);
        newBuckets.splice(toIndex, 0, movedBucket);
        handleBucketsChange(newBuckets);
    }, [currentBuckets, handleBucketsChange]);

    // Initialiser avec un bucket par défaut si vide
    const initializeIfEmpty = useCallback(() => {
        if (currentBuckets.length === 0 && columns.length > 0) {
            const defaultBucket = createDefaultBucket('terms', columns[0]);
            handleBucketsChange([defaultBucket]);
        }
    }, [currentBuckets.length, columns, handleBucketsChange]);

    return {
        buckets: currentBuckets,
        handleBucketsChange,
        addBucket,
        removeBucket,
        updateBucket,
        moveBucket,
        initializeIfEmpty,
        canAddMore: allowMultiple || currentBuckets.length === 0,
        isEmpty: currentBuckets.length === 0,
    };
}
