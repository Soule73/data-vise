import { useSourceData } from "@/core/hooks/useSourceData";
import { WIDGETS } from "@/data/adapters/visualizations";
import { useRef, useEffect, useMemo } from "react";

export function useGridItem({
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
}: {
  widget: any;
  sources: any[];
  idx: number;
  hydratedLayout: any[];
  editMode?: boolean;
  onSwapLayout?: (newLayout: any[]) => void;
  hoveredIdx?: number | null;
  draggedIdx?: number | null;
  handleDragStart?: (idx: number) => void;
  handleDragOver?: (idx: number) => void;
  handleDrop?: (idx: number) => void;
  handleDragEnd?: () => void;
  isMobile?: boolean;
  item?: any;
}) {
  // Resize natif (extraction depuis useDashboardGrid)
  function handleResize() {
    const widgetRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!editMode || !widgetRef.current) return;
      const el = widgetRef.current;
      let resizing = false;
      let lastWidth = el.offsetWidth;
      let lastHeight = el.offsetHeight;
      function getFlexContainer(element: HTMLElement): HTMLElement | null {
        let parent = element.parentElement;
        while (parent) {
          if (parent.classList.contains("flex-wrap")) return parent;
          parent = parent.parentElement;
        }
        return null;
      }
      const observer = new window.ResizeObserver(() => {
        if (!resizing) {
          resizing = true;
          const onUp = () => {
            resizing = false;
            const flexContainer = getFlexContainer(el);
            if (!flexContainer) return;
            const parentWidth = flexContainer.offsetWidth;
            const newWidthPx = el.offsetWidth;
            const newHeightPx = el.offsetHeight;
            const newWidthPercent = Math.round(
              (newWidthPx / parentWidth) * 100
            );
            if (
              (newWidthPx !== lastWidth || newHeightPx !== lastHeight) &&
              typeof idx === "number" &&
              hydratedLayout &&
              onSwapLayout
            ) {
              lastWidth = newWidthPx;
              lastHeight = newHeightPx;
              const newLayout = hydratedLayout.map((it: any, i: number) =>
                i === idx
                  ? {
                      ...it,
                      width: `${newWidthPercent}%`,
                      height: newHeightPx,
                    }
                  : it
              );
              onSwapLayout(newLayout);
            }
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mouseup", onUp);
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [editMode, hydratedLayout, idx, onSwapLayout]);
    return widgetRef;
  }

  // Drag & drop props centralisés
  const dragProps = useMemo(() => {
    if (!editMode) return {};
    return {
      draggable: true,
      onDragStart: () => handleDragStart && handleDragStart(idx),
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        handleDragOver && handleDragOver(idx);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        handleDrop && handleDrop(idx);
      },
      onDragEnd: () => handleDragEnd && handleDragEnd(),
    };
  }, [
    editMode,
    idx,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  ]);

  // Style props centralisés
  const styleProps = useMemo(() => {
    let className =
      "relative  rounded-lg  p-2 transition-all duration-200 overflow-hidden border-dashed border-2 border-spacing-4 ";
    if (editMode) {
      if (draggedIdx === idx) className += " opacity-60 border-blue-400 ";
      else if (hoveredIdx === idx) className += " border-blue-300 ";
      else className += " border-gray-300 "; // Toujours une bordure visible en édition
      className += " cursor-move ";
    } else {
      className += " border-transparent ";
    }
    if (isMobile) className += " w-full min-w-0 ";
    const style: React.CSSProperties = {
      width: item?.width || (isMobile ? "100%" : undefined),
      height: item?.height || undefined,
      minHeight: 120,
      ...(editMode && draggedIdx === idx ? { zIndex: 10 } : {}),
    };
    return { className, style };
  }, [editMode, draggedIdx, hoveredIdx, idx, isMobile, item]);

  // Trouver la source associée
  const source = sources?.find(
    (s: any) => String(s._id) === String(widget?.dataSourceId)
  );
  const initialData = Array.isArray(source?.data) ? source.data : undefined;
  const {
    data: widgetData,
    loading,
    error,
  } = useSourceData(source?.endpoint, initialData);
  const widgetDef = widget
    ? WIDGETS[widget.type as keyof typeof WIDGETS]
    : null;
  let WidgetComponent = null;
  if (widgetDef && widgetDef.component) {
    WidgetComponent = widgetDef.component;
  }
  let dataError = "";
  if (!source) {
    dataError = "Source de données introuvable.";
  } else if (error) {
    dataError = error;
  } else if (!loading && (!widgetData || !widgetData.length)) {
    dataError = "Aucune donnée disponible pour cette source.";
  }
  const config = widget?.config || {};
  return {
    widgetData,
    loading,
    error: dataError,
    WidgetComponent,
    config,
    handleResize,
    dragProps,
    styleProps,
  };
}
