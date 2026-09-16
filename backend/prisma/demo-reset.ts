import { PrismaClient } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();

async function demoReset() {
  console.log('=== SkillSync Demo Data Reset Initialized ===');

  // Environment Safety Guard
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_RESET !== 'true') {
    console.error('CRITICAL SAFETY CHECK: Cannot run demo reset in production environment without explicit override.');
    process.exit(1);
  }

  console.log('1. Cleaning existing synthetic demo records...');

  // Find demo users
  const demoUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: '@skillsync.demo' } },
        { email: { endsWith: '@capacityconnect.demo' } },
      ],
    },
    select: { id: true, email: true },
  });

  const demoUserIds = demoUsers.map((u) => u.id);
  console.log(`Identified ${demoUserIds.length} synthetic demo accounts to reset.`);

  if (demoUserIds.length > 0) {
    await prisma.emailLog.deleteMany({ where: { recipientUserId: { in: demoUserIds } } });
    await prisma.notification.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.certificate.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.assessmentAnswer.deleteMany({ where: { attempt: { userId: { in: demoUserIds } } } });
    await prisma.assessmentAttempt.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.enrollment.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.profile.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.auditLog.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: demoUserIds } } });
  }

  console.log('2. Re-triggering idempotent seed process...');
  // Require and run main from seed.ts
  const { execSync } = require('child_process');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

  console.log('=== Demo Reset Completed Successfully ===');
}

demoReset()
  .catch((err) => {
    console.error('Demo reset failure:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
