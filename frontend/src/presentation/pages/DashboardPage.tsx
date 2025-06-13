import DashboardGrid from "@/presentation/components/DashboardGrid";
import Button from "@/presentation/components/Button";
import WidgetSelectModal from "@/presentation/components/WidgetSelectModal";
import { useDashboard } from "@/core/hooks/useDashboard";
import Modal from "@/presentation/components/Modal";
import InputField from "@/presentation/components/InputField";

export default function DashboardPage() {
  const {
    isLoading,
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
  } = useDashboard();

  // UI purement déclarative, tout le reste est dans le hook
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
        title="Titre du dashboard"
      >
        <div className="space-y-4">
          <InputField
            label="Titre du dashboard"
            value={pendingTitle}
            onChange={(e) => {
              setPendingTitle(e.target.value);
              if (isCreate && setLocalTitle) setLocalTitle(e.target.value);
            }}
            required
            autoFocus
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
              onClick={handleConfirmSave}
              disabled={!pendingTitle.trim()}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>
      <div className="flex items-center justify-between mb-2">
        {editMode || isCreate ? (
          <div className="flex items-center gap-2 md:gap-4">
            <a
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectOpen(true);
              }}
            >
              Ajouter un widget
            </a>
            <a
              href="#"
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </a>
            {editMode && !isCreate && (
              <a
                href="#"
                className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  handleCancelEdit();
                }}
              >
                Annuler
              </a>
            )}
          </div>
        ) : !isCreate ? (
          <div>
            <a
              href="#"
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              onClick={(e) => {
                e.preventDefault();
                setEditMode(true);
              }}
            >
              Modifier
            </a>
          </div>
        ) : null}
      </div>
      {isCreate ? (
        layout.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            Aucun widget sur ce dashboard.
            <br />
            Cliquez sur "Sauvegarder" après avoir donné un titre pour créer
            votre dashboard.
          </div>
        ) : (
          <DashboardGrid
            isLoading={isLoading}
            layout={layout}
            onSwapLayout={handleSwapLayout}
            sources={sources ?? []}
            editMode={true}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )
      ) : isLoading ? (
        <div>Chargement…</div>
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
