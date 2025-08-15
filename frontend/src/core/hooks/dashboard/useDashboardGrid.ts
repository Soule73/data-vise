import { useState, useEffect } from "react";
import { getSlotStyleUtil } from "@utils/dashboard/dashboardGridUtils";
import type { UseDashboardGridProps } from "@type/dashboardTypes";

export function useDashboardGrid({
  layout,
  editMode,
  hasUnsavedChanges,
  onSwapLayout,
}: UseDashboardGridProps) {
  // --- Drag & drop state ---
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  // --- Slots pour la grille (ajout d'un slot "Ajouter un widget") ---
  const slots = [...layout, null];

  // --- Style responsive centralisé pour les slots ---
  function getSlotStyle() {
    return getSlotStyleUtil(isMobile);
  }

  // --- Forcer le recalcul du responsive lors du resize de la fenêtre ---
  const [, setDummyState] = useState(0);
  useEffect(() => {
    const handleResize = () => setDummyState((v) => v + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Drag & drop handlers ---
  const handleDragStart = (idx: number, e?: React.DragEvent) => {
    setDraggedIdx(idx);
    if (e) {
      // Paramètres de base pour le drag & drop
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', idx.toString());
    } else {
      console.warn('Missing drag event');
    }
  };

  const handleDragOver = (idx: number, e?: React.DragEvent) => {
    if (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
    setHoveredIdx(idx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setHoveredIdx(null);
  };

  const handleDrop = (slotIdx: number, e?: React.DragEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (draggedIdx === null || draggedIdx === slotIdx) {
      setDraggedIdx(null);
      setHoveredIdx(null);
      return;
    }

    if (draggedIdx === -1 || slotIdx === -1 || draggedIdx >= layout.length || slotIdx >= layout.length) {
      setDraggedIdx(null);
      setHoveredIdx(null);
      return;
    }

    // Swap en préservant toutes les propriétés, y compris widget
    const newLayout = layout.map((item) => ({ ...item }));
    const temp = { ...newLayout[draggedIdx] };
    newLayout[draggedIdx] = { ...newLayout[slotIdx] };
    newLayout[slotIdx] = temp;

    if (onSwapLayout) {
      onSwapLayout(newLayout);
    }

    setDraggedIdx(null);
    setHoveredIdx(null);
  };

  // --- Suppression d'un widget (préserver la clé widget) ---
  const handleRemove = (idx: number) => {
    const newLayout = layout
      .filter((_, lidx) => lidx !== idx)
      .map((item) => ({ ...item }));
    if (onSwapLayout) onSwapLayout(newLayout);
  };

  // --- Alerte navigation/fermeture si édition non sauvegardée ---
  useEffect(() => {
    if (!editMode || !hasUnsavedChanges) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editMode, hasUnsavedChanges]);

  // --- Retour du hook ---
  return {
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
  };
}
