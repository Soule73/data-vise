/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DashboardLayoutItem } from "@type/dashboardTypes";

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
    "relative rounded-lg transition-all duration-200 overflow-hidden ";

  const effectiveEditMode = editMode && !isMobile;

  if (effectiveEditMode) {
    className += " border-dashed border-2 border-spacing-4";

    if (draggedIdx === idx) {
      className += " opacity-60 border-indigo-500 shadow-lg z-50 ";
    } else if (hoveredIdx === idx) {
      className += " border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 shadow-md ";
    } else {
      className += " border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 ";
    }

    className += " cursor-grab active:cursor-grabbing resize-handle-widget ";
  } else {
    className += " border border-gray-200 dark:border-gray-700 ";
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
      transition: "all 0.2s ease-in-out",
      ...(effectiveEditMode && draggedIdx === idx ? {
        zIndex: 1000,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      } : {}),
      ...(effectiveEditMode && hoveredIdx === idx ? {
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      } : {}),
      ...(effectiveEditMode ? {
        resize: "both",
        overflow: "auto",
        minWidth: "200px",
        minHeight: "150px"
      } : {}),
    };
  }

  return { className, style };
}

/**
 * Hook utilitaire pour observer le resize d'un widget de dashboard grid.
 */
import { useEffect, useRef } from "react";

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
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualResizeRef = useRef(false);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!editMode || !widgetRef.current) return;

    const el = widgetRef.current;
    let lastWidth = el.offsetWidth;
    let lastHeight = el.offsetHeight;

    // Observer seulement les changements de resize manuel via les poignées
    const observer = new window.ResizeObserver((entries) => {
      // Ignore si on est en train de draguer ou si c'est pas un resize manuel
      if (isDraggingRef.current || !isManualResizeRef.current) return;

      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;

        // Débounce pour éviter trop d'appels
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }

        resizeTimeoutRef.current = setTimeout(() => {
          const flexContainer = getFlexContainer(el);
          if (!flexContainer) return;

          const parentWidth = flexContainer.offsetWidth;
          const newWidthPercent = Math.round((newWidth / parentWidth) * 100);

          // Limite les valeurs min/max
          const clampedWidthPercent = Math.max(15, Math.min(100, newWidthPercent));
          const clampedHeight = Math.max(150, Math.min(800, newHeight));

          if (
            (Math.abs(newWidth - lastWidth) > 5 || Math.abs(newHeight - lastHeight) > 5) &&
            typeof idx === "number" &&
            hydratedLayout &&
            onSwapLayout
          ) {
            lastWidth = newWidth;
            lastHeight = newHeight;

            const newLayout = buildNewLayoutOnResize({
              hydratedLayout,
              idx,
              newWidthPercent: clampedWidthPercent,
              newHeightPx: clampedHeight,
            });

            onSwapLayout(newLayout);
          }

          // Reset le flag après le resize
          isManualResizeRef.current = false;
        }, 150);
      }
    });

    // Détecter le début d'un drag pour désactiver le resize
    const handleDragStart = () => {
      isDraggingRef.current = true;
      isManualResizeRef.current = false;
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
    };

    // Détecter le resize manuel via les poignées (corner resize)
    const handleMouseDown = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Zone de détection pour les poignées de resize (coin inférieur droit)
      const resizeZoneSize = 20;
      const isInResizeZone =
        x >= rect.width - resizeZoneSize &&
        y >= rect.height - resizeZoneSize;

      if (isInResizeZone) {
        isManualResizeRef.current = true;
        e.preventDefault();

        const startWidth = el.offsetWidth;
        const startHeight = el.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        el.style.userSelect = 'none';

        const handleMouseMove = (e: MouseEvent) => {
          if (!isManualResizeRef.current) return;

          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          const newWidth = Math.max(200, startWidth + deltaX);
          const newHeight = Math.max(150, startHeight + deltaY);

          el.style.width = `${newWidth}px`;
          el.style.height = `${newHeight}px`;
        };

        const handleMouseUp = () => {
          el.style.userSelect = '';

          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);

          // Déclenche la mise à jour du layout après le resize manuel
          if (isManualResizeRef.current && onSwapLayout) {
            const flexContainer = getFlexContainer(el);
            if (flexContainer) {
              const parentWidth = flexContainer.offsetWidth;
              const newWidthPercent = Math.round((el.offsetWidth / parentWidth) * 100);

              const newLayout = buildNewLayoutOnResize({
                hydratedLayout,
                idx,
                newWidthPercent,
                newHeightPx: el.offsetHeight,
              });

              onSwapLayout(newLayout);
            }
          }

          isManualResizeRef.current = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    observer.observe(el);
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('dragend', handleDragEnd);

    return () => {
      observer.disconnect();
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('dragstart', handleDragStart);
      el.removeEventListener('dragend', handleDragEnd);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [editMode, hydratedLayout, idx, onSwapLayout, widgetRef]);
}
