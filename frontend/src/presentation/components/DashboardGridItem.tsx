import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useGridItem } from "@/core/hooks/useGridItem";
import type { DashboardGridItemProps } from "@/core/types/dashboard-types";

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
  // isLoading = false,
  sources,
  onRemove,
  onSwapLayout,
  timeRangeFrom,
  timeRangeTo,
  refreshMs,
}: DashboardGridItemProps) {
  const {
    widgetData,
    // loading,
    isRefreshing,
    // error,
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
    timeRangeFrom,
    timeRangeTo,
    refreshMs,
    // Les props relatives ne sont plus nécessaires
  });
  const widgetRef = handleResize();

  // Overlay spinner pour le rafraîchissement asynchrone
  const RefreshOverlay = isRefreshing ? (
    <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-gray-900/20 z-30 pointer-events-none">
      <EllipsisVerticalIcon className="w-8 h-8 animate-spin text-indigo-400 opacity-80" />
    </div>
  ) : null;

  return (
    <div
      ref={editMode ? widgetRef : undefined}
      key={item?.widgetId || idx}
      className={styleProps.className}
      style={styleProps.style}
      {...dragProps}
    >
      {/* Menu d'édition (supprimer) */}
      {editMode && onRemove && (
        <Menu as="div" className="absolute top-2 right-2 z-20 text-left">
          <MenuButton className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </MenuButton>
          <MenuItems className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <MenuItem>
              <button
                onClick={onRemove}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md gap-2 transition-colors text-red-600 dark:text-red-300`}
              >
                <TrashIcon className="w-4 h-4" />
                Supprimer
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      )}
      {/* Affichage du widget ou des messages d'état */}
      {WidgetComponent ? (
        <div className="relative w-full h-full">
          <WidgetComponent
            data={widgetData ?? []}
            config={config}
            editMode={editMode}
          />
          {RefreshOverlay}
        </div>
      ) : null}
    </div>
  );
}
