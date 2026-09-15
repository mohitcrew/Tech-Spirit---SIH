import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Demo@12345');
  await prisma.user.upsert({ where: { email: 'admin@capacityconnect.demo' }, update: {}, create: { email: 'admin@capacityconnect.demo', name: 'Admin', passwordHash: passwordHash, role: 'ADMIN', status: 'ACTIVE' } });
  await prisma.user.upsert({ where: { email: 'trainer@capacityconnect.demo' }, update: {}, create: { email: 'trainer@capacityconnect.demo', name: 'Trainer', passwordHash: passwordHash, role: 'TRAINER', status: 'ACTIVE' } });
  await prisma.user.upsert({ where: { email: 'trainee@capacityconnect.demo' }, update: {}, create: { email: 'trainee@capacityconnect.demo', name: 'Trainee', passwordHash: passwordHash, role: 'TRAINEE', status: 'ACTIVE' } });
  console.log('seeded');
}
main();