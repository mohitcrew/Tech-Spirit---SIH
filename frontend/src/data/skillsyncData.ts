export interface PublicCourse {
  id: string;
  title: string;
  category: string;
  sector: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  learningMode: 'Self-Paced' | 'Cohort-Based' | 'Hybrid Workshop';
  techStack: string[];
  competencies: string[];
  trainerName: string;
  trainerRole: string;
  trainerAvatar: string;
  rating: number;
  reviewsCount: number;
  enrolledCount: number;
  gradient: string;
  description: string;
  syllabus: Array<{ module: string; topics: string[] }>;
}

export interface PublicSkill {
  id: string;
  name: string;
  category: 'Programming' | 'Data' | 'Cloud & DevOps' | 'Cybersecurity' | 'Leadership';
  relatedRoles: string[];
  relatedCompetencies: string[];
  recommendedCourse: string;
  learnersCount: number;
}

export interface PublicCompetency {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  relatedSkills: string[];
  relatedRoles: string[];
  benchmarkScore: number;
  growthPill: string;
}

export interface PublicTrainer {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatar: string;
  expertise: string[];
  experienceYears: number;
  competencies: string[];
  rating: number;
  studentsTrained: number;
  coursesCount: number;
  availability: 'Open for Cohorts' | 'Mentorship Only' | 'Full';
}

export interface SectorItem {
  id: string;
  name: string;
  icon: string;
  status: 'Prototype Available' | 'Configurable Domain' | 'Coming Soon';
  description: string;
  rolesCount: number;
  skillsCount: number;
  sampleRoles: string[];
  accentColor: string;
}

export interface KnowledgeResource {
  id: string;
  title: string;
  type: 'Recorded Lecture' | 'Presentation' | 'Study Material' | 'Research Guide' | 'Documentation';
  author: string;
  sector: string;
  readTime: string;
  downloadsCount: number;
  icon: string;
  tag: string;
}

/* ==========================================================================
   PUBLIC SKILLSYNC PROTOTYPE DATASET
   ========================================================================== */

export const publicCourses: PublicCourse[] = [
  {
    id: 'c-fs-101',
    title: 'Full Stack Development with React, TypeScript & Node.js',
    category: 'Software Engineering',
    sector: 'IT & Digital',
    level: 'Intermediate',
    duration: '8 Weeks',
    learningMode: 'Cohort-Based',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    competencies: ['Web Engineering', 'API Integration', 'Full-Stack Architecture'],
    trainerName: 'Dr. Arun Verma',
    trainerRole: 'Head of Emerging Technologies',
    trainerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 4.92,
    reviewsCount: 148,
    enrolledCount: 340,
    gradient: 'from-blue-600 via-indigo-600 to-blue-800',
    description: 'Build production-ready web apps with clean architecture, strict TypeScript schemas, and performant REST APIs.',
    syllabus: [
      { module: 'Module 1: Modern Frontend Architecture', topics: ['Component composition', 'State patterns', 'Design tokens'] },
      { module: 'Module 2: Server-Side REST & DBs', topics: ['Node/Express', 'PostgreSQL migrations', 'Prisma ORM'] },
      { module: 'Module 3: Production Deployment', topics: ['Docker containers', 'CI/CD pipeline', 'Cloud hosting'] },
    ],
  },
  {
    id: 'c-cloud-201',
    title: 'Cloud Systems Architecture & Kubernetes DevOps',
    category: 'Cloud & Infrastructure',
    sector: 'IT & Digital',
    level: 'Advanced',
    duration: '10 Weeks',
    learningMode: 'Hybrid Workshop',
    techStack: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Prometheus'],
    competencies: ['Cloud Systems Engineering', 'DevOps Automation', 'Site Reliability'],
    trainerName: 'Alex Rivera',
    trainerRole: 'Principal Cloud Architect',
    trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewsCount: 112,
    enrolledCount: 220,
    gradient: 'from-sky-600 via-indigo-700 to-purple-800',
    description: 'Design resilient distributed infrastructure with container orchestration, infrastructure-as-code, and automated scaling.',
    syllabus: [
      { module: 'Module 1: Container Orchestration', topics: ['Pod lifecycles', 'ConfigMaps', 'Ingress controllers'] },
      { module: 'Module 2: Infrastructure as Code', topics: ['Terraform state', 'Modular VPCs', 'Security policies'] },
      { module: 'Module 3: Observability & Resilience', topics: ['Metrics monitoring', 'Log aggregation', 'Chaos recovery'] },
    ],
  },
  {
    id: 'c-ds-301',
    title: 'Data Science, Predictive Modeling & Machine Learning',
    category: 'Data & AI',
    sector: 'IT & Digital',
    level: 'Intermediate',
    duration: '6 Weeks',
    learningMode: 'Cohort-Based',
    techStack: ['Python', 'SQL', 'Scikit-Learn', 'Pandas', 'FastAPI'],
    competencies: ['Data Science', 'Predictive Modeling', 'Statistical Analysis'],
    trainerName: 'Prof. Vikram Rao',
    trainerRole: 'AI Ethics & EdTech Researcher',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    rating: 4.88,
    reviewsCount: 185,
    enrolledCount: 410,
    gradient: 'from-emerald-600 via-teal-700 to-blue-800',
    description: 'Master exploratory data pipelines, statistical hypothesis testing, and operationalized machine learning models.',
    syllabus: [
      { module: 'Module 1: Statistical Foundations', topics: ['Distributions', 'Feature engineering', 'Correlation testing'] },
      { module: 'Module 2: Predictive Modeling', topics: ['Regression', 'Decision forests', 'Ensemble classifiers'] },
      { module: 'Module 3: ML API Serving', topics: ['Model serialization', 'Inference APIs', 'Drift monitoring'] },
    ],
  },
  {
    id: 'c-sec-401',
    title: 'Cybersecurity Defense & Zero-Trust Protocol Analysis',
    category: 'Cybersecurity',
    sector: 'IT & Digital',
    level: 'Advanced',
    duration: '8 Weeks',
    learningMode: 'Self-Paced',
    techStack: ['Wireshark', 'Kali Linux', 'OAuth 2.0', 'SIEM', 'Cryptography'],
    competencies: ['Cybersecurity Defense', 'Threat Analysis', 'Identity & Access'],
    trainerName: 'Sarah Jenkins',
    trainerRole: 'Security Systems Specialist',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    rating: 4.86,
    reviewsCount: 94,
    enrolledCount: 195,
    gradient: 'from-purple-600 via-pink-700 to-slate-900',
    description: 'Defend organizational digital perimeter through real-world threat vectors, intrusion analysis, and zero-trust IAM.',
    syllabus: [
      { module: 'Module 1: Network Packet Forensics', topics: ['Protocol handshakes', 'Deep packet inspection', 'Anomaly triage'] },
      { module: 'Module 2: Zero-Trust Implementation', topics: ['Least privilege', 'Microsegmentation', 'mTLS handshakes'] },
      { module: 'Module 3: Incident Response Simulation', topics: ['Breach containment', 'Forensic timeline', 'Remediation briefs'] },
    ],
  },
  {
    id: 'c-ai-501',
    title: 'Generative AI Systems & Prompt Engineering for Workflows',
    category: 'Innovation',
    sector: 'IT & Digital',
    level: 'Beginner',
    duration: '4 Weeks',
    learningMode: 'Self-Paced',
    techStack: ['Python', 'OpenAI API', 'LangChain', 'Vector DBs', 'JSON Schema'],
    competencies: ['Generative AI Systems', 'Automation Design', 'AI Ethics'],
    trainerName: 'Prof. Vikram Rao',
    trainerRole: 'AI Ethics & EdTech Researcher',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    rating: 4.97,
    reviewsCount: 240,
    enrolledCount: 580,
    gradient: 'from-amber-500 via-orange-600 to-rose-700',
    description: 'Harness LLMs, structured outputs, RAG retrieval architectures, and evaluation harnesses to supercharge productivity.',
    syllabus: [
      { module: 'Module 1: Prompt Principles', topics: ['Few-shot learning', 'Structured JSON schemas', 'Guardrails'] },
      { module: 'Module 2: Retrieval Augmented Generation', topics: ['Embeddings', 'Vector databases', 'Context ranking'] },
      { module: 'Module 3: AI Safety & Governance', topics: ['Hallucination auditing', 'Privacy filters', 'Human-in-the-loop'] },
    ],
  },
  {
    id: 'c-lead-601',
    title: 'Agile Engineering Leadership & Cross-Team Delivery',
    category: 'Leadership & Management',
    sector: 'IT & Digital',
    level: 'Intermediate',
    duration: '5 Weeks',
    learningMode: 'Cohort-Based',
    techStack: ['Jira', 'Miro', 'OKRs', 'System Design Logs', 'Async Docs'],
    competencies: ['Technical Leadership', 'Agile Delivery', 'Team Coaching'],
    trainerName: 'David Chen',
    trainerRole: 'Agile Transformation Coach',
    trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 4.89,
    reviewsCount: 78,
    enrolledCount: 160,
    gradient: 'from-cyan-600 via-blue-700 to-indigo-800',
    description: 'Transform from a solo contributor into a trusted team multiplier, mastering delegation, psychological safety, and velocity.',
    syllabus: [
      { module: 'Module 1: The Multiplier Mindset', topics: ['Active listening', 'Blameless retrospectives', 'Cognitive safety'] },
      { module: 'Module 2: Cross-Functional Velocity', topics: ['Roadmap negotiation', 'Technical debt triage', 'Team velocity'] },
      { module: 'Module 3: Strategic Executive Pitching', topics: ['Stakeholder alignment', 'Value storytelling', 'KPI impact metrics'] },
    ],
  },
];

export const publicSkills: PublicSkill[] = [
  // Programming
  { id: 'sk-1', name: 'JavaScript', category: 'Programming', relatedRoles: ['Frontend Engineer', 'Full-Stack Developer'], relatedCompetencies: ['Web Engineering'], recommendedCourse: 'Full Stack Development', learnersCount: 1420 },
  { id: 'sk-2', name: 'TypeScript', category: 'Programming', relatedRoles: ['Full-Stack Developer', 'Software Architect'], relatedCompetencies: ['Web Engineering', 'API Integration'], recommendedCourse: 'Full Stack Development', learnersCount: 1150 },
  { id: 'sk-3', name: 'Python', category: 'Programming', relatedRoles: ['Data Scientist', 'AI/ML Engineer', 'Backend Dev'], relatedCompetencies: ['Data Science', 'Generative AI Systems'], recommendedCourse: 'Data Science & Machine Learning', learnersCount: 1890 },
  { id: 'sk-4', name: 'Go / Golang', category: 'Programming', relatedRoles: ['Cloud Systems Engineer', 'Backend Specialist'], relatedCompetencies: ['Cloud Systems Engineering'], recommendedCourse: 'Cloud Systems Architecture', learnersCount: 640 },

  // Data
  { id: 'sk-5', name: 'SQL', category: 'Data', relatedRoles: ['Data Analyst', 'Data Engineer', 'Product Manager'], relatedCompetencies: ['Data Science', 'Statistical Analysis'], recommendedCourse: 'Data Science & Machine Learning', learnersCount: 1650 },
  { id: 'sk-6', name: 'Data Analysis', category: 'Data', relatedRoles: ['Business Analyst', 'Data Scientist'], relatedCompetencies: ['Data Science', 'Predictive Modeling'], recommendedCourse: 'Data Science & Machine Learning', learnersCount: 1210 },
  { id: 'sk-7', name: 'Machine Learning', category: 'Data', relatedRoles: ['ML Engineer', 'AI Researcher'], relatedCompetencies: ['Data Science', 'Predictive Modeling'], recommendedCourse: 'Data Science & Machine Learning', learnersCount: 1390 },
  { id: 'sk-8', name: 'Data Pipelines (ETL)', category: 'Data', relatedRoles: ['Data Engineer', 'Big Data Specialist'], relatedCompetencies: ['Data Science'], recommendedCourse: 'Data Science & Machine Learning', learnersCount: 780 },

  // Cloud & DevOps
  { id: 'sk-9', name: 'Docker', category: 'Cloud & DevOps', relatedRoles: ['DevOps Engineer', 'Cloud Architect'], relatedCompetencies: ['Cloud Systems Engineering'], recommendedCourse: 'Cloud Systems Architecture', learnersCount: 1450 },
  { id: 'sk-10', name: 'Kubernetes', category: 'Cloud & DevOps', relatedRoles: ['Cloud Systems Engineer', 'SRE'], relatedCompetencies: ['Cloud Systems Engineering', 'DevOps Automation'], recommendedCourse: 'Cloud Systems Architecture', learnersCount: 980 },
  { id: 'sk-11', name: 'AWS / Azure', category: 'Cloud & DevOps', relatedRoles: ['Cloud Architect', 'Systems Engineer'], relatedCompetencies: ['Cloud Systems Engineering'], recommendedCourse: 'Cloud Systems Architecture', learnersCount: 1620 },
  { id: 'sk-12', name: 'CI/CD Pipelines', category: 'Cloud & DevOps', relatedRoles: ['Release Manager', 'DevOps Specialist'], relatedCompetencies: ['DevOps Automation'], recommendedCourse: 'Cloud Systems Architecture', learnersCount: 890 },

  // Cybersecurity
  { id: 'sk-13', name: 'Zero-Trust IAM', category: 'Cybersecurity', relatedRoles: ['Security Architect', 'Cyber Analyst'], relatedCompetencies: ['Cybersecurity Defense'], recommendedCourse: 'Cybersecurity Defense', learnersCount: 520 },
  { id: 'sk-14', name: 'Penetration Testing', category: 'Cybersecurity', relatedRoles: ['Ethical Hacker', 'SecOps Engineer'], relatedCompetencies: ['Threat Analysis'], recommendedCourse: 'Cybersecurity Defense', learnersCount: 610 },
  { id: 'sk-15', name: 'Cryptography', category: 'Cybersecurity', relatedRoles: ['Security Researcher', 'Blockchain Engineer'], relatedCompetencies: ['Cybersecurity Defense'], recommendedCourse: 'Cybersecurity Defense', learnersCount: 440 },

  // Leadership
  { id: 'sk-16', name: 'Agile & Scrum', category: 'Leadership', relatedRoles: ['Scrum Master', 'Engineering Manager'], relatedCompetencies: ['Technical Leadership'], recommendedCourse: 'Agile Engineering Leadership', learnersCount: 1100 },
  { id: 'sk-17', name: 'Technical Writing', category: 'Leadership', relatedRoles: ['Staff Engineer', 'Product Lead'], relatedCompetencies: ['Technical Leadership'], recommendedCourse: 'Agile Engineering Leadership', learnersCount: 820 },
  { id: 'sk-18', name: 'Cross-Team Mentorship', category: 'Leadership', relatedRoles: ['Tech Lead', 'Director'], relatedCompetencies: ['Team Coaching'], recommendedCourse: 'Agile Engineering Leadership', learnersCount: 670 },
];

export const publicCompetencies: PublicCompetency[] = [
  {
    id: 'comp-1',
    title: 'Data Science & Predictive Intelligence',
    level: 'Intermediate',
    description: 'Transform raw institutional telemetry into predictive forecasts, anomaly detection models, and decision-support dashboards.',
    relatedSkills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Pandas'],
    relatedRoles: ['Data Analyst', 'Data Scientist', 'ML Operations Engineer'],
    benchmarkScore: 82,
    growthPill: '+18% Industry Demand',
  },
  {
    id: 'comp-2',
    title: 'Cloud Systems Engineering & Microservices',
    level: 'Advanced',
    description: 'Architect, configure, and operate resilient containerized systems with high availability and self-healing infrastructure.',
    relatedSkills: ['Kubernetes', 'Docker', 'AWS', 'Linux', 'Terraform'],
    relatedRoles: ['Cloud Architect', 'DevOps Specialist', 'Site Reliability Engineer'],
    benchmarkScore: 78,
    growthPill: '+24% Capacity Urgency',
  },
  {
    id: 'comp-3',
    title: 'Full Stack Web & API Engineering',
    level: 'Intermediate',
    description: 'Deliver responsive, accessible user interfaces backed by scalable schema-safe REST/GraphQL services and databases.',
    relatedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    relatedRoles: ['Frontend Developer', 'Full-Stack Engineer', 'Web Architect'],
    benchmarkScore: 88,
    growthPill: '+15% Core Requirement',
  },
  {
    id: 'comp-4',
    title: 'Cybersecurity Defense & Protocol Integrity',
    level: 'Advanced',
    description: 'Audit digital systems against zero-day exposures, enforce zero-trust access controls, and coordinate incident response.',
    relatedSkills: ['Zero-Trust IAM', 'Network Forensics', 'Cryptography', 'SIEM'],
    relatedRoles: ['Security Analyst', 'Information Security Officer', 'SecOps Lead'],
    benchmarkScore: 71,
    growthPill: '+30% Critical Need',
  },
  {
    id: 'comp-5',
    title: 'Generative AI Integration & Prompt Systems',
    level: 'Intermediate',
    description: 'Embed foundation models safely into business workflows using structured schemas, RAG pipelines, and hallucination guardrails.',
    relatedSkills: ['Python', 'OpenAI / Anthropic APIs', 'LangChain', 'Vector DBs'],
    relatedRoles: ['AI Application Engineer', 'Innovation Fellow', 'Automation Specialist'],
    benchmarkScore: 84,
    growthPill: '+45% Emerging Trajectory',
  },
  {
    id: 'comp-6',
    title: 'Technical Leadership & Capacity Multiplication',
    level: 'Intermediate',
    description: 'Foster cross-departmental alignment, clear blockers, mentor early-career talent, and steer engineering delivery with agility.',
    relatedSkills: ['Agile Scrum', 'Team Coaching', 'System Design Logs', 'Async Culture'],
    relatedRoles: ['Tech Lead', 'Project Manager', 'Capacity Building Coordinator'],
    benchmarkScore: 75,
    growthPill: '+20% Organizational Value',
  },
];

export const publicTrainers: PublicTrainer[] = [
  {
    id: 'tr-1',
    name: 'Dr. Arun Verma',
    title: 'Head of Emerging Technologies',
    organization: 'Digital Innovation Council',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80',
    expertise: ['Full-Stack Architecture', 'TypeScript Systems', 'Cloud Infrastructure'],
    experienceYears: 12,
    competencies: ['Web Engineering', 'API Integration'],
    rating: 4.92,
    studentsTrained: 840,
    coursesCount: 14,
    availability: 'Open for Cohorts',
  },
  {
    id: 'tr-2',
    name: 'Prof. Vikram Rao',
    title: 'AI Ethics & EdTech Researcher',
    organization: 'Institute of Cognitive Computing',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=140&auto=format&fit=crop&q=80',
    expertise: ['Machine Learning', 'Generative AI', 'Predictive Modeling'],
    experienceYears: 15,
    competencies: ['Data Science', 'Generative AI Systems'],
    rating: 4.96,
    studentsTrained: 1250,
    coursesCount: 9,
    availability: 'Open for Cohorts',
  },
  {
    id: 'tr-3',
    name: 'Sarah Jenkins',
    title: 'Security Systems Specialist',
    organization: 'Cyber Resilience Frameworks',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=140&auto=format&fit=crop&q=80',
    expertise: ['Zero-Trust Architecture', 'Incident Forensics', 'Threat Analysis'],
    experienceYears: 10,
    competencies: ['Cybersecurity Defense', 'Threat Analysis'],
    rating: 4.88,
    studentsTrained: 620,
    coursesCount: 11,
    availability: 'Mentorship Only',
  },
  {
    id: 'tr-4',
    name: 'Alex Rivera',
    title: 'Principal Cloud Architect',
    organization: 'Global Infrastructure Alliance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80',
    expertise: ['Kubernetes Orchestration', 'Terraform IaC', 'SRE Practices'],
    experienceYears: 14,
    competencies: ['Cloud Systems Engineering', 'DevOps Automation'],
    rating: 4.94,
    studentsTrained: 910,
    coursesCount: 16,
    availability: 'Open for Cohorts',
  },
  {
    id: 'tr-5',
    name: 'David Chen',
    title: 'Agile Transformation Coach',
    organization: 'Capacity Leadership Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80',
    expertise: ['Agile Velocity', 'Cross-Functional Team Coaching', 'OKR Systems'],
    experienceYears: 9,
    competencies: ['Technical Leadership', 'Team Coaching'],
    rating: 4.85,
    studentsTrained: 480,
    coursesCount: 8,
    availability: 'Open for Cohorts',
  },
  {
    id: 'tr-6',
    name: 'Meera Nair',
    title: 'Senior Communications Lead',
    organization: 'Executive Presence Institute',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=140&auto=format&fit=crop&q=80',
    expertise: ['Stakeholder Pitching', 'Executive Briefings', 'Narrative Design'],
    experienceYears: 8,
    competencies: ['Technical Leadership', 'Communication'],
    rating: 4.9,
    studentsTrained: 730,
    coursesCount: 7,
    availability: 'Open for Cohorts',
  },
];

export const sectorsData: SectorItem[] = [
  {
    id: 'sec-it',
    name: 'IT & Digital Systems',
    icon: '💻',
    status: 'Prototype Available',
    description: 'Current live prototype demonstrating software development, cloud infrastructure, cybersecurity, and data intelligence workflows.',
    rolesCount: 18,
    skillsCount: 42,
    sampleRoles: ['Software Engineer', 'Data Scientist', 'Cloud Architect', 'Cybersecurity Lead', 'AI/ML Engineer'],
    accentColor: '#2563EB',
  },
  {
    id: 'sec-met',
    name: 'Meteorology & Atmospheric Science',
    icon: '🌦',
    status: 'Configurable Domain',
    description: 'Numerical weather prediction, Doppler radar interpretation, cyclone tracking, and seasonal climate telemetry.',
    rolesCount: 14,
    skillsCount: 36,
    sampleRoles: ['Meteorological Officer', 'Doppler Radar Analyst', 'Numerical Forecaster', 'Agro-Met Specialist'],
    accentColor: '#06B6D4',
  },
  {
    id: 'sec-ocean',
    name: 'Ocean Science & Marine Services',
    icon: '🌊',
    status: 'Coming Soon',
    description: 'Oceanographic buoyancy data, tsunami early warning telemetry, coastal bathymetry, and marine biogeochemistry.',
    rolesCount: 12,
    skillsCount: 28,
    sampleRoles: ['Physical Oceanographer', 'Tsunami Warning Analyst', 'Marine Acoustic Technician'],
    accentColor: '#0284C7',
  },
  {
    id: 'sec-earth',
    name: 'Earth System Science & Geosciences',
    icon: '🌍',
    status: 'Coming Soon',
    description: 'Seismological hazard mapping, satellite remote sensing, geomagnetic observations, and hydrological modeling.',
    rolesCount: 15,
    skillsCount: 32,
    sampleRoles: ['Seismologist', 'GIS Geospatial Analyst', 'Geomagnetism Fellow', 'Hydrological Modeler'],
    accentColor: '#10B981',
  },
  {
    id: 'sec-polar',
    name: 'Polar Science & Cryosphere',
    icon: '❄',
    status: 'Coming Soon',
    description: 'Antarctic & Arctic expedition data systems, ice core paleoclimatology, and glaciological monitoring.',
    rolesCount: 8,
    skillsCount: 22,
    sampleRoles: ['Glaciologist', 'Polar Remote Sensing Specialist', 'Sub-Zero Instrumentation Lead'],
    accentColor: '#8B5CF6',
  },
];

export const knowledgeResources: KnowledgeResource[] = [
  {
    id: 'res-1',
    title: 'Zero-Trust Architecture Implementation Guidelines in Public Systems',
    type: 'Documentation',
    author: 'Sarah Jenkins',
    sector: 'IT & Digital',
    readTime: '15 min read',
    downloadsCount: 412,
    icon: '🛡️',
    tag: 'Cybersecurity',
  },
  {
    id: 'res-2',
    title: 'Introduction to Distributed Cloud Telemetry and Microservice Observability',
    type: 'Recorded Lecture',
    author: 'Alex Rivera',
    sector: 'IT & Digital',
    readTime: '45 mins watch',
    downloadsCount: 890,
    icon: '🎥',
    tag: 'Cloud & SRE',
  },
  {
    id: 'res-3',
    title: 'High-Impact Predictive Modeling for Public Service Decisions',
    type: 'Study Material',
    author: 'Prof. Vikram Rao',
    sector: 'IT & Digital',
    readTime: '25 pages PDF',
    downloadsCount: 630,
    icon: '📊',
    tag: 'Data Science',
  },
  {
    id: 'res-4',
    title: 'Domain Engine Configuration: Decoupling Ontologies from LMS Platforms',
    type: 'Research Guide',
    author: 'SkillSync Core Architecture Team',
    sector: 'Platform Architecture',
    readTime: '20 min read',
    downloadsCount: 750,
    icon: '⚙️',
    tag: 'System Design',
  },
];
