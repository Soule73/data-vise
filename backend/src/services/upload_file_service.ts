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
 * Service de gestion des fichiers uploadés.
 * Utilise multer pour gérer les fichiers uploadés via l'API.
 * Limite la taille des fichiers à 10 Mo et n'autorise que les fichiers CSV et JSON.
 *
 */
const uploadFileService
    = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadsDir);
            },
            filename: function (req, file, cb) {
                const ext = path.extname(file.originalname) || ".csv";
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
                cb(null, uniqueName);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille de fichier à 10 Mo
        fileFilter: function (req, file, cb) {
            const allowedTypes = [".csv", ".json"];
            const ext = path.extname(file.originalname);
            if (!allowedTypes.includes(ext)) {
                return new Error("Type de fichier non autorisé");
            }
            cb(null, true);
        },
    }).single("file");



export default uploadFileService;


