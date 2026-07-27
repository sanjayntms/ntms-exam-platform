import { Request, Response } from 'express';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { prisma } from '../infrastructure/database.js';

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

  // Get all exam lock/unlock statuses for a specific user
  async getExamAccess(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const exams = await prisma.exam.findMany({ select: { id: true, title: true, code: true } });
      const accesses = await prisma.studentExamAccess.findMany({ where: { userId } });
      const accessMap = new Map(accesses.map((a) => [a.examId, a.isUnlocked]));

      const result = exams.map((exam) => ({
        examId: exam.id,
        code: exam.code,
        title: exam.title,
        isUnlocked: accessMap.get(exam.id) ?? false,
      }));

      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Toggle lock/unlock for a single exam for a specific user
  async toggleExamAccess(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { examId, isUnlocked } = req.body;
      const adminEmail = req.user?.email || 'admin';

      const record = await prisma.studentExamAccess.upsert({
        where: { userId_examId: { userId, examId } },
        update: { isUnlocked, unlockedBy: adminEmail, unlockedAt: new Date() },
        create: { userId, examId, isUnlocked, unlockedBy: adminEmail },
      });

      return res.json(record);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Bulk unlock all exams for a specific user
  async unlockAllExams(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const adminEmail = req.user?.email || 'admin';
      const exams = await prisma.exam.findMany({ select: { id: true } });

      for (const exam of exams) {
        await prisma.studentExamAccess.upsert({
          where: { userId_examId: { userId, examId: exam.id } },
          update: { isUnlocked: true, unlockedBy: adminEmail, unlockedAt: new Date() },
          create: { userId, examId: exam.id, isUnlocked: true, unlockedBy: adminEmail },
        });
      }

      return res.json({ message: 'All exams successfully UNLOCKED for student' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Bulk lock all exams for a specific user
  async lockAllExams(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      await prisma.studentExamAccess.updateMany({
        where: { userId },
        data: { isUnlocked: false },
      });

      return res.json({ message: 'All exams successfully LOCKED for student' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Fetch full exam history for a specific user
  async getUserAttempts(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const attempts = await prisma.examAttempt.findMany({
        where: { userId },
        include: { exam: { select: { code: true, title: true, vendor: true } } },
        orderBy: { startedAt: 'desc' },
      });

      return res.json(attempts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
