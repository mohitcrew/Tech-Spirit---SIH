import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Demo@12345');
  await prisma.user.upsert({ where: { email: 'admin@capacityconnect.demo' }, update: {}, create: { email: 'admin@capacityconnect.demo', name: 'Admin', passwordHash: passwordHash, role: 'ADMIN', status: 'ACTIVE' } });
  const trainer = await prisma.user.upsert({ where: { email: 'trainer@capacityconnect.demo' }, update: {}, create: { email: 'trainer@capacityconnect.demo', name: 'Trainer', passwordHash: passwordHash, role: 'TRAINER', status: 'ACTIVE' } });
  await prisma.user.upsert({ where: { email: 'trainee@capacityconnect.demo' }, update: {}, create: { email: 'trainee@capacityconnect.demo', name: 'Trainee', passwordHash: passwordHash, role: 'TRAINEE', status: 'ACTIVE' } });

  const courses = [
    {
      title: 'Weather Data Analysis with Python', description: 'Learn to clean, visualize and interpret weather datasets for operational forecasting.', category: 'Data & AI', sector: 'Earth Sciences', domain: 'Meteorology', skills: 'Python, Pandas, Data Visualization', competencies: 'Data analysis, Evidence-based decision making', level: 'BEGINNER', durationHours: 12, trainingMode: 'Self-paced', eligibility: 'Open to all learners with basic computer skills.', courseDates: 'Available year-round', thumbnailUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=900&auto=format&fit=crop&q=80', learningObjectives: ['Load and clean weather datasets', 'Create useful visual summaries'], modules: ['Python foundations for weather data', 'Cleaning and visualization']
    },
    {
      title: 'Climate Risk and Resilient Planning', description: 'Build practical climate-risk assessments and resilient action plans for public programmes.', category: 'Policy & Impact', sector: 'Climate Services', domain: 'Climate Resilience', skills: 'Risk Assessment, GIS, Policy Planning', competencies: 'Systems thinking, Strategic planning', level: 'INTERMEDIATE', durationHours: 16, trainingMode: 'Cohort-based workshop', eligibility: 'Recommended for policy, planning and programme officers.', courseDates: 'Next cohort: 06 Oct - 31 Oct 2026', thumbnailUrl: 'https://images.unsplash.com/photo-1561485132-59468cd0b553?w=900&auto=format&fit=crop&q=80', modules: ['Climate risk fundamentals', 'Designing resilient interventions']
    },
    {
      title: 'Geospatial Mapping for Field Operations', description: 'Use geospatial tools to turn field observations into clear maps and operational insights.', category: 'Technical', sector: 'Earth Sciences', domain: 'Geospatial Technology', skills: 'GIS, Remote Sensing, QGIS', competencies: 'Spatial reasoning, Operational reporting', level: 'INTERMEDIATE', durationHours: 20, trainingMode: 'Hybrid workshop', eligibility: 'Suitable for field and technical staff.', courseDates: 'Next cohort: 12 Nov - 03 Dec 2026', thumbnailUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=900&auto=format&fit=crop&q=80', modules: ['Map design and data layers', 'Field data to decision maps']
    },
    {
      title: 'Leadership for Public Service Teams', description: 'Strengthen communication, collaboration and delivery habits for high-performing public teams.', category: 'Professional Development', sector: 'Public Administration', domain: 'Leadership', skills: 'Communication, Facilitation, Team Management', competencies: 'People leadership, Collaborative delivery', level: 'BEGINNER', durationHours: 10, trainingMode: 'Cohort-based', eligibility: 'Open to public-sector professionals and emerging leaders.', courseDates: 'Available from 19 Oct 2026', thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&auto=format&fit=crop&q=80', modules: ['Leading with clarity', 'Feedback and team alignment']
    },
    {
      title: 'Research Methods and Technical Writing', description: 'Plan rigorous studies and communicate technical findings with clarity and confidence.', category: 'Research', sector: 'Science & Technology', domain: 'Research Communication', skills: 'Research Design, Technical Writing, Referencing', competencies: 'Critical thinking, Knowledge communication', level: 'INTERMEDIATE', durationHours: 14, trainingMode: 'Self-paced with live clinics', eligibility: 'For researchers, analysts and postgraduate learners.', courseDates: 'Live clinics every Friday', thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=80', modules: ['Research questions and methods', 'Writing findings for decision makers']
    },
    {
      title: 'Digital Safety and Data Protection', description: 'Apply practical cyber hygiene and data-protection practices in everyday institutional work.', category: 'Cybersecurity', sector: 'Information Technology', domain: 'Digital Safety', skills: 'Cyber Hygiene, Privacy, Secure Collaboration', competencies: 'Risk awareness, Responsible data handling', level: 'BEGINNER', durationHours: 8, trainingMode: 'Self-paced', eligibility: 'Open to all staff and learners.', courseDates: 'Available year-round', thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&auto=format&fit=crop&q=80', modules: ['Secure accounts and devices', 'Protecting sensitive information']
    },
  ];

  for (const course of courses) {
    const existing = await prisma.course.findFirst({ where: { title: course.title } });
    const record = existing ?? await prisma.course.create({
      data: {
        title: course.title, description: course.description, category: course.category, sector: course.sector ?? '', domain: course.domain ?? '', skills: course.skills ?? '', competencies: course.competencies ?? '', department: 'Capacity Connect Learning Centre', level: course.level, durationHours: course.durationHours, trainingMode: course.trainingMode ?? '', eligibility: course.eligibility ?? '', courseDates: course.courseDates ?? '', thumbnailUrl: course.thumbnailUrl, learningObjectives: course.modules.join('\n'), trainerId: trainer.id, status: 'PUBLISHED',
      },
    });
    await prisma.course.update({ where: { id: record.id }, data: { thumbnailUrl: course.thumbnailUrl } });
    if (!existing) {
      await prisma.courseModule.createMany({ data: course.modules.map((title, index) => ({ courseId: record.id, title, description: `Practical module: ${title}`, order: index + 1 })) });
    }
  }

  console.log(`seeded ${courses.length} sample courses`);
}
main();