import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Update ALL Entra ID users in the database to Sanjay Dubey / NTMS Admin
  const updated = await prisma.user.updateMany({
    where: {
      OR: [
        { entraId: { not: null } },
        { email: { contains: 'entra' } },
        { name: { contains: 'Entra' } },
      ],
    },
    data: {
      name: 'NTMS Admin (Sanjay Dubey)',
      email: 'sanjay@ntmsentra.onmicrosoft.com',
    },
  });

  console.log(`✅ Updated ${updated.count} Entra ID user record(s) in DB to "NTMS Admin (Sanjay Dubey)"!`);
}

main().finally(() => prisma.$disconnect());
