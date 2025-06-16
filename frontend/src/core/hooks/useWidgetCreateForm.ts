import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { createWidget } from "@/data/services/widget";
import { useNavigate } from "react-router-dom";
import type {
  WidgetFormInitialValues,
  WidgetType,
} from "../types/widget-types";
import { useSources } from "./useSources";
import { ROUTES } from "../constants/routes";
import { useSourceData } from "@/core/hooks/useSourceData";
import {
  WIDGETS,
  WIDGET_DATA_CONFIG,
  WIDGET_CONFIG_FIELDS,
} from "@/data/adapters/visualizations";
import { useMetricLabelStore } from "@/core/store/metricLabels";
import type { DataSource } from "../types/data-source";
import type { Widget } from "@/core/models/Widget";

function getDefaultConfig(type: WidgetType, columns: string[]): any {
  const widgetDef = WIDGETS[type];
  const schema = widgetDef?.configSchema;
  if (!schema) return {};

  // Fonction récursive pour parcourir le schéma et extraire les valeurs par défaut
  function extractDefaults(obj: any): any {
    if (!obj || typeof obj !== "object") return undefined;
    // Si c'est un champ de config (avec .default)
    if ("default" in obj) {
      // Si le champ attend un tableau de colonnes, injecte les colonnes si possible
      if (obj.inputType === "table-columns") {
        return columns.slice(0, 3);
      }
      return obj.default;
    }
    // Si c'est un objet de champs
    const result: any = {};
    for (const key of Object.keys(obj)) {
      const val = extractDefaults(obj[key]);
      if (val !== undefined) result[key] = val;
    }
    return result;
  }

  // On extrait les defaults du schéma principal
  const baseConfig = extractDefaults(schema);
  // Pour certains types, on peut injecter les colonnes dans les champs principaux si besoin
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

export function useWidgetCreateForm(initialValues?: WidgetFormInitialValues) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
  // Tabs et modals
  const [tab, setTab] = useState<"data" | "metricsAxes" | "params">("data");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [widgetTitle, setWidgetTitle] = useState(title || "");

  const [widgetTitleError, setWidgetTitleError] = useState("");

  // Notifications
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notif, setNotif] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  // Pour le drag & drop (ordre des métriques)
  const [draggedMetric, setDraggedMetric] = useState<number | null>(null);

  const metricLabelStore = useMetricLabelStore();

  const WidgetComponent = WIDGETS[type]?.component;

  //Lisete Data source
  const { data: sources = [] } = useSources();

  // Hook pour charger les données de la source (en mode synchrone via query)
  const src = sources?.find((s: DataSource) => s._id === sourceId);
  const { data: sourceData = [] } = useSourceData(src?._id);

  // Étape 1 : charger les colonnes et preview
  const loadSourceColumns = async () => {
    setError("");
    setLoading(true);
    try {
      let data: any[] = [];
      if (src && src._id) {
        // Utilise les données du hook (cache react-query)
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

  // Étape 2 : config widget + preview
  const handleConfigChange = (field: string, value: any) => {
    setConfig((c: any) => ({ ...c, [field]: value }));
  };

  const createMutation = useMutation<Widget, Error, void>({
    mutationFn: async () => {
      return await createWidget({
        widgetId: uuidv4(),
        title,
        visibility: visibility,
        type,
        dataSourceId: sourceId,
        config,
      });
    },
    onSuccess: (widget) => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      setNotif({
        open: true,
        type: "success",
        message: "Widget créé avec succès ! Redirection...",
      });
      setTimeout(() => {
        const id = widget._id || "";
        navigate(ROUTES.editWidget.replace(":id", String(id)));
      }, 1000);
    },
    onError: (e) => {
      setNotif({
        open: true,
        type: "error",
        message: e.message || "Erreur lors de la création du widget",
      });
    },
  });

  // Réinitialise le config à chaque changement de type ou de source (sauf si désactivé)
  useEffect(() => {
    if (!initialValues?.disableAutoConfig) {
      setConfig(getDefaultConfig(type, columns));
    }
  }, [type, sourceId]);

  // --- Configuration ---
  const dataConfig = WIDGET_DATA_CONFIG[type];
  if (!initialValues?.disableAutoConfig) {
    if (dataConfig && dataConfig.metrics.allowMultiple) {
      if (!Array.isArray(config.metrics) || config.metrics.length === 0) {
        config.metrics = [
          {
            agg: dataConfig.metrics.defaultAgg,
            field: columns[1] || "",
            label: columns[1] || "",
          },
        ];
      }
    } else if (dataConfig) {
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
    if (
      dataConfig &&
      dataConfig.bucket.allow &&
      (!config.bucket || !config.bucket.field)
    ) {
      config.bucket = {
        field: columns[0] || "",
        type: dataConfig.bucket.typeLabel || "x",
      };
    }
  }

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

  // --- Fonctions utilitaires internes ---
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
        // Ajoutez ici d'autres champs si besoin
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

  // Synchronisation metrics/metricStyles
  const prevMetricsRef = useRef<any[]>(
    config.metrics ? [...config.metrics] : []
  );

  useEffect(() => {
    const metrics = config.metrics || [];
    let metricStyles = config.metricStyles || [];
    // Ajoute les styles manquants
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

  // Synchronisation initiale des labels (données -> store)
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

  // Wrapper pour synchroniser label lors du changement d'agg ou de field
  function handleMetricAggOrFieldChange(
    idx: number,
    field: "agg" | "field",
    value: any
  ) {
    const newMetrics = [...config.metrics];
    newMetrics[idx] = { ...newMetrics[idx], [field]: value };
    const aggLabel =
      dataConfig.metrics.allowedAggs.find(
        (a: any) => a.value === (field === "agg" ? value : newMetrics[idx].agg)
      )?.label || (field === "agg" ? value : newMetrics[idx].agg);
    const fieldLabel = field === "field" ? value : newMetrics[idx].field;
    const autoLabel = `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""}`;
    newMetrics[idx].label = autoLabel;
    handleConfigChange("metrics", newMetrics);
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
    tab,
    setTab,
    showSaveModal,
    setShowSaveModal,
    widgetTitle,
    setWidgetTitle,
    visibility,
    setVisibility,
    widgetTitleError,
    setWidgetTitleError,
    WidgetComponent,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleMetricAggOrFieldChange,
    metricLabelStore,
    setColumns,
    setDataPreview,
  };
}
