import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Role from '../models/Role';
import Permission from '../models/Permission';
import type { AuthRequest } from './auth';

/**
 * Middleware générique pour vérifier qu'un utilisateur a la permission demandée.
 * @param permissionName ex: 'dashboard:canUpdate'
 * @param allowSelfUpdateUser Si true, autorise un user à modifier ses propres infos (PUT /users/:id)
 */
export function requirePermission(permissionName: string, allowSelfUpdateUser = false) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Authentification obligatoire
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Non authentifié.' });

    // Cas spécial : modification de ses propres infos (PUT /users/:id)
    if (
      allowSelfUpdateUser &&
      req.method === 'PUT' &&
      req.params.id &&
      (String(req.params.id) === String((user as any)._id ?? user.id))
    ) {
      return next();
    }

    // Récupère le rôle et les permissions de l'utilisateur
    const userPop = await User.findById((user as any)._id ?? user.id).populate({ path: 'roleId', populate: { path: 'permissions' } });
    const role: any = userPop?.roleId;
    if (!role) return res.status(403).json({ message: 'Aucun rôle associé.' });
    // role.permissions peut être un tableau d'ObjectId ou d'objets Permission
    const perms = Array.isArray(role.permissions)
      ? role.permissions.map((p: any) => (typeof p === 'string' ? p : (p.name || p.toString())))
      : [];
    if (perms.includes(permissionName)) {
      return next();
    }
    return res.status(403).json({ message: 'Permission insuffisante.' });
  };
}
