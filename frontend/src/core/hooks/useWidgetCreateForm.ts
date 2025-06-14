import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "@/data/services/api";
import { useNavigate, useLocation } from "react-router-dom";
import type { WidgetType } from "../types/widget-types";
import { useSources } from "./useSources";

function getDefaultConfig(type: WidgetType, columns: string[]): any {
  // Génère un config complet selon le schéma du widget
  switch (type) {
    case "bar":
      return {
        metrics: [
          { agg: "sum", field: columns[1] || "", label: columns[1] || "" },
        ],
        bucket: { field: columns[0] || "", type: "x" },
        metricStyles: [{}],
        widgetParams: {},
        xField: columns[0] || "",
        yField: columns[1] || "",
        color: "",
        groupBy: "",
      };
    case "pie":
      return {
        metrics: [
          { agg: "sum", field: columns[1] || "", label: columns[1] || "" },
        ],
        metricStyles: [{}],
        widgetParams: {},
        valueField: columns[1] || "",
        nameField: columns[0] || "",
        colorScheme: "",
      };
    case "line":
      return {
        metrics: [
          { agg: "sum", field: columns[1] || "", label: columns[1] || "" },
        ],
        bucket: { field: columns[0] || "", type: "x" },
        metricStyles: [{}],
        widgetParams: {},
        xField: columns[0] || "",
        yField: columns[1] || "",
        color: "",
      };
    case "table":
      return {
        columns: columns.slice(0, 3),
        pageSize: 10,
        widgetParams: {},
      };
    default:
      return {};
  }
}

export function useWidgetCreateForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<WidgetType>("bar");
  const [sourceId, setSourceId] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [dataPreview, setDataPreview] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({});
  const [title, setTitle] = useState("");
  const [privateWidget, setPrivateWidget] = useState<"public" | "private">(
    "private"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notif, setNotif] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  useEffect(() => {
    // Récupère les params passés via navigation (WidgetCreateSelectorModal)
    const state = location.state as
      | { type?: WidgetType; sourceId?: string }
      | undefined;
    if (state?.type) setType(state.type);
    if (state?.sourceId) setSourceId(state.sourceId);
  }, [location.state]);

  const {
    data: sources = [],
    // refetchWidgets
  } = useSources();

  // Étape 1 : charger les colonnes et preview
  const loadSourceColumns = async () => {
    setError("");
    setLoading(true);
    try {
      // Utilise la source du state global si possible
      const src = sources.find((s: any) => s._id === sourceId);
      let data: any[] = [];
      if (Array.isArray(src?.data) && src.data.length > 0) {
        data = src.data;
      } else {
        // Fallback : fetch si data absente
        const res = await api.get(src.endpoint);
        data = Array.isArray(res.data) ? res.data : [res.data];
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

  const createMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/widgets", {
        widgetId: uuidv4(),
        title,
        private: privateWidget,
        type,
        dataSourceId: sourceId,
        config,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      setNotif({
        open: true,
        type: "success",
        message: "Widget créé avec succès !",
      });
      setTimeout(() => navigate("/widgets"), 1200);
    },
    onError: (e: any) => {
      setNotif({
        open: true,
        type: "error",
        message:
          e.response?.data?.message || "Erreur lors de la création du widget",
      });
    },
  });

  // Réinitialise le config à chaque changement de type ou de source
  useEffect(() => {
    setConfig(getDefaultConfig(type, columns));
  }, [type, sourceId]);

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
    privateWidget,
    setPrivateWidget,
    loading,
    error,
    setError,
    loadSourceColumns,
    handleConfigChange,
    createMutation,
    sources,
    notif,
    setNotif,
  };
}
