import {create} from 'zustand';

interface TableSearchState {
  search: string;
  setSearch: (search: string) => void;
  reset: () => void;
}

export const useTableSearchStore = create<TableSearchState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
  reset: () => set({ search: '' }),
}));
