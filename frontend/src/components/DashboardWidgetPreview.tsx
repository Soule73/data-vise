import { WIDGETS } from "./widgets";
import { useSourceData } from "@/hooks/useSourceData";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface DashboardWidgetPreviewProps {
  widget: any;
  sources: any[];
  onRemove?: () => void;
  editMode?: boolean;
}

export default function DashboardWidgetPreview({
  widget,
  sources,
  onRemove,
  editMode,
}: DashboardWidgetPreviewProps) {
  const source = sources.find(
    (s) => String(s._id) === String(widget.dataSourceId)
  );
  const initialData = Array.isArray(source?.data) ? source.data : undefined;
  const {
    data: widgetData,
    loading,
    error,
  } = useSourceData(source?.endpoint, initialData);
  const widgetDef = WIDGETS[widget.type as keyof typeof WIDGETS];
  const WidgetComponent = widgetDef?.component;
  let dataError = "";
  if (!source) {
    dataError = "Source de données introuvable.";
  } else if (error) {
    dataError = error;
  } else if (!loading && (!widgetData || !widgetData.length)) {
    dataError = "Aucune donnée disponible pour cette source.";
  }
  if (!WidgetComponent) return null;
  return (
    <div className="relative group">
      {editMode && onRemove && (
        <Menu as="div" className="absolute top-2 right-2 z-20 text-left">
          <MenuButton className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </MenuButton>
          <MenuItems className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={onRemove}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md gap-2 transition-colors ${
                    active
                      ? "bg-red-50 dark:bg-red-700 text-red-700 dark:text-white"
                      : "text-red-600 dark:text-red-300"
                  }`}
                >
                  <TrashIcon className="w-4 h-4" />
                  Supprimer
                </button>
              )}
            </MenuItem>
            {/* D'autres actions pourront être ajoutées ici */}
          </MenuItems>
        </Menu>
      )}
      {loading ? (
        <div className="text-sm text-gray-400">Chargement des données…</div>
      ) : dataError ? (
        <div className="text-sm text-red-500">{dataError}</div>
      ) : (
        <WidgetComponent data={widgetData} config={widget.config} />
      )}
    </div>
  );
}
