import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';

export class AnalyticsService {
  constructor(private uow: UnitOfWork) {}

  async getDashboardOverview() {
    const users = await this.uow.users.findAll();
    const exams = await this.uow.exams.findAll();
    const questions = await this.uow.questions.findAll();
    const attempts = await this.uow.attempts.findAll();

    const totalCandidates = users.filter((u) => u.role === 'CANDIDATE').length;
    const totalExams = exams.length;
    const totalQuestions = questions.length;
    const totalAttempts = attempts.length;

    const passedAttempts = attempts.filter((a) => a.passed).length;
    const overallPassRate = totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(1) : '0';

    const recentAttempts = attempts.slice(0, 5);

    return {
      stats: {
        totalCandidates,
        totalExams,
        totalQuestions,
        totalAttempts,
        overallPassRate: `${overallPassRate}%`,
      },
      recentAttempts,
    };
  }
}
