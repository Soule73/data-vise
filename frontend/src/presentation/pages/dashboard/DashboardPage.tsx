import DashboardGrid from "@/presentation/components/dashoards/DashboardGrid";
import WidgetSelectModal from "@/presentation/components/widgets/WidgetSelectModal";
import { useDashboard } from "@/core/hooks/dashboard/useDashboard";
import DashboardHeader from "../../components/dashoards/DashboardHeader";
import { EmptyDashboard } from "@/presentation/components/dashoards/EmptyDashboard";
import { DashboardSaveModal } from "./DashboardSaveModal";
import ExportPDFModal from "@/presentation/components/ExportPDFModal";

export default function DashboardPage() {

  const {
    sources,
    saving,
    selectOpen,
    setSelectOpen,
    layout,
    editMode,
    setEditMode,
    hasUnsavedChanges,
    handleAddWidget,
    handleSwapLayout,
    setLocalTitle,
    saveModalOpen,
    setSaveModalOpen,
    pendingTitle,
    setPendingTitle,
    handleSave,
    handleConfirmSave,
    handleCancelEdit,
    isCreate,
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit,
    timeRangeFrom,
    timeRangeTo,
    relativeValue,
    relativeUnit,
    timeRangeMode,
    forceRefreshKey,
    setForceRefreshKey,
    handleChangeAutoRefresh,
    handleChangeTimeRangeAbsolute,
    handleChangeTimeRangeRelative,
    handleChangeTimeRangeMode,
    handleSaveConfig,
    effectiveFrom,
    effectiveTo,
    refreshMs,
    visibility,
    setVisibility,
    hasPermission,
    openAddWidgetModal,
    shareLoading,
    shareError,
    shareLink,
    isShareEnabled,
    currentShareId,
    handleEnableShare,
    handleDisableShare,
    handleCopyShareLink,
    handleExportPDF,
    exportPDFModalOpen,
    setExportPDFModalOpen,
  } = useDashboard();

  return (
    <>
      {/* Sélecteur de widget */}
      <WidgetSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        onSelect={handleAddWidget}
      />
      {/* Modal de sauvegarde */}
      <DashboardSaveModal
        saving={saving}
        saveModalOpen={saveModalOpen}
        setSaveModalOpen={setSaveModalOpen}
        pendingTitle={pendingTitle}
        setPendingTitle={setPendingTitle}
        handleConfirmSave={handleConfirmSave}
        isCreate={isCreate}
        setLocalTitle={setLocalTitle}
        visibility={visibility}
        setVisibility={setVisibility}
      />
      {/* Header dashboard */}
      <DashboardHeader
        editMode={editMode}
        isCreate={isCreate}
        hasPermission={hasPermission}
        openAddWidgetModal={openAddWidgetModal}
        handleSave={handleSave}
        handleCancelEdit={handleCancelEdit}
        setEditMode={setEditMode}
        saving={saving}
        handleSaveConfig={handleSaveConfig}
        autoRefreshIntervalValue={autoRefreshIntervalValue}
        autoRefreshIntervalUnit={autoRefreshIntervalUnit}
        timeRangeFrom={timeRangeFrom}
        timeRangeTo={timeRangeTo}
        relativeValue={relativeValue}
        relativeUnit={relativeUnit}
        timeRangeMode={timeRangeMode}
        handleChangeAutoRefresh={handleChangeAutoRefresh}
        handleChangeTimeRangeAbsolute={handleChangeTimeRangeAbsolute}
        handleChangeTimeRangeRelative={handleChangeTimeRangeRelative}
        handleChangeTimeRangeMode={handleChangeTimeRangeMode}
        savingConfig={saving}
        onForceRefresh={() => setForceRefreshKey((k) => k + 1)}
        shareLoading={shareLoading}
        shareError={shareError}
        shareLink={shareLink}
        isShareEnabled={isShareEnabled}
        currentShareId={currentShareId}
        handleEnableShare={handleEnableShare}
        handleDisableShare={handleDisableShare}
        handleCopyShareLink={handleCopyShareLink}
        handleExportPDF={() => setExportPDFModalOpen(true)}
      />
      {/* Modal d'export PDF */}
      <ExportPDFModal
        open={exportPDFModalOpen}
        onClose={() => setExportPDFModalOpen(false)}
        onExport={handleExportPDF}
      />
      {/* Grille ou placeholder */}
      {isCreate ? (
        layout.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <DashboardGrid
            layout={layout ?? []}
            onSwapLayout={handleSwapLayout}
            sources={sources ?? []}
            editMode={true}
            hasUnsavedChanges={hasUnsavedChanges}
            handleAddWidget={openAddWidgetModal}
            timeRangeFrom={effectiveFrom}
            timeRangeTo={effectiveTo}
            refreshMs={refreshMs}
            forceRefreshKey={forceRefreshKey}
          />
        )
      ) : layout.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <DashboardGrid
          layout={layout}
          onSwapLayout={editMode ? handleSwapLayout : undefined}
          sources={sources ?? []}
          editMode={editMode}
          hasUnsavedChanges={hasUnsavedChanges}
          handleAddWidget={openAddWidgetModal}
          timeRangeFrom={effectiveFrom}
          timeRangeTo={effectiveTo}
          refreshMs={refreshMs}
          forceRefreshKey={forceRefreshKey}
        />
      )}
    </>
  );
}
