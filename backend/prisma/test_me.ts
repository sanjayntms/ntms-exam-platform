import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('=== DB USERS CURRENT STATE ===');
  for (const u of users) {
    console.log(`ID: ${u.id} | Name: "${u.name}" | Email: "${u.email}" | EntraID: ${u.entraId}`);
  }
}

main().finally(() => prisma.$disconnect());
