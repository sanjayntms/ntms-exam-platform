import { PrismaClient, AttemptStatus } from '@prisma/client';

const prisma = new PrismaClient();

function evaluateQuestionAnswer(question: any, userAnswer: any): boolean {
  try {
    const content = typeof question.content === 'string' ? JSON.parse(question.content) : question.content;

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

      default:
        return !!userAnswer;
    }
  } catch {
    return false;
  }
}

async function main() {
  console.log('Recalculating all evaluated exam attempts...');
  const attempts = await prisma.examAttempt.findMany({
    include: {
      exam: {
        include: {
          sections: {
            include: {
              questions: {
                include: {
                  question: true,
                },
              },
            },
          },
        },
      },
    },
  });

  for (const attempt of attempts) {
    if (!attempt.answers || !attempt.exam) continue;

    let mergedAnswers: any = {};
    try {
      mergedAnswers = JSON.parse(attempt.answers);
    } catch {
      continue;
    }

    let selectedQuestionIds: string[] = [];
    if (mergedAnswers._meta?.selectedQuestionIds) {
      selectedQuestionIds = mergedAnswers._meta.selectedQuestionIds;
    }

    const sectionsToEvaluate = attempt.exam.sections
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
        totalPossiblePoints += q.points || 1.0;
        secTotal++;
        evaluatedQuestionCount++;

        const userAnswer = mergedAnswers[q.id];
        if (userAnswer) {
          const isCorrect = evaluateQuestionAnswer(q, userAnswer);
          if (isCorrect) {
            earnedPoints += q.points || 1.0;
            correctCount++;
            secCorrect++;
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
    const passed = scorePercentage >= attempt.exam.passingScore;

    await prisma.examAttempt.update({
      where: { id: attempt.id },
      data: {
        sectionScores: JSON.stringify(sectionScores),
        totalQuestions: evaluatedQuestionCount > 0 ? evaluatedQuestionCount : attempt.totalQuestions,
        scorePercentage: parseFloat(scorePercentage.toFixed(2)),
        correctAnswers: correctCount,
        passed,
      },
    });

    console.log(`Updated attempt ${attempt.id}: ${correctCount}/${evaluatedQuestionCount} (${scorePercentage.toFixed(1)}%) -> Passed: ${passed}`);
  }

  console.log('Recalculation finished!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
