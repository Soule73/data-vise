import { create } from 'zustand';
import type { DashboardStore } from '../types/store';

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
