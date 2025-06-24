import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// Route sécurisée pour servir les fichiers du dossier uploads
router.get(
  "/:filename",
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    const { filename } = req.params;
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier non trouvé." });
    }

    // Détecte le type MIME pour les CSV/texte
    if (filePath.endsWith(".csv")) {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      // Ajoute le BOM UTF-8 pour forcer la détection correcte dans Excel/Windows
      const content = fs.readFileSync(filePath);
      const bom = Buffer.from([0xef, 0xbb, 0xbf]);
      res.send(Buffer.concat([bom, content]));
      return;
    } else if (filePath.endsWith(".txt")) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
    }

    res.sendFile(filePath, {
      headers: { "Content-Disposition": `attachment; filename="${filename}"` },
    });
  }
);

export default router;
