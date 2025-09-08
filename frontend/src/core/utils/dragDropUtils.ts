import React from "react";
import type { DragDropHandlers } from "@type/ui";



/**
 * Crée les handlers pour le drag & drop des métriques
 */
export function createDragDropHandlers(
    draggedMetric: number | null,
    setDraggedMetric: (idx: number | null) => void,
    onReorder: (fromIndex: number, toIndex: number) => void
): DragDropHandlers {
    return {
        handleDragStart: (idx: number) => {
            setDraggedMetric(idx);
        },

        handleDragOver: (_idx: number, e: React.DragEvent) => {
            e.preventDefault();
        },

        handleDrop: (idx: number) => {
            if (draggedMetric === null || draggedMetric === idx) return;

            onReorder(draggedMetric, idx);
            setDraggedMetric(null);
        }
    };
}

/**
 * Valide si un élément peut être déplacé
 */
export function canDrop(draggedIndex: number | null, targetIndex: number): boolean {
    return draggedIndex !== null && draggedIndex !== targetIndex;
}

/**
 * Utilitaire pour gérer l'état de drag actif
 */
export function isDragging(draggedIndex: number | null): boolean {
    return draggedIndex !== null;
}
