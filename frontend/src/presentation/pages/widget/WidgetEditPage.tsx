import { useWidgetEditForm } from "@hooks/widget/useWidgetEditForm";
import WidgetFormLayout from "@components/widgets/WidgetFormLayout";

export default function WidgetEditPage() {
  const { loading, error, widget, formReady, form, handleConfirmSave } =
    useWidgetEditForm();

  if (loading || !formReady) return <div>Chargement…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!widget) return null;

  const handleSave = () => {
    form.setShowSaveModal(true);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <WidgetFormLayout
      title="Modifier la visualisation"
      isLoading={loading}
      onSave={handleSave}
      onCancel={handleCancel}
      saveButtonText="Enregistrer"
      showCancelButton={true}
      WidgetComponent={form.WidgetComponent}
      dataPreview={form.dataPreview}
      config={form.config}
      metricsWithLabels={form.metricsWithLabels}
      isPreviewReady={!!form.WidgetComponent}
      type={form.type}
      tab={form.tab}
      setTab={form.setTab}
      columns={form.columns}
      handleConfigChange={form.handleConfigChange}
      handleDragStart={form.handleDragStart}
      handleDragOver={form.handleDragOver}
      handleDrop={form.handleDrop}
      handleMetricAggOrFieldChange={form.handleMetricAggOrFieldChange}
      handleMetricStyleChange={form.handleMetricStyleChange}
      showSaveModal={form.showSaveModal}
      setShowSaveModal={form.setShowSaveModal}
      widgetTitle={form.widgetTitle}
      setWidgetTitle={form.setWidgetTitle}
      visibility={form.visibility}
      setVisibility={form.setVisibility}
      widgetTitleError={form.widgetTitleError}
      setWidgetTitleError={form.setWidgetTitleError}
      onModalConfirm={handleConfirmSave}
    />
  );
}
