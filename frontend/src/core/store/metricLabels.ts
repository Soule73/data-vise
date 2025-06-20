import { create } from 'zustand';
import type { MetricLabelState } from '../types/metric-bucket-types';

export const useMetricLabelStore = create<MetricLabelState>((set) => ({
  metricLabels: [],
  setMetricLabel: (idx, label) => set((state) => {
    const arr = [...state.metricLabels];
    arr[idx] = label;
    return { metricLabels: arr };
  }),
  setAllMetricLabels: (labels) => set(() => ({ metricLabels: labels })),
}));