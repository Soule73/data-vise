import express, { Request, Response, NextFunction } from 'express';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { requirePermission } from '../middleware/requirePermission';
import Role from '@/models/Role';
import Permission from '@/models/Permission';
import userController from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Inscription (ouverte à tous)
router.post('/register', userController.register);

// Connexion (ouverte à tous)
router.post('/login', userController.login);

// Création d'un utilisateur (admin seulement)
router.post(
  '/users',
  requireAuth,
  requirePermission('user:canCreate'),
  userController.createUser
);

// Mise à jour d'un utilisateur (admin ou soi-même)
router.put(
  '/users/:id',
  requireAuth,
  requirePermission('user:canUpdate', true),
  userController.updateUser
);

// Suppression d'un utilisateur (admin seulement)
router.delete(
  '/users/:id',
  requireAuth,
  requirePermission('user:canDelete'),
  userController.deleteUser
);

// Lister tous les rôles (admin seulement)
router.get('/roles', requireAuth, requirePermission('role:canView'), userController.listRoles);

// Créer un rôle (admin seulement)
router.post('/roles', requireAuth, requirePermission('role:canCreate'), userController.createRole);

// Modifier un rôle (admin seulement)
router.put('/roles/:id', requireAuth, requirePermission('role:canUpdate'), userController.updateRole);

// Supprimer un rôle (admin seulement, si aucun utilisateur ne l'utilise)
router.delete('/roles/:id', requireAuth, requirePermission('role:canDelete'), userController.deleteRole);

// Lister toutes les permissions (admin seulement)
router.get('/permissions', requireAuth, requirePermission('role:canView'), userController.listPermissions);

// Lister tous les utilisateurs (admin seulement)
router.get(
  '/users',
  requireAuth,
  requirePermission('user:canView'),
  userController.listUsers
);

export default router;
