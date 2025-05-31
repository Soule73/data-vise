import { create } from 'zustand';
import type { DashboardLayoutItem } from '@/hooks/useDashboard';

interface DashboardStore {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (v: boolean) => void;
  layout: DashboardLayoutItem[];
  setLayout: (l: DashboardLayoutItem[]) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  editMode: false,
  setEditMode: (v) => set({ editMode: v }),
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (v) => set({ hasUnsavedChanges: v }),
  layout: [],
  setLayout: (l) => set({ layout: l }),
}));
