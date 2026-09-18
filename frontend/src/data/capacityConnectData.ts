export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  completedModules: number;
  totalModules: number;
  estimatedTime: string;
  status: 'Not Started' | 'In Progress' | 'Almost Complete' | 'Completed';
  thumbnailGradient: string;
  rating: number;
  accentColor: string;
  description: string;
}

export interface SkillCompetency {
  name: string;
  score: number;
  fullMark: number;
  level: string;
  completedCourses: string[];
  recommendedCourses: string[];
  nextMilestone: string;
  categoryColor: string;
  description: string;
}

export interface LiveSession {
  id: string;
  date: string;
  title: string;
  time: string;
  trainer: string;
  trainerRole: string;
  trainerAvatar: string;
  participants: number;
  sessionType: string;
  isLive: boolean;
  meetingLink: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  role: string;
  avatar: string;
  timeAgo: string;
  content: string;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: Array<{ author: string; text: string; time: string }>;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  reason: string;
  instructor: string;
  thumbnailColor: string;
  isBookmarked?: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  badges: number;
  streakDays: number;
  avatarColor: string;
  isCurrentUser?: boolean;
  highlightText: string;
  prize?: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  unlockedAt: string;
  description: string;
  gradient: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/* ==========================================================================
   INITIAL MOCK DATASET
   ========================================================================== */

export const currentUserProfile = {
  id: 'learner-001',
  name: 'A Mohit',
  email: 'mohit199189@gmail.com',
  role: 'TRAINEE' as const,
  title: 'Digital Innovation Fellow',
  organization: 'Capacity Building Commission',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=A%20Mohit&backgroundColor=0284c7,2563eb,7c3aed&textColor=ffffff',
  level: 5,
  levelTitle: 'Curious Explorer',
  currentXp: 850,
  nextLevelXp: 1000,
  streakDays: 7,
  badgesCount: 12,
  weeklyGoalPercent: 78,
  lessonsLeftThisWeek: 2,
};

export const myLearningCourses: Course[] = [
  {
    id: 'c1',
    title: 'Digital Skills for the Future',
    instructor: 'Dr. Arun Verma',
    instructorRole: 'Head of Emerging Technologies',
    category: 'Digital Literacy',
    level: 'Intermediate',
    progress: 75,
    completedModules: 12,
    totalModules: 16,
    estimatedTime: '2.5 hrs left',
    status: 'In Progress',
    thumbnailGradient: 'from-blue-600 to-indigo-700',
    rating: 4.9,
    accentColor: '#2563EB',
    description: 'Master foundational digital workflows, cloud productivity, and collaborative engineering tools.',
  },
  {
    id: 'c2',
    title: 'Leadership & Team Management',
    instructor: 'Sarah Jenkins',
    instructorRole: 'Organizational Psychologist',
    category: 'Leadership',
    level: 'Intermediate',
    progress: 45,
    completedModules: 6,
    totalModules: 14,
    estimatedTime: '4.0 hrs left',
    status: 'In Progress',
    thumbnailGradient: 'from-purple-600 to-pink-600',
    rating: 4.8,
    accentColor: '#8B5CF6',
    description: 'Strategic interpersonal leadership, conflict mitigation, and adaptive team coaching frameworks.',
  },
  {
    id: 'c3',
    title: 'AI for Education',
    instructor: 'Prof. Vikram Rao',
    instructorRole: 'AI Ethics & EdTech Researcher',
    category: 'Innovation',
    level: 'Advanced',
    progress: 90,
    completedModules: 9,
    totalModules: 10,
    estimatedTime: '45 mins left',
    status: 'Almost Complete',
    thumbnailGradient: 'from-emerald-500 to-teal-700',
    rating: 4.95,
    accentColor: '#10B981',
    description: 'Practical adoption of generative models, adaptive evaluations, and prompt design in education.',
  },
  {
    id: 'c4',
    title: 'Communication Skills',
    instructor: 'Meera Nair',
    instructorRole: 'Senior Communications Lead',
    category: 'Communication',
    level: 'Beginner',
    progress: 100,
    completedModules: 8,
    totalModules: 8,
    estimatedTime: 'Completed',
    status: 'Completed',
    thumbnailGradient: 'from-amber-500 to-orange-600',
    rating: 4.9,
    accentColor: '#F59E0B',
    description: 'High-impact public speaking, executive summaries, and active listening methods.',
  },
  {
    id: 'c5',
    title: 'Sustainable Development',
    instructor: 'Dr. Rajesh Kumar',
    instructorRole: 'Environmental Policy Specialist',
    category: 'Policy & Impact',
    level: 'Beginner',
    progress: 0,
    completedModules: 0,
    totalModules: 12,
    estimatedTime: '6.0 hrs',
    status: 'Not Started',
    thumbnailGradient: 'from-cyan-500 to-blue-600',
    rating: 4.7,
    accentColor: '#06B6D4',
    description: 'Understanding UN SDGs, green procurement standards, and environmental governance.',
  },
  {
    id: 'c6',
    title: 'Project Management',
    instructor: 'David Chen',
    instructorRole: 'Agile Transformation Coach',
    category: 'Management',
    level: 'Intermediate',
    progress: 60,
    completedModules: 9,
    totalModules: 15,
    estimatedTime: '3.2 hrs left',
    status: 'In Progress',
    thumbnailGradient: 'from-sky-500 to-indigo-600',
    rating: 4.85,
    accentColor: '#38BDF8',
    description: 'Agile sprints, stakeholder mapping, resource leveling, and risk analysis principles.',
  },
];

export const skillCompetencies: SkillCompetency[] = [
  {
    name: 'Communication',
    score: 82,
    fullMark: 100,
    level: 'Advanced',
    completedCourses: ['High Impact Presentation', 'Cross-Cultural Dialogue', 'Active Listening in Teams'],
    recommendedCourses: ['Executive Stakeholder Negotiation', 'Storytelling for Public Leaders'],
    nextMilestone: 'Master Orator Badge (Requires 85%)',
    categoryColor: '#F59E0B',
    description: 'Articulate ideas persuasively, moderate debates, and draft transparent institutional briefs.',
  },
  {
    name: 'Leadership',
    score: 68,
    fullMark: 100,
    level: 'Intermediate',
    completedCourses: ['Foundations of Empathetic Leadership', 'Mentorship Basics'],
    recommendedCourses: ['Strategic Delegation & Trust', 'Leading During Organizational Change'],
    nextMilestone: 'Team Catalyst Badge (Requires 75%)',
    categoryColor: '#8B5CF6',
    description: 'Inspire alignment, nurture psychological safety, and guide teams through ambiguity.',
  },
  {
    name: 'Digital Literacy',
    score: 91,
    fullMark: 100,
    level: 'Expert',
    completedCourses: ['Cloud Infrastructure Basics', 'Data Security Protocols', 'API Integrations & Workflows'],
    recommendedCourses: ['Enterprise Cloud Architecture', 'Zero Trust Security Systems'],
    nextMilestone: 'Tech Pioneer Badge (Completed!)',
    categoryColor: '#2563EB',
    description: 'Fluency in modern cloud stacks, cybersecurity postures, and automated workflow design.',
  },
  {
    name: 'Problem Solving',
    score: 76,
    fullMark: 100,
    level: 'Proficient',
    completedCourses: ['Root Cause Analysis', 'Design Thinking Frameworks'],
    recommendedCourses: ['Complex Systems Thinking', 'Algorithmic Decision Making'],
    nextMilestone: 'Critical Thinker Distinction (Requires 80%)',
    categoryColor: '#10B981',
    description: 'Deconstruct multifaceted bottlenecks with structured analytical hypotheses.',
  },
  {
    name: 'Project Mgmt',
    score: 64,
    fullMark: 100,
    level: 'Intermediate',
    completedCourses: ['Agile Fundamentals', 'Kanban Board Mastery'],
    recommendedCourses: ['Scrum Master Certification Prep', 'Earned Value Management'],
    nextMilestone: 'Sprint Master (Requires 70%)',
    categoryColor: '#38BDF8',
    description: 'Scoping milestones, workload balancing, and tracking velocity across cross-functional squads.',
  },
  {
    name: 'Teamwork',
    score: 88,
    fullMark: 100,
    level: 'Advanced',
    completedCourses: ['Peer Code & Doc Review', 'Inclusive Collaboration', 'Asynchronous Work Culture'],
    recommendedCourses: ['Cross-Departmental Synergy Workshops'],
    nextMilestone: 'Synergy Champion (Requires 90%)',
    categoryColor: '#EC4899',
    description: 'Foster peer reciprocity, shared ownership, and smooth distributed cooperation.',
  },
];

export const upcomingSessions: LiveSession[] = [
  {
    id: 's1',
    date: 'October 18',
    title: 'Effective Communication & Stakeholder Pitching',
    time: '11:00 AM – 12:30 PM',
    trainer: 'Meera Nair',
    trainerRole: 'Senior Communications Lead',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    participants: 48,
    sessionType: 'Interactive Workshop',
    isLive: true,
    meetingLink: 'https://meet.capacityconnect.edu/live-comm-101',
  },
  {
    id: 's2',
    date: 'October 21',
    title: 'AI Prompts for Educators & Instructional Design',
    time: '03:00 PM – 04:30 PM',
    trainer: 'Prof. Vikram Rao',
    trainerRole: 'AI Ethics & EdTech Researcher',
    trainerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    participants: 72,
    sessionType: 'Live Masterclass',
    isLive: false,
    meetingLink: 'https://meet.capacityconnect.edu/ai-edu-live',
  },
  {
    id: 's3',
    date: 'October 25',
    title: 'Agile Delivery in Public Sector Capacity Projects',
    time: '02:00 PM – 03:30 PM',
    trainer: 'David Chen',
    trainerRole: 'Agile Transformation Coach',
    trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    participants: 55,
    sessionType: 'Interactive Q&A',
    isLive: false,
    meetingLink: 'https://meet.capacityconnect.edu/agile-live-25',
  },
];

export const communityDiscussions: CommunityPost[] = [
  {
    id: 'p1',
    author: 'Aisha Khan',
    role: 'Instructional Designer · New Delhi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    timeAgo: '2 hours ago',
    content: 'Which AI tools are you all using for generating automated formative quiz questions without hallucinated facts? Looking for trustworthy open frameworks!',
    tags: ['#AIEducation', '#EdTechTools', '#DigitalSkills'],
    likes: 18,
    isLiked: false,
    commentsCount: 6,
    comments: [
      { author: 'Vikram Rao', text: 'Anthropic Claude with temperature 0.1 works remarkably well for strict curriculum alignment.', time: '1 hr ago' },
      { author: 'A Mohit', text: 'We pair local models with structured JSON schemas, keeping questions 100% verified against NCERT and IMD training texts.', time: '35m ago' },
    ],
  },
  {
    id: 'p2',
    author: 'Rahul Verma',
    role: 'Operations Trainee · Mumbai',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    timeAgo: '5 hours ago',
    content: 'Share your experience from the Leadership & Team Management course! What was your biggest personal takeaway from module 3 on empathetic listening?',
    tags: ['#Leadership', '#TeamGrowth', '#LearningReflections'],
    likes: 24,
    isLiked: true,
    commentsCount: 11,
    comments: [
      { author: 'Sarah Jenkins', text: 'Loved seeing learners apply the "Listen to Understand, Not to Reply" exercise in their daily standups!', time: '3 hrs ago' },
    ],
  },
  {
    id: 'p3',
    author: 'Arjun Mehta',
    role: 'Data Analyst Fellow · Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    timeAgo: 'Yesterday',
    content: 'Just passed the Digital Skills Capstone! Highly recommend reviewing the cloud architecture modules before attempting the timed assessment.',
    tags: ['#Milestone', '#DigitalSkills', '#StudyTips'],
    likes: 31,
    isLiked: true,
    commentsCount: 8,
    comments: [
      { author: 'A Mohit', text: 'Congratulations Arjun! Huge inspiration for the rest of our cohort!', time: '18 hrs ago' },
    ],
  },
];

export const recommendations: Recommendation[] = [
  {
    id: 'r1',
    title: 'Cloud Architecture & Infrastructure for Scalable Systems',
    category: 'Digital Skills',
    difficulty: 'Intermediate',
    duration: '5.5 hrs',
    rating: 4.9,
    reason: 'Because you completed Digital Literacy with 91%',
    instructor: 'Alex Rivera',
    thumbnailColor: 'from-blue-600 to-indigo-800',
    isBookmarked: false,
  },
  {
    id: 'r2',
    title: 'Design Thinking & Service Delivery for Public Impact',
    category: 'Leadership & Policy',
    difficulty: 'Beginner',
    duration: '3.8 hrs',
    rating: 4.85,
    reason: 'Because of your interest in Leadership & Problem Solving',
    instructor: 'Anita Sen',
    thumbnailColor: 'from-purple-600 to-pink-700',
    isBookmarked: true,
  },
  {
    id: 'r3',
    title: 'Data Visualization with PowerBI, Python & Geo-Spatial Maps',
    category: 'Data Analytics',
    difficulty: 'Advanced',
    duration: '4.2 hrs',
    rating: 4.95,
    reason: 'Matches your weekly goal & top assessment score',
    instructor: 'Dr. Kabir Anand',
    thumbnailColor: 'from-emerald-600 to-teal-800',
    isBookmarked: false,
  },
];

export const leaderboardUsers: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'A Mohit (You)',
    xp: 850,
    badges: 12,
    streakDays: 7,
    avatarColor: 'bg-blue-600',
    isCurrentUser: true,
    highlightText: 'Top learner this week · 7-day streak',
    prize: '₹2,500 Grant + Gold Distinction',
  },
  {
    rank: 2,
    name: 'Arjun Mehta',
    xp: 820,
    badges: 11,
    streakDays: 6,
    avatarColor: 'bg-emerald-600',
    isCurrentUser: false,
    highlightText: 'Completed Digital Skills Capstone',
    prize: '₹1,500 Grant + Silver Distinction',
  },
  {
    rank: 3,
    name: 'Aisha Khan',
    xp: 790,
    badges: 10,
    streakDays: 5,
    avatarColor: 'bg-purple-600',
    isCurrentUser: false,
    highlightText: 'Community Champion',
    prize: '₹1,000 Grant + Bronze Distinction',
  },
  {
    rank: 4,
    name: 'Rahul Verma',
    xp: 740,
    badges: 9,
    streakDays: 4,
    avatarColor: 'bg-amber-600',
    isCurrentUser: false,
    highlightText: 'Quiz Master distinction',
    prize: '250 Bonus XP + Honor Roll',
  },
];

export const badgesCatalog: BadgeItem[] = [
  {
    id: 'b1',
    title: '7-Day Streak Flame',
    icon: '🔥',
    category: 'Consistency',
    unlockedAt: 'Today',
    description: 'Completed at least one learning unit every day for 7 consecutive days.',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'b2',
    title: 'Digital Pioneer',
    icon: '⚡',
    category: 'Competency',
    unlockedAt: '2 days ago',
    description: 'Achieved 90%+ score in Digital Literacy core curriculum.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'b3',
    title: 'Master Communicator',
    icon: '🎙️',
    category: 'Soft Skills',
    unlockedAt: 'Last week',
    description: 'Completed 100% of Communication Skills with verified peer pitch review.',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'b4',
    title: 'Community Mentor',
    icon: '🤝',
    category: 'Social Learning',
    unlockedAt: 'Last week',
    description: 'Shared 5 insightful solutions and received 20+ peer upvotes.',
    gradient: 'from-purple-400 to-pink-500',
  },
];

export const weeklyAnalyticsData = [
  { day: 'Mon', hours: 2.5, modules: 3 },
  { day: 'Tue', hours: 3.2, modules: 4 },
  { day: 'Wed', hours: 1.8, modules: 2 },
  { day: 'Thu', hours: 4.0, modules: 5 },
  { day: 'Fri', hours: 3.5, modules: 4 },
  { day: 'Sat', hours: 2.0, modules: 2 },
  { day: 'Sun', hours: 1.5, modules: 1 },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'In modern digital collaboration, which practice most effectively ensures asynchronous transparency across distributed teams?',
    options: [
      'Sending private direct messages for every status update',
      'Maintaining public documented sprint boards and decision logs',
      'Scheduling daily mandatory 2-hour video calls',
      'Restricting file sharing permissions to managers only'
    ],
    correctIndex: 1,
    explanation: 'Publicly documented boards and decision records empower all stakeholders to inspect progress asynchronously without interruption.'
  },
  {
    id: 2,
    question: 'When implementing AI tools in educational content creation, what is the most critical safeguard?',
    options: [
      'Publishing generated answers immediately to save time',
      'Using the longest possible prompts regardless of context',
      'Human-in-the-loop expert review and verifiable curriculum citations',
      'Never testing the output on actual students'
    ],
    correctIndex: 2,
    explanation: 'Human-in-the-loop validation prevents inaccuracies, hallucinations, and biases from reaching learners.'
  },
  {
    id: 3,
    question: 'What is the core philosophy of CAPACITY CONNECT digital capacity building?',
    options: [
      'Solo competition where only the top 1% receive support',
      'Rigid rote memorization with static annual PDF exams',
      'Collaborative, continuous, and competency-driven student empowerment',
      'Administrative tracking without learner feedback'
    ],
    correctIndex: 2,
    explanation: 'CAPACITY CONNECT focuses on friendly, student-centered, competency-driven lifelong learning.'
  }
];
