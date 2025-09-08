import { useWidgetCreateForm } from "@hooks/widget/useWidgetCreateForm";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import type { WidgetType } from "@type/widgetTypes";
import WidgetFormLayout from "@components/widgets/WidgetFormLayout";

export default function WidgetCreatePage() {
  const [searchParams] = useSearchParams();
  const sourceIdFromUrl = searchParams.get("sourceId") || "";
  const typeFromUrl = (searchParams.get("type") as WidgetType) || "bar";

  const {
    type,
    setType,
    sourceId,
    setSourceId,
    columns,
    dataPreview,
    config,
    loadSourceColumns,
    handleConfigChange,
    createMutation,
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
    handleCreate,
    isPreviewReady,
    metricsWithLabels,
    handleMetricStyleChange,
    error
  } = useWidgetCreateForm({
    sourceId: sourceIdFromUrl,
    type: typeFromUrl,
  });

  // Charger automatiquement les colonnes si une source est pré-sélectionnée
  useEffect(() => {
    if (sourceIdFromUrl && sourceIdFromUrl !== sourceId) {
      setSourceId(sourceIdFromUrl);
    }
    if (typeFromUrl && typeFromUrl !== type) {
      setType(typeFromUrl);
    }
  }, [sourceIdFromUrl, typeFromUrl, sourceId, type, setSourceId, setType]);

  useEffect(() => {
    if (sourceId && columns.length === 0) {
      loadSourceColumns();
    }
  }, [sourceId, columns.length, loadSourceColumns]);

  const handleSave = () => {
    setShowSaveModal(true);
  };

  return (
    <WidgetFormLayout
      title="Créer une visualisation"
      isLoading={createMutation.isPending}
      onSave={handleSave}
      saveButtonText="Enregistrer"
      showCancelButton={false}
      WidgetComponent={WidgetComponent}
      dataPreview={dataPreview}
      config={config}
      metricsWithLabels={metricsWithLabels}
      isPreviewReady={isPreviewReady}
      type={type}
      tab={tab}
      setTab={setTab}
      columns={columns}
      handleConfigChange={handleConfigChange}
      handleDragStart={handleDragStart}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
      handleMetricStyleChange={handleMetricStyleChange}
      showSaveModal={showSaveModal}
      setShowSaveModal={setShowSaveModal}
      widgetTitle={widgetTitle}
      setWidgetTitle={setWidgetTitle}
      visibility={visibility}
      setVisibility={setVisibility}
      widgetTitleError={widgetTitleError}
      setWidgetTitleError={setWidgetTitleError}
      onModalConfirm={handleCreate}
      error={error}
    />
  );
}
