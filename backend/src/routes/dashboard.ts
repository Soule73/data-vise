import express, { Request, Response, NextFunction } from 'express';
import { requirePermission } from '../middleware/requirePermission';
import { requireAuth } from '../middleware/auth';
import dashboardController from '../controllers/dashboardController';

const router = express.Router();

// Récupérer le dashboard de l'utilisateur courant (single dashboard par user)
router.get('/me', requireAuth, requirePermission('dashboard:canView'), dashboardController.getMyDashboard);

// Créer un nouveau dashboard
router.post('/', requireAuth, requirePermission('dashboard:canCreate'), dashboardController.createDashboard);

// Récupérer un dashboard par ID
router.get('/:id', requireAuth, requirePermission('dashboard:canView'), dashboardController.getDashboardById);

// Mettre à jour le layout du dashboard
router.put('/:id', requireAuth, requirePermission('dashboard:canUpdate'), dashboardController.updateDashboard);

// Supprimer un dashboard
router.delete('/:id', requireAuth, requirePermission('dashboard:canDelete'), dashboardController.deleteDashboard);

// Lister tous les dashboards de l'utilisateur courant
router.get('/', requireAuth, requirePermission('dashboard:canView'), dashboardController.listUserDashboards);

// DEBUG : endpoint temporaire pour lister tous les widgets (widgetId, _id, title)
router.get('/debug/widgets', requireAuth, requirePermission('widget:canView'), dashboardController.debugWidgets);

export default router;
