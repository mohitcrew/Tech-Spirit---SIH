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
};
