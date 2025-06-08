import express, { Request, Response, NextFunction } from 'express';
import { requirePermission } from '../middleware/requirePermission';
import { requireAuth } from '../middleware/auth';
import dataSourceController from '../controllers/dataSourceController';

const router = express.Router();

// Lister toutes les sources de l'utilisateur (ou globales)
router.get(
  '/',
  requireAuth,
  requirePermission('datasource:canView'),
  dataSourceController.list
);

// Créer une nouvelle source
router.post(
  '/',
  requireAuth,
  requirePermission('datasource:canCreate'),
  dataSourceController.create
);

// Récupérer une source par ID
router.get(
  '/:id',
  requireAuth,
  requirePermission('datasource:canView'),
  dataSourceController.getById
);

// Mettre à jour une source
router.put(
  '/:id',
  requireAuth,
  requirePermission('datasource:canUpdate'),
  dataSourceController.update
);

// Supprimer une source
router.delete(
  '/:id',
  requireAuth,
  requirePermission('datasource:canDelete'),
  dataSourceController.remove
);

// Endpoint pour détecter dynamiquement les colonnes d'une source (exemple : JSON ou endpoint externe)
router.post(
  '/detect-columns',
  requireAuth,
  requirePermission('datasource:canView'),
  dataSourceController.detectColumns
);

// Endpoint pour servir un fichier JSON de test (pour la démo frontend)
router.get('/demo/ventes', dataSourceController.demoVentes);

export default router;
