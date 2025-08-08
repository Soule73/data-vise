import { useEffect } from 'react';
import type { WidgetType } from '@/core/types/widget-types';
import type { MultiBucketConfig } from '@/core/types/metric-bucket-types';
import { createDefaultWidgetConfig, optimizeWidgetConfig } from '@/core/utils/widgetConfigDefaults';
import { ensureMultiBuckets } from '@/core/utils/bucketMigration';

interface UseWidgetAutoConfigProps {
    widgetType: WidgetType;
    columns: string[];
    data?: Record<string, unknown>[];
    currentConfig: {
        bucket?: { field: string; label?: string };
        buckets?: MultiBucketConfig[];
        metrics?: unknown[];
    };
    onConfigChange: (field: string, value: unknown) => void;
    autoInitialize?: boolean;
}

/**
 * Hook pour initialiser automatiquement la configuration d'un widget
 * avec des buckets et métriques par défaut intelligents
 */
export function useWidgetAutoConfig({
    widgetType,
    columns,
    data,
    currentConfig,
    onConfigChange,
    autoInitialize = true
}: UseWidgetAutoConfigProps) {

    useEffect(() => {
        if (!autoInitialize || columns.length === 0) {
            return;
        }

        // Vérifier si on a déjà des buckets configurés
        const existingBuckets = ensureMultiBuckets(currentConfig);
        const hasMetrics = currentConfig.metrics && currentConfig.metrics.length > 0;

        // Ne pas écraser une configuration existante
        if (existingBuckets.length > 0 && hasMetrics) {
            return;
        }

        // Créer une configuration par défaut
        const defaultConfig = createDefaultWidgetConfig(widgetType, columns, data);

        // Optimiser selon le type de widget
        const optimizedConfig = optimizeWidgetConfig(defaultConfig, widgetType);

        // Appliquer la configuration si elle n'existe pas déjà
        if (!hasMetrics && optimizedConfig.metrics.length > 0) {
            onConfigChange('metrics', optimizedConfig.metrics);
        }

        if (existingBuckets.length === 0 && optimizedConfig.buckets.length > 0) {
            onConfigChange('buckets', optimizedConfig.buckets);
            // Maintenir la compatibilité
            onConfigChange('bucket', optimizedConfig.bucket);
        }

    }, [widgetType, columns, data, autoInitialize, currentConfig, onConfigChange]);

    // Retourner des suggestions pour une configuration manuelle
    const suggestions = (() => {
        if (columns.length === 0) return null;

        const defaultConfig = createDefaultWidgetConfig(widgetType, columns, data);
        const optimizedConfig = optimizeWidgetConfig(defaultConfig, widgetType);

        return {
            suggestedMetrics: optimizedConfig.metrics,
            suggestedBuckets: optimizedConfig.buckets,
            isComplete: optimizedConfig.metrics.length > 0 &&
                (optimizedConfig.buckets.length > 0 || ['kpi', 'kpi_group'].includes(widgetType))
        };
    })();

    return {
        suggestions,
        canAutoComplete: suggestions?.isComplete || false,
        applyDefaultConfig: () => {
            if (suggestions) {
                onConfigChange('metrics', suggestions.suggestedMetrics);
                onConfigChange('buckets', suggestions.suggestedBuckets);
                if (suggestions.suggestedBuckets.length > 0) {
                    onConfigChange('bucket', {
                        field: suggestions.suggestedBuckets[0].field,
                        label: suggestions.suggestedBuckets[0].label
                    });
                }
            }
        }
    };
}
