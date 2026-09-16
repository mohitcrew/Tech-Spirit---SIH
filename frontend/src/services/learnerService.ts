import { api, unwrap } from './api';
import {
  myLearningCourses,
  skillCompetencies,
  currentUserProfile,
  upcomingSessions,
  recommendations,
  leaderboardUsers,
  badgesCatalog,
  communityDiscussions,
  Course,
  SkillCompetency,
  LiveSession,
  CommunityPost,
  LeaderboardUser,
} from '../data/capacityConnectData';

// ── Types for SkillSync Learner Dashboard ──────────────────────────────────────

export interface EducationItem {
  id: string;
  highestQualification: string;
  degree: string;
  institution: string;
  graduationYear: number;
  certifications?: string[];
}

export interface ProfessionalInfo {
  currentRole: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior / Specialist';
  workExperienceYears: number;
  currentOrganization: string;
  sector: string;
  domain: string;
}

export interface UserSkillItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  rating: number; // 1 - 100%
  verified: boolean;
  category: string;
}

export interface CareerGoal {
  targetRole: string;
  dreamCompany: string;
  targetSector: string;
  targetDomain: string;
  targetTimelineMonths: number;
  careerGoalStatement: string;
  shortTermGoal: string;
  longTermGoal: string;
  weeklyLearningHours: number;
  preferredPace: 'Self-Paced' | 'Cohort-Based' | 'Intensive Bootcamp';
  preferredTrainingMode: 'Hybrid' | 'Online Live' | 'Hands-on Lab';
}

export interface ExternalProfiles {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  resumeUrl?: string;
}

export interface TraineeProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  photoUrl: string;
  education: EducationItem;
  professional: ProfessionalInfo;
  skills: UserSkillItem[];
  interests: string[];
  careerGoal: CareerGoal;
  learningPreferences: {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    format: string;
    weeklyHours: number;
    trainingMode: string;
  };
  externalProfiles: ExternalProfiles;
  onboardingCompleted: boolean;
}

export interface PointTransaction {
  id: string;
  userId: string;
  activity: string;
  points: number;
  referenceId?: string;
  createdAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Milestone' | 'Skill' | 'Speed' | 'Community' | 'Mastery';
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface RoadmapStageTask {
  id: string;
  title: string;
  type: 'course' | 'resource' | 'assessment' | 'project';
  duration: string;
  completed: boolean;
  xp: number;
  linkUrl?: string;
}

export interface CareerRoadmapStage {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  objective: string;
  skills: string[];
  competencies: string[];
  estimatedDuration: string;
  pointsAvailable: number;
  completionCriteria: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  tasks: RoadmapStageTask[];
  stageCertificateId?: string;
  stageCertificateIssued?: boolean;
}

export interface CareerRoadmap {
  id: string;
  targetRole: string;
  dreamCompany: string;
  targetTimeline: string;
  generatedDate: string;
  disclaimer: string;
  totalXP: number;
  earnedXP: number;
  stages: CareerRoadmapStage[];
}

export interface CertificateItem {
  id: string;
  certificateNumber: string;
  courseTitle: string;
  courseId: string;
  issueDate: string;
  score: number;
  grade: string;
  issuer: string;
  credentialUrl: string;
  skills: string[];
  pdfDownloadUrl?: string;
  verified: boolean;
}

export interface LearningPathStage {
  id: string;
  order: number;
  title: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  competencies: string[];
  courses: {
    id: string;
    title: string;
    level: string;
    completed: boolean;
    duration: string;
  }[];
}

export interface LearningPath {
  id: string;
  targetRole: string;
  description: string;
  totalStages: number;
  completedStages: number;
  overallProgress: number;
  estimatedCompletion: string;
  requiredSkills: string[];
  calculatedSkillGaps: string[];
  stages: LearningPathStage[];
}

export interface SkillGapItem {
  id: string;
  name: string;
  category: string;
  currentScore: number;
  targetScore: number;
  gap: number;
  status: 'Critical' | 'Moderate' | 'Target Met';
  recommendedCourse: string;
  recommendedCourseId: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'Recorded Lecture' | 'Research Paper' | 'Architecture Brief' | 'Study Guide' | 'Presentation';
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  downloadsCount: number;
  likesCount: number;
  isBookmarked: boolean;
  tags: string[];
  fileSize: string;
  format: string;
  description: string;
  downloadUrl: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  type: 'live_session' | 'course_deadline' | 'assessment_deadline' | 'workshop';
  date: string; // YYYY-MM-DD
  time: string;
  duration: string;
  courseName?: string;
  trainerName?: string;
  trainerAvatar?: string;
  status: 'upcoming' | 'completed' | 'in_progress';
  meetingUrl?: string;
  description?: string;
}

export interface SupportTicketItem {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  responseCount: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// ── Realistic Prototype Store with localStorage Persistence ──────────────────

const CERTIFICATES_KEY = 'skillsync_learner_certificates';
const BOOKMARKS_KEY = 'skillsync_learner_bookmarks';
const COMMUNITY_KEY = 'skillsync_learner_posts';
const SUPPORT_TICKETS_KEY = 'skillsync_learner_tickets';

export const initialCertificates: CertificateItem[] = [
  {
    id: 'cert-001',
    certificateNumber: 'SS-2026-DL-89211',
    courseTitle: 'Communication Skills & Executive Presentation',
    courseId: 'c4',
    issueDate: 'August 28, 2026',
    score: 96,
    grade: 'A+ Distinction',
    issuer: 'SkillSync National Capacity Council',
    credentialUrl: 'https://skillsync.gov.in/verify/SS-2026-DL-89211',
    skills: ['Executive Presentation', 'Public Speaking', 'Cross-Functional Dialogue'],
    pdfDownloadUrl: '#',
    verified: true,
  },
  {
    id: 'cert-002',
    certificateNumber: 'SS-2026-CL-41094',
    courseTitle: 'Digital Literacy & Modern Cloud Fundamentals',
    courseId: 'c1',
    issueDate: 'July 15, 2026',
    score: 91,
    grade: 'A Honors',
    issuer: 'Ministry of Electronics & IT Capacity Commission',
    credentialUrl: 'https://skillsync.gov.in/verify/SS-2026-CL-41094',
    skills: ['Cloud Architecture', 'Container Basics', 'Data Security'],
    pdfDownloadUrl: '#',
    verified: true,
  },
  {
    id: 'cert-003',
    certificateNumber: 'SS-2026-PM-10294',
    courseTitle: 'Foundations of Empathetic Leadership & Team Dynamics',
    courseId: 'c2',
    issueDate: 'June 04, 2026',
    score: 88,
    grade: 'A',
    issuer: 'SkillSync Leadership Institute',
    credentialUrl: 'https://skillsync.gov.in/verify/SS-2026-PM-10294',
    skills: ['Empathetic Leadership', 'Conflict Resolution', 'Team Motivation'],
    pdfDownloadUrl: '#',
    verified: true,
  },
];

export const initialLearningPaths: LearningPath[] = [
  {
    id: 'lp-01',
    targetRole: 'Full Stack Capacity & Cloud Specialist',
    description: 'A comprehensive curriculum designed to transition software engineers into cloud-native enterprise system architects with verified zero-trust competencies.',
    totalStages: 4,
    completedStages: 2,
    overallProgress: 65,
    estimatedCompletion: 'November 2026',
    requiredSkills: ['Kubernetes & Docker', 'TypeScript & NestJS', 'Zero Trust IAM', 'CI/CD Pipelines'],
    calculatedSkillGaps: ['Zero Trust IAM (Gap: 32%)', 'Kubernetes Orchestration (Gap: 24%)'],
    stages: [
      {
        id: 'stage-1',
        order: 1,
        title: 'Foundational Systems & Microservices',
        duration: '3 Weeks',
        status: 'completed',
        competencies: ['Microservices Patterns', 'API Gateway Configuration'],
        courses: [
          { id: 'c1-1', title: 'Modern Cloud & Distributed Architecture', level: 'Intermediate', completed: true, duration: '12 hrs' },
          { id: 'c1-2', title: 'REST & GraphQL High-Throughput Design', level: 'Intermediate', completed: true, duration: '8 hrs' },
        ],
      },
      {
        id: 'stage-2',
        order: 2,
        title: 'Containerization & Cluster Orchestration',
        duration: '4 Weeks',
        status: 'completed',
        competencies: ['Container Deployment', 'Docker Multi-Stage Builds'],
        courses: [
          { id: 'c2-1', title: 'Docker Containers for High-Availability Apps', level: 'Intermediate', completed: true, duration: '10 hrs' },
          { id: 'c2-2', title: 'Kubernetes Workloads & StatefulSets', level: 'Advanced', completed: true, duration: '14 hrs' },
        ],
      },
      {
        id: 'stage-3',
        order: 3,
        title: 'Zero-Trust IAM & Cloud Infrastructure Security',
        duration: '3 Weeks',
        status: 'in_progress',
        competencies: ['Identity & Access Management', 'Mutual TLS & Secret Vaults'],
        courses: [
          { id: 'c3-1', title: 'Zero-Trust Protocol Analysis & Cyber Defense', level: 'Advanced', completed: false, duration: '16 hrs' },
          { id: 'c3-2', title: 'Cloud Armor & DDoS Mitigation', level: 'Advanced', completed: false, duration: '8 hrs' },
        ],
      },
      {
        id: 'stage-4',
        order: 4,
        title: 'Continuous Delivery, Observability & Capstone',
        duration: '4 Weeks',
        status: 'upcoming',
        competencies: ['Prometheus/Grafana Telemetry', 'Production GitOps Pipelines'],
        courses: [
          { id: 'c4-1', title: 'GitOps with ArgoCD & Progressive Rollouts', level: 'Advanced', completed: false, duration: '12 hrs' },
          { id: 'c4-2', title: 'Enterprise Capacity Capstone Assessment', level: 'Mastery', completed: false, duration: '20 hrs' },
        ],
      },
    ],
  },
  {
    id: 'lp-02',
    targetRole: 'Data Science & Predictive Capacity Fellow',
    description: 'Curated for public sector and research professionals to harness statistical modeling, machine learning pipelines, and predictive analytics for real-world impact.',
    totalStages: 3,
    completedStages: 1,
    overallProgress: 38,
    estimatedCompletion: 'December 2026',
    requiredSkills: ['Python & Pandas', 'Supervised Learning', 'Model Serialization', 'Vector DBs'],
    calculatedSkillGaps: ['Vector DBs & Embeddings (Gap: 45%)', 'Model Serialization (Gap: 28%)'],
    stages: [
      {
        id: 'stage-2-1',
        order: 1,
        title: 'Statistical Baselines & Exploratory Analysis',
        duration: '3 Weeks',
        status: 'completed',
        competencies: ['Data Cleaning', 'Hypothesis Testing'],
        courses: [
          { id: 'ds-1', title: 'Data Analytics & Numerical Foundations in Python', level: 'Beginner', completed: true, duration: '14 hrs' },
        ],
      },
      {
        id: 'stage-2-2',
        order: 2,
        title: 'Predictive Modeling & Feature Engineering',
        duration: '4 Weeks',
        status: 'in_progress',
        competencies: ['Scikit-Learn Regression', 'Classification Pipelines'],
        courses: [
          { id: 'ds-2', title: 'Machine Learning Foundations & Predictive Analytics', level: 'Intermediate', completed: false, duration: '18 hrs' },
        ],
      },
      {
        id: 'stage-2-3',
        order: 3,
        title: 'Applied Generative AI & Vector Search Systems',
        duration: '4 Weeks',
        status: 'upcoming',
        competencies: ['RAG Architectures', 'LLM Fine-Tuning'],
        courses: [
          { id: 'ds-3', title: 'Generative AI for Capacity & Operational Intelligence', level: 'Advanced', completed: false, duration: '16 hrs' },
        ],
      },
    ],
  },
];

export const initialKnowledgeResources: KnowledgeItem[] = [
  {
    id: 'kh-01',
    title: 'Zero-Trust Architecture Guidelines for Digital Public Infrastructure',
    category: 'Architecture Brief',
    author: 'Dr. Arun Verma',
    authorRole: 'Head of Emerging Technologies',
    readTime: '18 min read',
    date: 'Sep 10, 2026',
    downloadsCount: 1420,
    likesCount: 312,
    isBookmarked: true,
    tags: ['#ZeroTrust', '#Cybersecurity', '#DPI', '#CloudArch'],
    fileSize: '3.4 MB',
    format: 'PDF Whitepaper',
    description: 'Detailed enterprise blueprint on credential rotation, mutual TLS authentication, and granular RBAC schemas across national digital systems.',
    downloadUrl: '#',
  },
  {
    id: 'kh-02',
    title: 'Masterclass: Generative AI in Curriculum Design and Adaptive Evaluation',
    category: 'Recorded Lecture',
    author: 'Prof. Vikram Rao',
    authorRole: 'AI Ethics & EdTech Researcher',
    readTime: '45 mins watch',
    date: 'Sep 02, 2026',
    downloadsCount: 2890,
    likesCount: 540,
    isBookmarked: false,
    tags: ['#AIEducation', '#EdTech', '#Pedagogy'],
    fileSize: '320 MB',
    format: 'HD Video + Slides',
    description: 'Full lecture recording with interactive slide notes on crafting non-hallucinating evaluation prompts and automated diagnostic scoring.',
    downloadUrl: '#',
  },
  {
    id: 'kh-03',
    title: 'National Meteorological Satellite Telemetry Standards Handbook',
    category: 'Research Paper',
    author: 'Dr. Rajesh Kumar',
    authorRole: 'Senior Atmospheric Scientist',
    readTime: '32 min read',
    date: 'Aug 24, 2026',
    downloadsCount: 940,
    likesCount: 180,
    isBookmarked: false,
    tags: ['#RemoteSensing', '#Satellites', '#IMD', '#Meteorology'],
    fileSize: '8.1 MB',
    format: 'Technical Doc',
    description: 'Operational guidelines for radar ingestion, Doppler spectral filtering, and cyclone precipitation estimation protocols.',
    downloadUrl: '#',
  },
  {
    id: 'kh-04',
    title: 'High-Velocity Agile Squad Playbook for Public Sector Capacity',
    category: 'Study Guide',
    author: 'David Chen',
    authorRole: 'Agile Transformation Coach',
    readTime: '22 min read',
    date: 'Aug 14, 2026',
    downloadsCount: 1750,
    likesCount: 395,
    isBookmarked: true,
    tags: ['#Agile', '#Leadership', '#CapacityBuilding'],
    fileSize: '2.1 MB',
    format: 'Executive Summary',
    description: 'Sprint planning ceremonies, retrospective rubrics, and OKR alignment templates proven across 40+ governmental pilot programs.',
    downloadUrl: '#',
  },
  {
    id: 'kh-05',
    title: 'Modern TypeScript & NestJS Enterprise Pattern Showcase',
    category: 'Presentation',
    author: 'Meera Nair & Tech Spirit Team',
    authorRole: 'Principal Cloud Architects',
    readTime: '15 min read',
    date: 'Jul 30, 2026',
    downloadsCount: 3100,
    likesCount: 680,
    isBookmarked: false,
    tags: ['#TypeScript', '#NestJS', '#CleanArchitecture'],
    fileSize: '4.8 MB',
    format: 'Slide Deck',
    description: 'Layered controller-service architecture, dependency injection best practices, and Prisma ORM query optimizations.',
    downloadUrl: '#',
  },
];

export const initialCalendarEvents: CalendarEventItem[] = [
  {
    id: 'evt-01',
    title: 'Live Workshop: Zero-Trust IAM & Security Auditing',
    type: 'live_session',
    date: '2026-09-18',
    time: '11:00 AM – 12:30 PM',
    duration: '90 mins',
    courseName: 'Digital Literacy & Cloud Systems',
    trainerName: 'Dr. Arun Verma',
    trainerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    status: 'upcoming',
    meetingUrl: 'https://meet.skillsync.edu/live-zt-iam',
    description: 'Hands-on live session analyzing OAuth2 JWT tokens, role claims, and mTLS proxy configurations.',
  },
  {
    id: 'evt-02',
    title: 'Course Milestone: AI Ethics Prompt Submission',
    type: 'course_deadline',
    date: '2026-09-20',
    time: '11:59 PM IST',
    duration: 'Deadline',
    courseName: 'AI for Education',
    trainerName: 'Prof. Vikram Rao',
    status: 'upcoming',
    description: 'Submit your prompt design rubric and verified peer review assignment.',
  },
  {
    id: 'evt-03',
    title: 'Diagnostic Assessment: Cloud Container Security',
    type: 'assessment_deadline',
    date: '2026-09-24',
    time: '04:00 PM – 05:00 PM',
    duration: '60 mins',
    courseName: 'Cloud Engineering Bootcamp',
    trainerName: 'Alex Rivera',
    status: 'upcoming',
    description: '25-question timed benchmark covering Docker vulnerabilities, CVE scanners, and Kubernetes secrets.',
  },
  {
    id: 'evt-04',
    title: 'Cohort Interactive Review: Communication Capstone',
    type: 'workshop',
    date: '2026-09-27',
    time: '02:30 PM – 04:00 PM',
    duration: '90 mins',
    courseName: 'Communication Skills',
    trainerName: 'Meera Nair',
    status: 'upcoming',
    meetingUrl: 'https://meet.skillsync.edu/live-comm-review',
    description: 'Live presentation pitch presentations with real-time feedback and rubric scoring.',
  },
];

export const initialFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Competencies & Gaps',
    question: 'How is my skill gap calculated on SkillSync?',
    answer: 'SkillSync benchmarks your performance from diagnostics, quiz submissions, and course milestones against standardized role competency baselines. The difference between the target score (e.g. 85%) and your diagnostic rating (e.g. 64%) defines your calculated skill gap (21%).',
  },
  {
    id: 'faq-2',
    category: 'Certificates & Verification',
    question: 'Are SkillSync certificates verifiable by third parties?',
    answer: 'Yes! Every issued certificate includes a tamper-proof cryptographic Certificate ID and a public verification URL (e.g., skillsync.gov.in/verify/:id) that confirms the recipient, course date, and verified score.',
  },
  {
    id: 'faq-3',
    category: 'Learning Paths',
    question: 'Can I switch or customize my target role?',
    answer: 'Yes. In the Learning Paths module, you can choose alternative target career roles (e.g., Data Scientist, Cloud Architect, Systems Lead). The system instantly recomputes required competencies and reorders your recommended course sequence.',
  },
  {
    id: 'faq-4',
    category: 'Courses & Ingestion',
    question: 'Why is the Explore Courses catalogue managed separately?',
    answer: 'In enterprise deployments and hackathon demonstrations, the broader course catalogue is ingested via backend bulk uploads (e.g., institutional Excel sheets). Your enrolled courses in "My Learning" always remain active and synchronized.',
  },
  {
    id: 'faq-5',
    category: 'XP & Leaderboard',
    question: 'How do I earn XP and rank higher on the Leaderboard?',
    answer: 'You earn XP by completing course modules (+50 XP), scoring above 85% on quizzes (+100 XP), maintaining daily learning streaks (+30 XP daily), and helping peers in the Community discussions (+25 XP).',
  },
];

// ── Service API with Real Backend Integration & Prototype Fallback ──────────

export const learnerService = {
  // 1. Dashboard Overview
  async getDashboardSummary() {
    try {
      const res = await api.get('/users/me/enrollments');
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return {
          profile: currentUserProfile,
          enrollmentsCount: data.length,
          completedCount: data.filter((e: any) => e.status === 'COMPLETED').length,
          courses: myLearningCourses,
          competencies: skillCompetencies,
        };
      }
    } catch (e) {
      // Backend fallback
    }
    return {
      profile: currentUserProfile,
      enrollmentsCount: myLearningCourses.length,
      completedCount: myLearningCourses.filter(c => c.status === 'Completed').length,
      courses: myLearningCourses,
      competencies: skillCompetencies,
    };
  },

  // 2. My Learning
  async getMyLearningCourses(): Promise<Course[]> {
    try {
      const res = await api.get('/users/me/enrollments');
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((e: any) => ({
          id: e.course?.id || e.id,
          title: e.course?.title || 'Enrolled Course',
          instructor: e.course?.trainer?.name || 'Verified Faculty',
          instructorRole: 'Course Educator',
          category: e.course?.category || 'General',
          level: (e.course?.level || 'Intermediate') as any,
          progress: e.progress || 0,
          completedModules: Math.round(((e.progress || 0) / 100) * (e.course?.modules?.length || 10)),
          totalModules: e.course?.modules?.length || 10,
          estimatedTime: `${e.course?.durationHours || 4} hrs total`,
          status: e.status === 'COMPLETED' ? 'Completed' : 'In Progress',
          thumbnailGradient: 'from-blue-600 to-indigo-700',
          rating: 4.9,
          accentColor: '#2563EB',
          description: e.course?.description || '',
        }));
      }
    } catch (e) {
      // Fallback to rich prototype data
    }
    return myLearningCourses;
  },

  // 3. Learning Paths
  async getLearningPaths(): Promise<LearningPath[]> {
    return initialLearningPaths;
  },

  // 4. Skills & Skill Gaps
  async getSkillProfile() {
    const gaps: SkillGapItem[] = [
      {
        id: 'gap-1',
        name: 'Zero-Trust IAM & Security Protocols',
        category: 'Cybersecurity',
        currentScore: 48,
        targetScore: 80,
        gap: 32,
        status: 'Critical',
        recommendedCourse: 'Zero-Trust Protocol Analysis & Cyber Defense',
        recommendedCourseId: 'c-zt-1',
      },
      {
        id: 'gap-2',
        name: 'Cloud Container Orchestration (Kubernetes)',
        category: 'Cloud Infrastructure',
        currentScore: 56,
        targetScore: 80,
        gap: 24,
        status: 'Moderate',
        recommendedCourse: 'Cloud Engineering Bootcamp & Kubernetes CI/CD',
        recommendedCourseId: 'c-k8s-1',
      },
      {
        id: 'gap-3',
        name: 'Project Milestone Scoping & Agile Velocity',
        category: 'Project Management',
        currentScore: 64,
        targetScore: 75,
        gap: 11,
        status: 'Moderate',
        recommendedCourse: 'Project Management & Agile Sprints',
        recommendedCourseId: 'c6',
      },
      {
        id: 'gap-4',
        name: 'Strategic Leadership & Delegation',
        category: 'Leadership',
        currentScore: 68,
        targetScore: 75,
        gap: 7,
        status: 'Moderate',
        recommendedCourse: 'Leadership & Team Management',
        recommendedCourseId: 'c2',
      },
      {
        id: 'gap-5',
        name: 'Digital Literacy & Cloud Automation',
        category: 'Digital Literacy',
        currentScore: 91,
        targetScore: 85,
        gap: 0,
        status: 'Target Met',
        recommendedCourse: 'Digital Skills for the Future',
        recommendedCourseId: 'c1',
      },
    ];

    return {
      competencies: skillCompetencies,
      skillGaps: gaps,
      overallReadiness: 74,
      targetRole: 'Full Stack Capacity & Cloud Specialist',
    };
  },

  // 5. Certificates
  async getCertificates(): Promise<CertificateItem[]> {
    try {
      const res = await api.get('/certificates');
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          certificateNumber: c.certificateNumber || `SS-${c.id.substring(0, 8).toUpperCase()}`,
          courseTitle: c.course?.title || 'Completed Curriculum',
          courseId: c.courseId,
          issueDate: new Date(c.issuedAt || Date.now()).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          score: c.score || 90,
          grade: c.score >= 90 ? 'A+ Distinction' : 'A Honors',
          issuer: 'SkillSync National Capacity Council',
          credentialUrl: `https://skillsync.gov.in/verify/${c.id}`,
          skills: ['Certified Competency', 'Practical Evaluation'],
          pdfDownloadUrl: '#',
          verified: true,
        }));
      }
    } catch (e) {
      // Return prototype certificates
    }
    const saved = localStorage.getItem(CERTIFICATES_KEY);
    return saved ? JSON.parse(saved) : initialCertificates;
  },

  // 6. Knowledge Hub
  async getKnowledgeResources(): Promise<KnowledgeItem[]> {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    const bookmarkedIds: string[] = saved ? JSON.parse(saved) : ['kh-01', 'kh-04'];
    return initialKnowledgeResources.map(r => ({
      ...r,
      isBookmarked: bookmarkedIds.includes(r.id),
    }));
  },

  toggleBookmark(resourceId: string): boolean {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    let bookmarkedIds: string[] = saved ? JSON.parse(saved) : ['kh-01', 'kh-04'];
    const exists = bookmarkedIds.includes(resourceId);
    if (exists) {
      bookmarkedIds = bookmarkedIds.filter(id => id !== resourceId);
    } else {
      bookmarkedIds.push(resourceId);
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedIds));
    return !exists;
  },

  // 7. Community
  async getCommunityPosts(): Promise<CommunityPost[]> {
    const saved = localStorage.getItem(COMMUNITY_KEY);
    return saved ? JSON.parse(saved) : communityDiscussions;
  },

  saveCommunityPost(post: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'comments' | 'timeAgo'>): CommunityPost {
    const existing = localStorage.getItem(COMMUNITY_KEY);
    const posts: CommunityPost[] = existing ? JSON.parse(existing) : [...communityDiscussions];
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      timeAgo: 'Just now',
      likes: 0,
      commentsCount: 0,
      comments: [],
    };
    posts.unshift(newPost);
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(posts));
    return newPost;
  },

  likeCommunityPost(postId: string): CommunityPost[] {
    const existing = localStorage.getItem(COMMUNITY_KEY);
    const posts: CommunityPost[] = existing ? JSON.parse(existing) : [...communityDiscussions];
    const updated = posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      }
      return p;
    });
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(updated));
    return updated;
  },

  addComment(postId: string, text: string): CommunityPost[] {
    const existing = localStorage.getItem(COMMUNITY_KEY);
    const posts: CommunityPost[] = existing ? JSON.parse(existing) : [...communityDiscussions];
    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [
            ...p.comments,
            { author: currentUserProfile.name, text, time: 'Just now' },
          ],
        };
      }
      return p;
    });
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(updated));
    return updated;
  },

  // 8. Leaderboard
  async getLeaderboard(period: 'weekly' | 'monthly' | 'all_time' = 'weekly'): Promise<LeaderboardUser[]> {
    if (period === 'monthly') {
      return [
        { rank: 1, name: 'Aisha Khan', xp: 3450, badges: 22, streakDays: 28, avatarColor: 'bg-purple-600', isCurrentUser: false, highlightText: 'Monthly Capstone Leader' },
        { rank: 2, name: 'Priya Sharma (You)', xp: 3200, badges: 20, streakDays: 26, avatarColor: 'bg-blue-600', isCurrentUser: true, highlightText: 'High Quiz Accuracy' },
        { rank: 3, name: 'Arjun Mehta', xp: 2980, badges: 18, streakDays: 21, avatarColor: 'bg-emerald-600', isCurrentUser: false, highlightText: '3 Completed Modules' },
        { rank: 4, name: 'Rahul Verma', xp: 2750, badges: 16, streakDays: 19, avatarColor: 'bg-amber-600', isCurrentUser: false, highlightText: 'Consistent Contributor' },
      ];
    }
    if (period === 'all_time') {
      return [
        { rank: 1, name: 'Dr. Kabir Anand', xp: 12400, badges: 48, streakDays: 140, avatarColor: 'bg-emerald-600', isCurrentUser: false, highlightText: 'Institutional Fellow' },
        { rank: 2, name: 'Priya Sharma (You)', xp: 10850, badges: 42, streakDays: 85, avatarColor: 'bg-blue-600', isCurrentUser: true, highlightText: 'Top 5% National Learner' },
        { rank: 3, name: 'Aisha Khan', xp: 9950, badges: 39, streakDays: 78, avatarColor: 'bg-purple-600', isCurrentUser: false, highlightText: 'EdTech Specialist' },
        { rank: 4, name: 'Arjun Mehta', xp: 9100, badges: 36, streakDays: 62, avatarColor: 'bg-indigo-600', isCurrentUser: false, highlightText: 'Cloud Certified' },
      ];
    }
    return leaderboardUsers;
  },

  // 9. Calendar Events
  async getCalendarEvents(): Promise<CalendarEventItem[]> {
    return initialCalendarEvents;
  },

  // 10. Help & Support
  async getFaqs(category?: string): Promise<FaqItem[]> {
    if (category && category !== 'All') {
      return initialFaqs.filter(f => f.category === category);
    }
    return initialFaqs;
  },

  getSupportTickets(): SupportTicketItem[] {
    const saved = localStorage.getItem(SUPPORT_TICKETS_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'TICK-901',
        subject: 'Certificate verification URL returns pending state',
        category: 'Certificates',
        priority: 'Medium',
        status: 'Resolved',
        createdAt: '2 days ago',
        updatedAt: 'Yesterday',
        responseCount: 2,
      },
      {
        id: 'TICK-902',
        subject: 'Inquiry regarding Docker cluster cloud quota for lab exercise',
        category: 'Lab Environment',
        priority: 'High',
        status: 'In Progress',
        createdAt: '5 hours ago',
        updatedAt: '1 hour ago',
        responseCount: 1,
      },
    ];
  },

  submitSupportTicket(ticket: { subject: string; category: string; priority: 'Low' | 'Medium' | 'High'; description: string }): SupportTicketItem {
    const saved = localStorage.getItem(SUPPORT_TICKETS_KEY);
    const tickets: SupportTicketItem[] = saved ? JSON.parse(saved) : this.getSupportTickets();
    const newTicket: SupportTicketItem = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: 'Open',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      responseCount: 0,
    };
    tickets.unshift(newTicket);
    localStorage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(tickets));
    return newTicket;
  },

  // 11. Profile System & Completion Calculator
  getProfileStorageKey(userEmail?: string): string {
    if (userEmail) return `skillsync_trainee_full_profile_${userEmail.toLowerCase().trim()}`;
    const userStr = localStorage.getItem('cc_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.email) return `skillsync_trainee_full_profile_${u.email.toLowerCase().trim()}`;
      } catch {}
    }
    return 'skillsync_trainee_full_profile';
  },

  getTraineeProfile(): TraineeProfile {
    const userStr = localStorage.getItem('cc_user');
    let currentUser: any = null;
    if (userStr) {
      try {
        currentUser = JSON.parse(userStr);
      } catch {}
    }

    const PROFILE_KEY = this.getProfileStorageKey(currentUser?.email);
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If parsed profile has a valid name, keep it and sync currentUser if needed
        if (parsed.name && currentUser && currentUser.name !== parsed.name) {
          currentUser.name = parsed.name;
          localStorage.setItem('cc_user', JSON.stringify(currentUser));
        } else if (currentUser?.name && !parsed.name) {
          parsed.name = currentUser.name;
        }
        if (currentUser?.email && parsed.email !== currentUser.email) {
          parsed.email = currentUser.email;
        }
        if (parsed.name && (!parsed.photoUrl || parsed.photoUrl.includes('dicebear.com'))) {
          parsed.photoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(parsed.name)}&backgroundColor=0284c7,2563eb,7c3aed&textColor=ffffff`;
        }
        return parsed;
      } catch (e) {}
    }

    const displayName = currentUser?.name || 'SkillSync Learner';
    const displayEmail = currentUser?.email || 'learner@skillsync.demo';
    const displayId = currentUser?.id || 'learner-001';

    const defaultProfile: TraineeProfile = {
      id: displayId,
      name: displayName,
      email: displayEmail,
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=0284c7,2563eb,7c3aed&textColor=ffffff`,
      education: {
        id: 'edu-1',
        highestQualification: 'Undergraduate Degree',
        degree: 'Computer Science & Engineering',
        institution: 'National Institute of Technology',
        graduationYear: 2025,
        certifications: ['AWS Solutions Architect Associate'],
      },
      professional: {
        currentRole: currentUser?.role === 'TRAINER' ? 'Faculty Lead' : 'Student Trainee',
        experienceLevel: 'Intermediate',
        workExperienceYears: 2,
        currentOrganization: 'SkillSync National Learning Network',
        sector: 'Information Technology & Digital Services',
        domain: 'Cloud Systems & Data Intelligence',
      },
      skills: [
        { name: 'Python', level: 'Advanced', rating: 78, verified: true, category: 'Programming' },
        { name: 'SQL & PostgreSQL', level: 'Intermediate', rating: 68, verified: true, category: 'Data' },
        { name: 'Machine Learning', level: 'Beginner', rating: 42, verified: true, category: 'AI & Data Science' },
        { name: 'Docker & Containers', level: 'Advanced', rating: 75, verified: true, category: 'Cloud & DevOps' },
        { name: 'Zero-Trust Security', level: 'Beginner', rating: 38, verified: false, category: 'Cybersecurity' },
        { name: 'Statistics & Math', level: 'Intermediate', rating: 55, verified: true, category: 'Foundations' },
        { name: 'Git & CI/CD', level: 'Advanced', rating: 80, verified: true, category: 'DevOps' },
      ],
      interests: [
        'Artificial Intelligence & Predictive Analytics',
        'Distributed Cloud Architectures',
        'Large Language Model Fine-Tuning',
      ],
      careerGoal: {
        targetRole: 'Full-Stack & Cloud Engineer',
        dreamCompany: 'Microsoft',
        targetSector: 'Artificial Intelligence & Cloud Computing',
        targetDomain: 'Cloud Platforms & Intelligent Services',
        targetTimelineMonths: 12,
        careerGoalStatement: `Advance expertise and achieve benchmark competencies in modern cloud architectures.`,
        shortTermGoal: 'Complete core competencies and foundational certifications.',
        longTermGoal: 'Lead distributed cloud initiatives and enterprise architecture.',
        weeklyLearningHours: 10,
        preferredPace: 'Self-Paced',
        preferredTrainingMode: 'Hybrid',
      },
      learningPreferences: {
        level: 'Intermediate',
        format: 'Hands-on Projects & Labs',
        weeklyHours: 10,
        trainingMode: 'Hybrid with Mentor Sprints',
      },
      externalProfiles: {
        github: 'https://github.com/priyasharma-dev',
        linkedin: 'https://linkedin.com/in/priya-sharma-skillsync',
        portfolio: 'https://priyasharma.dev',
      },
      onboardingCompleted: true,
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  },

  updateTraineeProfile(updated: Partial<TraineeProfile>): TraineeProfile {
    const userStr = localStorage.getItem('cc_user');
    let currentUser: any = null;
    if (userStr) {
      try {
        currentUser = JSON.parse(userStr);
      } catch {}
    }
    const PROFILE_KEY = this.getProfileStorageKey(currentUser?.email || updated.email);
    const current = this.getTraineeProfile();
    const merged: TraineeProfile = {
      ...current,
      ...updated,
      education: { ...current.education, ...(updated.education || {}) },
      professional: { ...current.professional, ...(updated.professional || {}) },
      careerGoal: { ...current.careerGoal, ...(updated.careerGoal || {}) },
      learningPreferences: { ...current.learningPreferences, ...(updated.learningPreferences || {}) },
      externalProfiles: { ...current.externalProfiles, ...(updated.externalProfiles || {}) },
    };
    if (updated.name) {
      merged.name = updated.name;
      if (!merged.photoUrl || merged.photoUrl.includes('dicebear.com')) {
        merged.photoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(updated.name)}&backgroundColor=0284c7,2563eb,7c3aed&textColor=ffffff`;
      }
      if (currentUser) {
        currentUser.name = updated.name;
        localStorage.setItem('cc_user', JSON.stringify(currentUser));
      }
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
    return merged;
  },

  calculateProfileCompletion(profile: TraineeProfile): { percent: number; missingFields: string[] } {
    const checks: { label: string; valid: boolean }[] = [
      { label: 'Profile Photo', valid: Boolean(profile.photoUrl) },
      { label: 'Phone Number', valid: Boolean(profile.phone) },
      { label: 'Location', valid: Boolean(profile.location) },
      { label: 'Education Degree & School', valid: Boolean(profile.education?.degree && profile.education?.institution) },
      { label: 'Current Role & Sector', valid: Boolean(profile.professional?.currentRole && profile.professional?.sector) },
      { label: 'Skills Added (minimum 3)', valid: (profile.skills || []).length >= 3 },
      { label: 'Target Career Role', valid: Boolean(profile.careerGoal?.targetRole) },
      { label: 'Target Company / Organization', valid: Boolean(profile.careerGoal?.dreamCompany) },
      { label: 'Short & Long-term Goals', valid: Boolean(profile.careerGoal?.shortTermGoal && profile.careerGoal?.longTermGoal) },
      { label: 'Weekly Learning Hours', valid: (profile.careerGoal?.weeklyLearningHours || 0) > 0 },
      { label: 'External Portfolio / GitHub', valid: Boolean(profile.externalProfiles?.github || profile.externalProfiles?.portfolio) },
      { label: 'Resume Document', valid: Boolean(profile.externalProfiles?.resumeUrl) },
    ];

    const completed = checks.filter(c => c.valid).length;
    const percent = Math.round((completed / checks.length) * 100);
    const missingFields = checks.filter(c => !c.valid).map(c => c.label);

    return { percent, missingFields };
  },

  // 12. Points / XP Ledger & Gamification
  getPointTransactions(): PointTransaction[] {
    const POINTS_KEY = 'skillsync_point_transactions';
    const saved = localStorage.getItem(POINTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    const defaultTransactions: PointTransaction[] = [
      { id: 'tx-1', userId: 'learner-001', activity: 'Completed Stage 1: Python Fundamentals', points: 100, referenceId: 'stage-1', createdAt: '3 weeks ago' },
      { id: 'tx-2', userId: 'learner-001', activity: 'Passed Diagnostic Assessment: Data Structures', points: 100, referenceId: 'quiz-ds-1', createdAt: '2 weeks ago' },
      { id: 'tx-3', userId: 'learner-001', activity: 'Completed Stage 2: SQL & Data Analysis', points: 150, referenceId: 'stage-2', createdAt: '1 week ago' },
      { id: 'tx-4', userId: 'learner-001', activity: '7-Day Learning Streak Bonus', points: 50, referenceId: 'streak-7', createdAt: '3 days ago' },
      { id: 'tx-5', userId: 'learner-001', activity: 'Solved Peer Inquiry in Community Forum', points: 25, referenceId: 'comm-help-1', createdAt: 'Yesterday' },
      { id: 'tx-6', userId: 'learner-001', activity: 'Completed Module: Linear Regression & Cost Functions', points: 50, referenceId: 'mod-ml-1', createdAt: 'Today' },
    ];

    localStorage.setItem(POINTS_KEY, JSON.stringify(defaultTransactions));
    return defaultTransactions;
  },

  awardPoints(activity: string, points: number, referenceId?: string): { totalXP: number; newTx: PointTransaction } {
    const POINTS_KEY = 'skillsync_point_transactions';
    const currentTxs = this.getPointTransactions();
    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      userId: 'learner-001',
      activity,
      points,
      referenceId,
      createdAt: 'Just now',
    };
    currentTxs.unshift(newTx);
    localStorage.setItem(POINTS_KEY, JSON.stringify(currentTxs));

    const totalXP = currentTxs.reduce((sum, tx) => sum + tx.points, 1175); // Baseline demo XP

    // Check achievement unlock
    this.checkAndUnlockAchievements(totalXP);

    return { totalXP, newTx };
  },

  getTotalXP(): number {
    const txs = this.getPointTransactions();
    const sum = txs.reduce((acc, t) => acc + t.points, 0);
    // Demo baseline so user is around 1,650 XP as requested in prompt (1,650 / 2,000 threshold)
    return Math.max(1650, 1175 + sum);
  },

  getAchievements(): AchievementBadge[] {
    const BADGES_KEY = 'skillsync_achievements';
    const saved = localStorage.getItem(BADGES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    const defaultBadges: AchievementBadge[] = [
      { id: 'ach-1', title: 'First Learning Milestone', description: 'Complete your first verified learning module on SkillSync.', icon: '🏆', category: 'Milestone', unlocked: true, unlockedAt: 'August 12, 2026', xpReward: 100 },
      { id: 'ach-2', title: 'Skill Gap Crusher', description: 'Reduce calculated skill gaps by at least 15% through targeted learning.', icon: '🎯', category: 'Skill', unlocked: true, unlockedAt: 'September 02, 2026', xpReward: 150 },
      { id: 'ach-3', title: 'Course Champion', description: 'Finish 3 complete courses with average quiz score above 85%.', icon: '📚', category: 'Mastery', unlocked: true, unlockedAt: 'September 10, 2026', xpReward: 200 },
      { id: 'ach-4', title: 'Learning Streak Legend', description: 'Log in and complete activities for 14 consecutive days.', icon: '🔥', category: 'Speed', unlocked: true, unlockedAt: 'September 14, 2026', xpReward: 150 },
      { id: 'ach-5', title: 'Competency Builder', description: 'Master at least 4 observable multi-dimensional competencies.', icon: '🧠', category: 'Milestone', unlocked: false, xpReward: 250 },
      { id: 'ach-6', title: 'Roadmap Finisher', description: 'Complete all stages in your personalized career roadmap.', icon: '🚀', category: 'Mastery', unlocked: false, xpReward: 500 },
      { id: 'ach-7', title: 'SkillSync Certified', description: 'Pass the comprehensive final assessment and unlock official certification.', icon: '🏅', category: 'Mastery', unlocked: false, xpReward: 500 },
    ];

    localStorage.setItem(BADGES_KEY, JSON.stringify(defaultBadges));
    return defaultBadges;
  },

  checkAndUnlockAchievements(currentXP: number): AchievementBadge[] {
    const BADGES_KEY = 'skillsync_achievements';
    const badges = this.getAchievements();
    let updated = false;

    if (currentXP >= 1800) {
      const b = badges.find(x => x.id === 'ach-5');
      if (b && !b.unlocked) {
        b.unlocked = true;
        b.unlockedAt = 'Just now';
        updated = true;
      }
    }

    if (updated) {
      localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
    }
    return badges;
  },

  // 13. Personalized Career Roadmap Engine
  getPersonalizedRoadmap(): CareerRoadmap {
    const ROADMAP_KEY = 'skillsync_personalized_career_roadmap';
    const saved = localStorage.getItem(ROADMAP_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    const defaultRoadmap: CareerRoadmap = {
      id: 'roadmap-ds-001',
      targetRole: 'Data Scientist',
      dreamCompany: 'Microsoft',
      targetTimeline: '12 Months',
      generatedDate: 'September 2026',
      disclaimer: 'Your roadmap is designed around the selected target role and your current skill profile. This guidance represents a competency recommendation and prototype pathway, not official hiring criteria.',
      totalXP: 2000,
      earnedXP: 1650,
      stages: [
        {
          id: 'stage-1',
          order: 1,
          title: 'Stage 1: Python Fundamentals',
          subtitle: 'Core Syntax, OOP, Data Structures & Memory Models',
          objective: 'Solidify advanced object-oriented programming, data structures, and algorithmic computational efficiency in Python 3.12.',
          skills: ['Python 3.12', 'OOP & Decorators', 'Data Structures', 'Algorithmic Complexity'],
          competencies: ['Code Modularity & Design', 'Unit Testing & PyTest'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 100,
          completionCriteria: 'Pass diagnostic code lab with >= 80% accuracy',
          status: 'completed',
          stageCertificateId: 'SS-STG-PY-01',
          stageCertificateIssued: true,
          tasks: [
            { id: 't1-1', title: 'Python Intermediate & Vectorized Thinking', type: 'course', duration: '8 hrs', completed: true, xp: 50 },
            { id: 't1-2', title: 'Data Structures Diagnostic Assessment', type: 'assessment', duration: '45 mins', completed: true, xp: 50 },
          ],
        },
        {
          id: 'stage-2',
          order: 2,
          title: 'Stage 2: SQL & Data Analysis',
          subtitle: 'Relational Queries, CTEs, Window Functions & Pandas',
          objective: 'Master high-throughput tabular query optimizations, window functions, and multi-indexed exploratory data processing.',
          skills: ['PostgreSQL & SQL', 'Window Functions', 'Pandas & NumPy', 'Data Cleansing'],
          competencies: ['Complex Query Optimization', 'Exploratory Data Mining'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 150,
          completionCriteria: 'Complete 3 real-world database case studies and query challenges',
          status: 'completed',
          stageCertificateId: 'SS-STG-SQL-02',
          stageCertificateIssued: true,
          tasks: [
            { id: 't2-1', title: 'Advanced SQL for Analytics Engineers', type: 'course', duration: '10 hrs', completed: true, xp: 75 },
            { id: 't2-2', title: 'Pandas Performance Tuning & Chunk Ingestion', type: 'resource', duration: '3 hrs', completed: true, xp: 25 },
            { id: 't2-3', title: 'Financial Transaction Fraud Database Sprint', type: 'project', duration: '6 hrs', completed: true, xp: 50 },
          ],
        },
        {
          id: 'stage-3',
          order: 3,
          title: 'Stage 3: Statistics & Probability',
          subtitle: 'Hypothesis Testing, Bayesian Inference & Distributions',
          objective: 'Develop rigorous intuition for statistical tests (A/B testing, p-values, ANOVA) and multivariate probability distributions.',
          skills: ['Hypothesis Testing', 'A/B Testing', 'Probability Distributions', 'Bayesian Inference'],
          competencies: ['Experimentation Design', 'Statistical Validation'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 150,
          completionCriteria: 'Simulate 5 A/B test experiments and calculate confidence intervals',
          status: 'in_progress',
          stageCertificateId: 'SS-STG-STAT-03',
          stageCertificateIssued: false,
          tasks: [
            { id: 't3-1', title: 'Statistical Methods for Machine Learning', type: 'course', duration: '12 hrs', completed: true, xp: 75 },
            { id: 't3-2', title: 'A/B Experiment Power Analysis Lab', type: 'project', duration: '4 hrs', completed: false, xp: 50 },
            { id: 't3-3', title: 'Statistical Significance Quiz', type: 'assessment', duration: '30 mins', completed: false, xp: 25 },
          ],
        },
        {
          id: 'stage-4',
          order: 4,
          title: 'Stage 4: Machine Learning Foundations',
          subtitle: 'Supervised/Unsupervised Algorithms, Scikit-Learn & Cross-Validation',
          objective: 'Train, evaluate, and tune linear, tree-based, and ensemble regression and classification models with regularization.',
          skills: ['Scikit-Learn', 'Feature Engineering', 'Cross-Validation', 'Gradient Boosting (XGBoost)'],
          competencies: ['Predictive Model Architecture', 'Overfitting Prevention & Regularization'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 200,
          completionCriteria: 'Build an end-to-end predictive pipeline achieving >= 88% AUC-ROC',
          status: 'available',
          stageCertificateId: 'SS-STG-ML-04',
          stageCertificateIssued: false,
          tasks: [
            { id: 't4-1', title: 'Supervised Learning Algorithms Deep Dive', type: 'course', duration: '14 hrs', completed: false, xp: 80 },
            { id: 't4-2', title: 'Predictive Feature Selection Best Practices', type: 'resource', duration: '2 hrs', completed: false, xp: 30 },
            { id: 't4-3', title: 'Housing Price & Churn Prediction Pipeline', type: 'project', duration: '8 hrs', completed: false, xp: 90 },
          ],
        },
        {
          id: 'stage-5',
          order: 5,
          title: 'Stage 5: Production Projects & MLOps',
          subtitle: 'FastAPI Serving, Docker Containerization, CI/CD & Model Monitoring',
          objective: 'Deploy machine learning models as production REST APIs packaged in lightweight Docker containers with automated test suites.',
          skills: ['FastAPI & Uvicorn', 'MLflow Tracking', 'Docker Containerization', 'Model Monitoring'],
          competencies: ['API Integration & Production Deployment', 'Latency & Drift Monitoring'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 250,
          completionCriteria: 'Deploy a containerized microservice serving real-time model inferences',
          status: 'locked',
          stageCertificateId: 'SS-STG-MLOPS-05',
          stageCertificateIssued: false,
          tasks: [
            { id: 't5-1', title: 'FastAPI Production Model Serving', type: 'course', duration: '8 hrs', completed: false, xp: 100 },
            { id: 't5-2', title: 'Dockerized ML Inference Microservice Capstone', type: 'project', duration: '12 hrs', completed: false, xp: 150 },
          ],
        },
        {
          id: 'stage-6',
          order: 6,
          title: 'Stage 6: Advanced Deep Learning & Generative AI',
          subtitle: 'PyTorch, Transformers, Embeddings, Vector DBs & RAG Architecture',
          objective: 'Implement Transformer-based semantic search systems, retrieval-augmented generation (RAG), and vector embeddings.',
          skills: ['PyTorch', 'HuggingFace Transformers', 'Vector Databases (Chroma / Pinecone)', 'RAG Pipelines'],
          competencies: ['Generative AI Architecture', 'Contextual Retrieval Optimization'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 300,
          completionCriteria: 'Build an enterprise document QA assistant with citation tracing',
          status: 'locked',
          stageCertificateId: 'SS-STG-GENAI-06',
          stageCertificateIssued: false,
          tasks: [
            { id: 't6-1', title: 'Applied Generative AI & Vector Search Systems', type: 'course', duration: '16 hrs', completed: false, xp: 150 },
            { id: 't6-2', title: 'Enterprise RAG Search Engine Capstone', type: 'project', duration: '10 hrs', completed: false, xp: 150 },
          ],
        },
        {
          id: 'stage-7',
          order: 7,
          title: 'Final Assessment & Certification',
          subtitle: 'Comprehensive Diagnostic Evaluation + Capstone Defense',
          objective: 'Demonstrate holistic competency mastery across algorithms, statistics, modeling, deployment, and ethical AI stewardship.',
          skills: ['Comprehensive Data Science Mastery', 'Executive Solution Presentation'],
          competencies: ['Full-Lifecycle Capacity Intelligence', 'Strategic Problem Solving'],
          estimatedDuration: '1 Week',
          pointsAvailable: 500,
          completionCriteria: 'Score >= 85% on the proctored final assessment and achieve 2,000 total XP',
          status: 'locked',
          stageCertificateId: 'SS-FINAL-CERT-DS-2026',
          stageCertificateIssued: false,
          tasks: [
            { id: 't7-1', title: 'Proctored 60-Question Competency Exam', type: 'assessment', duration: '90 mins', completed: false, xp: 250 },
            { id: 't7-2', title: 'Capstone Code & Architecture Defense', type: 'project', duration: '4 hrs', completed: false, xp: 250 },
          ],
        },
      ],
    };

    localStorage.setItem(ROADMAP_KEY, JSON.stringify(defaultRoadmap));
    return defaultRoadmap;
  },

  updateRoadmapStage(stageId: string, status: 'locked' | 'available' | 'in_progress' | 'completed'): CareerRoadmap {
    const ROADMAP_KEY = 'skillsync_personalized_career_roadmap';
    const roadmap = this.getPersonalizedRoadmap();
    const stage = roadmap.stages.find(s => s.id === stageId);

    if (stage) {
      stage.status = status;
      if (status === 'completed') {
        stage.stageCertificateIssued = true;
        // Award stage completion points
        this.awardPoints(`Completed Roadmap Stage: ${stage.title}`, stage.pointsAvailable, stage.id);
        
        // Also add stage certificate to certificates list
        this.issueStageCertificate(stage);

        // Unlock next stage if available
        const nextIndex = roadmap.stages.findIndex(s => s.id === stageId) + 1;
        if (nextIndex < roadmap.stages.length) {
          const nextStage = roadmap.stages[nextIndex];
          if (nextStage.status === 'locked') {
            nextStage.status = 'available';
          }
        }
      }
    }

    // Recalculate roadmap earnedXP
    roadmap.earnedXP = this.getTotalXP();
    localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmap));
    return roadmap;
  },

  issueStageCertificate(stage: CareerRoadmapStage): CertificateItem {
    const certs = this.getCertificates();
    const certNum = `SS-STG-${stage.order}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Check if already issued
    const existing = certs.find(c => c.id === stage.stageCertificateId || c.courseTitle.includes(stage.title));
    if (existing) return existing;

    const newCert: CertificateItem = {
      id: stage.stageCertificateId || `cert-stg-${stage.id}`,
      certificateNumber: certNum,
      courseTitle: `${stage.title}: Verified Stage Competency`,
      courseId: `stage-${stage.id}`,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      score: 94,
      grade: 'Distinction',
      issuer: 'SkillSync Competency Council',
      credentialUrl: `https://skillsync.gov.in/verify/${certNum}`,
      skills: stage.skills,
      pdfDownloadUrl: '#',
      verified: true,
    };

    certs.unshift(newCert);
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(certs));
    return newCert;
  },

  // 14. Target Role vs Current Skills Gap Engine
  getSkillGapAnalysis(): {
    targetRole: string;
    dreamCompany: string;
    skills: {
      name: string;
      current: number;
      target: number;
      gap: number;
      priority: 'High Priority' | 'Medium Priority' | 'Strong Skill';
      whyItMatters: string;
      whatToLearn: string;
      recommendedCourse: string;
      recommendedResource: string;
    }[];
  } {
    return {
      targetRole: 'Data Scientist',
      dreamCompany: 'Microsoft',
      skills: [
        {
          name: 'Machine Learning & Predictive Modeling',
          current: 28,
          target: 85,
          gap: 57,
          priority: 'High Priority',
          whyItMatters: 'Core pillar for training classification models, optimizing loss functions, and predicting behavioral outcomes.',
          whatToLearn: 'Scikit-learn pipelines, cross-validation, hyperparameter tuning (GridSearchCV), and gradient-boosted trees.',
          recommendedCourse: 'Machine Learning Foundations & Predictive Analytics',
          recommendedResource: 'Masterclass: Generative AI in Curriculum Design and Adaptive Evaluation',
        },
        {
          name: 'Statistics & Hypothesis Testing',
          current: 35,
          target: 80,
          gap: 45,
          priority: 'High Priority',
          whyItMatters: 'Essential for experimental validation, distinguishing statistical signal from random variance, and conducting A/B trials.',
          whatToLearn: 'Two-sample t-tests, Chi-square independence tests, confidence interval bounds, and Bayesian priors.',
          recommendedCourse: 'Statistical Methods for Machine Learning & Decision Science',
          recommendedResource: 'High-Velocity Agile Squad Playbook for Public Sector Capacity',
        },
        {
          name: 'SQL & Large-Scale Data Wrangling',
          current: 48,
          target: 80,
          gap: 32,
          priority: 'Medium Priority',
          whyItMatters: 'Extracting, aggregating, and joining massive distributed datasets across relational databases and analytical warehouses.',
          whatToLearn: 'Window functions (RANK, ROW_NUMBER, LAG/LEAD), recursive CTEs, and PostgreSQL execution plans.',
          recommendedCourse: 'Advanced SQL & Distributed Query Design',
          recommendedResource: 'Modern TypeScript & NestJS Enterprise Pattern Showcase',
        },
        {
          name: 'Data Visualization & Executive Reporting',
          current: 61,
          target: 80,
          gap: 19,
          priority: 'Medium Priority',
          whyItMatters: 'Translating complex analytical discoveries into intuitive decision dashboards for cross-functional leadership.',
          whatToLearn: 'Seaborn, Matplotlib, interactive Plotly charts, and KPI metric presentation principles.',
          recommendedCourse: 'Executive Data Storytelling & Dashboard Design',
          recommendedResource: 'Zero-Trust Architecture Guidelines for Digital Public Infrastructure',
        },
        {
          name: 'Python Programming & Algorithms',
          current: 78,
          target: 85,
          gap: 7,
          priority: 'Strong Skill',
          whyItMatters: 'Baseline programming fluency that underpins all data transformation, modeling, and automated scripts.',
          whatToLearn: 'Memory profiling, vectorization, and asynchronous pipeline execution.',
          recommendedCourse: 'Data Analytics & Numerical Foundations in Python',
          recommendedResource: 'National Meteorological Satellite Telemetry Standards Handbook',
        },
      ],
    };
  },

  // 15. Dynamic Roadmap Synthesis from Onboarding Engine
  generatePersonalizedRoadmapFromOnboarding(onboardingData: Partial<TraineeProfile> & { persona?: string; assessmentScore?: number }): CareerRoadmap {
    const ROADMAP_KEY = 'skillsync_personalized_career_roadmap';
    const targetRole = onboardingData.careerGoal?.targetRole || 'Data Scientist';
    const dreamCompany = onboardingData.careerGoal?.dreamCompany || 'Industry Tech Leader';
    const timeline = onboardingData.careerGoal?.targetTimelineMonths ? `${onboardingData.careerGoal.targetTimelineMonths} Months` : '6 Months';
    const weeklyHours = onboardingData.careerGoal?.weeklyLearningHours || 10;
    const userSkills = (onboardingData.skills || []).map(s => s.name.toLowerCase());
    const roleLower = targetRole.toLowerCase();

    // Determine domain tracks
    let stages: CareerRoadmapStage[] = [];

    if (roleLower.includes('data') || roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('machine learning')) {
      stages = [
        {
          id: 'stage-1',
          order: 1,
          title: 'Stage 1: Core Python & Algorithmic Foundations',
          subtitle: 'OOP, Vectorization, Complexity & PyTest',
          objective: `Master fundamental computational patterns required for high-velocity software engineering at ${dreamCompany}.`,
          skills: ['Python 3.12', 'OOP & Decorators', 'Data Structures', 'Algorithmic Efficiency'],
          competencies: ['Code Modularity & Design', 'Unit Testing'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 150,
          completionCriteria: 'Pass diagnostic code lab with >= 80% accuracy',
          status: 'in_progress',
          stageCertificateId: 'SS-STG-PY-01',
          stageCertificateIssued: false,
          tasks: [
            { id: 't1-1', title: 'Python Vectors & Data Structure Ingestion', type: 'course', duration: `${Math.round(weeklyHours * 0.8)} hrs`, completed: false, xp: 75 },
            { id: 't1-2', title: 'Core Algorithmic Diagnostic Assessment', type: 'assessment', duration: '45 mins', completed: false, xp: 75 },
          ],
        },
        {
          id: 'stage-2',
          order: 2,
          title: 'Stage 2: High-Performance SQL & Tabular Pipelines',
          subtitle: 'Window Functions, CTEs, Aggregations & Pandas',
          objective: 'Process, clean, and manipulate multi-gigabyte datasets with relational query optimizations.',
          skills: ['PostgreSQL & SQL', 'Window Functions', 'Pandas & NumPy', 'Data Cleansing'],
          competencies: ['Query Optimization', 'Exploratory Analysis'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 200,
          completionCriteria: 'Complete database sprint and analytical case studies',
          status: 'locked',
          stageCertificateId: 'SS-STG-SQL-02',
          stageCertificateIssued: false,
          tasks: [
            { id: 't2-1', title: 'Enterprise SQL Optimization for Data Engineers', type: 'course', duration: `${Math.round(weeklyHours * 1.2)} hrs`, completed: false, xp: 100 },
            { id: 't2-2', title: 'Pandas Vectorized Ingestion Lab', type: 'project', duration: `${Math.round(weeklyHours * 0.8)} hrs`, completed: false, xp: 100 },
          ],
        },
        {
          id: 'stage-3',
          order: 3,
          title: 'Stage 3: Statistical Modeling & Hypothesis Testing',
          subtitle: 'A/B Testing, Bayesian Inference & Significance Tests',
          objective: 'Ground all quantitative findings in statistical rigor and robust experimentation frameworks.',
          skills: ['Hypothesis Testing', 'A/B Testing', 'Probability Distributions', 'Bayesian Inference'],
          competencies: ['Experimentation Design', 'Statistical Validation'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 250,
          completionCriteria: 'Simulate 5 A/B test experiments and calculate confidence intervals',
          status: 'locked',
          stageCertificateId: 'SS-STG-STAT-03',
          stageCertificateIssued: false,
          tasks: [
            { id: 't3-1', title: 'Applied Probability & Statistical Modeling', type: 'course', duration: `${Math.round(weeklyHours)} hrs`, completed: false, xp: 125 },
            { id: 't3-2', title: 'A/B Significance Diagnostic Sprint', type: 'project', duration: `${Math.round(weeklyHours * 0.7)} hrs`, completed: false, xp: 125 },
          ],
        },
        {
          id: 'stage-4',
          order: 4,
          title: 'Stage 4: Supervised & Unsupervised Machine Learning',
          subtitle: 'Scikit-Learn, Ensemble Trees, Regularization & Cross-Validation',
          objective: 'Train, evaluate, and tune production-ready regression and classification models.',
          skills: ['Scikit-Learn', 'Feature Engineering', 'Cross-Validation', 'Gradient Boosting (XGBoost)'],
          competencies: ['Predictive Model Architecture', 'Overfitting Prevention'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 300,
          completionCriteria: 'Build an end-to-end predictive pipeline achieving >= 88% AUC-ROC',
          status: 'locked',
          stageCertificateId: 'SS-STG-ML-04',
          stageCertificateIssued: false,
          tasks: [
            { id: 't4-1', title: 'Advanced Supervised Learning Algorithms', type: 'course', duration: `${Math.round(weeklyHours * 1.5)} hrs`, completed: false, xp: 150 },
            { id: 't4-2', title: 'Real-world Churn & Risk Modeling Capstone', type: 'project', duration: `${Math.round(weeklyHours)} hrs`, completed: false, xp: 150 },
          ],
        },
        {
          id: 'stage-5',
          order: 5,
          title: 'Stage 5: Production MLOps & Model Serving',
          subtitle: 'FastAPI Serving, Docker Containers, Drift Monitoring & CI/CD',
          objective: `Package and deploy models as low-latency microservices tailored for production at ${dreamCompany}.`,
          skills: ['FastAPI & Uvicorn', 'MLflow Tracking', 'Docker Containerization', 'Model Monitoring'],
          competencies: ['API Integration & Production Deployment', 'Latency & Drift Monitoring'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 350,
          completionCriteria: 'Deploy a containerized microservice serving real-time model inferences',
          status: 'locked',
          stageCertificateId: 'SS-STG-MLOPS-05',
          stageCertificateIssued: false,
          tasks: [
            { id: 't5-1', title: 'High-Throughput Model Serving with FastAPI & Docker', type: 'course', duration: `${Math.round(weeklyHours * 1.2)} hrs`, completed: false, xp: 175 },
            { id: 't5-2', title: 'Containerized Inference Microservice Deployment', type: 'project', duration: `${Math.round(weeklyHours)} hrs`, completed: false, xp: 175 },
          ],
        },
        {
          id: 'stage-6',
          order: 6,
          title: 'Stage 6: Generative AI, RAG & Capstone Defense',
          subtitle: 'Transformers, Embeddings, Vector DBs & Enterprise Architecture',
          objective: `Demonstrate mastery of modern retrieval-augmented generation and present your capstone solution for ${targetRole}.`,
          skills: ['PyTorch', 'HuggingFace Transformers', 'Vector Databases', 'RAG Pipelines'],
          competencies: ['Generative AI Architecture', 'Executive Technical Communication'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 500,
          completionCriteria: `Complete proctored final assessment and capstone defense for ${targetRole}`,
          status: 'locked',
          stageCertificateId: 'SS-FINAL-CERT-2026',
          stageCertificateIssued: false,
          tasks: [
            { id: 't6-1', title: 'Applied Generative AI & Vector Search Systems', type: 'course', duration: `${Math.round(weeklyHours * 1.5)} hrs`, completed: false, xp: 250 },
            { id: 't6-2', title: `Proctored Capstone Defense for ${targetRole}`, type: 'assessment', duration: '90 mins', completed: false, xp: 250 },
          ],
        },
      ];
    } else if (roleLower.includes('cloud') || roleLower.includes('devops') || roleLower.includes('infrastructure')) {
      stages = [
        {
          id: 'stage-1',
          order: 1,
          title: 'Stage 1: Linux Systems & Network Architectures',
          subtitle: 'Kernel, TCP/IP, Shell Scripting & Zero-Trust Basics',
          objective: 'Build foundational operating system fluency and automated shell pipeline competence.',
          skills: ['Linux Administration', 'Bash / Shell', 'TCP/IP & DNS', 'SSH & Key Management'],
          competencies: ['System Reliability', 'Command Line Automation'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 150,
          completionCriteria: 'Pass Linux systems benchmarking lab',
          status: 'in_progress',
          stageCertificateId: 'SS-STG-SYS-01',
          stageCertificateIssued: false,
          tasks: [
            { id: 't1-1', title: 'Modern Linux Engineering & Shell Automation', type: 'course', duration: `${Math.round(weeklyHours)} hrs`, completed: false, xp: 75 },
            { id: 't1-2', title: 'Systems Diagnostic Assessment', type: 'assessment', duration: '45 mins', completed: false, xp: 75 },
          ],
        },
        {
          id: 'stage-2',
          order: 2,
          title: 'Stage 2: Docker Containers & Microservices',
          subtitle: 'Multi-stage Builds, Networking, Volumes & Registries',
          objective: 'Package resilient polyglot services into production container images.',
          skills: ['Docker', 'Multi-stage Builds', 'Container Security', 'Compose'],
          competencies: ['Container Architecture', 'Microservices Separation'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 200,
          completionCriteria: 'Build hardened container fleet with vulnerability scanner pass',
          status: 'locked',
          stageCertificateId: 'SS-STG-DKR-02',
          stageCertificateIssued: false,
          tasks: [
            { id: 't2-1', title: 'Enterprise Container Architecture & Vulnerability Mitigation', type: 'course', duration: `${Math.round(weeklyHours * 1.2)} hrs`, completed: false, xp: 100 },
            { id: 't2-2', title: 'High-Availability Container Sprint', type: 'project', duration: `${Math.round(weeklyHours * 0.8)} hrs`, completed: false, xp: 100 },
          ],
        },
        {
          id: 'stage-3',
          order: 3,
          title: 'Stage 3: Kubernetes Orchestration & Cluster Management',
          subtitle: 'Pods, Deployments, Services, Ingress, ConfigMaps & Secrets',
          objective: 'Deploy and operate production stateful and stateless clusters on Kubernetes.',
          skills: ['Kubernetes (K8s)', 'Ingress Controllers', 'Helm Charts', 'Service Meshes'],
          competencies: ['Cluster Operations', 'High Availability Orchestration'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 250,
          completionCriteria: 'Zero-downtime rolling update deployment under simulated peak load',
          status: 'locked',
          stageCertificateId: 'SS-STG-K8S-03',
          stageCertificateIssued: false,
          tasks: [
            { id: 't3-1', title: 'Kubernetes Workloads & Production Cluster Operations', type: 'course', duration: `${Math.round(weeklyHours * 1.3)} hrs`, completed: false, xp: 125 },
            { id: 't3-2', title: 'K8s Cluster Resilience Challenge', type: 'project', duration: `${Math.round(weeklyHours * 0.7)} hrs`, completed: false, xp: 125 },
          ],
        },
        {
          id: 'stage-4',
          order: 4,
          title: 'Stage 4: Infrastructure as Code & CI/CD Pipelines',
          subtitle: 'Terraform, GitHub Actions, Automated Testing & Canary Releases',
          objective: `Automate end-to-end cloud resource provisioning aligned with ${dreamCompany} standards.`,
          skills: ['Terraform', 'GitHub Actions', 'CI/CD Automation', 'CloudFormation / Pulumi'],
          competencies: ['Infrastructure Automation', 'Continuous Delivery'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 300,
          completionCriteria: 'Deploy multi-region cloud topology via declarative Terraform state',
          status: 'locked',
          stageCertificateId: 'SS-STG-IAC-04',
          stageCertificateIssued: false,
          tasks: [
            { id: 't4-1', title: 'Declarative Cloud Architecture with Terraform', type: 'course', duration: `${Math.round(weeklyHours * 1.2)} hrs`, completed: false, xp: 150 },
            { id: 't4-2', title: 'Automated CI/CD Pipeline Build & Release', type: 'project', duration: `${Math.round(weeklyHours)} hrs`, completed: false, xp: 150 },
          ],
        },
        {
          id: 'stage-5',
          order: 5,
          title: 'Stage 5: Observability, SRE & Cloud Security',
          subtitle: 'Prometheus, Grafana, Distributed Tracing, Zero-Trust IAM & SLAs',
          objective: 'Implement end-to-end telemetry and maintain four golden signals of site reliability.',
          skills: ['Prometheus & Grafana', 'OpenTelemetry', 'Incident Management', 'Zero-Trust IAM'],
          competencies: ['Site Reliability Engineering', 'Proactive Incident Prevention'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 350,
          completionCriteria: 'Configure automated alert triage and SLO monitoring dashboard',
          status: 'locked',
          stageCertificateId: 'SS-STG-SRE-05',
          stageCertificateIssued: false,
          tasks: [
            { id: 't5-1', title: 'Observability & Telemetry Engineering for High-Availability Apps', type: 'course', duration: `${Math.round(weeklyHours)} hrs`, completed: false, xp: 175 },
            { id: 't5-2', title: 'SRE Chaos Engineering Simulation', type: 'project', duration: `${Math.round(weeklyHours * 0.8)} hrs`, completed: false, xp: 175 },
          ],
        },
        {
          id: 'stage-6',
          order: 6,
          title: 'Stage 6: Enterprise Cloud Architecture Capstone & Defense',
          subtitle: 'Multi-Cloud High Availability, Cost Optimization & Executive Sign-off',
          objective: `Present an enterprise-grade cloud blueprint tailored for ${targetRole} at ${dreamCompany}.`,
          skills: ['Multi-Cloud Architecture', 'Cost Governance (FinOps)', 'Executive Design Defense'],
          competencies: ['Strategic Enterprise Architecture', 'Capacity Leadership'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 500,
          completionCriteria: 'Pass comprehensive proctored evaluation and architecture defense',
          status: 'locked',
          stageCertificateId: 'SS-FINAL-CERT-CLOUD-2026',
          stageCertificateIssued: false,
          tasks: [
            { id: 't6-1', title: 'Enterprise Cloud System Architecture Masterclass', type: 'course', duration: `${Math.round(weeklyHours * 1.5)} hrs`, completed: false, xp: 250 },
            { id: 't6-2', title: `Proctored Capstone Defense for ${targetRole}`, type: 'assessment', duration: '90 mins', completed: false, xp: 250 },
          ],
        },
      ];
    } else {
      // General Software / Full-Stack Track
      stages = [
        {
          id: 'stage-1',
          order: 1,
          title: 'Stage 1: Modern TypeScript & Core Foundations',
          subtitle: 'Strong Typing, Asynchronous Patterns & Modern Tooling',
          objective: `Solidify production engineering habits and type-safe systems modeling for ${dreamCompany}.`,
          skills: ['TypeScript', 'ESNext / Modern JS', 'Data Structures', 'Async/Await & Streams'],
          competencies: ['Type-Driven Development', 'Code Modularity'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 150,
          completionCriteria: 'Pass TypeScript systems diagnostic benchmark',
          status: 'in_progress',
          stageCertificateId: 'SS-STG-TS-01',
          stageCertificateIssued: false,
          tasks: [
            { id: 't1-1', title: 'Deep Dive: Modern TypeScript & Design Patterns', type: 'course', duration: `${Math.round(weeklyHours)} hrs`, completed: false, xp: 75 },
            { id: 't1-2', title: 'Core Diagnostic Assessment', type: 'assessment', duration: '45 mins', completed: false, xp: 75 },
          ],
        },
        {
          id: 'stage-2',
          order: 2,
          title: 'Stage 2: Scalable Backend Services & Database Design',
          subtitle: 'NestJS / Express, Relational Schemas, ORM & Caching',
          objective: 'Design and implement robust REST & GraphQL APIs with resilient database indexing.',
          skills: ['NestJS / Node.js', 'PostgreSQL / Prisma', 'Redis Caching', 'API Security'],
          competencies: ['Service Architecture', 'Database Optimization'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 200,
          completionCriteria: 'Complete multi-tier backend microservice sprint',
          status: 'locked',
          stageCertificateId: 'SS-STG-BE-02',
          stageCertificateIssued: false,
          tasks: [
            { id: 't2-1', title: 'High-Throughput Backend Architecture with NestJS', type: 'course', duration: `${Math.round(weeklyHours * 1.2)} hrs`, completed: false, xp: 100 },
            { id: 't2-2', title: 'Database Optimization & Transaction Isolation Lab', type: 'project', duration: `${Math.round(weeklyHours * 0.8)} hrs`, completed: false, xp: 100 },
          ],
        },
        {
          id: 'stage-3',
          order: 3,
          title: 'Stage 3: Advanced Frontend Engineering & State Architecture',
          subtitle: 'React 19, Component Trees, Virtual DOM & Client Performance',
          objective: 'Build fluid, accessible, and high-performance user interfaces with zero memory leaks.',
          skills: ['React 19', 'State Machines (Zustand/Redux)', 'Tailwind / Glassmorphism', 'Web Vitals'],
          competencies: ['UI Engineering', 'Frontend Performance Tuning'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 250,
          completionCriteria: 'Deliver responsive portal achieving 98+ Lighthouse score',
          status: 'locked',
          stageCertificateId: 'SS-STG-FE-03',
          stageCertificateIssued: false,
          tasks: [
            { id: 't3-1', title: 'Enterprise Frontend Architecture & Core Web Vitals', type: 'course', duration: `${Math.round(weeklyHours * 1.2)} hrs`, completed: false, xp: 125 },
            { id: 't3-2', title: 'Real-time Analytics Dashboard Project', type: 'project', duration: `${Math.round(weeklyHours * 0.8)} hrs`, completed: false, xp: 125 },
          ],
        },
        {
          id: 'stage-4',
          order: 4,
          title: 'Stage 4: Cloud Containers & CI/CD Pipelines',
          subtitle: 'Docker, GitHub Actions, Automated Testing & Deployment',
          objective: 'Automate build, lint, test, and containerized deployment workflows.',
          skills: ['Docker', 'CI/CD Pipelines', 'Automated Testing (Jest/Playwright)', 'Cloud Deployments'],
          competencies: ['DevOps Alignment', 'Release Quality Assurance'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 300,
          completionCriteria: 'Deploy continuous delivery pipeline with 100% automated verification',
          status: 'locked',
          stageCertificateId: 'SS-STG-CICD-04',
          stageCertificateIssued: false,
          tasks: [
            { id: 't4-1', title: 'Continuous Integration & Container Workflows', type: 'course', duration: `${Math.round(weeklyHours)} hrs`, completed: false, xp: 150 },
            { id: 't4-2', title: 'Production Pipeline Deployment Sprint', type: 'project', duration: `${Math.round(weeklyHours * 0.8)} hrs`, completed: false, xp: 150 },
          ],
        },
        {
          id: 'stage-5',
          order: 5,
          title: 'Stage 5: Systems Security, Zero-Trust & Microservices',
          subtitle: 'OAuth2/OIDC, JWT Verification, Rate Limiting & Resilient Patterns',
          objective: 'Harden microservices against unauthorized access and implement circuit breakers.',
          skills: ['Zero-Trust IAM', 'OAuth2 / OpenID Connect', 'Circuit Breakers', 'Vulnerability Scans'],
          competencies: ['Application Security', 'Fault-Tolerant System Design'],
          estimatedDuration: '4 Weeks',
          pointsAvailable: 350,
          completionCriteria: 'Complete security audit and penetration resistance challenge',
          status: 'locked',
          stageCertificateId: 'SS-STG-SEC-05',
          stageCertificateIssued: false,
          tasks: [
            { id: 't5-1', title: 'Zero-Trust Architecture & Secure API Engineering', type: 'course', duration: `${Math.round(weeklyHours * 1.2)} hrs`, completed: false, xp: 175 },
            { id: 't5-2', title: 'Resilience & Circuit Breaker Simulation Sprint', type: 'project', duration: `${Math.round(weeklyHours * 0.8)} hrs`, completed: false, xp: 175 },
          ],
        },
        {
          id: 'stage-6',
          order: 6,
          title: 'Stage 6: Enterprise Full-Stack Capstone Defense',
          subtitle: 'Distributed Architecture, Scale Testing & Executive Presentation',
          objective: `Demonstrate end-to-end competence and defense of your production solution for ${targetRole}.`,
          skills: ['Full-Lifecycle Architecture', 'Load Testing (k6)', 'Technical Defense Presentation'],
          competencies: ['Holistic Full-Stack Mastery', 'Strategic Problem Solving'],
          estimatedDuration: '3 Weeks',
          pointsAvailable: 500,
          completionCriteria: `Score >= 85% on the proctored final assessment and capstone defense`,
          status: 'locked',
          stageCertificateId: 'SS-FINAL-CERT-FS-2026',
          stageCertificateIssued: false,
          tasks: [
            { id: 't6-1', title: 'Enterprise Full-Stack Distributed Systems Masterclass', type: 'course', duration: `${Math.round(weeklyHours * 1.5)} hrs`, completed: false, xp: 250 },
            { id: 't6-2', title: `Proctored Capstone Defense for ${targetRole}`, type: 'assessment', duration: '90 mins', completed: false, xp: 250 },
          ],
        },
      ];
    }

    const newRoadmap: CareerRoadmap = {
      id: `roadmap-${Date.now()}`,
      targetRole,
      dreamCompany,
      targetTimeline: timeline,
      generatedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      disclaimer: `Your roadmap is uniquely customized around your diagnostic benchmark, verified competencies, and targeted career milestones for ${targetRole} at ${dreamCompany}.`,
      totalXP: stages.reduce((acc, s) => acc + s.pointsAvailable, 0),
      earnedXP: 150, // Onboarding completion bonus
      stages,
    };

    localStorage.setItem(ROADMAP_KEY, JSON.stringify(newRoadmap));

    // Update profile with onboarding data
    this.updateTraineeProfile({
      ...onboardingData,
      onboardingCompleted: true,
    });

    // Award onboarding completion points
    this.awardPoints('Completed First-Login Onboarding & Baseline Diagnostic', 150, 'onboarding-completed');

    return newRoadmap;
  },
};

