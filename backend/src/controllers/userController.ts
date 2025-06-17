import { Request, Response } from "express";
import userService from "../services/userService";
import { handleServiceResult } from "@/utils/api";

export default {
  async register(req: Request, res: Response) {
    const result = await userService.register(req.body);
    return handleServiceResult(res, result, 201);
  },
  async login(req: Request, res: Response) {
    const result = await userService.login(req.body);
    return handleServiceResult(res, result);
  },
  async createUser(req: Request, res: Response) {
    const result = await userService.createUser(req.body);
    return handleServiceResult(res, result, 201);
  },
  async updateUser(req: Request, res: Response) {
    const result = await userService.updateUser(req.params.id, req.body);
    return handleServiceResult(res, result);
  },
  async deleteUser(req: Request, res: Response) {
    const result = await userService.deleteUser(req.params.id);
    return handleServiceResult(res, result);
  },
  async listRoles(req: Request, res: Response) {
    const result = await userService.listRolesWithCanDelete();
    res.json({ data: result });
  },
  async createRole(req: Request, res: Response) {
    const result = await userService.createRole(req.body);
    return handleServiceResult(res, result, 201);
  },
  async updateRole(req: Request, res: Response) {
    const result = await userService.updateRole(req.params.id, req.body);
    return handleServiceResult(res, result);
  },
  async deleteRole(req: Request, res: Response) {
    const result = await userService.deleteRole(req.params.id);
    return handleServiceResult(res, result);
  },
  async listPermissions(req: Request, res: Response) {
    const result = await userService.listPermissions();
    res.json({ data: result });
  },
  async listUsers(req: Request, res: Response) {
    const users = await userService.listUsers();
    res.json({ data: users });
  },
};
