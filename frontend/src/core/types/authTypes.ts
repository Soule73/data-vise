// ======================================================
// 8. Utilisateurs, Rôles & Permissions
// ======================================================

// --- Gestion Utilisateur

export interface User {
  _id: string;
  email: string;
  username: string;
  roleId?: { _id: string; name: string };
  role?: UserRole;
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
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token: string) => void;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface RoleCreateForm {
  name: string;
  description: string;
  permissions: string[];
}

export interface UserStoreWithPerms extends UserState {
  getPermissions: () => string[];
  hasPermission: (permName: string) => boolean;
  isOwner: (ownerId: string) => boolean;
}

export interface LoginRegisterResponse {
  user: User;
  token: string;
}
