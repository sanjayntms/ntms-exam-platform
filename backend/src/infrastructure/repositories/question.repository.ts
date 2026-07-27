import { PrismaClient, Question, QuestionType, DifficultyLevel } from '@prisma/client';

export class QuestionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
        caseStudy: true,
        simulation: true,
        lab: true,
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.question.findUnique({ where: { code } });
  }

  async findAll(filters?: { type?: QuestionType; difficulty?: DifficultyLevel; search?: string }) {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.difficulty) where.difficulty = filters.difficulty;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { code: { contains: filters.search } },
      ];
    }

    return this.prisma.question.findMany({
      where,
      include: {
        category: true,
        tags: { include: { tag: true } },
        caseStudy: true,
        simulation: true,
        lab: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.question.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.question.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }
}
