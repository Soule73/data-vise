import Button from "@components/forms/Button";
import Modal from "@components/Modal";
import InputField from "@components/forms/InputField";
import CheckboxField from "@components/forms/CheckboxField";
import type { SaveModalProps } from "@type/dashboardTypes";

export function DashboardSaveModal(props: SaveModalProps) {
  const {
    saving,
    saveModalOpen,
    setSaveModalOpen,
    pendingTitle,
    setPendingTitle,
    handleConfirmSave,
    isCreate,
    setLocalTitle,
    visibility,
    setVisibility,
  } = props;
  return (
    <Modal
      open={saveModalOpen}
      onClose={() => setSaveModalOpen(false)}
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
          onChange={(checked) => setVisibility(checked ? "private" : "public")}
          name="dashboard-visibility"
        />
        <div className="flex gap-2 justify-end">
          <Button
            color="gray"
            variant="outline"
            disabled={saving}
            onClick={() => setSaveModalOpen(false)}
          >
            Annuler
          </Button>
          <Button
            color="green"
            className=" "
            onClick={() => handleConfirmSave(visibility)}
            disabled={saving || !pendingTitle.trim()}
          >
            {saving ? "Savegarde..." : "Confirmer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
