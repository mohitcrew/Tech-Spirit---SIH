import React, { useState, useEffect } from 'react';
import {
  Trophy, Flame, Clock, Calendar, Users, Award, Sparkles,
  Search, Filter, ArrowRight, CheckCircle2, AlertCircle,
  ExternalLink, Github, Code2, Globe, Shield, Rocket,
  ChevronRight, Check, X, FileText, Send, Star, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export interface Contest {
  id: string;
  title: string;
  problemStatementId?: string;
  organizer: string;
  organizerLogo?: string;
  category: 'Climate & Meteorology' | 'AI & Data Science' | 'Cybersecurity' | 'EdTech & Capacity';
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  deadline: string;
  startsAt?: string;
  prizePool: string;
  xpReward: number;
  participantsCount: number;
  teamSize: string;
  level: 'All Levels' | 'Intermediate' | 'Advanced';
  tags: string[];
  bannerGradient: string;
  accentColor: string;
  description: string;
  problemOverview: string;
  keyObjectives: string[];
  deliverables: string[];
  evaluationRubric: { criteria: string; weight: number }[];
  winnerTeam?: {
    name: string;
    members: string[];
    institution: string;
    repoUrl: string;
    rank: number;
    score: string;
  };
}

const CONTESTS_DATA: Contest[] = [
  {
    id: 'sih-moes-2026',
    title: 'Smart India Hackathon 2026: MoES Capacity Intelligence Grand Challenge',
    problemStatementId: 'SIH26075',
    organizer: 'Ministry of Earth Sciences (MoES) & IMD',
    category: 'Climate & Meteorology',
    status: 'LIVE',
    deadline: '2026-09-24T23:59:59',
    prizePool: '₹1,50,000 + Incubation Grant',
    xpReward: 2500,
    participantsCount: 428,
    teamSize: 'Team of 1 - 4',
    level: 'Intermediate',
    tags: ['SIH 2026', 'MoES / IMD Official', 'Disaster Resilience', 'High Priority'],
    bannerGradient: 'from-blue-700 via-indigo-700 to-cyan-600',
    accentColor: '#2563eb',
    description: 'Design and prototype a high-throughput capacity building and early warning intelligence platform for meteorology trainees and district disaster response teams.',
    problemOverview: 'Modern weather and cyclone prediction generates massive volumes of radar telemetry and numerical simulations. Front-line trainees and civil defence officers require deterministic competency pathways, rapid scenario testing, and offline-resilient alerts to act on time.',
    keyObjectives: [
      'Architect a modular LMS foundation with role-based competency mapping (Trainee, Trainer, Admin).',
      'Integrate real-time Doppler radar & numerical weather simulation course modules.',
      'Ensure responsive, accessible performance on desktop, tablet, and low-bandwidth mobile networks.',
      'Provide server-evaluated competency assessments and cryptographically verifiable certificates.'
    ],
    deliverables: [
      'Working web prototype repository with clear installation scripts',
      'Architecture diagram demonstrating RBAC and offline resilience',
      'Sample datasets representing regional cyclone and monsoon alerts',
      '3-minute walkthrough video demonstrating end-to-end user journeys'
    ],
    evaluationRubric: [
      { criteria: 'Technical Architecture & Modularity', weight: 30 },
      { criteria: 'Relevance to MoES/IMD Capacity Guidelines', weight: 25 },
      { criteria: 'User Experience, Accessibility & Polish', weight: 25 },
      { criteria: 'Offline / Low-Bandwidth Resilience', weight: 20 }
    ]
  },
  {
    id: 'satellite-radar-sprint',
    title: 'National Satellite Doppler Radar & Big Data Telemetry Sprint',
    problemStatementId: 'MOES-BD-04',
    organizer: 'India Meteorological Department & INCOIS',
    category: 'AI & Data Science',
    status: 'LIVE',
    deadline: '2026-09-30T18:00:00',
    prizePool: '₹1,00,000 + Research Fellowship',
    xpReward: 1800,
    participantsCount: 294,
    teamSize: 'Solo or Pair (1 - 2)',
    level: 'Advanced',
    tags: ['Doppler Radar', 'Python', 'Geospatial AI', 'INCOIS'],
    bannerGradient: 'from-cyan-700 via-teal-700 to-blue-800',
    accentColor: '#0891b2',
    description: 'Develop automated anomaly detection models to detect sudden cloudburst events and high-velocity wind shears using multi-band Doppler radar datasets.',
    problemOverview: 'Participants will be provided with sample Doppler weather radar NetCDF datasets. The goal is to build an automated feature extraction pipeline that identifies microburst signatures 15 minutes before onset.',
    keyObjectives: [
      'Parse multi-dimensional radar reflectivities and radial velocities.',
      'Train lightweight machine learning models for early cloudburst classification.',
      'Generate instant GeoJSON alert zones for disaster management portals.'
    ],
    deliverables: [
      'Jupyter Notebook with reproducible training & evaluation pipeline',
      'FastAPI / REST prediction microservice',
      'Interactive radar sweep visualization dashboard'
    ],
    evaluationRubric: [
      { criteria: 'Model Precision, Recall & F1-Score', weight: 40 },
      { criteria: 'Inference Latency (< 500ms per sweep)', weight: 30 },
      { criteria: 'Data Preprocessing & Code Cleanliness', weight: 30 }
    ]
  },
  {
    id: 'govshield-ctf',
    title: 'Public Infrastructure Cyber Defense CTF (GovShield 2026)',
    problemStatementId: 'CERT-IN-CTF',
    organizer: 'National Critical Information Infrastructure (NCIIPC)',
    category: 'Cybersecurity',
    status: 'UPCOMING',
    startsAt: 'Starts in 4 days (Sep 20, 2026)',
    deadline: '2026-09-22T20:00:00',
    prizePool: '₹75,000 + Security Analyst Interviews',
    xpReward: 1500,
    participantsCount: 512,
    teamSize: 'Team of 1 - 3',
    level: 'All Levels',
    tags: ['Capture The Flag', 'DevSecOps', 'Zero-Trust', 'CERT-In'],
    bannerGradient: 'from-purple-800 via-violet-800 to-indigo-900',
    accentColor: '#7c3aed',
    description: 'Test your ethical hacking and defensive security skills by protecting simulated government public distribution and disaster reporting portals against APT scenarios.',
    problemOverview: 'GovShield challenges participants across 12 realistic capture-the-flag levels, ranging from API credential stuffing defense to SQL injection patching and TLS configuration.',
    keyObjectives: [
      'Conduct static and dynamic security assessments on sample portal endpoints.',
      'Identify and remediate OWASP Top 10 vulnerabilities in Express/NestJS services.',
      'Submit comprehensive mitigation playbooks for institutional administrators.'
    ],
    deliverables: [
      'Captured CTF Flag submissions with step-by-step cryptographic proofs',
      'Hardening script or patch diffs for target repositories'
    ],
    evaluationRubric: [
      { criteria: 'Speed and Accuracy of Captured Flags', weight: 50 },
      { criteria: 'Quality of Remediation Reports', weight: 30 },
      { criteria: 'Zero-Exploit Defense Strategy', weight: 20 }
    ]
  },
  {
    id: 'skillsync-microlearning',
    title: 'Climate Literacy & AI Tutoring Micro-Learning Hack',
    problemStatementId: 'CBC-EDTECH-09',
    organizer: 'Capacity Building Commission (CBC)',
    category: 'EdTech & Capacity',
    status: 'UPCOMING',
    startsAt: 'Starts in 12 days (Sep 28, 2026)',
    deadline: '2026-10-05T23:59:59',
    prizePool: '₹50,000 + Official Portal Integration',
    xpReward: 1200,
    participantsCount: 180,
    teamSize: 'Solo or Team (1 - 4)',
    level: 'All Levels',
    tags: ['Generative AI', 'Interactive Sims', 'EdTech', 'Open Source'],
    bannerGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    accentColor: '#059669',
    description: 'Create engaging, interactive 5-minute micro-learning modules that explain complex Earth Science and climate concepts to civil service recruits and school learners.',
    problemOverview: 'Help democratize scientific learning across India by building interactive, visual, or gamified learning snippets utilizing React and web canvas.',
    keyObjectives: [
      'Design a self-paced 5-minute module on monsoon thermodynamics or seismic waves.',
      'Incorporate interactive quizzes with instantaneous feedback loops.',
      'Support multi-lingual localization (Hindi & English).'
    ],
    deliverables: [
      'Deployable interactive SCORM / React component',
      'Curriculum mapping against NCERT / MoES standards'
    ],
    evaluationRubric: [
      { criteria: 'Instructional Design & Pedagogical Value', weight: 35 },
      { criteria: 'Interactive Engagement & Visual Feedback', weight: 35 },
      { criteria: 'Accessibility & Bilingual Usability', weight: 30 }
    ]
  },
  {
    id: 'cloud-resiliency-sprint',
    title: 'High-Concurrency Public Cloud Resiliency Challenge',
    problemStatementId: 'NIC-CLOUD-01',
    organizer: 'National Informatics Center & SkillSync',
    category: 'AI & Data Science',
    status: 'COMPLETED',
    deadline: '2026-09-10T23:59:59',
    prizePool: '₹50,000 Awarded',
    xpReward: 2000,
    participantsCount: 360,
    teamSize: 'Team of 2 - 4',
    level: 'Advanced',
    tags: ['Kubernetes', 'Redis', 'Chaos Engineering', 'Completed'],
    bannerGradient: 'from-slate-700 via-slate-800 to-zinc-900',
    accentColor: '#475569',
    description: 'Benchmarked public learning portal infrastructures under 100,000 simultaneous connections during peak disaster advisory release simulations.',
    problemOverview: 'Teams built stress-tested clusters and cache invalidation strategies that sustained zero-downtime under simulated traffic surges.',
    keyObjectives: [
      'Build auto-scaling Kubernetes deployments.',
      'Implement multi-tier distributed caching with Redis.',
      'Demonstrate failover within 2 seconds during pod crashes.'
    ],
    deliverables: [
      'Terraform / Helm deployment scripts',
      'Locust / k6 benchmark load test results'
    ],
    evaluationRubric: [
      { criteria: 'Zero-Downtime Resilience', weight: 50 },
      { criteria: 'Resource Optimization & Cost Efficiency', weight: 30 },
      { criteria: 'Documentation & Observability Dashboards', weight: 20 }
    ],
    winnerTeam: {
      name: 'Team Tech-Spirit',
      members: ['Yandrapu Bhavish', 'Ande Mohiteswara', 'Dindi Keerthi Priya', 'Tanmayi Sigatapu'],
      institution: 'National Institute of Technology',
      repoUrl: 'https://github.com/mohitcrew/Tech-Spirit---SIH',
      rank: 1,
      score: '98.6 / 100'
    }
  }
];

export default function Contests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { pushNotification } = useNotifications();
  
  // Modal states
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [registeredContests, setRegisteredContests] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('cc_registered_contests');
      return saved ? JSON.parse(saved) : { 'sih-moes-2026': true };
    } catch {
      return { 'sih-moes-2026': true };
    }
  });

  // Registration Form State
  const [teamType, setTeamType] = useState<'solo' | 'team'>('team');
  const [teamName, setTeamName] = useState(user?.name ? `${user.name.split(' ')[0]}'s Innovators` : 'Tech Pioneers');
  const [regSuccess, setRegSuccess] = useState(false);

  // Submission Form State
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleRegister = (contestId: string) => {
    const updated = { ...registeredContests, [contestId]: true };
    setRegisteredContests(updated);
    localStorage.setItem('cc_registered_contests', JSON.stringify(updated));
    setRegSuccess(true);
    
    // Live in-website notification alert!
    pushNotification({
      title: '🔥 Contest Registration Confirmed!',
      message: `You are officially registered for ${selectedContest?.title || 'SIH Challenge'}. +200 XP unlocked!`,
      type: 'CONTEST',
      link: '/trainee/contests',
      badge: 'Registered',
    });

    setTimeout(() => {
      setRegSuccess(false);
      setIsRegisterOpen(false);
    }, 2000);
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);

    // Live in-website notification alert!
    pushNotification({
      title: '🚀 Project Solution Submitted!',
      message: `Your repo & architecture brief for ${selectedContest?.title || 'Contest'} has been submitted for evaluation.`,
      type: 'CONTEST',
      link: '/trainee/contests',
      badge: 'Under Review',
    });

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitOpen(false);
      setRepoUrl('');
      setDemoUrl('');
      setSubmissionNotes('');
    }, 2200);
  };

  const filteredContests = CONTESTS_DATA.filter((c) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'LIVE' && c.status === 'LIVE') ||
      (activeTab === 'UPCOMING' && c.status === 'UPCOMING') ||
      (activeTab === 'COMPLETED' && c.status === 'COMPLETED');

    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;

    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.problemStatementId && c.problemStatementId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Climate & Meteorology', 'AI & Data Science', 'Cybersecurity', 'EdTech & Capacity'];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* ── Top Hero Banner ──────────────────────────────────────────────── */}
      <div className="page-header-banner relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3 text-white" style={{ color: '#ffffff' }}>
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="text-white" style={{ color: '#ffffff' }}>National Capacity & Innovation Challenges</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white" style={{ color: '#ffffff' }}>
              SkillSync Competitions & Hackathons
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed" style={{ color: '#dbeafe' }}>
              Tackle real-world challenges posed by the Ministry of Earth Sciences (MoES), IMD, and partner institutions. 
              Build innovative prototypes, earn verifiable SkillSync XP, win incubation grants, and gain national recognition for Smart India Hackathon 2026.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>₹4,25,000+ Prize Grant Pool</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-300" />
                <span>1,420+ Registered Trainees</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-300" />
                <span>Verified Ministry Badges</span>
              </div>
            </div>
          </div>

          {/* Quick Highlight Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex-shrink-0 w-full lg:w-80 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Featured Challenge
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">
                Ending Soon
              </span>
            </div>
            <h4 className="font-extrabold text-sm line-clamp-2">
              Smart India Hackathon 2026 (MoES SIH26075)
            </h4>
            <p className="text-[11px] text-blue-100 mt-1 line-clamp-2">
              Early warning intelligence & modular LMS architecture.
            </p>
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-blue-200 uppercase font-bold">Prize Pool</div>
                <div className="text-sm font-black text-amber-300">₹1,50,000</div>
              </div>
              <button
                onClick={() => {
                  setSelectedContest(CONTESTS_DATA[0]);
                  setIsRegisterOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                style={{ color: '#1d4ed8', backgroundColor: '#ffffff' }}
              >
                <span style={{ color: '#1d4ed8', fontWeight: 800 }}>
                  {registeredContests['sih-moes-2026'] ? 'View Details' : 'Join Track'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ──────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Contests', count: CONTESTS_DATA.length },
            { id: 'LIVE', label: '🔥 Live Now', count: CONTESTS_DATA.filter(c => c.status === 'LIVE').length },
            { id: 'UPCOMING', label: '⏳ Upcoming', count: CONTESTS_DATA.filter(c => c.status === 'UPCOMING').length },
            { id: 'COMPLETED', label: '🏆 Hall of Fame', count: CONTESTS_DATA.filter(c => c.status === 'COMPLETED').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar & Category Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, SIH ID, tech..."
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Contests Grid ─────────────────────────────────────────────────── */}
      {filteredContests.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No Contests Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filter criteria to discover other government and institutional challenges.
          </p>
          <button
            onClick={() => {
              setActiveTab('ALL');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContests.map((contest) => {
            const isRegistered = registeredContests[contest.id];
            const isLive = contest.status === 'LIVE';
            const isCompleted = contest.status === 'COMPLETED';

            return (
              <div
                key={contest.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Top Decorative Header */}
                  <div className={`p-5 bg-gradient-to-r ${contest.bannerGradient} text-white relative`}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
                        {contest.category}
                      </span>

                      {/* Status Tag */}
                      {isLive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          Live Now
                        </span>
                      )}
                      {contest.status === 'UPCOMING' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                          Upcoming
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                          Finished
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base leading-snug line-clamp-2">
                      {contest.title}
                    </h3>

                    <div className="text-[11px] text-blue-100 font-medium mt-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{contest.organizer}</span>
                      {contest.problemStatementId && (
                        <span className="px-1.5 py-0.2 rounded bg-black/25 text-[10px] font-mono">
                          {contest.problemStatementId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {contest.description}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Prize Grant</div>
                        <div className="text-xs font-black text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                          {contest.prizePool}
                        </div>
                      </div>
                      <div className="border-l border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">XP Award</div>
                        <div className="text-xs font-black text-amber-500 mt-0.5 flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>+{contest.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1.5">
                      {contest.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Logistics Row */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{contest.startsAt || `Deadline: ${new Date(contest.deadline).toLocaleDateString()}`}</span>
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {contest.teamSize}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{contest.participantsCount} participants</span>
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          {contest.level}
                        </span>
                      </div>
                    </div>

                    {/* Winner Callout if Completed */}
                    {contest.winnerTeam && (
                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                          🥇
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Winning Team</div>
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {contest.winnerTeam.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {contest.winnerTeam.institution} ({contest.winnerTeam.score})
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedContest(contest)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Problem Details</span>
                    </button>

                    {isLive && (
                      isRegistered ? (
                        <button
                          onClick={() => {
                            setSelectedContest(contest);
                            setIsSubmitOpen(true);
                          }}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Solution</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedContest(contest);
                            setIsRegisterOpen(true);
                          }}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          <span>Register Now</span>
                        </button>
                      )
                    )}

                    {contest.status === 'UPCOMING' && (
                      <button
                        onClick={() => {
                          setSelectedContest(contest);
                          setIsRegisterOpen(true);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isRegistered
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Pre-Registered</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Pre-Register</span>
                          </>
                        )}
                      </button>
                    )}

                    {isCompleted && contest.winnerTeam && (
                      <a
                        href={contest.winnerTeam.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>View Project</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Why Participate Institutional Value Section ─────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div className="max-w-xl mb-6">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            Institutional Career Acceleration
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Why Participate in SkillSync Contests?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Competitions on SkillSync are vetted by national institutions to transform classroom learning into verifiable public capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Ministry Recognition</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Top finalists receive official letters of commendation from MoES, IMD, or CBC, directly boosting placement credentials.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Incubation & Grants</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Selected prototypes are granted institutional compute credits and mentorship to deploy live in smart city and IMD centres.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Verifiable Credentials</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Every submission is evaluated against rigorous rubrics, automatically issuing verified digital badges to your profile.
            </p>
          </div>
        </div>
      </div>

      {/* ── Modal 1: Contest Details & Problem Statement ──────────────────── */}
      {selectedContest && !isRegisterOpen && !isSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <div className={`p-6 bg-gradient-to-r ${selectedContest.bannerGradient} text-white relative`}>
              <button
                onClick={() => setSelectedContest(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase mb-2">
                <span>{selectedContest.category}</span>
                <span>&bull;</span>
                <span>{selectedContest.status}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{selectedContest.title}</h2>
              <div className="text-xs text-blue-100 mt-1 flex items-center gap-2">
                <span>{selectedContest.organizer}</span>
                {selectedContest.problemStatementId && (
                  <span className="px-1.5 py-0.5 rounded bg-black/30 font-mono">
                    ID: {selectedContest.problemStatementId}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6 text-slate-700 dark:text-slate-300">
              {/* Problem Statement Overview */}
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Problem Statement Overview
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedContest.problemOverview}
                </p>
              </div>

              {/* Key Objectives */}
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Key Technical Objectives
                </h4>
                <ul className="space-y-2">
                  {selectedContest.keyObjectives.map((obj, i) => (
                    <li key={i} className="text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Required Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedContest.deliverables.map((del, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                      {del}
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluation Rubric */}
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Evaluation Rubric & Weightage
                </h4>
                <div className="space-y-2">
                  {selectedContest.evaluationRubric.map((rub, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{rub.criteria}</span>
                      <span className="font-black text-blue-600 dark:text-blue-400">{rub.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedContest(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Close
                </button>

                {selectedContest.status === 'LIVE' && (
                  registeredContests[selectedContest.id] ? (
                    <button
                      onClick={() => setIsSubmitOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Solution</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsRegisterOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Rocket className="w-4 h-4" />
                      <span>Register for this Challenge</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: One-Click Registration Modal ────────────────────────── */}
      {isRegisterOpen && selectedContest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Challenge Registration
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedContest.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {regSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Registration Confirmed!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  You are officially enrolled in <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedContest.title}</span>. +250 XP has been credited to your profile!
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {/* Participation Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Participation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTeamType('solo')}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        teamType === 'solo'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="font-black text-sm">Solo Participant</div>
                      <div className="text-[10px] font-normal text-slate-500 mt-0.5">Compete individually</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTeamType('team')}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        teamType === 'team'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="font-black text-sm">Team Challenge</div>
                      <div className="text-[10px] font-normal text-slate-500 mt-0.5">Collaborate with peers</div>
                    </button>
                  </div>
                </div>

                {teamType === 'team' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Climate Intelligence Pioneers"
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Lead Participant
                  </label>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white">{user?.name || 'Trainee Participant'}</div>
                    <div className="text-[11px] text-slate-500">{user?.email || 'trainee@skillsync.demo'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    By registering, your project will be eligible for evaluation by MoES mentors and will receive continuous feedback before the final submission deadline.
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRegister(selectedContest.id)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    Confirm Registration (+250 XP)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal 3: Solution Submission Modal ────────────────────────────── */}
      {isSubmitOpen && selectedContest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Submit Challenge Deliverables
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedContest.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Submission Received!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your project has been queued for jury evaluation. You will receive an email notification when scores and feedback are posted.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProject} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    GitHub Repository Link *
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/mohitcrew/Tech-Spirit---SIH"
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Live Demo / Hosted Deployment URL
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://skillsync-demo.vercel.app or http://localhost:5173"
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Technical Highlights & Approach Summary
                  </label>
                  <textarea
                    rows={3}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Briefly describe your architecture, offline resilience features, and how you solved the problem statement..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm & Submit</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
