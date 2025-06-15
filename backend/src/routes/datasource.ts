import express, { Request, Response, NextFunction } from "express";
import { requirePermission } from "../middleware/requirePermission";
import { requireAuth } from "../middleware/auth";
import dataSourceController from "../controllers/dataSourceController";
import multer from "multer";
import path from "path";
import fs from "fs";

// Définir le chemin absolu du dossier uploads à la racine du projet (data-vise/uploads)
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Ajoute l'extension d'origine au nom généré par multer
    const ext = path.extname(file.originalname) || ".csv";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max
});

const router = express.Router();

// Lister toutes les sources de l'utilisateur (ou globales)
router.get(
  "/",
  requireAuth,
  requirePermission("datasource:canView"),
  dataSourceController.list
);

// Créer une nouvelle source
router.post(
  "/",
  requireAuth,
  requirePermission("datasource:canCreate"),
  upload.single("file"), // Ajout du middleware multer
  dataSourceController.create
);

// Récupérer une source par ID
router.get(
  "/:id",
  requireAuth,
  requirePermission("datasource:canView"),
  dataSourceController.getById
);

// Mettre à jour une source
router.put(
  "/:id",
  requireAuth,
  requirePermission("datasource:canUpdate"),
  dataSourceController.update
);

// Supprimer une source
router.delete(
  "/:id",
  requireAuth,
  requirePermission("datasource:canDelete"),
  dataSourceController.remove
);

// Endpoint pour détecter dynamiquement les colonnes d'une source (exemple : JSON ou endpoint externe)
router.post(
  "/detect-columns",
  requireAuth,
  requirePermission("datasource:canView"),
  upload.single("file"), // Ajout du middleware multer
  dataSourceController.detectColumns
);

// Endpoint pour servir un fichier JSON de test (pour la démo frontend)
router.get("/demo/ventes", dataSourceController.demoVentes);

// Endpoint pour récupérer les données d'une source avec filtrage temporel
router.get(
  "/:id/data",
  requireAuth,
  requirePermission("datasource:canView"),
  dataSourceController.fetchData
);

export default router;
