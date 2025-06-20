import { Types } from "mongoose";
import { IRole } from "./authType";

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
