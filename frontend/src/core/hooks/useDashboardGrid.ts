import { useState, useEffect } from "react";

export function useDashboardGrid({
  layout,
  editMode,
  hasUnsavedChanges,
  onSwapLayout,
}: {
  layout: any[];
  editMode?: boolean;
  hasUnsavedChanges?: boolean;
  onSwapLayout?: (newLayout: any[]) => void;
}) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // Ajout d'un slot "Ajouter un widget" à la fin
  const slots = [...layout.filter((item) => !!item.widgetId), null];

  // Responsive slot style centralisé
  function getSlotStyle() {
    if (isMobile) {
      return {
        width: "100%",
        minWidth: "100%",
        maxWidth: "100%",
        minHeight: 300,
        height: 300,
      };
    }
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      return { width: "48%", minWidth: "48%", maxWidth: "48%" };
    }
    return { width: "32%", minWidth: "32%", maxWidth: "32%" };
  }

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

  // Suppression d'un widget
  const handleRemove = (idx: number) => {
    const newLayout = layout.filter((_, lidx) => lidx !== idx);
    onSwapLayout && onSwapLayout(newLayout);
  };

  // Alerte navigation/fermeture si édition non sauvegardée
  useEffect(() => {
    if (!editMode || !hasUnsavedChanges) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editMode, hasUnsavedChanges]);

  return {
    draggedIdx,
    hoveredIdx,
    isMobile,
    slots,
    getSlotStyle,
    getLayoutIdx,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleRemove,
  };
}
