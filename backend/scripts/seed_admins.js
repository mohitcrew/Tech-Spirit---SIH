const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash('Demo@12345');
  const admins = [
    {
      email: 'admin@capacityconnect.demo',
      name: 'Dr. Rajesh Verma',
      designation: 'Chief Capacity Director & System Architect',
      department: 'National Skill & Competency Directorate',
    },
    {
      email: 'admin@skillsync.demo',
      name: 'SkillSync Master Admin',
      designation: 'Lead Platform Administrator',
      department: 'Platform Administration & Security',
    },
  ];

  for (const adm of admins) {
    const u = await prisma.user.upsert({
      where: { email: adm.email },
      update: {
        name: adm.name,
        passwordHash: hash,
        role: 'ADMIN',
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
      create: {
        email: adm.email,
        name: adm.name,
        passwordHash: hash,
        role: 'ADMIN',
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
    });

    await prisma.profile.upsert({
      where: { userId: u.id },
      update: {
        department: adm.department,
        designation: adm.designation,
        sector: 'IT',
        domain: 'Digital Governance',
        experience: 15,
        skills: 'Executive Governance, System Design, Capacity Analytics, Cloud Security',
      },
      create: {
        userId: u.id,
        department: adm.department,
        designation: adm.designation,
        sector: 'IT',
        domain: 'Digital Governance',
        experience: 15,
        skills: 'Executive Governance, System Design, Capacity Analytics, Cloud Security',
      },
    });
    console.log('Seeded admin:', adm.email);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
