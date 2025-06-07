import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  canDelete?: boolean;
}

interface RoleStore {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
}

export const useRoleStore = create<RoleStore>()(
  devtools((set) => ({
    roles: [],
    setRoles: (roles) => set({ roles }),
  }))
);
