import { useState, useRef, useEffect } from 'react';

export function useDashboardGrid({ layout, editMode, hasUnsavedChanges, onSwapLayout }: {
  layout: any[];
  editMode?: boolean;
  hasUnsavedChanges?: boolean;
  onSwapLayout?: (newLayout: any[]) => void;
}) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const gridWidth = isMobile ? 340 : 900;

  // Ajout d'un slot "Ajouter un widget" à la fin
  const slots = [...layout.filter(item => !!item.widgetId), null];

  // Trouver l'index réel dans le layout (hors slot null)
  const getLayoutIdx = (slotIdx: number) => {
    if (slotIdx >= layout.length) return -1;
    let count = -1;
    for (let i = 0; i < layout.length; i++) {
      if (layout[i].widgetId) count++;
      if (count === slotIdx) return i;
    }
    return -1;
  };

  // Gestion du swap lors du drag
  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (idx: number) => setHoveredIdx(idx);
  const handleDragEnd = () => setDraggedIdx(null);
  const handleDrop = (slotIdx: number) => {
    if (draggedIdx === null || draggedIdx === slotIdx) {
      setDraggedIdx(null);
      setHoveredIdx(null);
      return;
    }
    const fromIdx = getLayoutIdx(draggedIdx);
    const toIdx = getLayoutIdx(slotIdx);
    if (fromIdx === -1 || toIdx === -1) {
      setDraggedIdx(null);
      setHoveredIdx(null);
      return;
    }
    const newLayout = [...layout];
    const temp = { ...newLayout[fromIdx] };
    newLayout[fromIdx] = { ...newLayout[toIdx] };
    newLayout[toIdx] = temp;
    onSwapLayout && onSwapLayout(newLayout);
    setDraggedIdx(null);
    setHoveredIdx(null);
  };

  // Alerte navigation/fermeture si édition non sauvegardée
  useEffect(() => {
    if (!editMode || !hasUnsavedChanges) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [editMode, hasUnsavedChanges]);

  // Gestion du resize natif (resize: both) pour chaque widget
  function useWidgetResize(idx: number, hydratedLayout: any[]) {
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
            const newWidthPercent = Math.round((newWidthPx / parentWidth) * 100);
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
                      width: `${newWidthPercent}%`, // MAJ à la racine
                      height: newHeightPx,         // MAJ à la racine
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

  return {
    draggedIdx,
    hoveredIdx,
    isMobile,
    gridWidth,
    slots,
    getLayoutIdx,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    useWidgetResize, // hook à utiliser dans DashboardGrid
  };
}
