import { create } from 'zustand';

interface MetricLabelState {
  metricLabels: string[];
  setMetricLabel: (idx: number, label: string) => void;
  setAllMetricLabels: (labels: string[]) => void;
}

export const useMetricLabelStore = create<MetricLabelState>((set) => ({
  metricLabels: [],
  setMetricLabel: (idx, label) => set((state) => {
    const arr = [...state.metricLabels];
    arr[idx] = label;
    return { metricLabels: arr };
  }),
  setAllMetricLabels: (labels) => set(() => ({ metricLabels: labels })),
}));