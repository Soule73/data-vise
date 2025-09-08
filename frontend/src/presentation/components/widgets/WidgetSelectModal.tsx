import ModalSidebarRight from "@components/ModalSidebarRight";
import Button from "@components/forms/Button";
import InputField from "@components/forms/InputField";
import type { Widget, WidgetSelectModalProps } from "@type/widgetTypes";
import { WIDGETS } from "@adapters/visualizations";
import { useState, useMemo } from "react";
import { useWidgetsQuery } from "@repositories/widgets";

export default function WidgetSelectModal({
  open,
  onClose,
  onSelect,
}: WidgetSelectModalProps) {
  const { data: widgets = [], isLoading } = useWidgetsQuery();
  const [search, setSearch] = useState("");
  const filteredWidgets = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return widgets;
    return widgets.filter(
      (w: Widget) =>
        w.title.toLowerCase().includes(s) || w.type.toLowerCase().includes(s)
    );
  }, [widgets, search]);
  return (
    <ModalSidebarRight
      size="lg"
      open={open}
      onClose={onClose}
      title="Ajouter une visualisation"
    >
      <div className="mb-2">
        <InputField
          id="widget-search"
          name="widget-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou type..."
        />
      </div>
      {isLoading ? (
        <div>Chargement…</div>
      ) : (
        <div className="relative h-[calc(100%-50px)]">
          <div className="space-y-2 config-scrollbar overflow-y-auto absolute inset-0">
            {filteredWidgets.length === 0 && search.trim() !== "" && (
              <div className="text-gray-500 text-sm">
                Aucune visualisation trouvée pour "{search}"
              </div>
            )}
            {filteredWidgets.length === 0 && search.trim() === "" && (
              <div className="text-gray-500 text-sm">
                Aucune visualisation disponible
              </div>
            )}
            {filteredWidgets.map((w: Widget) => {
              const widgetDef = WIDGETS[w.type as keyof typeof WIDGETS];
              const Icon = widgetDef?.icon;
              return (
                <div
                  key={w._id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-6 h-6 text-indigo-500" />}
                    <div>
                      <div className="font-semibold text-sm dark:text-white">
                        {w.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {widgetDef?.label || w.type}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      color="indigo"
                      size="sm"
                      onClick={() => onSelect(w)}
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ModalSidebarRight>
  );
}
