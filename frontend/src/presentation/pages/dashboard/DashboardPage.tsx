import DashboardGrid from "@components/dashoards/DashboardGrid";
import WidgetSelectModal from "@components/widgets/WidgetSelectModal";
import { useDashboard } from "@hooks/dashboard/useDashboard";
import DashboardHeader from "@components/dashoards/DashboardHeader";
import { EmptyDashboard } from "@components/dashoards/EmptyDashboard";
import { DashboardSaveModal } from "@components/DashboardSaveModal";
import ExportPDFModal from "@components/ExportPDFModal";
import DashboardConfigFields from "@components/dashoards/DashboardConfigFields";

export default function DashboardPage() {
  const {
    sources,
    saving,
    selectOpen,
    setSelectOpen,
    layout = [],
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

  const canUpdate = hasPermission("dashboard:canUpdate");
  const isEditing = editMode || isCreate;
  const isEmpty = layout.length === 0;

  const gridProps = {
    layout,
    sources: sources ?? [],
    handleAddWidget: openAddWidgetModal,
    timeRangeFrom: effectiveFrom,
    timeRangeTo: effectiveTo,
    refreshMs,
    forceRefreshKey,
    hasUnsavedChanges,
  };
  const swapHandler = isEditing ? handleSwapLayout : undefined;

  return (
    <>
      <WidgetSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        onSelect={handleAddWidget}
      />

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

      <DashboardHeader
        editMode={editMode}
        isCreate={isCreate}
        hasPermission={hasPermission}
        openAddWidgetModal={openAddWidgetModal}
        handleSave={handleSave}
        handleCancelEdit={handleCancelEdit}
        setEditMode={setEditMode}
        saving={saving}
        shareLoading={shareLoading}
        shareError={shareError}
        shareLink={shareLink}
        isShareEnabled={isShareEnabled}
        currentShareId={currentShareId}
        handleEnableShare={handleEnableShare}
        handleDisableShare={handleDisableShare}
        handleCopyShareLink={handleCopyShareLink}
        handleExportPDF={() => setExportPDFModalOpen(true)}
      >
        {canUpdate && (
          <DashboardConfigFields
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
            onSave={handleSaveConfig}
            saving={saving}
            onForceRefresh={() => setForceRefreshKey((k) => k + 1)}
          />
        )}
      </DashboardHeader>

      <ExportPDFModal
        open={exportPDFModalOpen}
        onClose={() => setExportPDFModalOpen(false)}
        onExport={handleExportPDF}
      />

      {isEmpty ? (
        <EmptyDashboard />
      ) : (
        <DashboardGrid
          {...gridProps}
          editMode={isEditing}
          onSwapLayout={swapHandler}
        />
      )}
    </>
  );
}
