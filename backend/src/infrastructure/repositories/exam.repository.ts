import { PrismaClient, Exam, ExamStatus, ExamVendor } from '@prisma/client';

export class ExamRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' },
              include: {
                question: {
                  include: {
                    category: true,
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
    });
  }

  async findAll(filters?: { vendor?: ExamVendor; status?: ExamStatus; search?: string }) {
    const where: any = {};
    if (filters?.vendor) where.vendor = filters.vendor;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { code: { contains: filters.search } },
      ];
    }

    return this.prisma.exam.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true } },
        sections: {
          include: {
            _count: { select: { questions: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.exam.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.exam.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.exam.delete({ where: { id } });
  }
}
