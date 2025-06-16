import { useSourceData } from "@/core/hooks/useSourceData";
import { WIDGETS } from "@/data/adapters/visualizations";
import { useRef, useEffect, useMemo, useState } from "react";
import type { DataSource } from "../types/data-source";

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
  // --- Ajout config avancée ---
  autoRefreshIntervalValue,
  autoRefreshIntervalUnit,
  timeRangeFrom,
  timeRangeTo,
}: {
  widget: any;
  sources: DataSource[];
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
  // --- Ajout config avancée ---
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: string;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
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
      "relative  rounded-lg transition-all shadow duration-200 overflow-hidden border-dashed border-2 border-spacing-4 ";
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
    (s: DataSource) => String(s._id) === String(widget?.dataSourceId)
  );
  // Calcul de l'intervalle de rafraîchissement en ms
  let refreshMs: number | undefined = undefined;
  // On active le polling uniquement si la source possède un champ timestampField
  const hasTimestamp = !!source?.timestampField;
  if (autoRefreshIntervalValue != null && hasTimestamp) {
    if (autoRefreshIntervalValue && autoRefreshIntervalUnit) {
      // Conversion en ms selon l'unité
      const unit = autoRefreshIntervalUnit;
      const value = autoRefreshIntervalValue;
      switch (unit) {
        case "second":
          refreshMs = value * 1000;
          break;
        case "minute":
          refreshMs = value * 60 * 1000;
          break;
        case "hour":
          refreshMs = value * 60 * 60 * 1000;
          break;
        case "day":
          refreshMs = value * 24 * 60 * 60 * 1000;
          break;
        case "week":
          refreshMs = value * 7 * 24 * 60 * 60 * 1000;
          break;
        case "month":
          refreshMs = value * 30 * 24 * 60 * 60 * 1000;
          break;
        case "year":
          refreshMs = value * 365 * 24 * 60 * 60 * 1000;
          break;
        default:
          refreshMs = undefined;
      }
    }
  }

  // Log pour vérifier le polling
  useEffect(() => {
    console.log({ hasTimestamp, refreshMs });
  }, [
    refreshMs,
    hasTimestamp,
    timeRangeFrom,
    timeRangeTo,
    autoRefreshIntervalValue,
    widget?.widgetId,
    idx,
  ]);

  // Utilisation des options de plage temporelle pour le hook useSourceData
  const {
    data: widgetData,
    loading,
    error,
  } = useSourceData(
    source?._id,
    {
      from: timeRangeFrom || undefined,
      to: timeRangeTo || undefined,
    },
    undefined,
    refreshMs
  );

  // --- Mémorisation des dernières données valides pour UX fluide ---
  const [lastValidData, setLastValidData] = useState<any>(undefined);
  useEffect(() => {
    if (widgetData && Array.isArray(widgetData) && widgetData.length > 0) {
      setLastValidData(widgetData);
    }
  }, [widgetData]);
  // isRefreshing : loading mais on a déjà des données affichables
  const isRefreshing = loading && !!lastValidData;

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
    widgetData: lastValidData || widgetData,
    loading,
    isRefreshing,
    error: dataError,
    WidgetComponent,
    config,
    handleResize,
    dragProps,
    styleProps,
  };
}
