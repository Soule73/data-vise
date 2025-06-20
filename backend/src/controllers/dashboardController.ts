import { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import dashboardService from "@/services/dashboardService";
import { handleServiceResult } from "@/utils/api";

const dashboardController = {
  async createDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    const timeRange = req.body.timeRange || {};
    const userId = req.user!.id;
    const result = await dashboardService.createDashboard(userId, {
      ...req.body,
      userId,
      ownerId: userId,
      visibility: req.body.visibility ?? "private",
      autoRefreshInterval: req.body.autoRefreshInterval ?? 60000,
      autoRefreshIntervalValue: req.body.autoRefreshIntervalValue,
      autoRefreshIntervalUnit: req.body.autoRefreshIntervalUnit,
      timeRange,
    });
    return handleServiceResult(res, result, 201);
  },
  async getDashboardById(req: Request, res: Response, next: NextFunction) {
    const result = await dashboardService.getDashboardById(req.params.id);
    return handleServiceResult(res, result);
  },
  async updateDashboard(req: Request, res: Response, next: NextFunction) {
    const timeRange = req.body.timeRange || {};
    const userId = (req as AuthRequest).user?.id;
    const result = await dashboardService.updateDashboard(req.params.id, {
      ...req.body,
      userId,
      visibility: req.body.visibility ?? "private",
      autoRefreshInterval: req.body.autoRefreshInterval ?? 60000,
      autoRefreshIntervalValue: req.body.autoRefreshIntervalValue,
      autoRefreshIntervalUnit: req.body.autoRefreshIntervalUnit,
      timeRange,
    });
    return handleServiceResult(res, result);
  },
  async deleteDashboard(req: Request, res: Response, next: NextFunction) {
    const result = await dashboardService.deleteDashboard(req.params.id);
    return handleServiceResult(res, result, 204);
  },
  async listUserDashboards(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await dashboardService.listUserDashboards(req.user!.id);
      return handleServiceResult(res, result);
    } catch (e) {
      next(e);
    }
  },
  async enableShare(req: Request, res: Response, next: NextFunction) {
    const result = await dashboardService.enableShare(req.params.id);
    return handleServiceResult(res, result);
  },
  async disableShare(req: Request, res: Response, next: NextFunction) {
    const result = await dashboardService.disableShare(req.params.id);
    return handleServiceResult(res, result);
  },
  async getSharedDashboard(req: Request, res: Response, next: NextFunction) {
    const result = await dashboardService.getSharedDashboard(req.params.shareId);
    return handleServiceResult(res, result);
  },
  async getSharedDashboardSources(req: Request, res: Response, next: NextFunction) {
    try {
      const { shareId } = req.params;
      const result = await dashboardService.getSharedDashboardSources(shareId);
      return handleServiceResult(res, result);
    } catch (e) {
      next(e);
    }
  },
};

export default dashboardController;
