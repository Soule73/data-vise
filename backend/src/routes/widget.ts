import express, { Request, Response, NextFunction } from 'express';
import { requirePermission } from '@/middleware/requirePermission';
import { requireAuth } from '../middleware/auth';
import widgetController from '../controllers/widgetController';

const router = express.Router();

// Lister tous les widgets d'un dashboard
router.get(
  '/',
  requireAuth,
  requirePermission('widget:canView'),
  widgetController.list
);

// Créer un widget
router.post(
  '/',
  requireAuth,
  requirePermission('widget:canCreate'),
  widgetController.create
);

// Mettre à jour un widget
router.put(
  '/:id',
  requireAuth,
  requirePermission('widget:canUpdate'),
  widgetController.update
);

// Supprimer un widget
router.delete(
  '/:id',
  requireAuth,
  requirePermission('widget:canDelete'),
  widgetController.remove
);

// Récupérer un widget par ID
router.get(
  '/:id',
  requireAuth,
  requirePermission('widget:canView'),
  widgetController.getById
);

export default router;
