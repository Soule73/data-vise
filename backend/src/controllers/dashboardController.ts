import { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import dashboardService from '@/services/dashboardService';

const dashboardController = {
  async getMyDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    const result = await dashboardService.getMyDashboard(req.user!.id);
    res.json(result.data);
  },
  async createDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    const result = await dashboardService.createDashboard(req.user!.id, { ...req.body, userId: req.user!.id });
    res.status(201).json(result.data);
  },
  async getDashboardById(req: Request, res: Response, next: NextFunction) {
    const result = await dashboardService.getDashboardById(req.params.id);
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
  async updateDashboard(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const result = await dashboardService.updateDashboard(req.params.id, { ...req.body, userId });
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.json(result.data);
  },
  async deleteDashboard(req: Request, res: Response, next: NextFunction) {
    const result = await dashboardService.deleteDashboard(req.params.id);
    if ('error' in result) return res.status(result.status ?? 500).json(result.error);
    res.status(204).send();
  },
  async debugWidgets(req: Request, res: Response) {
    const result = await dashboardService.debugWidgets();
    res.json(result);
  },
  async listUserDashboards(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dashboards = await dashboardService.listUserDashboards(req.user!.id);
      res.json(dashboards);
    } catch (e) {
      next(e);
    }
  },
};

export default dashboardController;
