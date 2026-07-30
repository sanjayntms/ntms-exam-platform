import { Request, Response } from 'express';
import { ExamEngineService } from '../services/examEngine.service.js';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { prisma } from '../infrastructure/database.js';

export class AttemptController {
  constructor(private engineService: ExamEngineService, private uow: UnitOfWork) {}

  async start(req: Request, res: Response) {
    try {
      const userId = req.user?.id || 'candidate';
      const userRole = req.user?.role;
      const { examId, roomId, candidateName, questionCount } = req.body;
      const session = await this.engineService.startExamAttempt(
        userId,
        examId,
        userRole,
        roomId,
        candidateName,
        questionCount ? parseInt(questionCount, 10) : undefined
      );
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

      // Check if attempt has custom sampled questions
      let sampledExam: any = null;
      let selectedQuestionIds: string[] = [];
      try {
        const parsedAnswers = JSON.parse(attempt.answers || '{}');
        if (parsedAnswers._meta?.selectedQuestionIds) {
          selectedQuestionIds = parsedAnswers._meta.selectedQuestionIds;
        }
      } catch {}

      if (selectedQuestionIds.length > 0) {
        const fullExam = await this.uow.exams.findById(attempt.examId);
        if (fullExam) {
          const filteredSections = fullExam.sections
            .map((sec: any) => ({
              ...sec,
              questions: sec.questions.filter((sq: any) => selectedQuestionIds.includes(sq.question.id)),
            }))
            .filter((sec: any) => sec.questions.length > 0);

          sampledExam = {
            ...fullExam,
            sections: filteredSections,
          };
        }
      }

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
        exam: sampledExam || undefined,
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

  // Admin Search & Filter Candidate Exam Records
  async adminSearchAttempts(req: Request, res: Response) {
    try {
      const { search, examId, startDate, endDate, resultState, minScore, maxScore } = req.query;

      const where: any = {};

      // Exam Track filter
      if (examId && examId !== 'ALL') {
        where.examId = String(examId);
      }

      // Result State filter
      if (resultState === 'PASSED') {
        where.passed = true;
      } else if (resultState === 'FAILED') {
        where.passed = false;
      }

      // Date Range filter (Custom Start and End Date)
      if (startDate || endDate) {
        where.startedAt = {};
        if (startDate && startDate !== '') {
          where.startedAt.gte = new Date(String(startDate));
        }
        if (endDate && endDate !== '') {
          const end = new Date(String(endDate));
          end.setHours(23, 59, 59, 999);
          where.startedAt.lte = end;
        }
      }

      // Score / Marks filter
      if ((minScore !== undefined && minScore !== '') || (maxScore !== undefined && maxScore !== '')) {
        where.scorePercentage = {};
        if (minScore !== undefined && minScore !== '') {
          where.scorePercentage.gte = parseFloat(String(minScore));
        }
        if (maxScore !== undefined && maxScore !== '') {
          where.scorePercentage.lte = parseFloat(String(maxScore));
        }
      }

      // Name / Username / Verification ID text search
      if (search && String(search).trim()) {
        const q = String(search).trim();
        where.OR = [
          { candidateName: { contains: q } },
          { user: { name: { contains: q } } },
          { user: { email: { contains: q } } },
          { id: { contains: q } },
          { exam: { code: { contains: q } } },
          { exam: { title: { contains: q } } },
        ];
      }

      const attempts = await prisma.examAttempt.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
          exam: { select: { id: true, code: true, title: true, vendor: true, passingScore: true } },
          room: { select: { id: true, roomCode: true, title: true } },
        },
        orderBy: { startedAt: 'desc' },
      });

      return res.json(attempts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
