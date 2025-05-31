import { useState, useEffect } from 'react';

export function useDashboardGrid({ layout, editMode, hasUnsavedChanges, onSwapLayout }: {
  layout: any[];
  editMode?: boolean;
  hasUnsavedChanges?: boolean;
  onSwapLayout?: (newLayout: any[]) => void;
}) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const gridCols = isMobile ? 1 : 12;
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

  // Resize fluide via poignée (desktop uniquement)
  const _handleResize = (layoutIdx: number, newW: number, newH: number) => {
    if (layoutIdx === -1) return;
    const newLayout = layout.map((item, i) =>
      i === layoutIdx
        ? { ...item, w: newW, h: newH }
        : item
    );
    onSwapLayout && onSwapLayout(newLayout);
  };

  // Gestion du redimensionnement via poignée (desktop uniquement)
  const handleResizeMouseDown = (layoutIdx: number, e: React.MouseEvent) => {
    if (layoutIdx === -1 || !editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = layout[layoutIdx]?.w ?? (isMobile ? 1 : 6);
    const startH = layout[layoutIdx]?.h ?? 8;
    function onMove(ev: MouseEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const colWidth = gridWidth / gridCols;
      let newW = Math.max(1, Math.min(gridCols, Math.round(startW + dx / colWidth)));
      let newH = Math.max(8, Math.min(20, startH + Math.round(dy / 20) * 2));
      _handleResize(layoutIdx, newW, newH);
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
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

  return {
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
    handleResize: _handleResize,
    handleResizeMouseDown,
  };
}
