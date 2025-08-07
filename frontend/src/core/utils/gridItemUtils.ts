/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DashboardLayoutItem } from "@/core/types/dashboard-types";

/**
 * Trouve le parent flex-wrap d'un élément.
 */
export function getFlexContainer(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;
  while (parent) {
    if (parent.classList.contains("flex-wrap")) return parent;
    parent = parent.parentElement;
  }
  return null;
}

/**
 * Construit un nouveau layout lors du resize d'un widget.
 */
export function buildNewLayoutOnResize({
  hydratedLayout,
  idx,
  newWidthPercent,
  newHeightPx,
}: {
  hydratedLayout: DashboardLayoutItem[];
  idx: number;
  newWidthPercent: number;
  newHeightPx: number;
}): DashboardLayoutItem[] {
  return hydratedLayout.map((it: any, i: number) =>
    i === idx
      ? {
        ...it,
        width: `${newWidthPercent}%`,
        height: newHeightPx,
        widget: it.widget,
      }
      : { ...it, widget: it.widget }
  );
}

/**
 * Retourne le composant de visualisation du widget.
 */
export function getWidgetComponent(widget: any, WIDGETS: any) {
  if (!widget) return null;
  const widgetDef = WIDGETS[widget.type as keyof typeof WIDGETS];
  return widgetDef?.component || null;
}

/**
 * Retourne le message d'erreur de données pour un widget.
 */
export function getDataError({ source, error, loading, widgetData }: {
  source: any;
  error: any;
  loading: boolean;
  widgetData: any;
}): string {
  if (!source) {
    return "Source de données introuvable.";
  } else if (error) {
    return error;
  } else if (!loading && (!widgetData || !widgetData.length)) {
    return "Aucune donnée disponible pour cette source.";
  }
  return "";
}

/**
 * Calcule les props de style et de classe pour un item de dashboard grid.
 */
export function getGridItemStyleProps({
  editMode,
  isMobile,
  draggedIdx,
  hoveredIdx,
  idx,
  item,
}: {
  editMode?: boolean;
  isMobile?: boolean;
  draggedIdx?: number | null;
  hoveredIdx?: number | null;
  idx: number;
  item?: { width?: string | number; height?: string | number };
}): { className: string; style: React.CSSProperties } {
  let className =
    "relative rounded-lg transition-all duration-200 overflow-hidden  ";
  const effectiveEditMode = editMode && !isMobile;
  if (effectiveEditMode) {
    className += " border-dashed border-2 border-spacing-4";
    if (draggedIdx === idx) className += " opacity-60 border-blue-400 ";
    else if (hoveredIdx === idx) className += " border-blue-300 ";
    else className += " border-gray-300 ";
    className += " cursor-move ";
  }
  let style: React.CSSProperties;
  if (isMobile) {
    style = {
      width: "100%",
      minWidth: "100%",
      maxWidth: "100%",
      height: 300,
      minHeight: 120,
    };
  } else {
    style = {
      width: item?.width || undefined,
      height: item?.height || undefined,
      minHeight: 120,
      ...(effectiveEditMode && draggedIdx === idx ? { zIndex: 10 } : {}),
      ...(effectiveEditMode ? { resize: "both", overflow: "auto" } : {}),
    };
  }
  return { className, style };
}

/**
 * Hook utilitaire pour observer le resize d'un widget de dashboard grid.
 */
import { useEffect } from "react";

export function useGridItemResizeObserver({
  widgetRef,
  editMode,
  hydratedLayout,
  idx,
  onSwapLayout,
}: {
  widgetRef: React.RefObject<HTMLDivElement>;
  editMode?: boolean;
  hydratedLayout: DashboardLayoutItem[];
  idx: number;
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
}) {
  useEffect(() => {
    if (!editMode || !widgetRef.current) return;
    const el = widgetRef.current;
    let resizing = false;
    let lastWidth = el.offsetWidth;
    let lastHeight = el.offsetHeight;
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
          const newWidthPercent = Math.round((newWidthPx / parentWidth) * 100);
          if (
            (newWidthPx !== lastWidth || newHeightPx !== lastHeight) &&
            typeof idx === "number" &&
            hydratedLayout &&
            onSwapLayout
          ) {
            lastWidth = newWidthPx;
            lastHeight = newHeightPx;
            const newLayout = buildNewLayoutOnResize({
              hydratedLayout,
              idx,
              newWidthPercent,
              newHeightPx,
            });
            onSwapLayout(newLayout);
          }
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mouseup", onUp);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [editMode, hydratedLayout, idx, onSwapLayout, widgetRef]);
}
