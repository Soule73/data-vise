import DashboardGrid from "@/components/DashboardGrid";
import Button from "@/components/Button";
import WidgetSelectModal from "@/components/WidgetSelectModal";
import { useDashboard } from "@/hooks/useDashboard";

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
    handleSaveDashboard,
    handleSwapLayout,
  } = useDashboard();

  const handleSave = () => {
    handleSaveDashboard().then(() => {
      setEditMode(false);
    });
  };

  return (
    <>
      <WidgetSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        onSelect={handleAddWidget}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold ">Tableau de bord</h1>
        {editMode ? (
          <div className="flex items-center gap-2">
            <Button
              color="indigo"
              className=" !min-w-42"
              size="md"
              onClick={() => setSelectOpen(true)}
            >
              Ajouter un widget
            </Button>
            <Button
              color="green"
              size="md"
              onClick={handleSave}
              loading={saving}
            >
              Sauvegarder
            </Button>
            <Button
              color="gray"
              variant="outline"
              size="md"
              onClick={() => setEditMode(false)}
            >
              Annuler
            </Button>
          </div>
        ) : (
          <div>
            <Button
              color="indigo"
              size="md"
              variant="outline"
              className=" w-max"
              onClick={() => setEditMode(true)}
            >
              Modifier
            </Button>
          </div>
        )}
      </div>
      {isLoading ? (
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
