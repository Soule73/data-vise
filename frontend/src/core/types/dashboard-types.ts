// ======================================================
// 5. Dashboard, Layout & Stores
// ======================================================

import type { DataSource } from "./data-source";

export interface BreadcrumbItem {
  url: string;
  label: string;
}

export interface DashboardLayoutItem {
  widgetId: string;
  width: string;
  height: number;
  x: number;
  y: number;
  widget?: any;
}

export interface DashboardGridProps {
  layout: DashboardLayoutItem[];
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
  sources: any[];
  editMode?: boolean;
  hasUnsavedChanges?: boolean;
  handleAddWidget: (e: React.MouseEvent) => void;
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: string;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
  refreshMs?: number;
  forceRefreshKey?: number;
  page?: number;
  pageSize?: number;
}

export interface DashboardStore {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (v: boolean) => void;
  layout: DashboardLayoutItem[];
  setLayout: (l: DashboardLayoutItem[]) => void;
  breadcrumb: BreadcrumbItem[];
  setBreadcrumb: (items: BreadcrumbItem[]) => void;
}

export interface DashboardGridItemProps {
  idx: number;
  hydratedLayout: DashboardLayoutItem[];
  editMode: boolean;
  item: any;
  widget: any; // Widget
  hoveredIdx: number | null;
  draggedIdx: number | null;
  isMobile?: boolean; // Indique si c'est un mobile
  isLoading?: boolean; // Indique si le widget est en cours de chargement
  handleDragStart: (idx: number) => void;
  handleDragOver: (idx: number) => void;
  handleDrop: (idx: number) => void;
  handleDragEnd: () => void;
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
  // Ajout config avancée
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: string;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
  sources: any[]; // Data sources
  onRemove?: () => void; // Callback pour supprimer le widget
  refreshMs?: number;
  forceRefreshKey?: number; // Clé pour forcer le rafraîchissement
  page?: number;
  pageSize?: number;
}

export interface SaveModalProps {
  saveModalOpen: boolean;
  setSaveModalOpen: (open: boolean) => void;
  pendingTitle: string;
  setPendingTitle: (title: string) => void;
  isCreate: boolean;
  setLocalTitle?: (title: string) => void;
  visibility: "public" | "private";
  setVisibility: (visibility: "public" | "private") => void;
  handleConfirmSave: (visibility: "public" | "private") => void;
}

export interface UseGridItemProps {
  widget: DashboardLayoutItem["widget"];
  sources: DataSource[];
  idx: number;
  hydratedLayout: DashboardLayoutItem[];
  editMode?: boolean;
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
  hoveredIdx?: number | null;
  draggedIdx?: number | null;
  handleDragStart?: (idx: number) => void;
  handleDragOver?: (idx: number) => void;
  handleDrop?: (idx: number) => void;
  handleDragEnd?: () => void;
  isMobile?: boolean;
  item?: DashboardLayoutItem;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
  refreshMs?: number;
  forceRefreshKey?: number;
  page?: number;
  pageSize?: number;
}
