import { create } from 'zustand';
import type { SourcesStore } from '../types/store';

export const useSourcesStore = create<SourcesStore>((set) => ({
  sources: [],
  setSources: (s) => set({ sources: s }),
}));
