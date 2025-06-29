import express, { Request, Response, NextFunction } from "express";
import { requirePermission } from "../middleware/requirePermission";
import { requireAuth } from "../middleware/auth";
import dataSourceController from "../controllers/dataSourceController";
import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Crée le répertoire de stockage pour les fichiers uploadés s'il n'existe pas.
 * Le répertoire est créé dans le répertoire courant du processus.
 *
 * @type {string}
 * @description Ce répertoire est utilisé pour stocker les fichiers uploadés via l'API.
 * Il est important de s'assurer que ce répertoire existe avant de tenter d'y stocker des fichiers.
 *
 * Si le répertoire n'existe pas, il est créé avec les permissions par défaut.
 */
const uploadsDir: string = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Configuration de multer pour le stockage des fichiers uploadés.
 * Utilise le système de fichiers pour stocker les fichiers dans le répertoire spécifié.
 * Le nom du fichier est généré de manière unique en utilisant un timestamp et un nombre aléatoire.
 *
 * @type {multer.StorageEngine}
 *
 */
const storage: multer.StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".csv";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();

/** * Endpoint pour lister toutes les sources de données.
 * L'utilisateur doit être authentifié et avoir
 *
 * la permission "datasource:canView".
 *
 * ROUTE GET /sources
 *
 */
router.get(
  "/",
  requireAuth,
  requirePermission("datasource:canView"),
  dataSourceController.list
);

/**
 * Endpoint pour créer une nouvelle source.
 * Ce point d'entrée accepte un fichier via multipart/form-data.
 * Le fichier doit être envoyé avec le champ "file".
 * L'utilisateur doit être authentifié et avoir
 *
 * la permission "datasource:canCreate".
 *
 * ROUTE POST /sources
 *
 */
router.post(
  "/",
  requireAuth,
  requirePermission("datasource:canCreate"),
  upload.single("file"),
  dataSourceController.create
);

/**
 * Endpoint pour récupérer une source par ID.
 * L'utilisateur doit être authentifié et avoir
 *
 * la permission "datasource:canView".
 *
 * @param {id} req - La requête HTTP contenant l'ID de la source.
 *
 * ROUTE GET sources/:id
 *
 */
router.get(
  "/:id",
  requireAuth,
  requirePermission("datasource:canView"),
  dataSourceController.getById
);

/**
 * Endpoint pour mettre à jour une source.
 * L'utilisateur doit être authentifié et avoir
 *
 * la permission "datasource:canUpdate".
 *
 * @param {id} req - La requête HTTP contenant l'ID de la source à mettre à jour.
 *
 * ROUTE PUT sources/:id
 */
router.put(
  "/:id",
  requireAuth,
  requirePermission("datasource:canUpdate"),
  dataSourceController.update
);

/**
 * Endpoint pour supprimer une source.
 * L'utilisateur doit être authentifié et avoir
 *
 * la permission "datasource:canDelete".
 *
 * @param {id} req - La requête HTTP contenant l'ID de la source à supprimer.
 *
 * ROUTE DELETE sources/:id
 *
 */
router.delete(
  "/:id",
  requireAuth,
  requirePermission("datasource:canDelete"),
  dataSourceController.remove
);

/**
 * Endpoint pour détecter dynamiquement les colonnes d'une source.
 * L'utilisateur doit être authentifié et avoir
 *
 * la permission "datasource:canView".
 *
 * Ce point d'entrée accepte un fichier via multipart/form-data.
 * Le fichier doit être envoyé avec le champ "file".
 *
 * @route POST /sources/detect-columns
 *
 */
router.post(
  "/detect-columns",
  requireAuth,
  requirePermission("datasource:canView"),
  upload.single("file"),
  dataSourceController.detectColumns
);

/**
 * Endpoint pour récupérer un fichier JSON de test.
 */
router.get("/demo/ventes", dataSourceController.demoVentes);

/**
 * Récupère les données d'une source avec filtrage temporel.
 * L'utilisateur doit être authentifié et avoir
 * la permission "datasource:canView".
 * Ce point d'entrée accepte un paramètre `shareId` dans la requête.
 * Si `shareId` est présent, l'authentification n'est pas requise
 * et les données sont accessibles publiquement.
 *
 * @param {id} req - La requête HTTP contenant l'ID de la source
 *
 * ROUTE GET /sources/:id/data
 *
 */
router.get(
  "/:id/data",
  async (req, res, next) => {
    if (req.query.shareId) {
      return dataSourceController.fetchData(req, res, next);
    }
    next();
  },
  requireAuth,
  requirePermission("datasource:canView"),
  dataSourceController.fetchData
);

export default router;
