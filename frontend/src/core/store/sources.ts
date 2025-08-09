import { create } from "zustand";
import type { SourcesStore } from "@type/theme-types";

export const useSourcesStore = create<SourcesStore>((set) => ({
  sources: [],
  setSources: (s) => set({ sources: s }),
}));
