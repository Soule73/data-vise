import { create } from 'zustand';

interface MetricUICollapseState {
  collapsedMetrics: Record<string | number, boolean>;
  toggleCollapse: (idx: string | number) => void;
  setCollapsed: (collapsed: Record<string | number, boolean>) => void;
  reset: () => void;
}

export const useMetricUICollapseStore = create<MetricUICollapseState>((set) => ({
  collapsedMetrics: {},
  toggleCollapse: (idx) => set((state) => ({
    collapsedMetrics: { ...state.collapsedMetrics, [idx]: !state.collapsedMetrics[idx] }
  })),
  setCollapsed: (collapsed) => set({ collapsedMetrics: collapsed }),
  reset: () => set({ collapsedMetrics: {} }),
}));
