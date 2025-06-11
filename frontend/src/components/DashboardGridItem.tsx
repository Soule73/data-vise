import { WIDGETS } from "./widgets";
import { useSourceData } from "@/hooks/useSourceData";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRef, useEffect } from "react";

function useWidgetResize(
  idx: number,
  hydratedLayout: any[],
  editMode?: boolean,
  onSwapLayout?: (newLayout: any[]) => void
) {
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
                    height: newHeightPx, // MAJ à la racine
                  }
                : it
            );
            // Suppression du log debug
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

export default function DashboardGridItem({
  idx,
  hydratedLayout,
  editMode,
  item,
  widget,
  hoveredIdx,
  draggedIdx,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  onSwapLayout, // à passer depuis DashboardGrid
  sources,
  onRemove,
}: any) {
  // Largeur en % (priorité à item.width)
  const widgetWidth = item?.width || "48%";
  // Hauteur en px (priorité à item.height)
  const widgetHeight = item?.height || 300;
  // Ref pour observer le resize natif (via hook local)
  const widgetRef = useWidgetResize(
    idx,
    hydratedLayout,
    editMode,
    onSwapLayout
  );

  // Fusion DashboardWidgetPreview
  const source = sources?.find(
    (s: any) => String(s._id) === String(widget?.dataSourceId)
  );
  const initialData = Array.isArray(source?.data) ? source.data : undefined;
  const {
    data: widgetData,
    loading,
    error,
  } = useSourceData(source?.endpoint, initialData);
  const widgetDef = widget
    ? WIDGETS[widget.type as keyof typeof WIDGETS]
    : null;
  let WidgetComponent = null;
  if (widgetDef && widgetDef.component) {
    WidgetComponent = widgetDef.component;
  }
  let dataError = "";
  if (!source) {
    dataError = "Source de données introuvable.";
  } else if (error) {
    dataError = error;
  } else if (!loading && (!widgetData || !widgetData.length)) {
    dataError = "Aucune donnée disponible pour cette source.";
  }
  const config = widget?.config || {};

  return (
    <div
      ref={editMode ? widgetRef : undefined}
      key={item?.widgetId || idx}
      className={`relative min-h-[160px] max-w-full overflow-x-auto flex flex-col
        ${editMode ? "border-2 border-dashed" : "border "}
         rounded-lg transition-colors duration-150
         ${
           hoveredIdx === idx && draggedIdx !== null
             ? "border-indigo-500 bg-indigo-50"
             : "border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-800"
         }`}
      draggable={editMode && !!widget}
      onDragStart={editMode ? () => handleDragStart(idx) : undefined}
      onDragOver={
        editMode
          ? (e) => {
              e.preventDefault();
              handleDragOver(idx);
            }
          : undefined
      }
      onDrop={editMode ? () => handleDrop(idx) : undefined}
      onDragEnd={editMode ? handleDragEnd : undefined}
      style={{
        width: widgetWidth,
        minWidth: "240px",
        height: widgetHeight,
        minHeight: 160,
        maxWidth: "100%",
        flex: "none",
        alignSelf: "stretch",
        position: "relative",
        resize: editMode ? "both" : undefined,
        overflow: editMode ? "auto" : undefined,
      }}
    >
      {/* Menu d'édition (supprimer) */}
      {editMode && onRemove && (
        <Menu as="div" className="absolute top-2 right-2 z-20 text-left">
          <MenuButton className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </MenuButton>
          <MenuItems className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={onRemove}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md gap-2 transition-colors ${
                    active
                      ? "bg-red-50 dark:bg-red-700 text-red-700 dark:text-white"
                      : "text-red-600 dark:text-red-300"
                  }`}
                >
                  <TrashIcon className="w-4 h-4" />
                  Supprimer
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      )}
      {/* Affichage du widget ou des messages d'état */}
      {loading ? (
        <div className="text-sm text-gray-400">Chargement des données…</div>
      ) : dataError ? (
        <div className="text-sm text-red-500">{dataError}</div>
      ) : (
        WidgetComponent && (
          <WidgetComponent
            data={widgetData}
            config={config}
            editMode={editMode}
          />
        )
      )}
    </div>
  );
}
