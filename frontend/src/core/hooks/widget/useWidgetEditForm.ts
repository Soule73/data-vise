import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotificationStore } from "@/core/store/notification";
import { useDashboardStore } from "@/core/store/dashboard";
import { ROUTES } from "@/core/constants/routes";
import { fetchWidgetById, updateWidget } from "@/data/services/widget";
import type { DataSource } from "@/core/types/data-source";
import type { WidgetType, Widget } from "@/core/types/widget-types";
import { useDataBySourceQuery, useSourcesQuery } from "@/data/repositories/sources";
import { useQueryClient } from "@tanstack/react-query";
import { useCommonWidgetForm } from "./useCommonWidgetForm";

export function useWidgetEditForm() {
  const queryClient = useQueryClient();
  const { id: widgetId } = useParams();
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [widget, setWidget] = useState<Widget | null>(null);
  const [config, setConfig] = useState<unknown>({});
  const [widgetTitle, setWidgetTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const [columns, setColumns] = useState<string[]>([]);
  const [source, setSource] = useState<DataSource | null>(null);
  const [formReady, setFormReady] = useState(false);

  // Liste Data source
  const { data: sources = [] } = useSourcesQuery({ queryClient });
  // Charge les données de la source via id
  const { data: realSourceData } = useDataBySourceQuery(source?._id ?? "");

  // Initialise les colonnes à partir des données de la source (comme en création)
  useEffect(() => {
    if (
      realSourceData &&
      Array.isArray(realSourceData) &&
      realSourceData.length > 0
    ) {
      setColumns(Object.keys(realSourceData[0]));
    }
  }, [realSourceData]);

  // Met à jour le titre du breadcrumb lorsque le widget est chargé ou que le titre change
  useEffect(() => {
    if (widgetId && widgetTitle) {
      setBreadcrumb([
        { url: ROUTES.widgets, label: "Visualisations" },
        {
          url: ROUTES.editWidget.replace(":widgetId", widgetId),
          label: widgetTitle,
        },
      ]);
    }
  }, [widgetId, widgetTitle, setBreadcrumb]);

  // Charge le widget puis la source pour récupérer l'endpoint
  useEffect(() => {
    async function fetchWidgetAndSource() {
      setLoading(true);
      try {
        const data = await fetchWidgetById(widgetId!);
        setWidget(data);
        setConfig(data.config);
        setWidgetTitle(data.title);
        setVisibility(data.visibility || "private");
        if (data.dataSourceId) {
          const srcRes = sources?.find(
            (s: DataSource) => String(s._id) === String(data.dataSourceId)
          );
          setSource(srcRes || null);
        } else {
          setSource(null);
        }
      } catch {
        setError("Impossible de charger le widget");
      } finally {
        setLoading(false);
      }
    }
    fetchWidgetAndSource();
  }, [widgetId, sources]);

  // Préparer les valeurs initiales pour le hook formulaire dès que tout est chargé
  useEffect(() => {
    if (widget && source && columns.length > 0) {
      setFormReady(true);
    }
  }, [widget, source, columns]);

  // Utilisation du hook centralisé avec initialValues (comme en création)
  const form = useCommonWidgetForm(
    formReady
      ? {
        type: (widget?.type as WidgetType) || "bar",
        config: config,
        title: widgetTitle,
        sourceId: widget?.dataSourceId,
        columns: columns,
        dataPreview: Array.isArray(realSourceData)
          ? (realSourceData as Record<string, unknown>[])
          : [],
        visibility: visibility,
        disableAutoConfig: true,
      }
      : undefined
  );

  // Synchronise le formulaire avec les données chargées (widget, config, etc.)
  useEffect(() => {
    if (formReady) {
      form.setType((widget?.type as WidgetType) || "bar");
      form.setConfig(config || {});
      form.setTitle(widgetTitle || "");
      form.setSourceId(widget?.dataSourceId || "");
      form.setColumns(columns || []);
      form.setVisibility(visibility || "private");
      form.setWidgetTitle(widgetTitle || "");
      // Pour la preview
      if (realSourceData) {
        form.setDataPreview(realSourceData);
      }
    }
  }, [formReady, widget, config, widgetTitle, columns, visibility, realSourceData, form]);

  // Gestion de la sauvegarde spécifique à l'édition
  async function handleSave() {
    try {
      if (!form.widgetTitle.trim()) {
        form.setWidgetTitleError("Le titre est requis");
        return;
      }
      await updateWidget(`${widgetId}`, {
        ...widget,
        title: form.widgetTitle,
        visibility: form.visibility,
        config: form.config,
      });
      showNotification({
        open: true,
        type: "success",
        title: "Succès",
        description: "Widget modifié avec succès !",
      });
      navigate(ROUTES.widgets);
    } catch (e) {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description:
          (e as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Erreur lors de la modification du widget",
      });
    }
  }

  // Gestion de la confirmation du modal de sauvegarde
  function handleConfirmSave() {
    if (!form.widgetTitle.trim()) {
      form.setWidgetTitleError("Le titre est requis");
      return;
    }
    form.setShowSaveModal(false);
    handleSave();
  }

  return {
    loading,
    error,
    widget,
    formReady,
    form,
    handleSave,
    handleConfirmSave,
  };
}
