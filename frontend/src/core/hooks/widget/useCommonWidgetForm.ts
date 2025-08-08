import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSourcesQuery, useDataBySourceQuery } from "@/data/repositories/sources";
import type { DataSource } from "@/core/types/data-source";
import type { WidgetType, WidgetFormInitialValues, WidgetConfig, CommonWidgetFormState } from "@/core/types/widget-types";
import { WIDGETS, WIDGET_DATA_CONFIG } from "@/data/adapters/visualizations";
import { useMetricLabelStore } from "@/core/store/metricLabels";
import {
    getDefaultConfig,
    syncMetricStyles,
    reorderMetrics,
    updateMetricAggOrField,
    updateMetricStyle,
    enrichMetricsWithLabels,
    extractMetricLabels,
    generateSourceOptions,
    isPreviewDataReady,
} from "@/core/utils/widget";

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
    const [widgetTitle, setWidgetTitle] = useState(title || "");
    const [widgetTitleError, setWidgetTitleError] = useState("");

    // Error handling
    const [error, setError] = useState("");

    // Advanced state
    const [draggedMetric, setDraggedMetric] = useState<number | null>(null);
    const metricLabelStore = useMetricLabelStore();

    // Data fetching
    const queryClient = useQueryClient();
    const { data: sources = [] } = useSourcesQuery({ queryClient });
    const src = sources?.find((s: DataSource) => s._id === sourceId);
    const { refetch } = useDataBySourceQuery(src?._id);

    // Computed values
    const WidgetComponent = WIDGETS[type]?.component;

    // Auto config setup when columns change
    const widgetConfig = WIDGET_DATA_CONFIG[type];
    useEffect(() => {
        if (!initialValues?.disableAutoConfig && columns.length > 0) {
            if (widgetConfig && widgetConfig.metrics.allowMultiple) {
                if (!config.metrics || config.metrics.length === 0) {
                    const newConfig = getDefaultConfig(type, columns);
                    setConfig(newConfig);
                }
            } else if (widgetConfig) {
                if (!config.metrics || config.metrics.length === 0) {
                    const newConfig = getDefaultConfig(type, columns);
                    setConfig(newConfig);
                }
            }

            if (
                widgetConfig &&
                widgetConfig.bucket.allow &&
                (!config.bucket || !config.bucket.field)
            ) {
                const newConfig = { ...config, bucket: { field: columns[1] || columns[0] } };
                setConfig(newConfig);
            }
        }
    }, [type, columns, widgetConfig, config, initialValues?.disableAutoConfig]);

    // --- Drag & drop métriques ---
    function handleDragStart(idx: number) {
        setDraggedMetric(idx);
    }

    function handleDragOver(_idx: number, e: React.DragEvent) {
        e.preventDefault();
    }

    function handleDrop(idx: number) {
        if (draggedMetric === null || draggedMetric === idx) return;

        const newMetrics = reorderMetrics(config.metrics, draggedMetric, idx);
        handleConfigChange("metrics", newMetrics);
        setDraggedMetric(null);
    }

    // --- Synchronisation metrics/metricStyles ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevMetricsRef = useRef<any[]>(
        config.metrics ? [...config.metrics] : []
    );

    useEffect(() => {
        const metrics = config.metrics || [];
        const currentStyles = config.metricStyles || [];

        const updatedStyles = syncMetricStyles(metrics, currentStyles);

        if (JSON.stringify(updatedStyles) !== JSON.stringify(currentStyles)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setConfig((c: any) => ({ ...c, metricStyles: updatedStyles }));
        }

        prevMetricsRef.current = [...metrics];
    }, [config.metrics, config.metricStyles, type]);

    // --- Handlers génériques ---
    function handleConfigChange(field: string, value: unknown) {
        setConfig((c: WidgetConfig) => ({ ...c, [field]: value }));
    }

    // Synchronise manuellement les labels des métriques avec le store
    function syncMetricLabelsToStore() {
        if (Array.isArray(config.metrics)) {
            const labels = extractMetricLabels(config.metrics);
            if (labels.length > 0) {
                metricLabelStore.setAllMetricLabels(labels);
            }
        }
    }

    function handleMetricAggOrFieldChange(
        idx: number,
        field: "agg" | "field",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any
    ) {
        const { updatedMetrics, autoLabel } = updateMetricAggOrField(
            config.metrics,
            idx,
            field,
            value,
            type
        );

        handleConfigChange("metrics", updatedMetrics);
        metricLabelStore.setMetricLabel(idx, autoLabel);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleMetricStyleChange(idx: number, field: string, value: any) {
        const newStyles = updateMetricStyle(config.metricStyles || [], idx, field, value);
        handleConfigChange("metricStyles", newStyles);
    }

    // --- Métriques enrichies avec label ---
    const metricsWithLabels = enrichMetricsWithLabels(
        config.metrics || [],
        metricLabelStore.metricLabels
    );

    // --- Preview ready ---
    const isPreviewReady = isPreviewDataReady(WidgetComponent, dataPreview, config);

    // Étape 1 : charger les colonnes et preview
    const loadSourceColumns = async () => {
        setError("");
        setLoading(true);
        try {
            if (sourceId) {
                setStep(2);
                const result = await refetch();
                if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                    const cols = Object.keys(result.data[0]);
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
        syncMetricLabelsToStore,
        loadSourceColumns,
    };
}
