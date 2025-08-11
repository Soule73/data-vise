import { create } from "zustand";
import type { DashboardStore } from "@type/dashboardTypes";

export const useDashboardStore = create<DashboardStore>((set) => ({
  editMode: false,
  setEditMode: (v) => set({ editMode: v }),
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (v) => set({ hasUnsavedChanges: v }),
  layout: [],
  setLayout: (l) => set({ layout: l }),
  breadcrumb: [],
  setBreadcrumb: (items) => set({ breadcrumb: items }),
}));
