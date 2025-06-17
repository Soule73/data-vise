import DashboardGridItem from "./DashboardGridItem";
import { useDashboardGrid } from "@/core/hooks/useDashboardGrid";
import { useWidgets } from "@/core/hooks/useWidgets";
import { useEffect, useState } from "react";
import type {
  DashboardGridProps,
  DashboardLayoutItem,
} from "@/core/types/dashboard-types";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function DashboardGrid({
  layout,
  onSwapLayout,
  sources,
  editMode = false,
  isLoading = false,
  hasUnsavedChanges = false,
  handleAddWidget,
  timeRangeFrom,
  timeRangeTo,
  refreshMs,
}: DashboardGridProps) {
  const {
    data: widgets = [],
    // isLoading
  } = useWidgets();

  // Hydrate le layout avec le widget complet si absent
  const hydratedLayout = layout.map((item) => {
    if (item.widget) return item;
    const widget = widgets.find(
      (w: any) => w.widgetId === item.widgetId || w._id === item.widgetId
    );
    return widget ? { ...item, widget } : item;
  });

  // Wrapper pour tracer les appels à onSwapLayout (resize/swap)
  const handleSwapLayout = (newLayout: DashboardLayoutItem[]) => {
    onSwapLayout && onSwapLayout(newLayout);
  };

  const {
    draggedIdx,
    hoveredIdx,
    isMobile,
    slots,
    getSlotStyle, // <-- Utilisation de la fonction centralisée
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleRemove,
  } = useDashboardGrid({
    layout: hydratedLayout,
    editMode,
    hasUnsavedChanges,
    onSwapLayout: handleSwapLayout,
  });

  // Ajout d'un effet pour forcer le recalcul du responsive lors du resize de la fenêtre
  const [, setDummyState] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setDummyState((v) => v + 1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`w-full flex flex-wrap min-w-full ${
        editMode
          ? "border-2 border-dashed border-gray-300 dark:border-gray-700"
          : ""
      }`}
      style={{
        gap: 8,
        // margin: "0 auto",
        // alignItems: "stretch",
      }}
    >
      {slots.map((item, idx) => {
        if (idx === slots.length - 1) {
          if (!editMode) return null;
          return (
            <div
              key="add-slot"
              className="relative min-h-[160px] w-full max-w-full border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer select-none overflow-x-auto"
              style={{ ...getSlotStyle(), minHeight: 300 }}
              onClick={(e) => {
                if (editMode && onSwapLayout) {
                  onSwapLayout(layout);
                }
                handleAddWidget(e);
              }}
            >
              <PlusIcon className="w-6 h-6 text-gray-400" />
              <span className="ml-2">Ajouter un widget</span>
            </div>
          );
        }
        const widget = item?.widget;
        return (
          <DashboardGridItem
            key={widget.widgetId || idx}
            idx={idx}
            hydratedLayout={hydratedLayout}
            editMode={editMode}
            item={item}
            widget={widget}
            isLoading={isLoading}
            hoveredIdx={hoveredIdx}
            draggedIdx={draggedIdx}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
            isMobile={isMobile}
            sources={sources}
            onRemove={editMode ? () => handleRemove(idx) : undefined}
            onSwapLayout={handleSwapLayout}
            timeRangeFrom={timeRangeFrom}
            timeRangeTo={timeRangeTo}
            refreshMs={refreshMs}
          />
        );
      })}
    </div>
  );
}
