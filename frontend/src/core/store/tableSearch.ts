import { create } from 'zustand';
import type { TableSearchState } from '@type/theme-types';

export const useTableSearchStore = create<TableSearchState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
  reset: () => set({ search: '' }),
}));
