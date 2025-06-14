// ======================================================
// 8. Utilisateurs, Rôles & Permissions
// ======================================================

// --- Gestion Utilisateur

export interface User {
  _id: string;
  email: string;
  username: string;
  roleId?: { _id: string; name: string };
}

// --- Rôles et Permissions

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  canDelete?: boolean;
}

export interface RoleStore {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
}

export interface Permission {
  _id: string;
  name: string;
  description?: string;
}

export interface PermissionStore {
  permissions: Permission[];
  setPermissions: (perms: Permission[]) => void;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface UserState {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole | null;
  } | null;
  token: string | null;
  setUser: (
    user: {
      id: string;
      username: string;
      email: string;
      role: UserRole | null;
    },
    token: string
  ) => void;
  logout: () => void;
  hasPermission: (permName: string) => boolean;
}

// --- Composants UI pour les rôles et permissions

export interface PermissionGroupCheckboxesProps {
  permissions: Permission[];
  checked: string[];
  onToggle: (permId: string) => void;
}

export interface RoleCreateFormProps {
  permissions: Permission[];
  onSuccess: () => void;
}

export interface PermissionGroupProps {
  model: string;
  perms: any[];
  checkedPerms: string[];
  onToggle: (permId: string) => void;
  editable: boolean;
}

export interface RoleActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onTogglePerms: () => void;
  showPerms: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
}

export interface RoleInfoProps {
  isEditing: boolean;
  name: string;
  description: string;
  onChangeName: (v: string) => void;
  onChangeDescription: (v: string) => void;
}
