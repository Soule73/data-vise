import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RoleStore } from '../types/ui';

export const useRoleStore = create<RoleStore>()(
  devtools((set) => ({
    roles: [],
    setRoles: (roles) => set({ roles }),
  }))
);
