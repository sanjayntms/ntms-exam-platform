import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { AttemptStatus, Role } from '../domain/types.js';
import { prisma } from '../infrastructure/database.js';

export class ExamEngineService {
  constructor(private uow: UnitOfWork) {}

  async startExamAttempt(userId: string, examId: string, userRole?: string) {
    const exam = await this.uow.exams.findById(examId);
    if (!exam) throw new Error('Exam not found');

    let user = await this.uow.users.findById(userId);
    if (!user) {
      user = await this.uow.users.findByEmail('candidate@ntms.com');
      if (!user) {
        const allUsers = await this.uow.users.findAll();
        user = allUsers[0];
      }
    }
    if (!user) throw new Error('Valid candidate user not found in database');

    const effectiveRole = userRole || user.role;

    // Validate per-student lock status: ALL non-admin users default to LOCKED
    if (effectiveRole !== Role.ADMINISTRATOR) {
      const access = await prisma.studentExamAccess.findUnique({
        where: { userId_examId: { userId: user.id, examId } },
      });

      if (!access || !access.isUnlocked) {
        throw new Error('This exam is currently LOCKED for your account. Please ask Admin (sanjay@ntmsentra.onmicrosoft.com) to unlock it.');
      }
    }

    let totalQuestions = 0;
    exam.sections.forEach((section) => {
      totalQuestions += section.questions.length;
    });

    const attempt = await this.uow.attempts.create({
      userId: user.id,
      examId: exam.id,
      totalQuestions,
      answers: JSON.stringify({}),
    });

    return {
      attemptId: attempt.id,
      exam,
      startedAt: attempt.startedAt,
      timeLimitMinutes: exam.timeLimitMinutes,
    };
  }

  async submitAnswers(attemptId: string, submittedAnswers: Record<string, any>, isFinalSubmit: boolean) {
    const attempt = await this.uow.attempts.findById(attemptId);
    if (!attempt) throw new Error('Exam attempt not found');

    let currentAnswers = {};
    try {
      currentAnswers = JSON.parse(attempt.answers || '{}');
    } catch {
      currentAnswers = {};
    }

    const mergedAnswers = { ...currentAnswers, ...submittedAnswers };

    if (!isFinalSubmit) {
      return this.uow.attempts.update(attemptId, {
        answers: JSON.stringify(mergedAnswers),
      });
    }

    // Evaluate scoring for all questions in the exam
    const exam = attempt.exam;
    let earnedPoints = 0.0;
    let totalPossiblePoints = 0.0;
    let correctCount = 0;

    exam.sections.forEach((section) => {
      section.questions.forEach((sq) => {
        const q = sq.question;
        totalPossiblePoints += q.points;
        const userAnswer = (mergedAnswers as any)[q.id];

        if (userAnswer) {
          const isCorrect = this.evaluateQuestionAnswer(q, userAnswer);
          if (isCorrect) {
            earnedPoints += q.points;
            correctCount++;
          } else if (exam.negativeMarking && q.negativePoints > 0) {
            earnedPoints = Math.max(0, earnedPoints - q.negativePoints);
          }
        }
      });
    });

    const scorePercentage = totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) * 100 : 0;
    const passed = scorePercentage >= exam.passingScore;

    return this.uow.attempts.update(attemptId, {
      answers: JSON.stringify(mergedAnswers),
      status: AttemptStatus.EVALUATED,
      completedAt: new Date(),
      scorePercentage: parseFloat(scorePercentage.toFixed(2)),
      correctAnswers: correctCount,
      passed,
    });
  }

  private evaluateQuestionAnswer(question: any, userAnswer: any): boolean {
    try {
      const content = JSON.parse(question.content);

      switch (question.type) {
        case 'SINGLE_CHOICE':
        case 'CASE_STUDY':
          const correctOpt = content.options?.find((o: any) => o.isCorrect);
          return userAnswer?.selectedOptionId === correctOpt?.id;

        case 'MULTIPLE_CHOICE':
          const correctIds = content.options?.filter((o: any) => o.isCorrect).map((o: any) => o.id).sort();
          const userSelectedIds = (userAnswer?.selectedOptionIds || []).sort();
          return JSON.stringify(correctIds) === JSON.stringify(userSelectedIds);

        case 'TRUE_FALSE':
          return userAnswer?.isTrue === content.isTrueCorrect;

        case 'DROPDOWN':
          if (!content.dropdowns && !content.questions) return false;
          const list = content.dropdowns || content.questions || [];
          return list.every((d: any) => userAnswer.dropdowns?.[d.id] === d.correctAnswer);

        case 'FILL_IN_BLANK':
          if (!content.blanks || !userAnswer?.blanks) return false;
          return content.blanks.every((b: any) => {
            const val = (userAnswer.blanks[b.id] || '').trim().toLowerCase();
            return b.correctAnswers.some((ca: string) => ca.trim().toLowerCase() === val);
          });

        case 'MATCHING':
          if (!content.pairs || !userAnswer?.pairs) return false;
          return content.pairs.every((p: any) => userAnswer.pairs[p.item] === p.target);

        case 'DRAG_AND_DROP':
          if (!content.targets || !userAnswer?.targets) return false;
          return content.targets.every((t: any) => userAnswer.targets[t.id] === t.correctItemId);

        case 'REORDER':
          if (!content.items || !userAnswer?.itemOrder) return false;
          const correctOrder = content.items.sort((a: any, b: any) => a.correctOrder - b.correctOrder).map((i: any) => i.id);
          return JSON.stringify(correctOrder) === JSON.stringify(userAnswer.itemOrder);

        case 'BUILD_LIST':
          return JSON.stringify(content.correctSequence) === JSON.stringify(userAnswer?.sequence);

        case 'HOTSPOT':
          if (!userAnswer?.clickCoords) return false;
          const correctHotspot = content.hotspots?.find((h: any) => h.isCorrect);
          if (!correctHotspot) return false;
          const dist = Math.sqrt(
            Math.pow(userAnswer.clickCoords.x - correctHotspot.x, 2) +
            Math.pow(userAnswer.clickCoords.y - correctHotspot.y, 2)
          );
          return dist <= (correctHotspot.radius || 20);

        case 'SIMULATION':
        case 'LAB':
        case 'CODE_EDITOR':
        case 'ESSAY':
          return !!userAnswer;

        default:
          return false;
      }
    } catch {
      return false;
    }
  }
}
