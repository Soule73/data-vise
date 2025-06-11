import { create } from 'zustand';
import type { DashboardLayoutItem } from '@/hooks/useDashboard';

interface BreadcrumbItem {
  url: string;
  label: string;
}

interface DashboardStore {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (v: boolean) => void;
  layout: DashboardLayoutItem[]; // width/height natifs
  setLayout: (l: DashboardLayoutItem[]) => void;
  breadcrumb: BreadcrumbItem[];
  setBreadcrumb: (items: BreadcrumbItem[]) => void;
  dashboardTitle: string;
  setDashboardTitle: (id: string, title: string) => void;
  getDashboardDisplayTitle?: () => string;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  editMode: false,
  setEditMode: (v) => set({ editMode: v }),
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (v) => set({ hasUnsavedChanges: v }),
  layout: [],
  setLayout: (l) => set({ layout: l }),
  breadcrumb: [],
  setBreadcrumb: (items) => set({ breadcrumb: items }),
  dashboardTitle: "",
  setDashboardTitle: (_id: string, title: string) => set({ dashboardTitle: title }),
  getDashboardDisplayTitle: () => get().dashboardTitle,
}));
