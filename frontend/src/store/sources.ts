import { create } from 'zustand';

interface SourcesStore {
  sources: any[];
  setSources: (s: any[]) => void;
}

export const useSourcesStore = create<SourcesStore>((set) => ({
  sources: [],
  setSources: (s) => set({ sources: s }),
}));
