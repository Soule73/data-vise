// Types principaux
import type { ReactNode } from "react";
import type { DataSource } from "@type/dataSource";
import type { Widget } from "@type/widgetTypes";

// =====================
// Dashboard & Layout
// =====================
export interface DashboardLayoutItem {
  widgetId: string;
  width: string;
  height: number;
  x: number;
  y: number;
  widget?: Widget;
}

export interface Dashboard {
  _id?: string;
  title: string;
  layout: DashboardLayoutItem[];
  ownerId: string;
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: IntervalUnit;
  timeRange: DashboardTimeRange;
  visibility?: "public" | "private";
  createdAt?: string;
  updatedAt?: string;
  widgets: Widget[];
  shareEnabled?: boolean;
  shareId?: string | null;
}

export interface DashboardTimeRange {
  from?: string; // ISO string (date de début)
  to?: string; // ISO string (date de fin)
  intervalValue?: number;
  intervalUnit?: IntervalUnit;
}

export type IntervalUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

// =====================
// Props de composants
// =====================
export interface DashboardGridProps {
  layout: DashboardLayoutItem[];
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
  sources: DataSource[];
  editMode?: boolean;
  hasUnsavedChanges?: boolean;
  handleAddWidget: (e: React.MouseEvent) => void;
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: string;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
  forceRefreshKey?: number;
  page?: number;
  pageSize?: number;
  shareId?: string;
  refreshMs?: number;
}

export interface DashboardGridItemProps {
  idx: number;
  hydratedLayout: DashboardLayoutItem[];
  editMode: boolean;
  item: DashboardLayoutItem;
  widget: Widget;
  hoveredIdx: number | null;
  draggedIdx: number | null;
  isMobile?: boolean;
  isLoading?: boolean;
  handleDragStart: (idx: number, e?: React.DragEvent) => void;
  handleDragOver: (idx: number, e?: React.DragEvent) => void;
  handleDrop: (idx: number, e?: React.DragEvent) => void;
  handleDragEnd: () => void;
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: string;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
  sources: DataSource[];
  onRemove?: () => void;
  forceRefreshKey?: number;
  page?: number;
  pageSize?: number;
  shareId?: string;
  refreshMs?: number;
}

export interface DashboardHeaderProps {
  editMode: boolean;
  isCreate: boolean;
  hasPermission: (perm: string) => boolean;
  openAddWidgetModal: (e: React.MouseEvent) => void;
  handleSave: () => void;
  handleCancelEdit: () => void;
  setEditMode: (v: boolean) => void;
  saving: boolean;
  shareLoading?: boolean;
  shareError?: string | null;
  shareLink?: string | null;
  isShareEnabled?: boolean;
  currentShareId?: string | null;
  handleEnableShare?: () => void;
  handleDisableShare?: () => void;
  handleCopyShareLink?: () => void;
  handleExportPDF: () => void;

  children?: ReactNode;
}

export interface SaveModalProps {
  saving: boolean;
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

export interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export interface ExportPDFModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (options: { orientation: "portrait" | "landscape" }) => void;
}

// =====================
// Stores & hooks
// =====================
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

export interface UseGridItemProps {
  widget: Widget;
  sources: DataSource[];
  idx: number;
  hydratedLayout: DashboardLayoutItem[];
  editMode?: boolean;
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
  hoveredIdx?: number | null;
  draggedIdx?: number | null;
  handleDragStart?: (idx: number, e?: React.DragEvent) => void;
  handleDragOver?: (idx: number, e?: React.DragEvent) => void;
  handleDrop?: (idx: number, e?: React.DragEvent) => void;
  handleDragEnd?: () => void;
  isMobile?: boolean;
  item?: DashboardLayoutItem;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
  forceRefreshKey?: number;
  page?: number;
  pageSize?: number;
  shareId?: string;
  refreshMs?: number;
}

export interface UseDashboardGridProps {
  layout: DashboardLayoutItem[];
  editMode?: boolean;
  hasUnsavedChanges?: boolean;
  onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
}

// =====================
// Divers
// =====================
export interface BreadcrumbItem {
  url: string;
  label: string;
}

export interface DashboardSharePopoverProps {
  isShareEnabled?: boolean;
  shareLoading?: boolean;
  shareError?: string | null;
  shareLink?: string | null;
  currentShareId?: string | null;
  handleEnableShare?: () => void;
  handleDisableShare?: () => void;
  handleCopyShareLink?: () => void;
}
