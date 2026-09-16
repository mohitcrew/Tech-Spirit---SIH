import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function seedMohit() {
  const passwordHash = await argon2.hash('Mohit@2006.');

  const user = await prisma.user.upsert({
    where: { email: 'mohit199189@gmail.com' },
    update: {
      name: 'A Mohit',
      role: 'TRAINEE',
      status: 'ACTIVE',
      passwordHash,
      onboardingCompleted: false,
      onboardingStatus: 'PENDING',
      firstLoginRequired: true,
    },
    create: {
      email: 'mohit199189@gmail.com',
      name: 'A Mohit',
      role: 'TRAINEE',
      status: 'ACTIVE',
      passwordHash,
      onboardingCompleted: false,
      onboardingStatus: 'PENDING',
      firstLoginRequired: true,
      profile: {
        create: {
          department: 'Computer Science & Engineering',
          designation: 'Student Trainee',
          sector: 'IT',
          domain: 'Full-Stack & Cloud Architecture',
          skills: 'JavaScript, TypeScript, React, Node.js',
          interests: 'Full-Stack Web Development, Cloud Computing, AI Integration',
        },
      },
    },
    include: { profile: true },
  });

  console.log('Seeded STU-051 user successfully:');
  console.log({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
    onboardingStatus: user.onboardingStatus,
    firstLoginRequired: user.firstLoginRequired,
  });
}

seedMohit()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
