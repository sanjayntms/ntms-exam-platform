import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const u of users) {
    if (u.entraId || u.email.includes('entra') || u.name.includes('Entra')) {
      await prisma.user.update({
        where: { id: u.id },
        data: {
          name: 'NTMS Admin (Sanjay Dubey)',
          email: u.email.includes('entra') ? `sanjay-${u.id.substring(0, 4)}@ntmsentra.onmicrosoft.com` : u.email,
        },
      });
    }
  }

  console.log('✅ Updated all Entra ID user profile names in DB to "NTMS Admin (Sanjay Dubey)"!');
}

main().finally(() => prisma.$disconnect());
