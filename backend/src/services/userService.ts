import User from "../models/User";
import Role from "../models/Role";
import Permission from "../models/Permission";
import Widget from "../models/Widget";
import Dashboard from "../models/Dashboard";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type {
  IUser,
  IRole,
  IPermission,
  PopulatedRole,
  PopulatedPermission,
  RegisterPayload,
  LoginPayload,
  CreateUserPayload,
  UpdateUserPayload,
  CreateRolePayload,
  UpdateRolePayload,
  UserResponse,
  UserRoleResponse,
  LeanRoleWithCanDelete,
} from "../types/authType";
import mongoose from "mongoose";
import { ApiResponse } from "@/types/api";

function sanitizeUser(user: IUser | null | undefined) {
  if (!user) return user;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

const userService = {
  async register(
    payload: RegisterPayload
  ): Promise<ApiResponse<{ user: UserResponse; token: string }>> {
    const { username, email, password } = payload;
    if (!username || username.length < 2)
      return {
        error: {
          errors: {
            username:
              "Le nom d'utilisateur doit contenir au moins 2 caractères.",
          },
        },
        status: 422,
      };
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return { error: { errors: { email: "Email invalide." } }, status: 422 };
    if (!password || password.length < 6)
      return {
        error: {
          errors: {
            password: "Le mot de passe doit contenir au moins 6 caractères.",
          },
        },
        status: 422,
      };
    const existing = await User.findOne({ email });
    if (existing)
      return {
        error: { errors: { email: "Cet email est déjà utilisé." } },
        status: 422,
      };
    const defaultRole = await Role.findOne({ name: "user" });
    if (!defaultRole)
      return {
        error: {
          errors: { roleId: "Le rôle par défaut 'user' est introuvable." },
        },
        status: 500,
      };
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hash,
      roleId: defaultRole._id,
    });
    const userPopulated = await User.findById(user._id).populate({
      path: "roleId",
      populate: { path: "permissions" },
    });
    // Correction du typage _id
    const userId = (
      user._id as import("mongoose").Types.ObjectId | string
    ).toString();
    let role: UserRoleResponse | null = null;
    if (
      userPopulated &&
      userPopulated.roleId &&
      typeof userPopulated.roleId === "object" &&
      "permissions" in userPopulated.roleId
    ) {
      const r = userPopulated.roleId as unknown as PopulatedRole;
      role = {
        id: r._id.toString(),
        name: r.name,
        description: r.description,
        permissions: Array.isArray(r.permissions)
          ? r.permissions.map((p: PopulatedPermission) => ({
              id: p._id.toString(),
              name: p.name,
              description: p.description,
            }))
          : [],
      };
    }
    const token = jwt.sign(
      { id: userId, role: role?.name },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    return {
      data: {
        user: {
          id: userId,
          username: user.username,
          email: user.email,
          role,
        },
        token,
      },
    };
  },
  async login(
    payload: LoginPayload
  ): Promise<ApiResponse<{ user: UserResponse; token: string }>> {
    const { email, password } = payload;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return { error: { errors: { email: "Email invalide." } }, status: 422 };
    if (!password)
      return {
        error: { errors: { password: "Mot de passe requis." } },
        status: 422,
      };
    const userPopulated = await User.findOne({ email }).populate({
      path: "roleId",
      populate: { path: "permissions" },
    });
    // Correction du typage _id
    const userPopId = userPopulated
      ? (
          userPopulated._id as import("mongoose").Types.ObjectId | string
        ).toString()
      : "";
    if (!userPopulated)
      return { error: { message: "Identifiants invalides." }, status: 401 };
    if (!userPopulated.roleId)
      return {
        error: { message: "Aucun rôle associé à ce compte." },
        status: 403,
      };
    const valid = await bcrypt.compare(password, userPopulated.password);
    if (!valid)
      return { error: { message: "Identifiants invalides." }, status: 401 };
    let role: UserRoleResponse | null = null;
    if (
      typeof userPopulated.roleId === "object" &&
      "permissions" in userPopulated.roleId
    ) {
      const r = userPopulated.roleId as unknown as PopulatedRole;
      role = {
        id: r._id.toString(),
        name: r.name,
        description: r.description,
        permissions: Array.isArray(r.permissions)
          ? r.permissions.map((p: PopulatedPermission) => ({
              id: p._id.toString(),
              name: p.name,
              description: p.description,
            }))
          : [],
      };
    }
    const token = jwt.sign(
      { id: userPopId, role: role?.name },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    return {
      data: {
        user: {
          id: userPopId,
          username: userPopulated.username,
          email: userPopulated.email,
          role,
        },
        token,
      },
    };
  },
  async createUser(
    payload: CreateUserPayload
  ): Promise<ApiResponse<{ user: IUser }>> {
    const { username, email, password, roleId } = payload;
    if (!username || !email || !password || !roleId)
      return { error: { message: "Champs requis manquants." }, status: 400 };
    const existing = await User.findOne({ email });
    if (existing)
      return { error: { message: "Cet email est déjà utilisé." }, status: 422 };
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash, roleId });
    const userPopulated = await User.findById(user._id).populate(
      "roleId",
      "name"
    );
    return { data: { user: sanitizeUser(userPopulated) } };
  },
  async updateUser(
    id: string,
    payload: UpdateUserPayload
  ): Promise<ApiResponse<{ user: IUser }>> {
    const update: Partial<
      Pick<IUser, "username" | "email" | "password" | "roleId">
    > = {};
    if (payload.username) update.username = payload.username;
    if (payload.email) update.email = payload.email;
    if (payload.roleId)
      update.roleId = new mongoose.Types.ObjectId(payload.roleId);
    if (payload.password && payload.password.length > 0)
      update.password = await bcrypt.hash(payload.password, 10);
    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("roleId", "name");
    if (!user)
      return { error: { message: "Utilisateur non trouvé." }, status: 404 };
    return { data: { user: sanitizeUser(user) } };
  },
  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    await Widget.deleteMany({ ownerId: id, visibility: "private" });
    await Widget.updateMany(
      { ownerId: id, visibility: "public" },
      { $set: { ownerId: null } }
    );
    await Dashboard.deleteMany({ ownerId: id, visibility: "private" });
    await Dashboard.updateMany(
      { ownerId: id, visibility: "public" },
      { $set: { ownerId: null } }
    );
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return { error: { message: "Utilisateur non trouvé." }, status: 404 };
    return { data: { message: "Utilisateur supprimé." } };
  },
  async listRoles(): Promise<IRole[]> {
    return await Role.find().populate("permissions");
  },
  async listRolesWithCanDelete(): Promise<LeanRoleWithCanDelete[]> {
    const roles = await Role.find().populate("permissions").lean();
    const users = await User.find({}, "roleId").lean();
    const roleUsage: Record<string, number> = {};
    users.forEach((u) => {
      if (u.roleId) {
        roleUsage[u.roleId.toString()] =
          (roleUsage[u.roleId.toString()] || 0) + 1;
      }
    });
    return roles.map((r) => ({
      ...r,
      _id: r._id.toString(),
      canDelete: !roleUsage[r._id?.toString()],
    }));
  },
  async createRole(payload: CreateRolePayload): Promise<ApiResponse<IRole>> {
    const { name, description, permissions } = payload;
    if (!name || !Array.isArray(permissions) || permissions.length === 0)
      return {
        error: { message: "Nom et au moins une permission requise." },
        status: 400,
      };
    const perms = await Permission.find({ _id: { $in: permissions } });
    if (perms.length !== permissions.length)
      return {
        error: { message: "Une ou plusieurs permissions sont invalides." },
        status: 400,
      };
    const role = await Role.create({ name, description, permissions });
    return { data: role };
  },
  async updateRole(
    id: string,
    payload: UpdateRolePayload
  ): Promise<ApiResponse<IRole>> {
    const { name, description, permissions } = payload;
    if (
      permissions &&
      (!Array.isArray(permissions) || permissions.length === 0)
    )
      return {
        error: { message: "Un rôle doit avoir au moins une permission." },
        status: 400,
      };
    if (permissions) {
      const perms = await Permission.find({ _id: { $in: permissions } });
      if (perms.length !== permissions.length)
        return {
          error: { message: "Une ou plusieurs permissions sont invalides." },
          status: 400,
        };
    }
    const role = await Role.findByIdAndUpdate(
      id,
      { $set: { name, description, ...(permissions ? { permissions } : {}) } },
      { new: true }
    ).populate("permissions");
    if (!role) return { error: { message: "Rôle non trouvé." }, status: 404 };
    return { data: role };
  },
  async deleteRole(id: string): Promise<ApiResponse<{ message: string }>> {
    const usersWithRole = await User.countDocuments({ roleId: id });
    if (usersWithRole > 0)
      return {
        error: {
          message:
            "Impossible de supprimer un rôle utilisé par des utilisateurs.",
        },
        status: 400,
      };
    const role = await Role.findByIdAndDelete(id);
    if (!role) return { error: { message: "Rôle non trouvé." }, status: 404 };
    return { data: { message: "Rôle supprimé." } };
  },
  async listPermissions(): Promise<IPermission[]> {
    return await Permission.find();
  },
  async listUsers(): Promise<IUser[]> {
    const users = await User.find().populate("roleId", "name");
    return users.map(sanitizeUser);
  },
};

export default userService;
