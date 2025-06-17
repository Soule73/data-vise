import { useWidgets } from "@/core/hooks/useWidgets";
import ModalSidebarRight from "@/presentation/components/ModalSidebarRight";
import Button from "@/presentation/components/Button";
import type { WidgetSelectModalProps } from "@/core/types/widget-types";
import type { Widget } from "@/core/models/Widget";

export default function WidgetSelectModal({
  open,
  onClose,
  onSelect,
}: WidgetSelectModalProps) {
  const { data: widgets = [], isLoading } = useWidgets();

  return (
    <ModalSidebarRight
      size="lg"
      open={open}
      onClose={onClose}
      title="Ajouter une visualisation existante"
    >
      {isLoading ? (
        <div>Chargement…</div>
      ) : (
        <div className="space-y-2 config-scrollbar overflow-y-auto">
          {widgets.length === 0 && (
            <div className="text-gray-500 text-sm">
              Aucune visualisation disponible.
            </div>
          )}
          {widgets.map((w: Widget) => (
            <div
              key={w._id}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 border border-gray-200 dark:border-gray-700"
            >
              <div>
                <div className="font-semibold text-sm dark:text-white">
                  {w.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {w.type}
                </div>
              </div>
              <div>
                <Button color="indigo" size="sm" onClick={() => onSelect(w)}>
                  Ajouter
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalSidebarRight>
  );
}
