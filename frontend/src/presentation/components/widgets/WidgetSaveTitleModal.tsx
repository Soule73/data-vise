import Modal from "@components/Modal";
import InputField from "@components/forms/InputField";
import Button from "@components/forms/Button";
import type { WidgetSaveTitleModalProps } from "@type/widgetTypes";
import CheckboxField from "@components/forms/CheckboxField";

export default function WidgetSaveTitleModal({
  open,
  onClose,
  title,
  setTitle,
  error,
  setError,
  onConfirm,
  loading,
  visibility,
  setVisibility,
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
            checked={visibility == "private"}
            onChange={(val) => setVisibility(val ? "private" : "public")}
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
