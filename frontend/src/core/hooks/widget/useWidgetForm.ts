import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sourcesQuery, dataBySourceQuery } from "@/data/repositories/sources";
import type { DataSource } from "@/core/types/data-source";
import type {
  WidgetFormInitialValues,
  WidgetType,
} from "@/core/types/widget-types";
import {
  WIDGETS,
  WIDGET_DATA_CONFIG,
  WIDGET_CONFIG_FIELDS,
} from "@/data/adapters/visualizations";
import { useMetricLabelStore } from "@/core/store/metricLabels";

export function useWidgetForm(initialValues?: WidgetFormInitialValues) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<WidgetType>(initialValues?.type || "bar");
  const [sourceId, setSourceId] = useState(initialValues?.sourceId || "");
  const [columns, setColumns] = useState<string[]>(
    initialValues?.columns || []
  );
  const [dataPreview, setDataPreview] = useState<any[]>(
    initialValues?.dataPreview || []
  );
  const [config, setConfig] = useState<any>(initialValues?.config || {});
  const [title, setTitle] = useState(initialValues?.title || "");
  const [visibility, setVisibility] = useState<"public" | "private">(
    initialValues?.visibility || "private"
  );
  const [tab, setTab] = useState<"data" | "metricsAxes" | "params">("data");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [widgetTitle, setWidgetTitle] = useState(title || "");
  const [widgetTitleError, setWidgetTitleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notif, setNotif] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });
  const [draggedMetric, setDraggedMetric] = useState<number | null>(null);
  const metricLabelStore = useMetricLabelStore();
  const WidgetComponent = WIDGETS[type]?.component;
  const queryClient = useQueryClient();
  const { data: sources = [] } = sourcesQuery({ queryClient });
  const src = sources?.find((s: DataSource) => s._id === sourceId);
  const { data: sourceData = [] } = dataBySourceQuery(src?._id);

  // --- Logique de config par défaut ---
  function getDefaultConfig(type: WidgetType, columns: string[]): any {
    const widgetDef = WIDGETS[type];
    const schema = widgetDef?.configSchema;
    if (!schema) return {};
    function extractDefaults(obj: any): any {
      if (!obj || typeof obj !== "object") return undefined;
      if ("default" in obj) {
        if (obj.inputType === "table-columns") {
          return columns.slice(0, 3);
        }
        return obj.default;
      }
      const result: any = {};
      for (const key of Object.keys(obj)) {
        const val = extractDefaults(obj[key]);
        if (val !== undefined) result[key] = val;
      }
      return result;
    }
    const baseConfig = extractDefaults(schema);
    if (type === "bar" || type === "line") {
      if (columns[0]) baseConfig.xField = columns[0];
      if (columns[1]) baseConfig.yField = columns[1];
    }
    if (type === "pie") {
      if (columns[0]) baseConfig.nameField = columns[0];
      if (columns[1]) baseConfig.valueField = columns[1];
    }
    if (type === "table") {
      baseConfig.columns = columns.slice(0, 3);
    }
    return baseConfig;
  }

  // --- Logique de gestion des métriques et styles ---
  function getDefaultMetricStyle() {
    const styleFields = Object.keys(WIDGET_CONFIG_FIELDS).filter((key) =>
      [
        "color",
        "borderColor",
        "borderWidth",
        "labelColor",
        "labelFontSize",
        "pointStyle",
        "barThickness",
        "borderRadius",
      ].includes(key)
    );
    const style: Record<string, any> = {};
    styleFields.forEach((field) => {
      style[field] =
        WIDGET_CONFIG_FIELDS[field]?.default ??
        (WIDGET_CONFIG_FIELDS[field]?.inputType === "color" ? "#2563eb" : "");
    });
    return style;
  }

  const widgetConfig = WIDGET_DATA_CONFIG[type];
  if (!initialValues?.disableAutoConfig) {
    if (widgetConfig && widgetConfig.metrics.allowMultiple) {
      if (!Array.isArray(config.metrics) || config.metrics.length === 0) {
        config.metrics = [
          {
            agg: widgetConfig.metrics.defaultAgg,
            field: columns[1] || "",
            label: columns[1] || "",
          },
        ];
      }
    } else if (widgetConfig) {
      if (!Array.isArray(config.metrics) || config.metrics.length === 0) {
        config.metrics = [
          {
            agg: widgetConfig.metrics.defaultAgg,
            field: columns[1] || "",
            label: columns[1] || "",
          },
        ];
      } else if (config.metrics.length > 1) {
        config.metrics = [config.metrics[0]];
      }
    }
    if (
      widgetConfig &&
      widgetConfig.bucket.allow &&
      (!config.bucket || !config.bucket.field)
    ) {
      config.bucket = {
        field: columns[0] || "",
        type: widgetConfig.bucket.typeLabel || "x",
      };
    }
  }

  // --- Drag & drop métriques ---
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

  // --- Synchronisation metrics/metricStyles ---
  const prevMetricsRef = useRef<any[]>(
    config.metrics ? [...config.metrics] : []
  );
  useEffect(() => {
    const metrics = config.metrics || [];
    let metricStyles = config.metricStyles || [];
    if (metricStyles.length < metrics.length) {
      metricStyles = [
        ...metricStyles,
        ...Array(metrics.length - metricStyles.length)
          .fill(0)
          .map(() => getDefaultMetricStyle()),
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
          (om: any) =>
            om.field === m.field && om.agg === m.agg && om.label === m.label
        );
        return oldIdx !== -1 ? metricStyles[oldIdx] : getDefaultMetricStyle();
      });
      handleConfigChange("metricStyles", newMetricStyles);
    }
    prevMetricsRef.current = [...metrics];
    // eslint-disable-next-line
  }, [config.metrics, type]);

  // --- Synchronisation initiale des labels (données -> store) ---
  useEffect(() => {
    if (Array.isArray(config.metrics)) {
      const labels = config.metrics.map(
        (m: any, idx: number) => m.label || `Métrique ${idx + 1}`
      );
      metricLabelStore.setAllMetricLabels(labels);
      if (Array.isArray(config.metricStyles)) {
        const newMetricStyles = config.metricStyles.map(
          (style: any, idx: number) => {
            const metric = config.metrics[idx];
            const aggLabel = metric?.agg || "";
            const fieldLabel = metric?.field || "";
            const autoLabel = `${aggLabel}${
              fieldLabel ? " · " + fieldLabel : ""
            }`;
            if (style && style.customLabel) {
              return style;
            }
            return {
              ...style,
              label: autoLabel,
            };
          }
        );
        handleConfigChange("metricStyles", newMetricStyles);
      }
    }
    // eslint-disable-next-line
  }, [config.metrics]);

  // --- Handlers génériques ---
  function handleConfigChange(field: string, value: any) {
    setConfig((c: any) => ({ ...c, [field]: value }));
  }
  function handleMetricAggOrFieldChange(
    idx: number,
    field: "agg" | "field",
    value: any
  ) {
    const newMetrics = [...config.metrics];
    newMetrics[idx] = { ...newMetrics[idx], [field]: value };
    const aggLabel =
      widgetConfig.metrics.allowedAggs.find(
        (a: any) => a.value === (field === "agg" ? value : newMetrics[idx].agg)
      )?.label || (field === "agg" ? value : newMetrics[idx].agg);
    const fieldLabel = field === "field" ? value : newMetrics[idx].field;
    const autoLabel = `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""}`;
    newMetrics[idx].label = autoLabel;
    handleConfigChange("metrics", newMetrics);
    metricLabelStore.setMetricLabel(idx, autoLabel);
  }
  function handleMetricStyleChange(idx: number, field: string, value: any) {
    const newStyles = [...(config.metricStyles || [])];
    newStyles[idx] = { ...newStyles[idx], [field]: value };
    handleConfigChange("metricStyles", newStyles);
  }

  // --- Métriques enrichies avec label ---
  const metricsWithLabels = (config.metrics || []).map(
    (m: Record<string, unknown>, idx: number) => ({
      ...m,
      label:
        metricLabelStore.metricLabels[idx] || m.label || `Métrique ${idx + 1}`,
    })
  );

  // --- Preview ready ---
  const isPreviewReady =
    WidgetComponent &&
    dataPreview &&
    Array.isArray(dataPreview) &&
    config &&
    Object.keys(config).length > 0;

  // Étape 1 : charger les colonnes et preview
  const loadSourceColumns = async () => {
    setError("");
    setLoading(true);
    try {
      let data: any[] = [];
      if (src && src._id) {
        data = sourceData || [];
      }
      setDataPreview(data.slice(0, 10));
      setColumns(data[0] ? Object.keys(data[0]) : []);
      setConfig(getDefaultConfig(type, data[0] ? Object.keys(data[0]) : []));
      setStep(2);
    } catch (e: any) {
      setError("Impossible de charger les données de la source");
    } finally {
      setLoading(false);
    }
  };

  // Options pour le SelectField des sources
  const sourceOptions = [
    { value: "", label: "Sélectionner une source" },
    ...sources.map((s: DataSource) => ({
      value: s._id,
      label: s.name,
    })),
  ];

  return {
    step,
    setStep,
    type,
    setType,
    sourceId,
    setSourceId,
    columns,
    setColumns,
    dataPreview,
    setDataPreview,
    config,
    setConfig,
    title,
    setTitle,
    loading,
    setLoading,
    error,
    setError,
    tab,
    setTab,
    showSaveModal,
    setShowSaveModal,
    widgetTitle,
    setWidgetTitle,
    widgetTitleError,
    setWidgetTitleError,
    visibility,
    setVisibility,
    WidgetComponent,
    handleConfigChange,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleMetricAggOrFieldChange,
    handleMetricStyleChange,
    metricsWithLabels,
    isPreviewReady,
    metricLabelStore,
    notif,
    setNotif,
    loadSourceColumns,
    sourceOptions,
  };
}
