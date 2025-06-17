import mongoose, { Types } from "mongoose";
import { Request } from "express";

// --- Bases communes ---
export interface BasePermission {
  name: string;
  description?: string;
}
export interface BaseRole {
  name: string;
  description?: string;
}
export interface BaseUserPayload {
  username: string;
  email: string;
  password: string;
}

// Utilisateurs
export interface IUser extends mongoose.Document, BaseUserPayload {
  roleId: mongoose.Types.ObjectId;
  preferences?: Record<string, unknown>;
}

export interface AuthUser {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// Permissions
export interface IPermission extends mongoose.Document, BasePermission {}

// Rôles
export interface IRole extends mongoose.Document, BaseRole {
  permissions: mongoose.Types.ObjectId[];
}

// Types utilitaires pour les rôles/permissions peuplés
export interface PopulatedPermission extends BasePermission {
  _id: mongoose.Types.ObjectId | string;
}
export interface PopulatedRole extends BaseRole {
  _id: mongoose.Types.ObjectId | string;
  permissions: PopulatedPermission[];
}

// Payloads utilisateurs
export interface RegisterPayload
  extends Pick<BaseUserPayload, "username" | "email" | "password"> {}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface CreateUserPayload extends BaseUserPayload {
  roleId: string;
}
export interface UpdateUserPayload extends Partial<BaseUserPayload> {
  roleId?: string;
}

// Payloads rôles
export interface CreateRolePayload extends BaseRole {
  permissions: string[];
}
export interface UpdateRolePayload extends Partial<BaseRole> {
  permissions?: string[];
}

export interface LeanRole {
  _id: Types.ObjectId | string;
  name: string;
  description?: string;
  permissions: Types.ObjectId[];
}

export interface LeanRoleWithCanDelete extends LeanRole {
  canDelete: boolean;
}

export interface UserRoleResponse {
  id: string;
  name: string;
  description?: string;
  permissions: { id: string; name: string; description?: string }[];
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: UserRoleResponse | null;
}
