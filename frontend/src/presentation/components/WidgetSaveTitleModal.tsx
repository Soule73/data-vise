import Modal from "@/presentation/components/Modal";
import InputField from "@/presentation/components/InputField";
import Button from "@/presentation/components/Button";
import type { WidgetSaveTitleModalProps } from "@/core/types/widget-types";
import CheckboxField from "./CheckboxField";

export default function WidgetSaveTitleModal({
  open,
  onClose,
  title,
  setTitle,
  error,
  setError,
  onConfirm,
  loading,
  privateWidget,
  setPrivateWidget,
}: WidgetSaveTitleModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enregistrer la visualisation"
      size="sm"
      footer={null}
    >
      <div className="space-y-4">
        <InputField
          label="Titre du widget"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          error={error}
          autoFocus
          required
        />

        <div className="flex items-center gap-2">
          <CheckboxField
            label="Rendre le widget privé"
            checked={privateWidget == "private"}
            onChange={(val) => setPrivateWidget(val ? "private" : "public")}
            name="private-widget"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button color="gray" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button color="indigo" onClick={onConfirm} loading={loading}>
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
