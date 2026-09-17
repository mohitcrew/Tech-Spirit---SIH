import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

const DOMAINS = [
  'Computer Science & Distributed Systems',
  'Data Science & AI Intelligence',
  'Meteorology & Atmospheric Telemetry',
  'Ocean Science & Marine Sensing',
  'Cloud Architecture & DevOps',
  'Cyber Defense & Zero-Trust',
  'Full-Stack & Mobile Development',
];

const SECTORS = ['IT', 'Earth Sciences', 'Public Governance', 'Aerospace & Telemetry'];

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Neha', 'Kabir', 'Sneha', 'Arjun', 'Diya',
  'Rahul', 'Tanvi', 'Ishaan', 'Meera', 'Varun', 'Kavya', 'Siddharth', 'Pooja', 'Gaurav', 'Shreya',
  'Akash', 'Ritika', 'Nikhil', 'Simran', 'Ayush', 'Komal', 'Pranav', 'Anjali', 'Yash', 'Bhavna',
  'Kunal', 'Divya', 'Mayank', 'Sanjana', 'Abhishek', 'Swati', 'Harsh', 'Preeti', 'Deepak', 'Nisha',
  'Karthik', 'Aarti', 'Manish', 'Pallavi', 'Suresh', 'Garima', 'Vivek', 'Monika', 'Alok', 'Rashi'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Iyer', 'Reddy', 'Gupta', 'Singh', 'Sen', 'Nair', 'Deshmukh',
  'Chatterjee', 'Mehta', 'Bose', 'Kumar', 'Chawla', 'Mishra', 'Joshi', 'Bhatia', 'Saxena', 'Pandey'
];

const TRAINER_PROFILES = [
  { name: 'Dr. Vikram Rao', email: 'trainer001@skillsync.demo', designation: 'Lead Systems Architect & Faculty Lead', domain: 'Computer Science & Distributed Systems' },
  { name: 'Dr. Sunita Mehra', email: 'trainer002@skillsync.demo', designation: 'Chief Atmospheric Research Scientist', domain: 'Meteorology & Atmospheric Telemetry' },
  { name: 'Prof. Rajesh Nair', email: 'trainer003@skillsync.demo', designation: 'Distinguished Professor of AI & Deep Learning', domain: 'Data Science & AI Intelligence' },
  { name: 'Dr. Anita Desai', email: 'trainer004@skillsync.demo', designation: 'Senior Director of Cloud Security & Zero-Trust', domain: 'Cyber Defense & Zero-Trust' },
  { name: 'Dr. Pradeep Kulkarni', email: 'trainer005@skillsync.demo', designation: 'Principal Telemetry Architect', domain: 'Ocean Science & Marine Sensing' },
  { name: 'Prof. Meenakshi Sundaram', email: 'trainer006@skillsync.demo', designation: 'Chairperson of Public Computing', domain: 'Full-Stack & Mobile Development' },
  { name: 'Dr. Anand Joshi', email: 'trainer007@skillsync.demo', designation: 'High-Performance Computing Specialist', domain: 'Cloud Architecture & DevOps' },
  { name: 'Dr. Renu Aggarwal', email: 'trainer008@skillsync.demo', designation: 'Principal Geospatial Analyst', domain: 'Meteorology & Atmospheric Telemetry' },
  { name: 'Prof. Sanjay Menon', email: 'trainer009@skillsync.demo', designation: 'Senior Faculty in Algorithm Engineering', domain: 'Computer Science & Distributed Systems' },
  { name: 'Dr. Kavita Singhania', email: 'trainer010@skillsync.demo', designation: 'Director of Ethical AI & Machine Learning', domain: 'Data Science & AI Intelligence' },
  { name: 'Dr. T. S. Narayanan', email: 'trainer011@skillsync.demo', designation: 'Marine Instrumentation Lead', domain: 'Ocean Science & Marine Sensing' },
  { name: 'Prof. Arvind Swaminathan', email: 'trainer012@skillsync.demo', designation: 'Lead Infrastructure Engineer', domain: 'Cloud Architecture & DevOps' },
  { name: 'Dr. Geeta Pillai', email: 'trainer013@skillsync.demo', designation: 'Cybersecurity Incident Response Lead', domain: 'Cyber Defense & Zero-Trust' },
  { name: 'Prof. Alok Banerjee', email: 'trainer014@skillsync.demo', designation: 'Embedded Systems & IoT Specialist', domain: 'Computer Science & Distributed Systems' },
  { name: 'Dr. Shalini Kapoor', email: 'trainer015@skillsync.demo', designation: 'Senior Faculty in Computational Statistics', domain: 'Data Science & AI Intelligence' },
  { name: 'Prof. Venkat Ramakrishnan', email: 'trainer016@skillsync.demo', designation: 'Climate Modeling Principal', domain: 'Meteorology & Atmospheric Telemetry' },
  { name: 'Dr. Monica D’Souza', email: 'trainer017@skillsync.demo', designation: 'Microservices & Distributed Systems Fellow', domain: 'Computer Science & Distributed Systems' },
  { name: 'Prof. Harish Chandra', email: 'trainer018@skillsync.demo', designation: 'Applied Cryptography Specialist', domain: 'Cyber Defense & Zero-Trust' },
  { name: 'Dr. Deepa Natarajan', email: 'trainer019@skillsync.demo', designation: 'Cloud DevOps Operations Lead', domain: 'Cloud Architecture & DevOps' },
  { name: 'Prof. S. K. Mahapatra', email: 'trainer020@skillsync.demo', designation: 'Senior Oceanographer & Data Lead', domain: 'Ocean Science & Marine Sensing' },
  { name: 'Trainer Demo', email: 'trainer@capacityconnect.demo', designation: 'Senior Technical Trainer', domain: 'Computer Science & Distributed Systems' },
  { name: 'Trainer Lead', email: 'trainer@skillsync.demo', designation: 'Principal Faculty Fellow', domain: 'Full-Stack & Mobile Development' },
];

export async function generateAndSeed75Users() {
  console.log('--- Generating and Seeding 75+ Verified Synthetic Users ---');

  const defaultPasswordHash = await argon2.hash('Demo@12345');
  const studentPasswordHash = await argon2.hash('Student@123');
  const mohitPasswordHash = await argon2.hash('Mohit@2006.');

  const excelRows: any[] = [];

  // 1. Admins
  const adminUsers = [
    {
      user_id: 'ADM-001',
      name: 'Dr. Rajesh Verma',
      email: 'admin@capacityconnect.demo',
      role: 'ADMIN',
      password: 'Demo@12345',
      sector: 'IT',
      domain: 'Digital Governance',
      target_role: 'Chief Capacity Director',
      experience_years: 16,
      skills: 'Executive Governance, System Design, Capacity Analytics',
      learning_goal: 'National Digital Capability Expansion',
      preferred_learning: 'Executive Briefs',
    },
    {
      user_id: 'ADM-002',
      name: 'SkillSync Master Admin',
      email: 'admin@skillsync.demo',
      role: 'ADMIN',
      password: 'Demo@12345',
      sector: 'IT',
      domain: 'Platform Administration',
      target_role: 'Lead Platform Administrator',
      experience_years: 12,
      skills: 'Cloud Infrastructure, Security Policies, User Directory Ops',
      learning_goal: 'Zero-downtime platform reliability',
      preferred_learning: 'Hands-on Labs',
    },
  ];

  for (const adm of adminUsers) {
    excelRows.push(adm);
    const u = await prisma.user.upsert({
      where: { email: adm.email },
      update: {
        name: adm.name,
        role: 'ADMIN',
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
      create: {
        email: adm.email,
        name: adm.name,
        passwordHash: defaultPasswordHash,
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
        employeeId: adm.user_id,
        designation: adm.target_role,
        department: `${adm.domain} Directorate`,
        sector: adm.sector,
        domain: adm.domain,
        experience: adm.experience_years,
        skills: adm.skills,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      create: {
        userId: u.id,
        employeeId: adm.user_id,
        designation: adm.target_role,
        department: `${adm.domain} Directorate`,
        sector: adm.sector,
        domain: adm.domain,
        experience: adm.experience_years,
        skills: adm.skills,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
    });
  }

  // 2. Trainers (22 trainers)
  for (let i = 0; i < TRAINER_PROFILES.length; i++) {
    const t = TRAINER_PROFILES[i];
    const tag = `TRN-${String(i + 1).padStart(3, '0')}`;
    const row = {
      user_id: tag,
      name: t.name,
      email: t.email,
      role: 'TRAINER',
      password: 'Demo@12345',
      sector: 'IT',
      domain: t.domain,
      target_role: t.designation,
      experience_years: 8 + (i % 10),
      skills: 'Pedagogy, Curriculum Architecture, Industry Diagnostics',
      learning_goal: 'Empower national trainees with high-impact skills',
      preferred_learning: 'Interactive Workshops',
    };
    excelRows.push(row);

    const userRecord = await prisma.user.upsert({
      where: { email: t.email },
      update: {
        name: t.name,
        role: 'TRAINER',
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
      create: {
        email: t.email,
        name: t.name,
        passwordHash: defaultPasswordHash,
        role: 'TRAINER',
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
    });

    await prisma.profile.upsert({
      where: { userId: userRecord.id },
      update: {
        employeeId: tag,
        sector: row.sector,
        domain: row.domain,
        targetRole: row.target_role,
        designation: row.target_role,
        department: `${row.domain} Faculty`,
        experience: row.experience_years,
        skills: row.skills,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      create: {
        userId: userRecord.id,
        employeeId: tag,
        sector: row.sector,
        domain: row.domain,
        targetRole: row.target_role,
        designation: row.target_role,
        department: `${row.domain} Faculty`,
        experience: row.experience_years,
        skills: row.skills,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    });
  }

  // 3. Students / Trainees (STU-001 to STU-050)
  for (let i = 1; i <= 50; i++) {
    const fn = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const name = `${fn} ${ln}`;
    const email = `student${String(i).padStart(3, '0')}@skillsync.demo`;
    const tag = `STU-${String(i).padStart(3, '0')}`;
    const domain = DOMAINS[(i - 1) % DOMAINS.length];
    const sector = SECTORS[(i - 1) % SECTORS.length];

    const row = {
      user_id: tag,
      name,
      email,
      role: 'TRAINEE',
      password: 'Student@123',
      sector,
      domain,
      target_role: 'Full Stack & AI Engineer',
      experience_years: (i % 4) + 1,
      skills: 'TypeScript, Python, SQL, Cloud Basics',
      learning_goal: 'Crack SIH 2026 & Land placement offer',
      preferred_learning: 'Blended',
    };
    excelRows.push(row);

    const userRecord = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        role: 'TRAINEE',
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
      create: {
        email,
        name,
        passwordHash: studentPasswordHash,
        role: 'TRAINEE',
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
    });

    await prisma.profile.upsert({
      where: { userId: userRecord.id },
      update: {
        employeeId: tag,
        sector,
        domain,
        targetRole: row.target_role,
        designation: 'Trainee Fellow',
        department: `${domain} Division`,
        experience: row.experience_years,
        skills: row.skills,
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      },
      create: {
        userId: userRecord.id,
        employeeId: tag,
        sector,
        domain,
        targetRole: row.target_role,
        designation: 'Trainee Fellow',
        department: `${domain} Division`,
        experience: row.experience_years,
        skills: row.skills,
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      },
    });
  }

  // 4. Also seed standard trainee demo user (trainee@capacityconnect.demo)
  const defaultTrainee = await prisma.user.upsert({
    where: { email: 'trainee@capacityconnect.demo' },
    update: {
      name: 'Priya Sharma',
      role: 'TRAINEE',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      firstLoginRequired: false,
    },
    create: {
      email: 'trainee@capacityconnect.demo',
      name: 'Priya Sharma',
      passwordHash: defaultPasswordHash,
      role: 'TRAINEE',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      firstLoginRequired: false,
    },
  });

  await prisma.profile.upsert({
    where: { userId: defaultTrainee.id },
    update: {
      employeeId: 'STU-000',
      designation: 'Digital Innovation Fellow',
      department: 'Capacity Building & Digital Learning',
      sector: 'IT',
      domain: 'Computer Science & Distributed Systems',
      skills: 'Digital Literacy, Communication, Leadership, Problem Solving',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    create: {
      userId: defaultTrainee.id,
      employeeId: 'STU-000',
      designation: 'Digital Innovation Fellow',
      department: 'Capacity Building & Digital Learning',
      sector: 'IT',
      domain: 'Computer Science & Distributed Systems',
      skills: 'Digital Literacy, Communication, Leadership, Problem Solving',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 5. STU-051: Mohit (mohit199189@gmail.com / Mohit@2006.) with onboardingCompleted = false!
  const mohitUser = await prisma.user.upsert({
    where: { email: 'mohit199189@gmail.com' },
    update: {
      name: 'A Mohit',
      role: 'TRAINEE',
      status: 'ACTIVE',
      passwordHash: mohitPasswordHash,
      onboardingCompleted: false,
      onboardingStatus: 'PENDING',
      firstLoginRequired: true,
    },
    create: {
      email: 'mohit199189@gmail.com',
      name: 'A Mohit',
      role: 'TRAINEE',
      status: 'ACTIVE',
      passwordHash: mohitPasswordHash,
      onboardingCompleted: false,
      onboardingStatus: 'PENDING',
      firstLoginRequired: true,
    },
  });

  await prisma.profile.upsert({
    where: { userId: mohitUser.id },
    update: {
      employeeId: 'STU-051',
      designation: 'Student Trainee',
      department: 'Computer Science & Engineering',
      sector: 'IT',
      domain: 'Full-Stack & Cloud Architecture',
      skills: 'JavaScript, TypeScript, React, Node.js',
      interests: 'Full-Stack Web Development, Cloud Computing, AI Integration',
      targetRole: 'Full Stack Engineer',
      experience: 1,
    },
    create: {
      userId: mohitUser.id,
      employeeId: 'STU-051',
      designation: 'Student Trainee',
      department: 'Computer Science & Engineering',
      sector: 'IT',
      domain: 'Full-Stack & Cloud Architecture',
      skills: 'JavaScript, TypeScript, React, Node.js',
      interests: 'Full-Stack Web Development, Cloud Computing, AI Integration',
      targetRole: 'Full Stack Engineer',
      experience: 1,
    },
  });

  excelRows.push({
    user_id: 'STU-051',
    name: 'A Mohit',
    email: 'mohit199189@gmail.com',
    role: 'TRAINEE',
    password: 'Mohit@2006.',
    sector: 'IT',
    domain: 'Full-Stack & Cloud Architecture',
    target_role: 'Full Stack Engineer',
    experience_years: 1,
    skills: 'JavaScript, TypeScript, React, Node.js',
    learning_goal: 'Full-Stack Web Development, Cloud Computing, AI Integration',
    preferred_learning: 'Interactive Onboarding',
  });

  // 6. Generate Excel workbook and write to disk
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelRows);
  XLSX.utils.book_append_sheet(wb, ws, 'All Users');

  const targets = [
    path.resolve(__dirname, '../../SkillSync_Demo_Users_and_Credentials.xlsx'),
    path.resolve(__dirname, '../SkillSync_Demo_Users_and_Credentials.xlsx'),
    path.resolve(__dirname, '../../../SkillSync_Demo_Users_and_Credentials.xlsx'),
  ];

  for (const t of targets) {
    try {
      XLSX.writeFile(wb, t);
      console.log(`Saved workbook to: ${t}`);
    } catch (err: any) {
      console.warn(`Could not write to ${t}: ${err?.message}`);
    }
  }

  const totalUsers = await prisma.user.count();
  console.log(`=== Seeding completed! Total users in database: ${totalUsers} ===`);
}

generateAndSeed75Users()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
