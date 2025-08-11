import { create } from "zustand";
import type { SourcesStore } from "@type/themeTypes";

export const useSourcesStore = create<SourcesStore>((set) => ({
  sources: [],
  setSources: (s) => set({ sources: s }),
}));
