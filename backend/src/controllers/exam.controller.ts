import { Request, Response } from 'express';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';

export class ExamController {
  constructor(private uow: UnitOfWork) {}

  async list(req: Request, res: Response) {
    try {
      const { vendor, status, search } = req.query;
      const exams = await this.uow.exams.findAll({
        vendor: vendor as any,
        status: status as any,
        search: search as any,
      });
      return res.json(exams);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const exam = await this.uow.exams.findById(req.params.id);
      if (!exam) return res.status(404).json({ error: 'Exam not found' });
      return res.json(exam);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const creatorId = req.user?.id || 'admin';
      const exam = await this.uow.exams.create({
        ...req.body,
        creatorId,
      });
      return res.status(201).json(exam);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
