import User from '../models/User';
import Role from '../models/Role';
import Permission from '../models/Permission';
import Widget from '../models/Widget';
import Dashboard from '../models/Dashboard';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function sanitizeUser(user: any) {
  if (!user) return user;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

const userService = {
  async register({ username, email, password }: any) {
    if (!username || username.length < 2) return { error: { errors: { username: 'Le nom d\'utilisateur doit contenir au moins 2 caractères.' } }, status: 422 };
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: { errors: { email: 'Email invalide.' } }, status: 422 };
    if (!password || password.length < 6) return { error: { errors: { password: 'Le mot de passe doit contenir au moins 6 caractères.' } }, status: 422 };
    const existing = await User.findOne({ email });
    if (existing) return { error: { errors: { email: 'Cet email est déjà utilisé.' } }, status: 422 };
    // Chercher le rôle "user" par défaut
    const defaultRole = await Role.findOne({ name: 'user' });
    if (!defaultRole) return { error: { errors: { roleId: 'Le rôle par défaut "user" est introuvable.' } }, status: 500 };
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash, roleId: defaultRole._id });
    const userPopulated = await User.findById(user._id).populate({ path: 'roleId', populate: { path: 'permissions' } });
    let role = null;
    let permissions: any[] = [];
    if (userPopulated && userPopulated.roleId && typeof userPopulated.roleId === 'object' && 'permissions' in userPopulated.roleId) {
      const r: any = userPopulated.roleId;
      role = {
        id: r._id,
        name: r.name,
        description: r.description,
        permissions: Array.isArray(r.permissions)
          ? r.permissions.map((p: any) => ({ id: p._id, name: p.name, description: p.description }))
          : []
      };
      permissions = role.permissions;
    }
    const token = jwt.sign({ id: user._id, role: role?.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return {
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role
        },
        token
      }
    };
  },
  async login({ email, password }: any) {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: { errors: { email: 'Email invalide.' } }, status: 422 };
    if (!password) return { error: { errors: { password: 'Mot de passe requis.' } }, status: 422 };
    const userPopulated = await User.findOne({ email }).populate({ path: 'roleId', populate: { path: 'permissions' } });
    if (!userPopulated) return { error: { message: 'Identifiants invalides.' }, status: 401 };
    if (!userPopulated.roleId) return { error: { message: 'Aucun rôle associé à ce compte.' }, status: 403 };
    const valid = await bcrypt.compare(password, userPopulated.password);
    if (!valid) return { error: { message: 'Identifiants invalides.' }, status: 401 };
    let role = null;
    if (typeof userPopulated.roleId === 'object' && 'permissions' in userPopulated.roleId) {
      const r: any = userPopulated.roleId;
      role = {
        id: r._id,
        name: r.name,
        description: r.description,
        permissions: Array.isArray(r.permissions)
          ? r.permissions.map((p: any) => ({ id: p._id, name: p.name, description: p.description }))
          : []
      };
    }
    const token = jwt.sign({ id: userPopulated._id, role: role?.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return {
      data: {
        user: {
          id: userPopulated._id,
          username: userPopulated.username,
          email: userPopulated.email,
          role
        },
        token
      }
    };
  },
  async createUser({ username, email, password, roleId }: any) {
    if (!username || !email || !password || !roleId) return { error: { message: 'Champs requis manquants.' }, status: 400 };
    const existing = await User.findOne({ email });
    if (existing) return { error: { message: 'Cet email est déjà utilisé.' }, status: 422 };
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash, roleId });
    const userPopulated = await User.findById(user._id).populate('roleId', 'name');
    return { data: { user: sanitizeUser(userPopulated) } };
  },
  async updateUser(id: string, { username, email, password, roleId }: any) {
    const update: any = {};
    if (username) update.username = username;
    if (email) update.email = email;
    if (roleId) update.roleId = roleId;
    if (password && password.length > 0) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(id, update, { new: true }).populate('roleId', 'name');
    if (!user) return { error: { message: 'Utilisateur non trouvé.' }, status: 404 };
    return { data: { user: sanitizeUser(user) } };
  },
  async deleteUser(id: string) {
    // Supprimer les widgets privés de l'utilisateur
    await Widget.deleteMany({ ownerId: id, visibility: 'private' });
    // Pour les widgets publics, on conserve mais on met ownerId à null
    await Widget.updateMany({ ownerId: id, visibility: 'public' }, { $set: { ownerId: null } });
    // Supprimer les dashboards privés de l'utilisateur
    await Dashboard.deleteMany({ ownerId: id, visibility: 'private' });
    // Pour les dashboards publics, on conserve mais on met ownerId à null
    await Dashboard.updateMany({ ownerId: id, visibility: 'public' }, { $set: { ownerId: null } });
    // Supprimer l'utilisateur
    const user = await User.findByIdAndDelete(id);
    if (!user) return { error: { message: 'Utilisateur non trouvé.' }, status: 404 };
    return { data: { message: 'Utilisateur supprimé.' } };
  },
  async listRoles() {
    return await Role.find().populate('permissions');
  },
  async listRolesWithCanDelete() {
    const roles = await Role.find().populate('permissions').lean();
    const users = await User.find({}, 'roleId').lean();
    const roleUsage: Record<string, number> = {};
    users.forEach(u => {
      if (u.roleId) {
        roleUsage[u.roleId.toString()] = (roleUsage[u.roleId.toString()] || 0) + 1;
      }
    });
    return roles.map(r => ({
      ...r,
      canDelete: !roleUsage[r._id?.toString()]
    }));
  },
  async createRole({ name, description, permissions }: any) {
    if (!name || !Array.isArray(permissions) || permissions.length === 0) return { error: { message: 'Nom et au moins une permission requise.' }, status: 400 };
    const perms = await Permission.find({ _id: { $in: permissions } });
    if (perms.length !== permissions.length) return { error: { message: 'Une ou plusieurs permissions sont invalides.' }, status: 400 };
    const role = await Role.create({ name, description, permissions });
    return { data: role };
  },
  async updateRole(id: string, { name, description, permissions }: any) {
    if (permissions && (!Array.isArray(permissions) || permissions.length === 0)) return { error: { message: 'Un rôle doit avoir au moins une permission.' }, status: 400 };
    if (permissions) {
      const perms = await Permission.find({ _id: { $in: permissions } });
      if (perms.length !== permissions.length) return { error: { message: 'Une ou plusieurs permissions sont invalides.' }, status: 400 };
    }
    const role = await Role.findByIdAndUpdate(id, { $set: { name, description, ...(permissions ? { permissions } : {}) } }, { new: true }).populate('permissions');
    if (!role) return { error: { message: 'Rôle non trouvé.' }, status: 404 };
    return { data: role };
  },
  async deleteRole(id: string) {
    const usersWithRole = await User.countDocuments({ roleId: id });
    if (usersWithRole > 0) return { error: { message: 'Impossible de supprimer un rôle utilisé par des utilisateurs.' }, status: 400 };
    const role = await Role.findByIdAndDelete(id);
    if (!role) return { error: { message: 'Rôle non trouvé.' }, status: 404 };
    return { data: { message: 'Rôle supprimé.' } };
  },
  async listPermissions() {
    return await Permission.find();
  },
  async listUsers() {
    const users = await User.find().populate('roleId', 'name');
    return users.map(sanitizeUser);
  },
};

export default userService;
