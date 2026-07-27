import { PrismaClient, ExamAttempt, AttemptStatus } from '@prisma/client';

export class AttemptRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.examAttempt.findUnique({
      where: { id },
      include: {
        exam: {
          include: {
            sections: {
              include: {
                questions: {
                  include: {
                    question: {
                      include: {
                        caseStudy: true,
                        simulation: true,
                        lab: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.examAttempt.findMany({
      where: { userId },
      include: {
        exam: { select: { id: true, title: true, code: true, vendor: true, passingScore: true } },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async create(data: { userId: string; examId: string; totalQuestions: number; answers: string }) {
    return this.prisma.examAttempt.create({
      data: {
        ...data,
        status: AttemptStatus.IN_PROGRESS,
      },
    });
  }

  async update(id: string, data: Partial<ExamAttempt>) {
    return this.prisma.examAttempt.update({ where: { id }, data });
  }

  async findAll() {
    return this.prisma.examAttempt.findMany({
      include: {
        exam: { select: { id: true, title: true, code: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startedAt: 'desc' },
    });
  }
}
