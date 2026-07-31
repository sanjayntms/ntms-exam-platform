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

      // Check if attempt has custom sampled questions & option orders
      let sampledExam: any = null;
      let selectedQuestionIds: string[] = [];
      let optionOrders: Record<string, string[]> = {};
      try {
        const parsedAnswers = JSON.parse(attempt.answers || '{}');
        if (parsedAnswers._meta?.selectedQuestionIds) {
          selectedQuestionIds = parsedAnswers._meta.selectedQuestionIds;
        }
        if (parsedAnswers._meta?.optionOrders) {
          optionOrders = parsedAnswers._meta.optionOrders;
        }
      } catch {}

      if (selectedQuestionIds.length > 0) {
        const fullExam = await this.uow.exams.findById(attempt.examId);
        if (fullExam) {
          const filteredSections = fullExam.sections
            .map((sec: any) => {
              const matchedQs = sec.questions.filter((sq: any) => selectedQuestionIds.includes(sq.question.id));
              const sortedQs = matchedQs
                .sort((a: any, b: any) => {
                  const idxA = selectedQuestionIds.indexOf(a.question.id);
                  const idxB = selectedQuestionIds.indexOf(b.question.id);
                  return (idxA !== -1 ? idxA : 9999) - (idxB !== -1 ? idxB : 9999);
                })
                .map((sq: any) => {
                  const q = sq.question;
                  if (!q || !q.content) return sq;
                  try {
                    const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
                    const savedOrder = optionOrders[q.id];
                    if (Array.isArray(content.options) && Array.isArray(savedOrder) && savedOrder.length > 0) {
                      content.options.sort((a: any, b: any) => {
                        const idxA = savedOrder.indexOf(a.id);
                        const idxB = savedOrder.indexOf(b.id);
                        return (idxA !== -1 ? idxA : 9999) - (idxB !== -1 ? idxB : 9999);
                      });
                    }
                    return {
                      ...sq,
                      question: {
                        ...q,
                        content: JSON.stringify(content),
                      },
                    };
                  } catch {
                    return sq;
                  }
                });

              return {
                ...sec,
                questions: sortedQs,
              };
            })
            .filter((sec: any) => sec.questions.length > 0);

          sampledExam = {
            ...fullExam,
            sections: filteredSections,
          };
        }
      }

      // Determine allowReview status for candidate and validate room open status for active attempt
      let allowReview = true;
      const roomId = (attempt as any).roomId;
      let targetRoom: any = null;

      if (roomId) {
        targetRoom = await prisma.examRoom.findUnique({ where: { id: roomId } });
        if (targetRoom) {
          allowReview = targetRoom.allowReview;
        }
      } else {
        targetRoom = await prisma.examRoom.findFirst({
          where: { examId: attempt.examId },
          orderBy: { createdAt: 'desc' },
        });
        if (targetRoom) {
          allowReview = targetRoom.allowReview;
        }
      }

      // If attempt is in-progress and the exam room is CLOSED (and exam not globally unlocked), block access
      const isAttemptInProgress = !attempt.completedAt && attempt.status !== 'EVALUATED';
      const isUnlocked = (attempt as any).exam?.isGloballyUnlocked;
      if (isAttemptInProgress && !isUnlocked) {
        if (targetRoom && targetRoom.status === 'CLOSED') {
          // Auto-expire attempt in DB
          await prisma.examAttempt.update({
            where: { id: attempt.id },
            data: { status: 'CLOSED' },
          });
          return res.status(403).json({ error: '🔒 Exam Room Closed: The Administrator has closed this exam room. In-progress exam attempt cleared.' });
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
      
      // Auto-expire in-progress attempts whose rooms are CLOSED
      const userAttempts = await prisma.examAttempt.findMany({
        where: { userId },
        include: { exam: true, room: true },
      });

      for (const att of userAttempts) {
        if (!att.completedAt && att.status !== 'EVALUATED' && att.status !== 'CLOSED' && att.status !== 'EXPIRED') {
          const roomIsClosed = att.room ? att.room.status === 'CLOSED' : false;
          const isGloballyUnlocked = att.exam?.isGloballyUnlocked || false;
          if (roomIsClosed && !isGloballyUnlocked) {
            await prisma.examAttempt.update({
              where: { id: att.id },
              data: { status: 'CLOSED' },
            });
          }
        }
      }

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

      // CANDIDATES can strictly ONLY view their own attempt results
      if (req.user?.role !== 'ADMINISTRATOR') {
        where.userId = req.user?.id;
      }

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

      // Text search: Candidate Name, User Email, Verification ID, Attempt ID, Room Code, Exam Code
      if (search && String(search).trim()) {
        const q = String(search).trim();
        const cleanQ = q.replace(/^(NTMS-|PROCTOR-)/i, '').trim();

        where.OR = [
          { candidateName: { contains: q, mode: 'insensitive' } },
          { user: { name: { contains: q, mode: 'insensitive' } } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
          { id: { contains: q, mode: 'insensitive' } },
          { id: { contains: cleanQ, mode: 'insensitive' } },
          { exam: { code: { contains: q, mode: 'insensitive' } } },
          { exam: { title: { contains: q, mode: 'insensitive' } } },
          { room: { roomCode: { contains: q, mode: 'insensitive' } } },
          { room: { title: { contains: q, mode: 'insensitive' } } },
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
