import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSourcesQuery, useDataBySourceQuery } from "@/data/repositories/datasources";
import type { DataSource } from "@type/dataSource";
import type { WidgetType, WidgetFormInitialValues, WidgetConfig, CommonWidgetFormState } from "@type/widgetTypes";
import {
    WIDGETS,
    WIDGET_DATA_CONFIG,
} from "@adapters/visualizations";
import { generateDefaultWidgetConfig, syncMetricStyles } from "@utils/widgets/widgetConfigUtils";
import { createDragDropHandlers } from "@utils/dragDropUtils";
import { reorderMetrics, updateMetricWithAutoLabel } from "@utils/bucketMetrics/metricUtils";
import { extractColumnsFromData, generateSourceOptions, isWidgetPreviewReady } from "@utils/datasource/dataSourceUtils";

export function useCommonWidgetForm(
    initialValues?: WidgetFormInitialValues
): CommonWidgetFormState {

    // Core state
    const [step, setStep] = useState(1);
    const [type, setType] = useState<WidgetType>(initialValues?.type || "bar");
    const [sourceId, setSourceId] = useState(initialValues?.sourceId || "");

    // Data state
    const [columns, setColumns] = useState<string[]>(initialValues?.columns || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [dataPreview, setDataPreview] = useState<any[]>(initialValues?.dataPreview || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [config, setConfig] = useState<any>(initialValues?.config || {});

    // UI state
    const [tab, setTab] = useState<"data" | "metricsAxes" | "params">("data");
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Widget properties
    const [title, setTitle] = useState(initialValues?.title || "");
    const [visibility, setVisibility] = useState<"public" | "private">(
        initialValues?.visibility || "private"
    );
    const [widgetTitle, setWidgetTitle] = useState(initialValues?.title || "");
    const [widgetTitleError, setWidgetTitleError] = useState("");

    // Synchronisation avec les initialValues (pour le mode édition)
    const hasInitialized = useRef(false);
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0 && !hasInitialized.current) {

            if (initialValues.type && initialValues.type !== type) {
                setType(initialValues.type);
            }
            if (initialValues.sourceId && initialValues.sourceId !== sourceId) {
                setSourceId(initialValues.sourceId);
            }
            if (initialValues.columns && initialValues.columns.length > 0) {
                setColumns(initialValues.columns);
            }
            if (initialValues.dataPreview && initialValues.dataPreview.length > 0) {
                setDataPreview(initialValues.dataPreview);
            }
            if (initialValues.config && Object.keys(initialValues.config).length > 0) {
                setConfig(initialValues.config);
            }
            if (initialValues.title && initialValues.title !== title) {
                setTitle(initialValues.title);
                setWidgetTitle(initialValues.title);
            }
            if (initialValues.visibility && initialValues.visibility !== visibility) {
                setVisibility(initialValues.visibility);
            }

            hasInitialized.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues?.type, initialValues?.sourceId, initialValues?.title, initialValues?.visibility]);

    // Error handling
    const [error, setError] = useState("");

    // Advanced state
    const [draggedMetric, setDraggedMetric] = useState<number | null>(null);

    // Data fetching
    const queryClient = useQueryClient();
    const { data: sources = [] } = useSourcesQuery({ queryClient });
    const src = sources?.find((s: DataSource) => s._id === sourceId);
    const { refetch } = useDataBySourceQuery(src?._id);

    // Computed values
    const WidgetComponent = WIDGETS[type]?.component;

    // Auto config setup when columns change - VERSION SIMPLIFIÉE
    const widgetConfig = WIDGET_DATA_CONFIG[type];
    useEffect(() => {
        // NE PAS exécuter si l'auto-config est désactivée (mode édition)
        if (initialValues?.disableAutoConfig) {
            return;
        }

        if (columns.length > 0 && widgetConfig) {
            // Génération de métriques par défaut si aucune n'existe
            if (!config.metrics || config.metrics.length === 0) {
                const newConfig = generateDefaultWidgetConfig(type, columns);
                setConfig(newConfig);
            }

            // Génération de buckets par défaut si autorisé et inexistant
            if (widgetConfig.buckets?.allow && (!config.buckets || config.buckets.length === 0)) {
                setConfig((prevConfig: WidgetConfig) => ({
                    ...prevConfig,
                    buckets: [{
                        field: columns[1] || columns[0],
                        label: columns[1] || columns[0],
                        type: 'terms',
                        order: 'desc',
                        size: 10,
                        minDocCount: 1
                    }]
                }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, columns.length, widgetConfig, initialValues?.disableAutoConfig]);

    // --- Drag & drop métriques ---
    const { handleDragStart, handleDragOver, handleDrop } = createDragDropHandlers(
        draggedMetric,
        setDraggedMetric,
        (fromIndex, toIndex) => {
            const newMetrics = reorderMetrics(config.metrics, fromIndex, toIndex);
            handleConfigChange("metrics", newMetrics);
        }
    );

    // --- Synchronisation metrics/metricStyles SIMPLIFIÉE ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevMetricsRef = useRef<any[]>(
        config.metrics ? [...config.metrics] : []
    );

    // Simplification : Un seul effet pour la synchronisation des styles
    useEffect(() => {
        const metrics = config.metrics || [];

        // Seulement si le nombre de métriques a changé (pas les labels)
        if (metrics.length !== prevMetricsRef.current.length) {
            const currentStyles = config.metricStyles || [];
            const updatedStyles = syncMetricStyles(metrics, currentStyles, type);

            if (updatedStyles !== undefined) {
                setConfig((c: WidgetConfig) => ({ ...c, metricStyles: updatedStyles }));
            }
        }

        prevMetricsRef.current = [...metrics];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.metrics?.length, type]);

    // --- Handlers génériques SIMPLIFIÉS ---
    function handleConfigChange(field: string, value: unknown) {

        setConfig((currentConfig: WidgetConfig & Record<string, unknown>) => {
            const newConfig = { ...currentConfig, [field]: value };
            return newConfig;
        });
        // Plus de synchronisation avec le store - tout est maintenant dans config
    }

    // Fonction supprimée car plus de store à synchroniser
    // Les labels sont maintenant directement dans config.metrics

    function handleMetricAggOrFieldChange(
        idx: number,
        field: "agg" | "field",
        value: string
    ) {
        const newMetrics = updateMetricWithAutoLabel(
            config.metrics,
            idx,
            field,
            value,
            type
        );
        handleConfigChange("metrics", newMetrics);
        // Plus de synchronisation avec le store - le label est déjà dans newMetrics
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleMetricStyleChange(idx: number, field: string, value: any) {
        const newStyles = [...(config.metricStyles || [])];
        newStyles[idx] = { ...newStyles[idx], [field]: value };
        handleConfigChange("metricStyles", newStyles);
    }

    // --- Métriques enrichies avec label ---
    // Utiliser directement les métriques du config au lieu d'enrichir avec le store
    // pour éviter les conflits lors de la saisie utilisateur
    const metricsWithLabels = config.metrics || [];

    // --- Preview ready ---
    const isPreviewReady = isWidgetPreviewReady(WidgetComponent, dataPreview, config);

    // Étape 1 : charger les colonnes et preview
    const loadSourceColumns = async () => {
        setError("");
        setLoading(true);
        try {
            if (sourceId) {
                setStep(2);
                const result = await refetch();
                if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                    const cols = extractColumnsFromData(result.data);
                    setColumns(cols);
                    setDataPreview(result.data);
                }
            }
        } catch {
            setError("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    // Options pour le SelectField des sources
    const sourceOptions = generateSourceOptions(sources);

    return {
        // Core state
        type,
        setType,
        sourceId,
        setSourceId,
        config,
        setConfig,

        // Data state
        columns,
        setColumns,
        dataPreview,
        setDataPreview,

        // UI state
        step,
        setStep,
        tab,
        setTab,
        showSaveModal,
        setShowSaveModal,
        loading,
        setLoading,

        // Widget properties
        title,
        setTitle,
        widgetTitle,
        setWidgetTitle,
        visibility,
        setVisibility,
        widgetTitleError,
        setWidgetTitleError,

        // Error handling
        error,
        setError,

        // Advanced features
        WidgetComponent,
        metricsWithLabels,
        isPreviewReady,
        sourceOptions,

        // Handlers
        handleConfigChange,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleMetricAggOrFieldChange,
        handleMetricStyleChange,
        loadSourceColumns,
    };
}
