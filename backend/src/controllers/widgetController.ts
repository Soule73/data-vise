import widgetService from '@/services/widgetService';
import { Request, Response, NextFunction } from 'express';

const widgetController = {
  async list(req: Request, res: Response, next: NextFunction) {
    const { dashboardId } = req.query;
    const result = await widgetService.list(dashboardId);
    res.json(result);
  },
  async create(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const result = await widgetService.create({ ...req.body, userId });
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.status(201).json(result.data);
  },
  async update(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const result = await widgetService.update(req.params.id, { ...req.body, userId });
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    const result = await widgetService.remove(req.params.id);
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    const result = await widgetService.getById(req.params.id);
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
};

export default widgetController;
