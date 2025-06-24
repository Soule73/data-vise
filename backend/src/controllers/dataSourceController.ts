import dataSourceService from "@/services/dataSourceService";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { handleServiceResult } from "@/utils/api";

const dataSourceController = {
  async list(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.list();
    return handleServiceResult(res, result);
  },
  async create(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const file = (req as any).file as Express.Multer.File | undefined;
    let filePath = undefined;
    if (file) {
      filePath = `uploads/${file.filename}`;
    }
    const result = await dataSourceService.create({
      ...req.body,
      filePath,
      // Si un fichier est uploadé, on ignore endpoint
      endpoint: file ? undefined : req.body.endpoint,
      ownerId: userId,
    });
    return handleServiceResult(res, result, 201);
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.getById(req.params.id);
    return handleServiceResult(res, result);
  },
  async update(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.update(req.params.id, req.body);
    return handleServiceResult(res, result);
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.remove(req.params.id);
    return handleServiceResult(res, result);
  },
  async detectColumns(req: Request, res: Response, next: NextFunction) {
    const {
      type,
      endpoint,
      filePath,
      sourceId,
      httpMethod,
      authType,
      authConfig,
    } = req.body;
    const file = (req as any).file as Express.Multer.File | undefined;
    let tempFilePath = filePath;
    if (file) {
      tempFilePath = file.path;
    }
    const result = await dataSourceService.detectColumns({
      sourceId,
      type,
      endpoint,
      filePath: tempFilePath,
      httpMethod,
      authType,
      authConfig,
    });
    // Nettoyage du fichier temporaire uploadé
    if (file) {
      fs.unlink(file.path, () => {});
    }
    return handleServiceResult(res, result);
  },
  async demoVentes(req: Request, res: Response) {
    // Pas besoin de service ici, simple envoi de fichier
    res.sendFile(
      require("path").resolve(__dirname, "../data/ventes-exemple.json")
    );
  },
  async fetchData(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { from, to, page, pageSize, fields } = req.query;
    const result = await dataSourceService.fetchData(id, {
      from: from as string | undefined,
      to: to as string | undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      fields: fields ? String(fields) : undefined,
    });
    return handleServiceResult(res, result);
  },
};

export default dataSourceController;
