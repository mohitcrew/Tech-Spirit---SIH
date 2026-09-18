const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash('Bhavish@2701');
  const email = 'yandrapubhavish2701@gmail.com';
  const name = 'Yandrapu Bhavish';

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash: hash,
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: false,
      onboardingStatus: 'PENDING',
      firstLoginRequired: true,
    },
    create: {
      email,
      name,
      passwordHash: hash,
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: false,
      onboardingStatus: 'PENDING',
      firstLoginRequired: true,
    },
  });

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      department: 'Ministry of Earth Sciences Governance',
      designation: 'Platform Administrator & Governance Lead',
      sector: 'IT',
      domain: 'Digital Governance',
      experience: 10,
      skills: 'Executive Governance, System Design, Capacity Analytics, Cloud Security',
      interests: 'National Capacity Building, AI Safety, Infrastructure Governance',
      learningGoal: 'National Digital Capability Expansion',
      preferredLearning: 'Executive Briefs',
    },
    create: {
      userId: user.id,
      department: 'Ministry of Earth Sciences Governance',
      designation: 'Platform Administrator & Governance Lead',
      sector: 'IT',
      domain: 'Digital Governance',
      experience: 10,
      skills: 'Executive Governance, System Design, Capacity Analytics, Cloud Security',
      interests: 'National Capacity Building, AI Safety, Infrastructure Governance',
      learningGoal: 'National Digital Capability Expansion',
      preferredLearning: 'Executive Briefs',
    },
  });

  console.log('SUCCESS: Admin user created/updated:', user.id, user.email, user.role, 'onboardingCompleted:', user.onboardingCompleted);
}

main()
  .catch((e) => {
    console.error('Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
