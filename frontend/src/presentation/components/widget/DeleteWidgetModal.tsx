import Modal from "@/presentation/components/Modal";
import Button from "@/presentation/components/forms/Button";
import type { Widget } from "@/core/types/widget-types";

export function DeleteWidgetModal({
  open,
  onClose,
  onDelete,
  loading,
  widget,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
  widget: Widget | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Supprimer le widget" size="sm">
      <div className="mb-4">
        Voulez-vous vraiment supprimer la visualisation
        <span className="font-semibold"> {widget?.title} </span> ? Cette action
        est irréversible.
        {widget?.isUsed && (
          <div className="mt-2 text-yellow-700 bg-yellow-100 rounded p-2 text-xs">
            Ce widget est utilisé dans au moins un dashboard. Vous ne pouvez pas
            le supprimer tant qu'il est utilisé.
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          color="red"
          onClick={onDelete}
          loading={loading}
          disabled={!!widget?.isUsed}
        >
          Supprimer
        </Button>
        <Button color="gray" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </Modal>
  );
}
