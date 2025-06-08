import DashboardWidgetPreview from "./DashboardWidgetPreview";
import { useDashboardGrid } from "@/hooks/useDashboardGrid";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

interface DashboardLayoutItem {
  widgetId: string;
  w: number;
  h: number;
  x: number;
  y: number;
  widget?: any;
}

interface DashboardGridProps {
  layout: DashboardLayoutItem[];
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
  sources: any[];
  editMode?: boolean;
  hasUnsavedChanges?: boolean;
}

export default function DashboardGrid({
  layout,
  onSwapLayout,
  sources,
  editMode = false,
  hasUnsavedChanges = false,
}: DashboardGridProps) {
  // Charge tous les widgets (pour hydratation du layout)
  const { data: widgets = [] } = useQuery({
    queryKey: ["widgets"],
    queryFn: async () => (await api.get("/widgets")).data,
    staleTime: 1000 * 60 * 2,
  });

  // Hydrate le layout avec le widget complet si absent
  const hydratedLayout = layout.map((item) => {
    if (item.widget) return item;
    const widget = widgets.find(
      (w: any) => w.widgetId === item.widgetId || w._id === item.widgetId
    );
    return widget ? { ...item, widget } : item;
  });

  const {
    draggedIdx,
    hoveredIdx,
    isMobile,
    gridCols,
    gridWidth,
    slots,
    getLayoutIdx,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleResizeMouseDown,
  } = useDashboardGrid({
    layout: hydratedLayout,
    editMode,
    hasUnsavedChanges,
    onSwapLayout,
  });

  return (
    <div
      className="w-full grid min-w-full"
      style={{
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        gap: 16,
        maxWidth: gridWidth,
        margin: "0 auto",
      }}
    >
      {slots.map((item, idx) => {
        if (idx === slots.length - 1) {
          if (!editMode) return null;
          return (
            <div
              key="add-slot"
              className="relative min-h-[160px] border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer select-none"
              style={{
                gridColumn: `span ${isMobile ? 1 : 6} / span ${
                  isMobile ? 1 : 6
                }`,
              }}
              onClick={() => editMode && onSwapLayout && onSwapLayout(layout)}
            >
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="ml-2">Ajouter un widget</span>
            </div>
          );
        }
        const widget = item?.widget;
        const layoutIdx = getLayoutIdx(idx);
        return (
          <div
            key={item?.widgetId || idx}
            className={`relative min-h-[160px] 
              ${editMode ? "border-2 border-dashed" : "border "}
               rounded-lg transition-colors duration-150 ${
                 hoveredIdx === idx && draggedIdx !== null
                   ? "border-indigo-500 bg-indigo-50"
                   : "border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-800"
               }`}
            draggable={editMode && !!widget}
            onDragStart={editMode ? () => handleDragStart(idx) : undefined}
            onDragOver={
              editMode
                ? (e) => {
                    e.preventDefault();
                    handleDragOver(idx);
                  }
                : undefined
            }
            onDrop={editMode ? () => handleDrop(idx) : undefined}
            onDragEnd={editMode ? handleDragEnd : undefined}
            style={{
              gridColumn: `span ${item?.w ?? (isMobile ? 1 : 6)} / span ${
                item?.w ?? (isMobile ? 1 : 6)
              }`,
              gridRowEnd: `span ${Math.ceil((item?.h ?? 8) / 8)}`,
            }}
          >
            {widget ? (
              <div className="h-full w-full flex flex-col relative group">
                <DashboardWidgetPreview
                  widget={widget}
                  sources={sources}
                  editMode={editMode}
                  onRemove={
                    editMode
                      ? () => {
                          // Supprime ce widget du layout
                          const newLayout = hydratedLayout.filter(
                            (_, lidx) => lidx !== idx
                          );
                          onSwapLayout && onSwapLayout(newLayout);
                        }
                      : undefined
                  }
                />
                {!isMobile && editMode && (
                  <div
                    className="absolute bottom-1 right-1 w-4 h-4 rounded cursor-se-resize bg-gray-200 opacity-70 group-hover:opacity-100 z-10"
                    onMouseDown={(e) => handleResizeMouseDown(layoutIdx, e)}
                    title="Redimensionner"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path
                        d="M2 14h12M6 10l6 4"
                        stroke="#555"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-300 text-center py-12 select-none">
                Emplacement vide
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
