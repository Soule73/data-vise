import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useGridItem } from "@hooks/dashboard/useGridItem";
import type { DashboardGridItemProps } from "@type/dashboardTypes";
import { Link } from "react-router-dom";
import { ROUTES } from "@constants/routes";

function RefreshOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-gray-900/20 z-30 pointer-events-none">
      <EllipsisVerticalIcon className="w-8 h-8 animate-spin text-indigo-400 opacity-80" />
    </div>
  );
}

export default function DashboardGridItem(props: DashboardGridItemProps) {

  const {
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
    sources,
    onRemove,
    onSwapLayout,
    timeRangeFrom,
    timeRangeTo,
    forceRefreshKey,
    page,
    pageSize,
    shareId,
    refreshMs,
  } = props;

  const {
    widgetData,
    isRefreshing,
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
    timeRangeFrom,
    timeRangeTo,
    forceRefreshKey,
    page,
    pageSize,
    shareId,
    refreshMs
  });
  const widgetRef = handleResize();

  return (
    <div
      ref={editMode ? widgetRef : undefined}
      key={item?.widgetId || idx}
      className={"dashboard-widget " + styleProps.className}
      style={styleProps.style}
      {...dragProps}
    >
      {editMode && onRemove && (
        <Menu as="div" className="absolute top-2 right-2 z-50 text-left">
          <MenuButton className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </MenuButton>
          <MenuItems className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <MenuItem>
              <button
                onClick={onRemove}
                className="flex items-center w-full px-3 py-2 text-sm rounded-md gap-2 transition-colors text-red-600 dark:text-red-300"
              >
                <TrashIcon className="w-4 h-4" />
                Supprimer
              </button>
            </MenuItem>
            <MenuItem>
              {item && (
                <Link
                  to={ROUTES.editWidget.replace(":id", item?.widget?._id ?? "")}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-md gap-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <EllipsisVerticalIcon className="w-4 h-4" />
                  Éditer
                </Link>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      )}

      {WidgetComponent && (
        <>
          <WidgetComponent
            data={widgetData ?? []}
            config={config}
            editMode={editMode}
          />
          {isRefreshing && <RefreshOverlay />}
        </>
      )}
    </div>
  );
}
