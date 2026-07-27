import { Request, Response } from 'express';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { prisma } from '../infrastructure/database.js';
import { Role } from '../domain/types.js';

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

      const userId = req.user?.id;
      const role = req.user?.role;

      // ADMINISTRATOR sees all exams as unlocked
      if (role === Role.ADMINISTRATOR) {
        const mappedExams = exams.map((exam) => ({
          ...exam,
          isUnlocked: true,
        }));
        return res.json(mappedExams);
      }

      // Check per-student unlock and global unlock
      if (userId) {
        const accesses = await prisma.studentExamAccess.findMany({
          where: { userId },
        });
        const accessMap = new Map(accesses.map((a) => [a.examId, a.isUnlocked]));

        const mappedExams = exams.map((exam) => {
          const isGloballyUnlocked = (exam as any).isGloballyUnlocked ?? false;
          const isUserUnlocked = accessMap.get(exam.id) ?? false;

          return {
            ...exam,
            isUnlocked: isGloballyUnlocked || isUserUnlocked,
          };
        });

        return res.json(mappedExams);
      }

      // Default fallback for unauthenticated: check global unlock
      const mappedExams = exams.map((exam) => ({
        ...exam,
        isUnlocked: (exam as any).isGloballyUnlocked ?? false,
      }));

      return res.json(mappedExams);
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
