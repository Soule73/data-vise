import dataSourceService from "@/services/dataSourceService";
import { Request, Response, NextFunction } from "express";
// Typage correct pour req.file
import type { Multer } from "multer";

const dataSourceController = {
  async list(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.list();
    if ("error" in result)
      return res
        .status(500)
        .json({ error: (result as any).error, status: 500 });
    res.json({ data: result.data });
  },
  async create(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const file = (req as any).file as Express.Multer.File | undefined;
    let filePath = undefined;
    if (file) {
      console.log("[BACKEND][CREATE] Fichier reçu:", file);
      // Stockage du chemin relatif pour la BDD
      filePath = `uploads/${file.filename}`;
    } else {
      console.log("[BACKEND][CREATE] Pas de fichier uploadé");
    }
    const result = await dataSourceService.create({
      ...req.body,
      filePath,
      // Si un fichier est uploadé, on ignore endpoint
      endpoint: file ? undefined : req.body.endpoint,
      ownerId: userId,
    });
    if ("error" in result)
      return res
        .status(result.status ?? 500)
        .json({ error: result.error, status: result.status ?? 500 });
    res.status(201).json({ data: result.data });
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.getById(req.params.id);
    if ("error" in result)
      return res
        .status(result.status ?? 500)
        .json({ error: result.error, status: result.status ?? 500 });
    res.json({ data: result.data });
  },
  async update(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.update(req.params.id, req.body);
    if ("error" in result)
      return res
        .status(result.status ?? 500)
        .json({ error: result.error, status: result.status ?? 500 });
    res.json({ data: result.data });
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.remove(req.params.id);
    if ("error" in result)
      return res
        .status(result.status ?? 500)
        .json({ error: result.error, status: result.status ?? 500 });
    res.json({ data: result.data });
  },
  async detectColumns(req: Request, res: Response, next: NextFunction) {
    const { type, endpoint, filePath } = req.body;
    const file = (req as any).file as Express.Multer.File | undefined;
    let tempFilePath = filePath;
    if (file) {
      console.log("[BACKEND][DETECT] Fichier temporaire reçu:", file);
      tempFilePath = file.path;
    }
    const result = await dataSourceService.detectColumns({
      type,
      endpoint,
      filePath: tempFilePath,
    });
    // Nettoyage du fichier temporaire uploadé
    if (file) {
      const fs = require("fs");
      fs.unlink(file.path, () => {
        console.log(
          "[BACKEND][DETECT] Fichier temporaire supprimé:",
          file.path
        );
      });
    }
    if ("error" in result)
      return res
        .status(result.status ?? 500)
        .json({ error: result.error, status: result.status ?? 500 });
    res.json({ data: result.data });
  },
  async demoVentes(req: Request, res: Response) {
    // Pas besoin de service ici, simple envoi de fichier
    res.sendFile(
      require("path").resolve(__dirname, "../data/ventes-exemple.json")
    );
  },
  async fetchData(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { from, to } = req.query;
    const result = await dataSourceService.fetchData(id, {
      from: from as string | undefined,
      to: to as string | undefined,
    });
    if ("error" in result)
      return res
        .status(result.status ?? 500)
        .json({ error: result.error, status: result.status ?? 500 });
    res.json({ data: result.data });
  },
};

export default dataSourceController;
