import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.user.deleteMany({
    where: {
      OR: [
        { email: 'entra_user@ntms.com' },
        { name: 'Microsoft Entra User' },
        { email: { contains: 'entra_user' } },
      ],
    },
  });
  console.log(`✅ Deleted ${deleted.count} old dummy user rows!`);
}

main().finally(() => prisma.$disconnect());
