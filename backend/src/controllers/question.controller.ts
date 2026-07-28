import { Request, Response } from 'express';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { prisma } from '../infrastructure/database.js';

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
      const { examId, ...questionData } = req.body;
      const question = await this.uow.questions.create(questionData);

      // If an examId is specified, link this question to the exam's first section
      if (examId && question.id) {
        let section = await prisma.examSection.findFirst({ where: { examId }, orderBy: { orderIndex: 'asc' } });
        if (!section) {
          section = await prisma.examSection.create({
            data: { examId, title: 'Section 1: General Items', orderIndex: 1 },
          });
        }

        const count = await prisma.sectionQuestion.count({ where: { sectionId: section.id } });
        await prisma.sectionQuestion.create({
          data: {
            sectionId: section.id,
            questionId: question.id,
            orderIndex: count + 1,
          },
        });
      }

      return res.status(201).json(question);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { examId, ...updateData } = req.body;
      const updated = await this.uow.questions.update(id, updateData);

      // Optionally rebind to section if examId is provided
      if (examId) {
        let section = await prisma.examSection.findFirst({ where: { examId }, orderBy: { orderIndex: 'asc' } });
        if (!section) {
          section = await prisma.examSection.create({
            data: { examId, title: 'Section 1: General Items', orderIndex: 1 },
          });
        }
        const existingSQ = await prisma.sectionQuestion.findFirst({ where: { questionId: id } });
        if (!existingSQ) {
          const count = await prisma.sectionQuestion.count({ where: { sectionId: section.id } });
          await prisma.sectionQuestion.create({
            data: { sectionId: section.id, questionId: id, orderIndex: count + 1 },
          });
        }
      }

      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.sectionQuestion.deleteMany({ where: { questionId: id } });
      await this.uow.questions.delete(id);
      return res.json({ message: 'Question deleted successfully' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
