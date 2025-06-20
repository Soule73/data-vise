import widgetService from "@/services/widgetService";
import { Request, Response, NextFunction } from "express";
import { handleServiceResult } from "@/utils/api";
import { AuthRequest } from "@/types/authType";

const widgetController = {
  async list(req: Request, res: Response, next: NextFunction) {

    const userId = (req as AuthRequest).user?.id;

    const result = await widgetService.list(userId);
    return handleServiceResult(res, result);
  },
  async create(req: Request, res: Response, next: NextFunction) {
    const userId = (req as AuthRequest).user?.id;
    const result = await widgetService.create({ ...req.body, userId });
    return handleServiceResult(res, result, 201);
  },
  async update(req: Request, res: Response, next: NextFunction) {
    const userId = (req as AuthRequest).user?.id;
    const result = await widgetService.update(req.params.id, {
      ...req.body,
      userId,
    });
    return handleServiceResult(res, result);
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    const result = await widgetService.remove(req.params.id);
    return handleServiceResult(res, result);
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    const result = await widgetService.getById(req.params.id);
    return handleServiceResult(res, result);
  },
};

export default widgetController;
