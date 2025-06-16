import {
  EllipsisVerticalIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useGridItem } from "@/core/hooks/useGridItem";
import type { DashboardGridItemProps } from "@/core/types/dashboard-types";
import { EmptyConfigWidget } from "./visualizations/charts/EmptyConfigWidget";

export default function DashboardGridItem({
  idx,
  hydratedLayout,
  editMode,
  item,
  widget,
  hoveredIdx,
  draggedIdx,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  isMobile,
  isLoading = false,
  sources,
  onRemove,
  onSwapLayout,
  // --- Ajout config avancée ---
  autoRefreshIntervalValue,
  autoRefreshIntervalUnit,
  timeRangeFrom,
  timeRangeTo,
}: DashboardGridItemProps) {
  const {
    widgetData,
    loading,
    error: dataError,
    WidgetComponent,
    config,
    handleResize,
    dragProps,
    styleProps,
  } = useGridItem({
    widget,
    sources,
    idx,
    hydratedLayout,
    editMode,
    onSwapLayout,
    hoveredIdx,
    draggedIdx,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    isMobile,
    item,
    // --- Ajout config avancée ---
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit,
    timeRangeFrom,
    timeRangeTo,
  });
  const widgetRef = handleResize();

  return (
    <div
      ref={editMode ? widgetRef : undefined}
      key={item?.widgetId || idx}
      className={styleProps.className}
      draggable={dragProps.draggable}
      onDragStart={dragProps.onDragStart}
      onDragOver={dragProps.onDragOver}
      onDrop={dragProps.onDrop}
      onDragEnd={dragProps.onDragEnd}
      style={{
        ...styleProps.style,
        ...(editMode ? { resize: "both", overflow: "auto" } : {}),
      }}
    >
      {/* Menu d'édition (supprimer) */}
      {editMode && onRemove && (
        <Menu as="div" className="absolute top-2 right-2 z-20 text-left">
          <MenuButton className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </MenuButton>
          <MenuItems className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
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
          </MenuItems>
        </Menu>
      )}
      {/* Affichage du widget ou des messages d'état */}
      {isLoading || loading ? (
        <EmptyConfigWidget
          icon={
            <EllipsisVerticalIcon className="w-12 h-12 text-gray-300 dark:text-gray-700" />
          }
          message="Chargement des données"
          details="Veuillez patienter pendant que les données sont récupérées."
        />
      ) : dataError || !widget ? (
        <EmptyConfigWidget
          icon={<ExclamationCircleIcon className="w-12 h-12 text-red-500" />}
          message="Erreur de données"
          details={
            dataError || "Impossible de récupérer les données pour ce widget."
          }
        />
      ) : (
        WidgetComponent && (
          <WidgetComponent
            data={widgetData}
            config={config}
            editMode={editMode}
          />
        )
      )}
    </div>
  );
}
