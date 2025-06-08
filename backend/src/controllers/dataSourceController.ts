import dataSourceService from '@/services/dataSourceService';
import { Request, Response, NextFunction } from 'express';

const dataSourceController = {
  async list(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.list();
    res.json(result);
  },
  async create(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const result = await dataSourceService.create({ ...req.body, ownerId: userId });
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.status(201).json(result.data);
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.getById(req.params.id);
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
  async update(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.update(req.params.id, req.body);
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.remove(req.params.id);
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
  async detectColumns(req: Request, res: Response, next: NextFunction) {
    const result = await dataSourceService.detectColumns(req.body.endpoint);
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
  async demoVentes(req: Request, res: Response) {
    // Pas besoin de service ici, simple envoi de fichier
    res.sendFile(require('path').resolve(__dirname, '../data/ventes-exemple.json'));
  },
};

export default dataSourceController;
