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

      // Fetch all currently OPEN proctor exam rooms
      const openRooms = await prisma.examRoom.findMany({
        where: { status: 'OPEN' },
        select: { examId: true, roomCode: true, title: true },
      });
      const openRoomExamIds = new Set(openRooms.map((r) => r.examId));
      const openRoomMap = new Map(openRooms.map((r) => [r.examId, r.roomCode]));

      // ADMINISTRATOR sees all exams as unlocked
      if (role === Role.ADMINISTRATOR) {
        const mappedExams = exams.map((exam) => ({
          ...exam,
          isUnlocked: true,
          activeRoomCode: openRoomMap.get(exam.id) || null,
        }));
        return res.json(mappedExams);
      }

      let accessMap = new Map<string, boolean>();
      if (userId) {
        const accesses = await prisma.studentExamAccess.findMany({
          where: { userId },
        });
        accessMap = new Map(accesses.map((a) => [a.examId, a.isUnlocked]));
      }

      const mappedExams = exams.map((exam) => {
        const isGloballyUnlocked = (exam as any).isGloballyUnlocked ?? false;
        const isUserUnlocked = accessMap.get(exam.id) ?? false;
        const hasOpenRoom = openRoomExamIds.has(exam.id);

        return {
          ...exam,
          isUnlocked: isGloballyUnlocked || isUserUnlocked || hasOpenRoom,
          activeRoomCode: openRoomMap.get(exam.id) || null,
          unlockedByRoom: hasOpenRoom,
        };
      });

      // CANDIDATES only see launched / allowed exams for their room or session
      const candidateExams = mappedExams.filter((exam) => exam.isUnlocked);
      return res.json(candidateExams);
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

      // Automatically create a default section for the new exam track
      await prisma.examSection.create({
        data: {
          examId: exam.id,
          title: 'Section 1: Main Assessment Section',
          orderIndex: 1,
        },
      });

      return res.status(201).json(exam);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await this.uow.exams.update(id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.examRoom.deleteMany({ where: { examId: id } });
      await prisma.studentExamAccess.deleteMany({ where: { examId: id } });
      const sections = await prisma.examSection.findMany({ where: { examId: id } });
      for (const sec of sections) {
        await prisma.sectionQuestion.deleteMany({ where: { sectionId: sec.id } });
      }
      await prisma.examSection.deleteMany({ where: { examId: id } });
      await this.uow.exams.delete(id);
      return res.json({ message: 'Exam track deleted successfully' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
