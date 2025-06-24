import WidgetConfigTabs from "@/presentation/components/widgets/WidgetConfigTabs";
import WidgetDataConfigSection from "@/presentation/components/widgets/WidgetDataConfigSection";
import WidgetConfigFooter from "@/presentation/components/widgets/WidgetConfigFooter";
import WidgetSaveTitleModal from "@/presentation/components/widgets/WidgetSaveTitleModal";
import WidgetMetricStyleConfigSection from "@/presentation/components/widgets/WidgetMetricStyleConfigSection";
import WidgetParamsConfigSection from "@/presentation/components/widgets/WidgetParamsConfigSection";
import { WIDGET_DATA_CONFIG } from "@/data/adapters/visualizations";
import { useWidgetEditForm } from "@/core/hooks/widget/useWidgetEditForm";

export default function WidgetEditPage() {
  const { loading, error, widget, formReady, form, handleConfirmSave } =
    useWidgetEditForm();

  if (loading || !formReady) return <div>Chargement…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!widget) return null;

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
                  config={{ ...form.config, metrics: form.metricsWithLabels }}
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
                  metrics={form.metricsWithLabels}
                  metricStyles={form.config.metricStyles || []}
                  handleMetricStyleChange={form.handleMetricStyleChange}
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
              onPrev={() => {
                form.setShowSaveModal(false);
                window.history.back();
              }}
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
        onConfirm={handleConfirmSave}
      />
    </>
  );
}
