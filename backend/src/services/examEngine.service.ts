import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { AttemptStatus, Role } from '../domain/types.js';
import { prisma } from '../infrastructure/database.js';

export class ExamEngineService {
  constructor(private uow: UnitOfWork) {}

  async startExamAttempt(
    userId: string,
    examId: string,
    userRole?: string,
    roomId?: string,
    candidateName?: string,
    requestedQuestionCount?: number
  ) {
    const exam = await this.uow.exams.findById(examId);
    if (!exam) throw new Error('Exam track not found');

    let user = await this.uow.users.findById(userId);
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: Role.CANDIDATE } });
      if (!user) {
        const allUsers = await this.uow.users.findAll();
        user = allUsers[0];
      }
    }
    if (!user) throw new Error('Valid candidate user not found in database');

    // Update user full name if candidateName passed
    const finalCandidateName = candidateName?.trim() || user.name;
    if (candidateName?.trim() && candidateName.trim() !== user.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: candidateName.trim() },
      });
    }

    const effectiveRole = userRole || user.role;
    let targetRoomId = roomId;

    let roomQuestionCount: number | null = null;

    // Validate room status and candidate room session:
    if (targetRoomId) {
      const room = await prisma.examRoom.findUnique({ where: { id: targetRoomId } });
      if (!room || room.status === 'CLOSED') {
        throw new Error('🔒 Exam Room Closed: The Administrator has closed this exam room. Exam attempt cannot be started.');
      }
      if (room.questionCount && room.questionCount > 0) {
        roomQuestionCount = room.questionCount;
      }
    }

    if (effectiveRole !== Role.ADMINISTRATOR && !(exam as any).isGloballyUnlocked) {
      if (!targetRoomId) {
        throw new Error('🔒 Proctored Room Code Required: This exam track requires joining an active Exam Room. Please enter your Room Code to launch this exam.');
      }

      const roomSession = await prisma.roomSession.findUnique({
        where: { roomId_userId: { roomId: targetRoomId, userId: user.id } },
      });
      const studentAccess = await prisma.studentExamAccess.findUnique({
        where: { userId_examId: { userId: user.id, examId } },
      });

      if (!roomSession && (!studentAccess || !studentAccess.isUnlocked)) {
        throw new Error('🔒 Proctored Room Session Required: You must enter the live Exam Room Code before launching this exam.');
      }
    }

    // Sample questions based on room questionCount or requestedQuestionCount or default to all questions
    const finalRequestedCount = roomQuestionCount && roomQuestionCount > 0
      ? roomQuestionCount
      : (requestedQuestionCount && requestedQuestionCount > 0 ? requestedQuestionCount : 0);

    const { sampledExam, selectedQuestionIds, optionOrders, totalQuestions } = this.sampleQuestionsForExam(exam, finalRequestedCount);

    const initialAnswersObj = {
      _meta: {
        selectedQuestionIds,
        optionOrders,
        requestedQuestionCount: finalRequestedCount > 0 ? finalRequestedCount : totalQuestions,
      },
    };

    const attempt = await this.uow.attempts.create({
      userId: user.id,
      candidateName: finalCandidateName,
      examId: exam.id,
      roomId: targetRoomId || null,
      totalQuestions,
      answers: JSON.stringify(initialAnswersObj),
    } as any);

    return {
      attemptId: attempt.id,
      exam: sampledExam,
      startedAt: attempt.startedAt,
      timeLimitMinutes: exam.timeLimitMinutes,
    };
  }

  private sampleQuestionsForExam(exam: any, requestedCount: number) {
    const optionOrders: Record<string, string[]> = {};

    const processQuestionAndShuffleOptions = (sq: any) => {
      if (!sq || !sq.question || !sq.question.content) return sq;
      try {
        const q = sq.question;
        const content = typeof q.content === 'string' ? JSON.parse(q.content) : q.content;
        if (Array.isArray(content.options) && content.options.length > 0) {
          const shuffledOpts = shuffleArray(content.options);
          optionOrders[q.id] = shuffledOpts.map((o: any) => o.id);
          content.options = shuffledOpts;
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
    };

    const sampledSections: any[] = [];
    const selectedQuestionIdsSet = new Set<string>();

    const totalAvailable = exam.sections.reduce((acc: number, sec: any) => acc + (sec.questions?.length || 0), 0);

    if (requestedCount <= 0 || requestedCount >= totalAvailable) {
      // Full exam: shuffle questions within each section and shuffle options
      exam.sections.forEach((sec: any) => {
        const secQuestions = sec.questions ? shuffleArray(sec.questions) : [];
        const processedQs = secQuestions.map((sq: any) => processQuestionAndShuffleOptions(sq));
        processedQs.forEach((sq: any) => {
          if (sq.question) selectedQuestionIdsSet.add(sq.question.id);
        });
        sampledSections.push({
          ...sec,
          questions: processedQs,
        });
      });

      return {
        sampledExam: {
          ...exam,
          sections: sampledSections,
        },
        selectedQuestionIds: Array.from(selectedQuestionIdsSet),
        optionOrders,
        totalQuestions: totalAvailable,
      };
    }

    const sectionQuotas: { section: any; quota: number }[] = [];

    exam.sections.forEach((sec: any) => {
      const secTotal = sec.questions.length;
      if (secTotal === 0) {
        sectionQuotas.push({ section: sec, quota: 0 });
        return;
      }
      const share = Math.round((secTotal / totalAvailable) * requestedCount);
      const quota = Math.max(1, Math.min(secTotal, share));
      sectionQuotas.push({ section: sec, quota });
    });

    let sumQuotas = sectionQuotas.reduce((acc, q) => acc + q.quota, 0);
    while (sumQuotas > requestedCount) {
      const largest = sectionQuotas.filter((sq) => sq.quota > 1).sort((a, b) => b.quota - a.quota)[0];
      if (largest) {
        largest.quota -= 1;
        sumQuotas -= 1;
      } else break;
    }
    while (sumQuotas < requestedCount) {
      const expandable = sectionQuotas.filter((sq) => sq.quota < sq.section.questions.length)[0];
      if (expandable) {
        expandable.quota += 1;
        sumQuotas += 1;
      } else break;
    }

    for (const sqQuota of sectionQuotas) {
      const { section, quota } = sqQuota;
      const secQuestions = section.questions;
      if (quota <= 0 || secQuestions.length === 0) continue;

      let selectedForSec: any[] = [];
      const hasCaseStudy = secQuestions.some((sq: any) => sq.question?.caseStudyId || sq.question?.caseStudy);

      if (hasCaseStudy) {
        const csGroups: Record<string, any[]> = {};
        const nonCs: any[] = [];

        secQuestions.forEach((sq: any) => {
          const csId = sq.question?.caseStudyId || sq.question?.caseStudy?.id;
          if (csId) {
            if (!csGroups[csId]) csGroups[csId] = [];
            csGroups[csId].push(sq);
          } else {
            nonCs.push(sq);
          }
        });

        let picked = 0;
        for (const [, group] of Object.entries(csGroups)) {
          if (picked >= quota) break;
          const take = Math.min(quota - picked, group.length);
          selectedForSec.push(...shuffleArray(group.slice(0, take)));
          picked += take;
        }

        if (picked < quota && nonCs.length > 0) {
          selectedForSec.push(...shuffleArray(nonCs.slice(0, quota - picked)));
        }
      } else {
        selectedForSec = shuffleArray(secQuestions).slice(0, quota);
      }

      const processedQs = selectedForSec.map((sq: any) => processQuestionAndShuffleOptions(sq));

      processedQs.forEach((sq: any) => {
        if (sq.question) selectedQuestionIdsSet.add(sq.question.id);
      });

      sampledSections.push({
        ...section,
        questions: processedQs,
      });
    }

    const selectedQuestionIds = Array.from(selectedQuestionIdsSet);
    const sampledExam = {
      ...exam,
      sections: sampledSections,
    };

    return {
      sampledExam,
      selectedQuestionIds,
      optionOrders,
      totalQuestions: selectedQuestionIds.length,
    };
  }

  async submitAnswers(attemptId: string, submittedAnswers: Record<string, any>, isFinalSubmit: boolean) {
    const attempt = await this.uow.attempts.findById(attemptId);
    if (!attempt) throw new Error('Exam attempt not found');

    // Validate if the room or exam for this attempt is closed or deleted
    if (attempt.status === 'CLOSED' || attempt.status === 'EXPIRED') {
      throw new Error('🔒 Exam Room Closed: The Administrator has closed or deleted this exam room. Active exam session terminated.');
    }

    const roomId = (attempt as any).roomId;
    let room: any = null;
    if (roomId) {
      room = await prisma.examRoom.findUnique({ where: { id: roomId } });
    } else {
      room = await prisma.examRoom.findFirst({
        where: { examId: attempt.examId },
        orderBy: { createdAt: 'desc' },
      });
    }

    const isUnlocked = (attempt as any).exam?.isGloballyUnlocked;
    if (!isUnlocked && (!room || room.status === 'CLOSED')) {
      await this.uow.attempts.update(attemptId, { status: 'CLOSED' });
      throw new Error('🔒 Exam Room Closed: The Administrator has closed or deleted this exam room. Active exam session terminated.');
    }

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

    // Evaluate scoring for assigned sampled questions (or full exam if no sampling metadata)
    const fullExam = attempt.exam;
    let selectedQuestionIds: string[] = [];
    if ((mergedAnswers as any)._meta?.selectedQuestionIds) {
      selectedQuestionIds = (mergedAnswers as any)._meta.selectedQuestionIds;
    }

    const sectionsToEvaluate = fullExam.sections
      .map((sec: any) => {
        if (selectedQuestionIds.length > 0) {
          return {
            ...sec,
            questions: sec.questions.filter((sq: any) => sq.question && selectedQuestionIds.includes(sq.question.id)),
          };
        }
        return sec;
      })
      .filter((sec: any) => sec.questions.length > 0);

    let earnedPoints = 0.0;
    let totalPossiblePoints = 0.0;
    let correctCount = 0;
    let evaluatedQuestionCount = 0;

    const sectionScores = sectionsToEvaluate.map((section: any) => {
      let secTotal = 0;
      let secCorrect = 0;

      section.questions.forEach((sq: any) => {
        const q = sq.question;
        totalPossiblePoints += q.points;
        secTotal++;
        evaluatedQuestionCount++;

        const userAnswer = (mergedAnswers as any)[q.id];
        if (userAnswer) {
          const isCorrect = this.evaluateQuestionAnswer(q, userAnswer);
          if (isCorrect) {
            earnedPoints += q.points;
            correctCount++;
            secCorrect++;
          } else if (fullExam.negativeMarking && q.negativePoints > 0) {
            earnedPoints = Math.max(0, earnedPoints - q.negativePoints);
          }
        }
      });

      const scorePercentage = secTotal > 0 ? Math.round((secCorrect / secTotal) * 100) : 0;
      let rating = 'Needs Improvement';
      if (scorePercentage >= 75) rating = 'Proficient';
      else if (scorePercentage >= 50) rating = 'Satisfactory';

      return {
        sectionId: section.id,
        title: section.title,
        weightPercentage: section.weightPercentage || 25.0,
        totalQuestions: secTotal,
        correctAnswers: secCorrect,
        scorePercentage,
        rating,
      };
    });

    const scorePercentage = totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) * 100 : 0;
    const passed = scorePercentage >= fullExam.passingScore;

    return this.uow.attempts.update(attemptId, {
      answers: JSON.stringify(mergedAnswers),
      sectionScores: JSON.stringify(sectionScores),
      status: AttemptStatus.EVALUATED,
      completedAt: new Date(),
      totalQuestions: evaluatedQuestionCount > 0 ? evaluatedQuestionCount : attempt.totalQuestions,
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

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
