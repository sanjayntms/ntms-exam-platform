import { Request, Response } from 'express';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';

export class UserController {
  constructor(private uow: UnitOfWork) {}

  async list(req: Request, res: Response) {
    try {
      const users = await this.uow.users.findAll();
      return res.json(users);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.uow.users.create(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async toggleActive(req: Request, res: Response) {
    try {
      const user = await this.uow.users.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const updated = await this.uow.users.update(req.params.id, { isActive: !user.isActive });
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
