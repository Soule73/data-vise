import { useWidgetCreateForm } from "@/core/hooks/useWidgetCreateForm";
import { WIDGETS, WIDGET_DATA_CONFIG } from "@/data/adapters/visualizations";
import { useDashboardStore } from "@/core/store/dashboard";
import { useMetricLabelStore } from '@/core/store/metricLabels';
import { useState, useEffect, useRef } from "react";

export function useWidgetCreateLogic() {
  const {
    step,
    setStep,
    type,
    setType,
    sourceId,
    setSourceId,
    columns,
    dataPreview,
    config,
    setConfig,
    title,
    setTitle,
    loading,
    error,
    setError,
    loadSourceColumns,
    handleConfigChange,
    createMutation,
    sources,
    notif,
    setNotif,
  } = useWidgetCreateForm();

  const setDashboardTitle = useDashboardStore((s) => s.setDashboardTitle);
  const metricLabelStore = useMetricLabelStore();

  useEffect(() => {
    setDashboardTitle("create", "Configurer la visualisation");
    setDashboardTitle("widgets", "Visualizations");
  }, [setDashboardTitle]);

  const [tab, setTab] = useState<"data" | "metricsAxes" | "params">("data");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [widgetTitle, setWidgetTitle] = useState(title || "");
  const [widgetTitleError, setWidgetTitleError] = useState("");

  const WidgetComponent = WIDGETS[type]?.component;

  // Fonction utilitaire pour agréger les données pour les bar charts
  function getGroupedData(data: any[], config: any) {
    if (!data || !Array.isArray(data)) return [];
    const { groupBy, value } = config;
    if (!groupBy || !value) return data;
    const grouped: Record<string, number> = {};
    data.forEach((item) => {
      const key = item[groupBy];
      const val = Number(item[value]) || 0;
      if (key in grouped) {
        grouped[key] += val;
      } else {
        grouped[key] = val;
      }
    });
    return Object.entries(grouped).map(([k, v]) => ({
      [groupBy]: k,
      [value]: v,
    }));
  }

  // Préparer les données pour l'aperçu selon le type de widget
  let previewData = dataPreview;
  if (type === "bar") {
    previewData = getGroupedData(dataPreview, config);
  }

  // --- Configuration avancée façon Kibana ---
  const dataConfig = WIDGET_DATA_CONFIG[type];
  if (dataConfig.metrics.allowMultiple) {
    if (!Array.isArray(config.metrics) || config.metrics.length === 0) {
      config.metrics = [
        {
          agg: dataConfig.metrics.defaultAgg,
          field: columns[1] || "",
          label: columns[1] || "",
        },
      ];
    }
  } else {
    if (!Array.isArray(config.metrics) || config.metrics.length === 0) {
      config.metrics = [
        {
          agg: dataConfig.metrics.defaultAgg,
          field: columns[1] || "",
          label: columns[1] || "",
        },
      ];
    } else if (config.metrics.length > 1) {
      config.metrics = [config.metrics[0]];
    }
  }
  if (dataConfig.bucket.allow && (!config.bucket || !config.bucket.field)) {
    config.bucket = {
      field: columns[0] || "",
      type: dataConfig.bucket.typeLabel || "x",
    };
  }

  // Pour le drag & drop (ordre des métriques)
  const [draggedMetric, setDraggedMetric] = useState<number | null>(null);
  function handleDragStart(idx: number) {
    setDraggedMetric(idx);
  }
  function handleDragOver(_idx: number, e: React.DragEvent) {
    e.preventDefault();
  }
  function handleDrop(idx: number) {
    if (draggedMetric === null || draggedMetric === idx) return;
    const newMetrics = [...config.metrics];
    const [removed] = newMetrics.splice(draggedMetric, 1);
    newMetrics.splice(idx, 0, removed);
    handleConfigChange("metrics", newMetrics);
    setDraggedMetric(null);
  }

  // Synchronisation metrics/metricStyles
  const prevMetricsRef = useRef<any[]>(config.metrics ? [...config.metrics] : []);
  useEffect(() => {
    const metrics = config.metrics || [];
    let metricStyles = config.metricStyles || [];
    if (metricStyles.length < metrics.length) {
      metricStyles = [
        ...metricStyles,
        ...Array(metrics.length - metricStyles.length).fill({}),
      ];
      handleConfigChange("metricStyles", metricStyles);
    }
    if (metricStyles.length > metrics.length) {
      metricStyles = metricStyles.slice(0, metrics.length);
      handleConfigChange("metricStyles", metricStyles);
    }
    if (
      prevMetricsRef.current &&
      prevMetricsRef.current.length === metrics.length &&
      prevMetricsRef.current.some((m, i) => m !== metrics[i])
    ) {
      const oldMetrics = prevMetricsRef.current;
      const newMetricStyles = metrics.map((m: any) => {
        const oldIdx = oldMetrics.findIndex(
          (om: any) => om.field === m.field && om.agg === m.agg && om.label === m.label
        );
        return oldIdx !== -1 ? metricStyles[oldIdx] : {};
      });
      handleConfigChange("metricStyles", newMetricStyles);
    }
    prevMetricsRef.current = [...metrics];
    // eslint-disable-next-line
  }, [config.metrics]);

  // Synchronisation initiale des labels (données -> store)
  useEffect(() => {
    if (Array.isArray(config.metrics)) {
      const labels = config.metrics.map((m: any, idx: number) => m.label || `Métrique ${idx + 1}`);
      metricLabelStore.setAllMetricLabels(labels);
    }
    // eslint-disable-next-line
  }, [config.metrics]);

  // Wrapper pour synchroniser label lors du changement d'agg ou de field
  function handleMetricAggOrFieldChange(idx: number, field: 'agg' | 'field', value: any) {
    const newMetrics = [...config.metrics];
    newMetrics[idx] = { ...newMetrics[idx], [field]: value };
    const aggLabel = dataConfig.metrics.allowedAggs.find((a: any) => a.value === (field === 'agg' ? value : newMetrics[idx].agg))?.label || (field === 'agg' ? value : newMetrics[idx].agg);
    const fieldLabel = field === 'field' ? value : newMetrics[idx].field;
    const autoLabel = `${aggLabel}${fieldLabel ? ' · ' + fieldLabel : ''}`;
    newMetrics[idx].label = autoLabel;
    handleConfigChange('metrics', newMetrics);
    metricLabelStore.setMetricLabel(idx, autoLabel);
  }

  return {
    step,
    setStep,
    type,
    setType,
    sourceId,
    setSourceId,
    columns,
    dataPreview: previewData,
    config,
    setConfig,
    title,
    setTitle,
    loading,
    error,
    setError,
    loadSourceColumns,
    handleConfigChange,
    createMutation,
    sources,
    notif,
    setNotif,
    tab,
    setTab,
    showSaveModal,
    setShowSaveModal,
    widgetTitle,
    setWidgetTitle,
    widgetTitleError,
    setWidgetTitleError,
    WidgetComponent,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleMetricAggOrFieldChange,
    metricLabelStore
  };
}
