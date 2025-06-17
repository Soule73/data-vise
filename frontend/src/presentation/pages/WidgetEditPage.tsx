import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WIDGET_DATA_CONFIG } from "@/data/adapters/visualizations";
import { useNotificationStore } from "@/core/store/notification";
import { useDashboardStore } from "@/core/store/dashboard";
import WidgetConfigTabs from "@/presentation/components/WidgetConfigTabs";
import WidgetDataConfigSection from "@/presentation/components/WidgetDataConfigSection";
import WidgetConfigFooter from "@/presentation/components/WidgetConfigFooter";
import WidgetSaveTitleModal from "@/presentation/components/WidgetSaveTitleModal";
import WidgetMetricStyleConfigSection from "@/presentation/components/WidgetMetricStyleConfigSection";
import WidgetParamsConfigSection from "@/presentation/components/WidgetParamsConfigSection";
import { useSourceData } from "@/core/hooks/useSourceData";
import { useWidgetCreateForm } from "@/core/hooks/useWidgetCreateForm";
import { ROUTES } from "@/core/constants/routes";
import { fetchWidgetById, updateWidget } from "@/data/services/widget";
import { useSources } from "@/core/hooks/useSources";
import type { DataSource } from "@/core/types/data-source";
import type { Widget } from "@/core/models/Widget";
import type { WidgetType } from "@/core/types/widget-types";
import type { MetricConfig } from "@/core/types/metric-bucket-types";

export default function WidgetEditPage() {
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

  //Lisete Data source
  const { data: sources = [] } = useSources();

  // Charge les données de la source via id
  const { data: realSourceData } = useSourceData(source?._id ?? "");

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
      } catch (e) {
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

  // Utilisation du hook formulaire avec initialValues (comme en création)
  const form = useWidgetCreateForm(
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
  }, [
    formReady,
    widget,
    config,
    widgetTitle,
    columns,
    visibility,
    realSourceData,
  ]);

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

  if (loading || !formReady) return <div>Chargement…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!widget) return null;

  // Rendu identique à la page de création, mais avec la logique du hook centralisé
  return (
    <>
      <div className="lg:h-[90vh] h-full flex flex-col min-h-0 overflow-hidden">
        <div className="flex flex-col md:flex-row lg:flex-row h-full min-h-0 gap-2">
          {/* Colonne aperçu (preview) : sticky/fixée, jamais scrollable */}
          <div className="order-1 md:w-1/2 lg:w-2/3 flex-shrink-0 flex flex-col lg:sticky lg:top-0 h-full p-1 md:p-2 ">
            {form.WidgetComponent && (
              <form.WidgetComponent
                data={form.dataPreview}
                config={{ ...form.config, title: form.widgetTitle }}
              />
            )}
          </div>
          {/* Colonne config (droite) : scrollable indépendamment, boutons sticky en bas */}
          <div className="order-2 md:w-1/2 lg:w-1/3 flex flex-col h-[90vh] bg-gray-300/30 dark:bg-gray-900/30 rounded shadow relative">
            {/* Tabs */}
            <WidgetConfigTabs tab={form.tab} setTab={form.setTab} />
            {/* Contenu scrollable : tout sauf les boutons */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pb-24 config-scrollbar md:px-2">
              {form.tab === "data" && (
                <WidgetDataConfigSection
                  type={form.type}
                  dataConfig={WIDGET_DATA_CONFIG[form.type]}
                  config={{
                    ...form.config,
                    metrics: form.config.metrics?.map(
                      (
                        m: import("@/core/types/metric-bucket-types").MetricConfig,
                        idx: number
                      ) => ({
                        ...m,
                        label:
                          form.metricLabelStore.metricLabels[idx] ||
                          m.label ||
                          `Métrique ${idx + 1}`,
                      })
                    ),
                  }}
                  columns={form.columns}
                  data={form.dataPreview}
                  handleConfigChange={form.handleConfigChange}
                  handleDragStart={form.handleDragStart}
                  handleDragOver={form.handleDragOver}
                  handleDrop={form.handleDrop}
                  handleMetricAggOrFieldChange={
                    form.handleMetricAggOrFieldChange
                  }
                />
              )}
              {form.tab === "metricsAxes" && (
                <WidgetMetricStyleConfigSection
                  type={form.type}
                  metrics={form.config.metrics?.map(
                    (m: MetricConfig, idx: number) => ({
                      ...m,
                      label:
                        form.metricLabelStore.metricLabels[idx] ||
                        m.label ||
                        `Métrique ${idx + 1}`,
                    })
                  )}
                  metricStyles={form.config.metricStyles || []}
                  handleMetricStyleChange={(idx, field, value) => {
                    const newStyles = [...(form.config.metricStyles || [])];
                    newStyles[idx] = { ...newStyles[idx], [field]: value };
                    form.handleConfigChange("metricStyles", newStyles);
                  }}
                />
              )}
              {form.tab === "params" && (
                <WidgetParamsConfigSection
                  type={form.type}
                  config={form.config}
                  handleConfigChange={form.handleConfigChange}
                />
              )}
            </div>
            {/* Footer : boutons sticky en bas */}
            <WidgetConfigFooter
              step={2}
              loading={loading}
              onPrev={() => navigate(ROUTES.widgets)}
              onNext={() => {}}
              onSave={() => form.setShowSaveModal(true)}
              isSaving={loading}
            />
          </div>
        </div>
      </div>
      {/* Modal de confirmation pour le titre du widget */}
      <WidgetSaveTitleModal
        open={form.showSaveModal}
        onClose={() => form.setShowSaveModal(false)}
        title={form.widgetTitle}
        setTitle={form.setWidgetTitle}
        visibility={form.visibility}
        setVisibility={form.setVisibility}
        error={form.widgetTitleError}
        setError={form.setWidgetTitleError}
        loading={loading}
        onConfirm={() => {
          if (!form.widgetTitle.trim()) {
            form.setWidgetTitleError("Le titre est requis");
            return;
          }
          form.setShowSaveModal(false);
          handleSave();
        }}
      />
    </>
  );
}
