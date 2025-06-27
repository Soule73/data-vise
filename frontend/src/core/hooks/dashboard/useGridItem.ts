import { WIDGETS } from "@/data/adapters/visualizations";
import { useRef, useEffect, useMemo, useState } from "react";
import type { DataSource } from "../../types/data-source";
import { getWidgetDataFields } from "@/core/utils/widgetDataFields";
import { dataBySourceQuery } from "@/data/repositories/sources";
import {
  getWidgetComponent,
  getDataError,
  getGridItemStyleProps,
  useGridItemResizeObserver,
} from "@/core/utils/gridItemUtils";
import type { UseGridItemProps } from "../../types/dashboard-types";

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
  shareId, // Ajout du shareId
}: UseGridItemProps) {
  // --- Gestion du resize natif ---
  function handleResize() {
    const widgetRef = useRef<HTMLDivElement>(
      null
    ) as React.RefObject<HTMLDivElement>;
    useGridItemResizeObserver({
      widgetRef,
      editMode,
      hydratedLayout,
      idx,
      onSwapLayout,
    });
    return widgetRef;
  }

  // --- Drag & drop props ---
  const dragProps = useMemo(() => {
    // Désactive le drag & drop en mobile
    if (!editMode || isMobile) return {};
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
    isMobile,
    idx,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
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
  const config = widget?.config || {};
  const fields = useMemo(
    () => getWidgetDataFields(config, widget?.type),
    [widget?.type, config]
  );

  // --- Données du widget (hook data + refresh) ---
  const {
    data: widgetData,
    loading,
    error,
  } = dataBySourceQuery(
    source?._id,
    {
      from: timeRangeFrom || undefined,
      to: timeRangeTo || undefined,
      fields,
      page,
      pageSize,
      shareId, // Passage du shareId à dataBySourceQuery
    },
    undefined,
    refreshMs,
    forceRefreshKey
  );

  // --- Mémorisation des dernières données valides ---
  const [lastValidData, setLastValidData] = useState<any>(undefined);
  useEffect(() => {
    if (widgetData && Array.isArray(widgetData) && widgetData.length > 0) {
      setLastValidData(widgetData);
    }
  }, [widgetData]);
  // isRefreshing : loading mais on a déjà des données affichables
  const isRefreshing = loading && !!lastValidData;

  // --- Détermination du composant de visualisation ---
  // const widgetDef = widget
  //   ? WIDGETS[widget.type as keyof typeof WIDGETS]
  //   : null;
  const WidgetComponent = getWidgetComponent(widget, WIDGETS);

  // --- Gestion des erreurs de données ---
  let dataError = getDataError({ source, error, loading, widgetData });

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
