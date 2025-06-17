import { useEffect } from "react";
import { useWidgetCreateForm } from "../../core/hooks/useWidgetCreateForm";
import { WIDGET_DATA_CONFIG } from "@/data/adapters/visualizations";
import SelectField from "@/presentation/components/SelectField";
import { useNotificationStore } from "@/core/store/notification";
import { useDashboardStore } from "@/core/store/dashboard";

import WidgetConfigTabs from "@/presentation/components/WidgetConfigTabs";
import WidgetDataConfigSection from "@/presentation/components/WidgetDataConfigSection";
import WidgetConfigFooter from "@/presentation/components/WidgetConfigFooter";
import WidgetSaveTitleModal from "@/presentation/components/WidgetSaveTitleModal";
import WidgetMetricStyleConfigSection from "@/presentation/components/WidgetMetricStyleConfigSection";
import WidgetParamsConfigSection from "@/presentation/components/WidgetParamsConfigSection";
import type { WidgetType } from "@/core/types/widget-types";
import { ROUTES } from "@/core/constants/routes";
import VisualizationTypeSelector from "../components/visualizations/VisualizationTypeSelector";
import type { DataSource } from "@/core/types/data-source";

export default function WidgetCreatePage() {
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
    setTitle,
    loading,
    error,
    loadSourceColumns,
    handleConfigChange,
    createMutation,
    sources,
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
    notif,
  } = useWidgetCreateForm();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);

  // Affiche la notification globale lors du succès/erreur
  useEffect(() => {
    if (notif.open) {
      showNotification({
        open: true,
        type: notif.type,
        title: notif.type === "success" ? "Succès" : "Erreur",
        description: notif.message,
      });
    }
  }, [notif, showNotification]);

  // Breadcrumb dynamique pour la création
  useEffect(() => {
    setBreadcrumb([
      { url: ROUTES.widgets, label: "Visualisations" },
      { url: ROUTES.createWidget, label: widgetTitle || "Créer" },
    ]);
  }, [widgetTitle, setBreadcrumb]);

  // Sécurisation du rendu du WidgetComponent (preview)
  const isPreviewReady =
    WidgetComponent &&
    dataPreview &&
    Array.isArray(dataPreview) &&
    config &&
    Object.keys(config).length > 0;

  return (
    <>
      <div className="lg:h-[90vh] h-full flex flex-col min-h-0 overflow-hidden">
        <div className="flex flex-col md:flex-row lg:flex-row h-full min-h-0 gap-2">
          {/* Colonne aperçu (preview) : sticky/fixée, jamais scrollable */}
          <div className="order-1 md:w-1/2 lg:w-2/3 flex-shrink-0 flex flex-col lg:sticky lg:top-0 h-full p-1 md:p-2 ">
            {isPreviewReady ? (
              <WidgetComponent
                data={dataPreview}
                config={{ ...config, title: config.title }}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm">
                Sélectionnez un type et une source pour prévisualiser
              </div>
            )}
          </div>
          {/* Colonne config (droite) : scrollable indépendamment, boutons sticky en bas */}
          <div className="order-2 md:w-1/2 lg:w-1/3 flex flex-col h-[90vh] bg-gray-300/30 dark:bg-gray-900/30 rounded shadow relative">
            {/* Tabs */}
            <WidgetConfigTabs tab={tab} setTab={setTab} />
            {/* Contenu scrollable : tout sauf les boutons */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pb-24 config-scrollbar md:px-2">
              {step === 1 ? (
                <>
                  <SelectField
                    label="Source de données"
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    name="sourceId"
                    id="widget-source"
                    options={[
                      { value: "", label: "Sélectionner une source" },
                      ...sources.map((s: DataSource) => ({
                        value: s._id,
                        label: s.name,
                      })),
                    ]}
                  />
                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <VisualizationTypeSelector
                    type={type as WidgetType}
                    setType={(newType: WidgetType) => {
                      setType(newType);
                      // setStep(2); // Passer à l'étape de configuration
                    }}
                  />
                </>
              ) : (
                <>
                  {tab === "data" && (
                    <WidgetDataConfigSection
                      type={type}
                      dataConfig={WIDGET_DATA_CONFIG[type as WidgetType]}
                      config={{
                        ...config,
                        metrics: config.metrics.map(
                          (m: Record<string, unknown>, idx: number) => ({
                            ...m,
                            label:
                              metricLabelStore.metricLabels[idx] ||
                              m.label ||
                              `Métrique ${idx + 1}`,
                          })
                        ),
                      }}
                      columns={columns}
                      data={dataPreview}
                      handleConfigChange={handleConfigChange}
                      handleDragStart={handleDragStart}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                      handleMetricAggOrFieldChange={
                        handleMetricAggOrFieldChange
                      }
                    />
                  )}
                  {tab === "metricsAxes" && (
                    <WidgetMetricStyleConfigSection
                      type={type}
                      metrics={config.metrics.map(
                        (m: Record<string, unknown>, idx: number) => ({
                          ...m,
                          label:
                            metricLabelStore.metricLabels[idx] ||
                            m.label ||
                            `Métrique ${idx + 1}`,
                        })
                      )}
                      metricStyles={config.metricStyles || []}
                      handleMetricStyleChange={(idx, field, value) => {
                        const newStyles = [...(config.metricStyles || [])];
                        newStyles[idx] = { ...newStyles[idx], [field]: value };
                        handleConfigChange("metricStyles", newStyles);
                      }}
                    />
                  )}
                  {tab === "params" && (
                    <WidgetParamsConfigSection
                      type={type}
                      config={config}
                      handleConfigChange={handleConfigChange}
                    />
                  )}
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                </>
              )}
            </div>
            {/* Footer : boutons sticky en bas */}
            <WidgetConfigFooter
              step={step}
              loading={loading}
              onPrev={() => setStep(1)}
              onNext={loadSourceColumns}
              onSave={() => setShowSaveModal(true)}
              isSaving={createMutation.isPending}
            />
          </div>
        </div>
      </div>
      {/* Modal de confirmation pour le titre du widget */}
      <WidgetSaveTitleModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title={widgetTitle}
        setTitle={setWidgetTitle}
        visibility={visibility}
        setVisibility={setVisibility}
        error={widgetTitleError}
        setError={setWidgetTitleError}
        loading={createMutation.isPending}
        onConfirm={() => {
          if (!widgetTitle.trim()) {
            setWidgetTitleError("Le titre est requis");
            return;
          }
          setTitle(widgetTitle);
          setShowSaveModal(false);
          createMutation.mutate();
        }}
      />
    </>
  );
}
