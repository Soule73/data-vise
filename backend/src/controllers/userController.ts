import { Request, Response } from 'express';
import userService from '../services/userService';

export default {
  async register(req: Request, res: Response) {
    const result = await userService.register(req.body);
    if (result.error) return res.status(result.status).json(result.error);
    res.status(201).json(result.data);
  },
  async login(req: Request, res: Response) {
    const result = await userService.login(req.body);
    if (result.error) return res.status(result.status).json(result.error);
    res.json(result.data);
  },
  async createUser(req: Request, res: Response) {
    const result = await userService.createUser(req.body);
    if (result.error) return res.status(result.status).json(result.error);
    res.status(201).json(result.data);
  },
  async updateUser(req: Request, res: Response) {
    const result = await userService.updateUser(req.params.id, req.body);
    if (result.error) return res.status(result.status).json(result.error);
    res.json(result.data);
  },
  async deleteUser(req: Request, res: Response) {
    const result = await userService.deleteUser(req.params.id);
    if (result.error) return res.status(result.status).json(result.error);
    res.json(result.data);
  },
  async listRoles(req: Request, res: Response) {
    const result = await userService.listRolesWithCanDelete();
    res.json(result);
  },
  async createRole(req: Request, res: Response) {
    const result = await userService.createRole(req.body);
    if (result.error) return res.status(result.status).json(result.error);
    res.status(201).json(result.data);
  },
  async updateRole(req: Request, res: Response) {
    const result = await userService.updateRole(req.params.id, req.body);
    if (result.error) return res.status(result.status).json(result.error);
    res.json(result.data);
  },
  async deleteRole(req: Request, res: Response) {
    const result = await userService.deleteRole(req.params.id);
    if (result.error) return res.status(result.status).json(result.error);
    res.json(result.data);
  },
  async listPermissions(req: Request, res: Response) {
    const result = await userService.listPermissions();
    res.json(result);
  },
  async listUsers(req: Request, res: Response) {
    const users = await userService.listUsers();
    res.json(users);
  },
};
