import { create } from 'zustand';
import type { DashboardLayoutItem } from '@/hooks/useDashboard';

interface DashboardStore {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (v: boolean) => void;
  layout: DashboardLayoutItem[];
  setLayout: (l: DashboardLayoutItem[]) => void;
  breadcrumbTitles?: Record<string, string>;
  setBreadcrumbTitle?: (key: string, title: string) => void;
  getDashboardTitle?: (id: string) => string | null;
  getBreadcrumbDisplayName?: (segment: string, routeTo: string) => string;
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
  breadcrumbTitles: {},
  setBreadcrumbTitle: (key, title) => set((state) => ({
    breadcrumbTitles: { ...state.breadcrumbTitles, [key]: title },
  })),
  dashboardTitle: "",
  setDashboardTitle: (id: string, title: string) => set((state) => ({
    dashboardTitle: title,
    breadcrumbTitles: { ...state.breadcrumbTitles, [id]: title },
  })),
  getDashboardTitle: (id: string) => {
    const titles = get().breadcrumbTitles || {};
    return titles[id] || null;
  },
  getDashboardDisplayTitle: () => get().dashboardTitle,
  getBreadcrumbDisplayName: (segment: string, routeTo: string) => {
    const titles = get().breadcrumbTitles || {};
    // Dashboard en création
    if (routeTo === "/dashboards/create") {
      return titles["create"] || "Nouveau dashboard";
    }
    // Dashboard existant par id
    const match = /^\/dashboards\/([\w-]+)/.exec(routeTo);
    if (match && match[1] && match[1] !== "create") {
      const id = match[1];
      return titles[id] || "Dashboard";
    }
    // Si un titre personnalisé existe pour ce segment, l'utiliser
    if (titles[segment]) {
      return titles[segment];
    }
    // Par défaut, segment capitalisé
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  },
}));
