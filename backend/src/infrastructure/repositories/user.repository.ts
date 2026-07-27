import { PrismaClient, User, Role } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByEntraId(entraId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { entraId } });
  }

  async create(data: { email: string; name: string; role: Role; passwordHash?: string; entraId?: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
