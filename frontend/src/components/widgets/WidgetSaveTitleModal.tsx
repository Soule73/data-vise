import Modal from "@/components/Modal";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

interface WidgetSaveTitleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  setTitle: (t: string) => void;
  error: string;
  setError: (e: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function WidgetSaveTitleModal({
  open,
  onClose,
  title,
  setTitle,
  error,
  setError,
  onConfirm,
  loading,
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
