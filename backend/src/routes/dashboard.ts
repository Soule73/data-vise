import express, { Request, Response, NextFunction } from "express";
import { requirePermission } from "../middleware/requirePermission";
import { requireAuth } from "../middleware/auth";
import dashboardController from "../controllers/dashboardController";

const router = express.Router();

// Créer un nouveau dashboard
router.post(
  "/",
  requireAuth,
  requirePermission("dashboard:canCreate"),
  dashboardController.createDashboard
);

// Récupérer un dashboard par ID
router.get(
  "/:id",
  requireAuth,
  requirePermission("dashboard:canView"),
  dashboardController.getDashboardById
);

// Mettre à jour le layout du dashboard
router.put(
  "/:id",
  requireAuth,
  requirePermission("dashboard:canUpdate"),
  dashboardController.updateDashboard
);

// Supprimer un dashboard
router.delete(
  "/:id",
  requireAuth,
  requirePermission("dashboard:canDelete"),
  dashboardController.deleteDashboard
);

// Lister tous les dashboards de l'utilisateur courant
router.get(
  "/",
  requireAuth,
  requirePermission("dashboard:canView"),
  dashboardController.listUserDashboards
);

// Activer le partage public d'un dashboard
router.post(
  "/:id/share/enable",
  requireAuth,
  requirePermission("dashboard:canUpdate"),
  dashboardController.enableShare
);
// Désactiver le partage public d'un dashboard
router.post(
  "/:id/share/disable",
  requireAuth,
  requirePermission("dashboard:canUpdate"),
  dashboardController.disableShare
);
// Route publique pour accéder à un dashboard partagé (pas d'auth)
router.get(
  "/share/:shareId",
  dashboardController.getSharedDashboard
);
// Route publique pour accéder aux sources d'un dashboard partagé (pas d'auth)
router.get(
  "/share/:shareId/sources",
  dashboardController.getSharedDashboardSources
);
export default router;
