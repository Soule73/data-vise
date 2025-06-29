import { create } from 'zustand';
import type { TableSearchState } from '../types/theme-types';

export const useTableSearchStore = create<TableSearchState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
  reset: () => set({ search: '' }),
}));
