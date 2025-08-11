import Modal from "@components/Modal";
import Button from "@components/forms/Button";
import type { Widget } from "@type/widgetTypes";
import { TrashIcon } from "@heroicons/react/24/outline";

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
      <div className="mb-4 flex flex-col items-center gap-4">
        <TrashIcon className="h-6 w-6 text-red-600" />
        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          Voulez-vous vraiment supprimer la visualisation
          <span className="font-semibold"> {widget?.title} </span> ?
        </p>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Cette action est irréversible.
        </p>
        {widget?.isUsed && (
          <div className="mt-2 text-yellow-700 bg-yellow-100 rounded p-2 text-xs">
            Ce widget est utilisé dans au moins un dashboard. Vous ne pouvez pas
            le supprimer tant qu'il est utilisé.
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          className="!w-max"
          variant="outline"
          color="gray" onClick={onClose}>
          Annuler
        </Button>
        <Button
          color="red"
          className=" !w-max"
          onClick={onDelete}
          loading={loading}
          disabled={!!widget?.isUsed}
        >
          Supprimer
        </Button>
      </div>
    </Modal>
  );
}
