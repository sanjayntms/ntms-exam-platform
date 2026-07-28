import { Request, Response } from 'express';
import { ExamEngineService } from '../services/examEngine.service.js';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';

export class AttemptController {
  constructor(private engineService: ExamEngineService, private uow: UnitOfWork) {}

  async start(req: Request, res: Response) {
    try {
      const userId = req.user?.id || 'candidate';
      const userRole = req.user?.role;
      const { examId, roomId } = req.body;
      const session = await this.engineService.startExamAttempt(userId, examId, userRole, roomId);
      return res.status(201).json(session);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async submit(req: Request, res: Response) {
    try {
      const { attemptId, answers, isFinalSubmit } = req.body;
      const result = await this.engineService.submitAnswers(attemptId, answers, isFinalSubmit);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const attempt = await this.uow.attempts.findById(req.params.id);
      if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

      // Determine allowReview status for candidate
      let allowReview = true;
      const roomId = (attempt as any).roomId;
      if (roomId) {
        const room = await prisma.examRoom.findUnique({ where: { id: roomId } });
        if (room) {
          allowReview = room.allowReview;
        }
      } else {
        const activeRoom = await prisma.examRoom.findFirst({
          where: { examId: attempt.examId },
          orderBy: { createdAt: 'desc' },
        });
        if (activeRoom) {
          allowReview = activeRoom.allowReview;
        }
      }

      return res.json({
        ...attempt,
        allowReview,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async myAttempts(req: Request, res: Response) {
    try {
      const userId = req.user?.id || 'candidate';
      const attempts = await this.uow.attempts.findByUser(userId);
      return res.json(attempts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
