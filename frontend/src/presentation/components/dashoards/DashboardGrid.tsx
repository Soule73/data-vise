import { useDashboardGrid } from "@hooks/dashboard/useDashboardGrid";
import type { DashboardGridProps } from "@type/dashboard-types";
import { PlusIcon } from "@heroicons/react/24/outline";
import DashboardGridItem from "@components/dashoards/DashboardGridItem";

// Slot d'ajout de widget
function AddWidgetSlot({
  onClick,
  getSlotStyle,
}: {
  onClick: (e: React.MouseEvent) => void;
  getSlotStyle: () => React.CSSProperties;
}) {
  return (
    <div
      key="add-slot"
      className="relative min-h-[160px] w-full max-w-full border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer select-none overflow-x-auto"
      style={{ ...getSlotStyle(), minHeight: 300 }}
      onClick={onClick}
    >
      <PlusIcon className="w-6 h-6 text-gray-400" />
      <span className="ml-2">Ajouter un widget</span>
    </div>
  );
}

export default function DashboardGrid({
  layout,
  onSwapLayout,
  sources,
  editMode = false,
  hasUnsavedChanges = false,
  handleAddWidget,
  timeRangeFrom,
  timeRangeTo,
  forceRefreshKey,
  page,
  pageSize,
  shareId,
  refreshMs
}: DashboardGridProps) {

  const {
    draggedIdx,
    hoveredIdx,
    isMobile,
    slots,
    getSlotStyle,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleRemove,
  } = useDashboardGrid({
    layout,
    editMode,
    hasUnsavedChanges,
    onSwapLayout,
  });

  return (
    <div
      className={`dashboard-grid w-full flex flex-wrap min-w-full gap-2 ${editMode &&
        "border-2 border-dashed border-gray-300 dark:border-gray-700"
        }`}
    >
      {slots.map((item, idx) => {

        if (idx === slots.length - 1) {
          if (!editMode) return null;
          return (
            <AddWidgetSlot
              key={`add-slot-${idx}`}
              onClick={handleAddWidget}
              getSlotStyle={getSlotStyle}
            />
          );
        }

        const widget = item?.widget;

        if (!widget) return null;

        return (
          <DashboardGridItem
            key={widget.widgetId || idx}
            idx={idx}
            hydratedLayout={layout}
            editMode={editMode}
            item={item}
            widget={widget}
            hoveredIdx={hoveredIdx}
            draggedIdx={draggedIdx}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
            isMobile={isMobile}
            sources={sources}
            onRemove={editMode ? () => handleRemove(idx) : undefined}
            onSwapLayout={onSwapLayout}
            timeRangeFrom={timeRangeFrom}
            timeRangeTo={timeRangeTo}
            forceRefreshKey={forceRefreshKey}
            page={page}
            pageSize={pageSize}
            shareId={shareId}
            refreshMs={refreshMs}
          />
        );
      })}
    </div>
  );
}
