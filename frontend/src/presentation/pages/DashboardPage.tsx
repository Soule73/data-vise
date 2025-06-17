import DashboardGrid from "@/presentation/components/DashboardGrid";
import Button from "@/presentation/components/Button";
import WidgetSelectModal from "@/presentation/components/WidgetSelectModal";
import { useDashboard } from "@/core/hooks/useDashboard";
import Modal from "@/presentation/components/Modal";
import InputField from "@/presentation/components/InputField";
import { useUserStore } from "@/core/store/user";
import DashboardHeader from "../components/DashboardHeader";
import CheckboxField from "@/presentation/components/CheckboxField";

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
    titleModalOpen,
    setTitleModalOpen,
    pendingTitle,
    setPendingTitle,
    handleSave,
    handleConfirmSave,
    handleCancelEdit,
    isCreate,
    // --- config avancée ---
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit,
    timeRangeFrom,
    timeRangeTo,
    relativeValue,
    relativeUnit,
    timeRangeMode,
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
  } = useDashboard();

  const hasPermission = useUserStore((s) => s.hasPermission);

  const openAddWidgetModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectOpen(true);
  };

  return (
    <>
      <WidgetSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        onSelect={handleAddWidget}
      />
      <Modal
        open={titleModalOpen}
        onClose={() => setTitleModalOpen(false)}
        title="Sauvegarder"
      >
        <div className="space-y-4">
          <InputField
            label="Titre du tableau de bord"
            value={pendingTitle}
            onChange={(e) => {
              setPendingTitle(e.target.value);
              if (isCreate && setLocalTitle) setLocalTitle(e.target.value);
            }}
            required
            autoFocus
          />
          <CheckboxField
            label="Privé(visble uniquement par vous)"
            checked={visibility === "private"}
            onChange={(checked) =>
              setVisibility(checked ? "private" : "public")
            }
            name="dashboard-visibility"
          />
          <div className="flex gap-2 justify-end">
            <Button
              color="gray"
              variant="outline"
              onClick={() => setTitleModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              color="green"
              onClick={() => handleConfirmSave(visibility)}
              disabled={!pendingTitle.trim()}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>
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
      />
      <div className="flex flex-col md:flex-row space-y-4 justify-start items-start md:items-center md:justify-between mb-2"></div>
      {isCreate ? (
        layout.length === 0 ? (
          <div
            className="text-gray-400 dark:text-gray-500
           text-center py-12"
          >
            Aucun widget sur ce dashboard.
            <br />
            Cliquez sur "Sauvegarder" après avoir donné un titre pour créer
            votre dashboard.
          </div>
        ) : (
          <DashboardGrid
            isLoading={false}
            layout={layout}
            onSwapLayout={handleSwapLayout}
            sources={sources ?? []}
            editMode={true}
            hasUnsavedChanges={hasUnsavedChanges}
            handleAddWidget={openAddWidgetModal}
            // --- Ajout config avancée ---
            timeRangeFrom={effectiveFrom}
            timeRangeTo={effectiveTo}
            refreshMs={refreshMs}
          />
        )
      ) : layout.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          Aucun widget sur ce dashboard.
          <br />
          Cliquez sur "Ajouter un widget" pour commencer.
        </div>
      ) : (
        <DashboardGrid
          layout={layout}
          onSwapLayout={editMode ? handleSwapLayout : undefined}
          sources={sources ?? []}
          editMode={editMode}
          hasUnsavedChanges={hasUnsavedChanges}
          handleAddWidget={openAddWidgetModal}
          // --- Ajout config avancée ---
          timeRangeFrom={effectiveFrom}
          timeRangeTo={effectiveTo}
          refreshMs={refreshMs}
        />
      )}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow">
          Sauvegarde…
        </div>
      )}
    </>
  );
}
