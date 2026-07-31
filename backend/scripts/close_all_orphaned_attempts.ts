import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Cleaning up closed room attempts in database...');

  const inProgressAttempts = await prisma.examAttempt.findMany({
    where: {
      completedAt: null,
      status: { notIn: ['EVALUATED', 'CLOSED', 'EXPIRED'] },
    },
    include: { room: true },
  });

  let closedCount = 0;
  for (const att of inProgressAttempts) {
    let shouldClose = false;
    if (att.roomId) {
      if (!att.room || att.room.status === 'CLOSED') {
        shouldClose = true;
      }
    } else {
      const targetRoom = await prisma.examRoom.findFirst({
        where: { examId: att.examId },
        orderBy: { createdAt: 'desc' },
      });
      if (targetRoom && targetRoom.status === 'CLOSED') {
        shouldClose = true;
      }
    }

    if (shouldClose) {
      await prisma.examAttempt.update({
        where: { id: att.id },
        data: { status: 'CLOSED' },
      });
      closedCount++;
      console.log(`🔒 Closed orphaned attempt: ${att.id} (User: ${att.userId})`);
    }
  }

  console.log(`✅ Completed: ${closedCount} orphaned attempts set to status: CLOSED.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
