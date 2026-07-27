import { PrismaClient } from '@prisma/client';
import { UserRepository } from './user.repository.js';
import { QuestionRepository } from './question.repository.js';
import { ExamRepository } from './exam.repository.js';
import { AttemptRepository } from './attempt.repository.js';

export class UnitOfWork {
  public users: UserRepository;
  public questions: QuestionRepository;
  public exams: ExamRepository;
  public attempts: AttemptRepository;

  constructor(private prisma: PrismaClient) {
    this.users = new UserRepository(this.prisma);
    this.questions = new QuestionRepository(this.prisma);
    this.exams = new ExamRepository(this.prisma);
    this.attempts = new AttemptRepository(this.prisma);
  }

  async executeTransaction<T>(fn: (uow: UnitOfWork) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (txPrisma) => {
      const txUow = new UnitOfWork(txPrisma as PrismaClient);
      return fn(txUow);
    });
  }
}
