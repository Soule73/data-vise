/**
 * Calcule le style responsive pour un slot de dashboard grid.
 */
export function getSlotStyleUtil(isMobile: boolean): React.CSSProperties {
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

/**
 * Trouve l'index réel dans le layout (drag & drop direct).
 */
export function getLayoutIdxUtil(slotIdx: number): number {
  return slotIdx;
}
