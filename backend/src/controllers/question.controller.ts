import { Request, Response } from 'express';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';

export class QuestionController {
  constructor(private uow: UnitOfWork) {}

  async list(req: Request, res: Response) {
    try {
      const { type, difficulty, search } = req.query;
      const questions = await this.uow.questions.findAll({
        type: type as any,
        difficulty: difficulty as any,
        search: search as any,
      });
      return res.json(questions);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const question = await this.uow.questions.findById(req.params.id);
      if (!question) return res.status(404).json({ error: 'Question not found' });
      return res.json(question);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const question = await this.uow.questions.create(req.body);
      return res.status(201).json(question);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
