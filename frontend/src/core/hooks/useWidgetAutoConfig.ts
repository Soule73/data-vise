import { useEffect } from 'react';
import type { UseWidgetAutoConfigProps } from '@type/widgetTypes';
import type { MultiBucketConfig } from '@type/metricBucketTypes';
import { createDefaultWidgetConfig, optimizeWidgetConfig } from '@utils/widgets/widgetConfigDefaults';

// Fonction pour s'assurer que nous avons des buckets multiples
function ensureMultiBuckets(config: { buckets?: MultiBucketConfig[] }): MultiBucketConfig[] {
    return config.buckets || [];
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
            }
        }
    };
}
