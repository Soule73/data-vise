import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotificationStore } from "@store/notification";
import { useDashboardStore } from "@store/dashboard";
import { ROUTES } from "@constants/routes";
import { fetchWidgetById, updateWidget } from "@services/widget";
import type { DataSource } from "@type/dataSource";
import type { WidgetType, Widget } from "@type/widgetTypes";
import { useDataBySourceQuery, useSourcesQuery } from "@/data/repositories/datasources";
import { useQueryClient } from "@tanstack/react-query";
import { useCommonWidgetForm } from "@hooks/widget/useCommonWidgetForm";

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
    if (widget && source && columns.length > 0 && realSourceData) {
      setFormReady(true);
    }
  }, [widget, source, columns, realSourceData]);

  // Préparer les valeurs initiales une fois que tout est prêt (useMemo pour éviter la re-création)
  const initialValues = useMemo(() => {
    if (!formReady) return undefined;

    return {
      type: (widget?.type as WidgetType) || "bar",
      config: config,
      title: widgetTitle,
      sourceId: widget?.dataSourceId,
      columns: columns,
      dataPreview: Array.isArray(realSourceData)
        ? (realSourceData as Record<string, unknown>[])
        : [],
      visibility: visibility,
      disableAutoConfig: true, // IMPORTANT: empêche l'auto-génération
    };
  }, [formReady, widget?.type, widget?.dataSourceId, config, widgetTitle, columns, realSourceData, visibility]);

  // Utilisation du hook centralisé avec initialValues
  const form = useCommonWidgetForm(initialValues);

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
