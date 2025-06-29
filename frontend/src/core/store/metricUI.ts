import { create } from 'zustand';
import type { MetricUICollapseState } from '../types/metric-bucket-types';


export const useMetricUICollapseStore = create<MetricUICollapseState>((set) => ({
  collapsedMetrics: {},
  toggleCollapse: (idx) => set((state) => ({
    collapsedMetrics: { ...state.collapsedMetrics, [idx]: !state.collapsedMetrics[idx] }
  })),
  setCollapsed: (collapsed) => set({ collapsedMetrics: collapsed }),
  reset: () => set({ collapsedMetrics: {} }),
}));
