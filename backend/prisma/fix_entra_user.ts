import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('--- ALL USERS IN DB ---');
  console.log(JSON.stringify(users, null, 2));

  // Update any Entra ID user to NTMS Admin (Sanjay Dubey)
  await prisma.user.updateMany({
    where: {
      OR: [
        { name: 'Microsoft Entra User' },
        { email: { contains: 'entra' } },
        { entraId: { not: null } },
      ],
    },
    data: {
      name: 'NTMS Admin (Sanjay Dubey)',
      email: 'sanjay@ntmsentra.onmicrosoft.com',
    },
  });

  console.log('✅ Updated Entra ID user profile name to NTMS Admin (Sanjay Dubey)!');
}

main().finally(() => prisma.$disconnect());
