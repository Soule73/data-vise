import { WIDGETS } from "@adapters/visualizations";
import { useRef, useEffect, useMemo, useState } from "react";
import type { DataSource } from "@type/dataSource";
import { getWidgetDataFields } from "@utils/widgets/widgetDataFields";
import { useDataBySourceQuery } from "@/data/repositories/datasources";
import {
  getWidgetComponent,
  getDataError,
  getGridItemStyleProps,
  useGridItemResizeObserver,
} from "@utils/gridItemUtils";
import type { UseGridItemProps } from "@type/dashboardTypes";

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
  timeRangeFrom,
  timeRangeTo,
  refreshMs,
  forceRefreshKey,
  page,
  pageSize,
  shareId,
}: UseGridItemProps) {
  // --- Gestion du resize natif ---
  const widgetRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  useGridItemResizeObserver({
    widgetRef,
    editMode,
    hydratedLayout,
    idx,
    onSwapLayout,
  });
  function handleResize() {
    return widgetRef;
  }

  // --- Drag & drop props ---
  const dragProps = useMemo(() => {
    // Désactive le drag & drop en mobile
    if (!editMode || isMobile) return {};

    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        // Vérifie si le drag commence depuis la zone de resize
        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const resizeZoneSize = 20;
        const isInResizeZone =
          x >= rect.width - resizeZoneSize &&
          y >= rect.height - resizeZoneSize;

        if (isInResizeZone) {
          e.preventDefault();
          return;
        }

        // Passe l'index pour le drag
        if (handleDragStart) {
          console.log('Starting drag for widget index:', idx);
          handleDragStart(idx, e);
        } else {
          console.warn('handleDragStart is not available');
        }
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        if (handleDragOver) handleDragOver(idx, e);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        if (handleDrop) handleDrop(idx, e);
      },
      onDragEnd: () => {
        if (handleDragEnd) handleDragEnd();
      },
      onDragEnter: (e: React.DragEvent) => {
        e.preventDefault();
      },
      onDragLeave: (e: React.DragEvent) => {
        // Évite le flickering lors du hover sur les enfants
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        if (hoveredIdx === idx) {
          // Reset hover state quand on quitte le widget
        }
      },
    };
  }, [
    editMode,
    isMobile,
    idx,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    hoveredIdx,
  ]);

  // --- Style props ---
  const styleProps = useMemo(
    () =>
      getGridItemStyleProps({
        editMode,
        isMobile,
        draggedIdx,
        hoveredIdx,
        idx,
        item,
      }),
    [editMode, isMobile, draggedIdx, hoveredIdx, idx, item]
  );

  // --- Source de données associée ---
  const source = sources?.find(
    (s: DataSource) => String(s._id) === String(widget?.dataSourceId)
  );

  // --- Colonnes nécessaires à la visualisation ---
  const config = useMemo(() => widget?.config || {}, [widget?.config]);
  const fields = useMemo(
    () => getWidgetDataFields(config,
      //  widget?.type
    ),
    [
      // widget?.type, 
      config]
  );

  // --- Données du widget (hook data + refresh) ---
  const {
    data: widgetData,
    loading,
    error,
  } = useDataBySourceQuery(
    source?._id,
    {
      from: timeRangeFrom || undefined,
      to: timeRangeTo || undefined,
      fields,
      page,
      pageSize,
      shareId,
    },
    undefined,
    refreshMs,
    forceRefreshKey
  );

  // --- Mémorisation des dernières données valides ---
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastValidData, setLastValidData] = useState<any>(undefined);
  useEffect(() => {
    if (widgetData && Array.isArray(widgetData) && widgetData.length > 0) {
      setLastValidData(widgetData);
    }
  }, [widgetData]);
  // isRefreshing : loading mais on a déjà des données affichables
  const isRefreshing = loading && !!lastValidData;

  // --- Détermination du composant de visualisation ---
  const WidgetComponent = getWidgetComponent(widget, WIDGETS);

  // --- Gestion des erreurs de données ---
  const dataError = getDataError({ source, error, loading, widgetData });

  // --- Retour du hook ---
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
