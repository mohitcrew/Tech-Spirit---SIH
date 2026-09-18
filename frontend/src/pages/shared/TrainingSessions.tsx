import React, { useState } from 'react';
import {
  Video,
  Radio,
  Calendar,
  Clock,
  Users,
  PlusCircle,
  Play,
  ExternalLink,
  Copy,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Layers,
  Award,
  Download,
  Share2,
  BookOpen,
  X,
  Send,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LiveSession } from '../../data/capacityConnectData';
import { LiveSessionModal } from '../../components/modals/LiveSessionModal';
import { trainerCourses } from '../../data/trainerData';

interface SessionItem extends LiveSession {
  cohortName?: string;
  courseTitle?: string;
  duration?: string;
  recordingUrl?: string;
  recordingViews?: number;
  slidesUrl?: string;
  agenda?: string[];
  registeredLearners?: Array<{ name: string; org: string; avatar: string; attended: boolean }>;
}

const initialSessions: SessionItem[] = [
  {
    id: 's-live-101',
    title: 'AI Prompts for Educators & Instructional Design',
    date: 'Today, Live Now',
    time: '03:00 PM – 04:30 PM',
    trainer: 'Prof. Vikram Rao',
    trainerRole: 'AI Ethics & EdTech Researcher',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    participants: 72,
    sessionType: 'Live Masterclass',
    isLive: true,
    meetingLink: 'https://meet.capacityconnect.gov.in/ai-prompts-live',
    cohortName: 'Batch 2026-A',
    courseTitle: 'Generative AI Systems & Prompt Engineering for Workflows',
    duration: '90 Mins',
    agenda: [
      'Few-shot prompting for scientific curricula',
      'JSON Schema enforcement for automated grading',
      'Live Q&A and student prompt debugging'
    ],
    registeredLearners: [
      { name: 'A Mohit', org: 'IMD New Delhi', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=A%20Mohit', attended: true },
      { name: 'Priya Sharma', org: 'NCMRWF Noida', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80', attended: true },
      { name: 'Arjun Kulkarni', org: 'IMD Pune', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80', attended: true },
      { name: 'Sneha Chawla', org: 'MoES HQ', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&auto=format&fit=crop&q=80', attended: true },
    ]
  },
  {
    id: 's-rad-202',
    title: 'Dual-Polarization Doppler Radar Calibration Telemetry Clinic',
    date: 'Today',
    time: '05:00 PM – 06:30 PM',
    trainer: 'Prof. Vikram Rao',
    trainerRole: 'AI Ethics & EdTech Researcher',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    participants: 48,
    sessionType: 'Hands-on Lab Clinic',
    isLive: false,
    meetingLink: 'https://meet.capacityconnect.gov.in/radar-telemetry-clinic',
    cohortName: 'Batch 2026-B',
    courseTitle: 'Doppler Radar & Severe Weather Telemetry Analytics',
    duration: '90 Mins',
    agenda: [
      'Radar reflectivity calibration formulas',
      'KDP and ZDR parameter troubleshooting',
      'Interactive NetCDF telemetry script walkthrough'
    ],
    registeredLearners: [
      { name: 'A Mohit', org: 'IMD New Delhi', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=A%20Mohit', attended: false },
      { name: 'Suresh Patel', org: 'IMD Ahmedabad', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=60&auto=format&fit=crop&q=80', attended: false },
      { name: 'Divya Nair', org: 'NCESS', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80', attended: false },
    ]
  },
  {
    id: 's-com-303',
    title: 'Effective Communication & High-Impact Policy Briefs',
    date: 'Tomorrow, Oct 18',
    time: '11:00 AM – 12:30 PM',
    trainer: 'Meera Nair',
    trainerRole: 'Senior Communications Lead',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    participants: 65,
    sessionType: 'Interactive Workshop',
    isLive: false,
    meetingLink: 'https://meet.capacityconnect.gov.in/policy-briefs-clinic',
    cohortName: 'Executive Cohort',
    courseTitle: 'Professional Leadership & Scientific Briefs',
    duration: '90 Mins',
    agenda: [
      'Translating complex weather telemetry for ministry executives',
      'Structuring persuasive slide decks in 15 minutes',
      'Crisis communication fundamentals during cyclones'
    ],
    registeredLearners: []
  },
  {
    id: 's-hpc-404',
    title: 'Slurm Multi-Node MPI Job Profiling & Container Tuning',
    date: 'Monday, Oct 23',
    time: '10:00 AM – 11:30 AM',
    trainer: 'Prof. Vikram Rao',
    trainerRole: 'AI Ethics & EdTech Researcher',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    participants: 38,
    sessionType: 'Technical Masterclass',
    isLive: false,
    meetingLink: 'https://meet.capacityconnect.gov.in/hpc-mpi-clinic',
    cohortName: 'Batch 2026-C',
    courseTitle: 'Cloud Infrastructure & High Performance Climate Clusters',
    duration: '90 Mins',
    agenda: [
      'MPI communication latency diagnosis',
      'Singularity vs Docker runtime benchmarks on PARAM supercomputers',
      'Live job script debugging session'
    ],
    registeredLearners: []
  },
];

const recordedArchives: SessionItem[] = [
  {
    id: 'rec-01',
    title: 'Prompt Principles & RAG Vector Architecture Masterclass',
    date: '12 Oct 2026',
    time: 'Completed',
    trainer: 'Prof. Vikram Rao',
    trainerRole: 'Lead Instructor',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    participants: 94,
    sessionType: 'Recorded Masterclass',
    isLive: false,
    meetingLink: '#',
    cohortName: 'Batch 2026-A',
    courseTitle: 'Generative AI Systems & Prompt Engineering',
    duration: '84 Mins',
    recordingViews: 418,
    slidesUrl: 'ai_prompt_principles_oct2026.pdf',
  },
  {
    id: 'rec-02',
    title: 'Doppler Velocity De-aliasing & Severe Storm Meso-Analysis',
    date: '05 Oct 2026',
    time: 'Completed',
    trainer: 'Prof. Vikram Rao',
    trainerRole: 'Lead Instructor',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    participants: 82,
    sessionType: 'Recorded Workshop',
    isLive: false,
    meetingLink: '#',
    cohortName: 'Batch 2026-B',
    courseTitle: 'Doppler Radar & Severe Weather Telemetry Analytics',
    duration: '96 Mins',
    recordingViews: 340,
    slidesUrl: 'radar_dealiasing_algorithms.pdf',
  },
  {
    id: 'rec-03',
    title: 'Geospatial Heatmap Interpolation with GeoPandas',
    date: '28 Sep 2026',
    time: 'Completed',
    trainer: 'Prof. Vikram Rao',
    trainerRole: 'Lead Instructor',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    participants: 68,
    sessionType: 'Recorded Lab',
    isLive: false,
    meetingLink: '#',
    cohortName: 'Batch 2026-D',
    courseTitle: 'Geospatial Data Visualization with Python & QGIS',
    duration: '75 Mins',
    recordingViews: 295,
    slidesUrl: 'geopandas_spatial_interpolation.pdf',
  },
  {
    id: 'rec-04',
    title: 'Zero-Trust IAM and Perimeter Encryption in MoES Networks',
    date: '20 Sep 2026',
    time: 'Completed',
    trainer: 'Sarah Jenkins',
    trainerRole: 'Security Specialist',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    participants: 110,
    sessionType: 'Recorded Seminar',
    isLive: false,
    meetingLink: '#',
    cohortName: 'Ministry Security Track',
    courseTitle: 'Cybersecurity Defense & Zero-Trust Protocol Analysis',
    duration: '90 Mins',
    recordingViews: 580,
    slidesUrl: 'zero_trust_moes_architecture.pdf',
  },
];

export default function TrainingSessions() {
  const { user } = useAuth();
  const isTrainer = user?.role === 'TRAINER';

  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'MY_CLINICS' | 'ARCHIVES'>('UPCOMING');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLiveModal, setActiveLiveModal] = useState<LiveSession | null>(null);
  const [selectedRosterSession, setSelectedRosterSession] = useState<SessionItem | null>(null);

  // New session modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState(trainerCourses[0]?.title || 'Generative AI Systems');
  const [newDate, setNewDate] = useState('Tomorrow, 02:00 PM');
  const [newType, setNewType] = useState<'Live Masterclass' | 'Interactive Workshop' | 'Hands-on Lab Clinic'>('Hands-on Lab Clinic');
  const [newDuration, setNewDuration] = useState('90 Mins');
  const [newCap, setNewCap] = useState(50);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyLink = (link: string, title: string) => {
    navigator.clipboard?.writeText(link);
    showToast(`Meeting link copied to clipboard for: "${title}"!`);
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: SessionItem = {
      id: 's-' + Date.now(),
      title: newTitle.trim(),
      date: newDate,
      time: '02:00 PM – 03:30 PM',
      trainer: user?.name || 'Prof. Vikram Rao',
      trainerRole: 'Lead Instructor',
      trainerAvatar: user?.profile?.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      participants: 0,
      sessionType: newType,
      isLive: false,
      meetingLink: `https://meet.capacityconnect.gov.in/moes-${Date.now().toString().slice(-4)}`,
      cohortName: 'Batch 2026-Live',
      courseTitle: newCourse,
      duration: newDuration,
      agenda: ['Live curriculum demonstration', 'Hands-on coding clinic', 'Student Q&A'],
      registeredLearners: [],
    };

    setSessions(prev => [created, ...prev]);
    showToast(`Training session "${newTitle}" scheduled successfully!`);
    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  // Filtered lists
  const currentList = activeTab === 'ARCHIVES' ? recordedArchives : sessions;
  const filtered = currentList.filter(s => {
    if (activeTab === 'MY_CLINICS') {
      const isVikram = s.trainer.toLowerCase().includes('vikram') || s.trainer === user?.name;
      if (!isVikram) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchTrainer = s.trainer.toLowerCase().includes(q);
      const matchTrack = (s.courseTitle || '').toLowerCase().includes(q);
      return matchTitle || matchTrainer || matchTrack;
    }
    return true;
  });

  return (
    <div className="space-y-6 page-enter pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-100/95 via-indigo-50/90 to-rose-50/80 dark:from-purple-950 dark:via-indigo-950 dark:to-slate-900 border border-purple-200/90 dark:border-purple-800/40 shadow-sm dark:shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-500/30 text-rose-800 dark:text-rose-200 border border-rose-300/80 dark:border-rose-400/30 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Live Classroom & Telemetry Studio
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/30">
              WebRTC Encrypted
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Training Sessions & Masterclasses
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-100 mt-1.5 max-w-2xl font-medium leading-relaxed">
            Conduct interactive scientific workshops, broadcast live telemetry clinics, review student code pipelines, and access complete recorded lecture archives.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              const live = sessions.find(s => s.isLive);
              if (live) setActiveLiveModal(live);
              else showToast('Launching capacity studio classroom...');
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 animate-pulse"
          >
            <Radio className="w-4 h-4" />
            <span>Join Live Session</span>
          </button>
          {isTrainer && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 dark:bg-white text-white dark:text-purple-900 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg dark:hover:bg-purple-50 transition-all active:scale-95 border border-purple-800 dark:border-white"
            >
              <PlusCircle className="w-4 h-4 text-white dark:text-purple-700" />
              <span>Host New Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Live & Scheduled</span>
            <Radio className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 flex items-center gap-2">
            <span>{sessions.length} Sessions</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
            1 Broadcasting right now
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Trainees</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            248 Attending
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
            Across 4 active cohorts
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Streaming Hours</span>
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            42.5 Hours
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
            +14 hrs this week
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Engagement Rating</span>
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            94.2%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            4.95/5.0 Instructor score
          </div>
        </div>
      </div>

      {/* Featured Live Banner (if any live session active) */}
      {sessions.some(s => s.isLive) && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-purple-900 to-indigo-950 border border-rose-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center flex-shrink-0">
              <Radio className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse">
                  ON AIR NOW
                </span>
                <span className="text-xs text-rose-200 font-semibold">
                  Live Classroom · Started 15 mins ago
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                AI Prompts for Educators & Instructional Design
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Conducted by <strong>Prof. Vikram Rao</strong> · 72 trainees actively participating
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const live = sessions.find(s => s.isLive);
                if (live) setActiveLiveModal(live);
              }}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>Enter Classroom Studio</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'UPCOMING'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Upcoming & Live ({sessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MY_CLINICS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'MY_CLINICS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Cohort Clinics (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('ARCHIVES')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ARCHIVES'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Recorded Archives ({recordedArchives.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workshops by topic or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
          >
            <div>
              {/* Card Header: Type Badge & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {s.sessionType}
                </span>
                {s.isLive ? (
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE NOW
                  </span>
                ) : activeTab === 'ARCHIVES' ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Archive Video Ready
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    Scheduled
                  </span>
                )}
              </div>

              {/* Title & Course */}
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mt-3.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {s.title}
              </h3>
              {s.courseTitle && (
                <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">
                  Track: {s.courseTitle} {s.cohortName && `· ${s.cohortName}`}
                </div>
              )}

              {/* Instructor Bio Row */}
              <div className="flex items-center gap-3 mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <img
                  src={s.trainerAvatar}
                  alt={s.trainer}
                  className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                />
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {s.trainer}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {s.trainerRole}
                  </div>
                </div>
              </div>

              {/* Agenda Highlights (if present) */}
              {s.agenda && (
                <div className="mt-4 space-y-1">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Session Agenda:</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {s.agenda.map((ag, i) => (
                      <li key={i} className="line-clamp-1">{ag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Time & Attendance */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{s.date} · {s.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {activeTab === 'ARCHIVES' ? `${s.recordingViews || 320} Replays` : `${s.participants} Enrolled`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="flex items-center justify-between gap-2.5 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              {activeTab === 'ARCHIVES' ? (
                <>
                  <button
                    onClick={() => setActiveLiveModal(s)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch Replay ({s.duration})</span>
                  </button>
                  {s.slidesUrl && (
                    <button
                      onClick={() => showToast(`Downloading slides: ${s.slidesUrl}`)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Slides (PDF)</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveLiveModal(s)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                      s.isLive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{s.isLive ? 'Launch Live Studio' : 'Enter Classroom'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {s.registeredLearners && s.registeredLearners.length > 0 && (
                      <button
                        onClick={() => setSelectedRosterSession(s)}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        title="View registered trainees"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Roster ({s.registeredLearners.length})</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCopyLink(s.meetingLink, s.title)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Copy meeting link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty Filter State */}
      {filtered.length === 0 && (
        <div className="cc-card p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">No training sessions found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try resetting your search query or switching tabs.</p>
          <button
            onClick={() => { setSearchTerm(''); setActiveTab('UPCOMING'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* ── MODAL 1: Live Interactive Classroom Studio Modal ── */}
      {activeLiveModal && (
        <LiveSessionModal
          session={activeLiveModal}
          onClose={() => setActiveLiveModal(null)}
        />
      )}

      {/* ── MODAL 2: Registered Trainee Roster Modal ── */}
      {selectedRosterSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cc-card w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-blue-100">
                  Registered Trainees
                </span>
                <h3 className="text-lg font-black text-white mt-1">Session Attendance Roster</h3>
                <p className="text-xs text-blue-200">{selectedRosterSession.title}</p>
              </div>
              <button
                onClick={() => setSelectedRosterSession(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
              {selectedRosterSession.registeredLearners?.map((learner, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <img src={learner.avatar} alt={learner.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{learner.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{learner.org}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    learner.attended
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {learner.attended ? 'Present in Live' : 'Registered'}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRosterSession(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Schedule / Host New Training Session Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSession}
            className="cc-card w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="p-6 bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-purple-100">
                  New Live Session
                </span>
                <h3 className="text-lg font-black text-white mt-1">Host Live Training Session</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Doppler Reflectivity & Hail Signature Clinic"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Associated Curriculum Track
                </label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {trainerCourses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title} ({c.cohortName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Date & Scheduled Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tomorrow, 02:00 PM"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Format
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Hands-on Lab Clinic">Hands-on Lab Clinic</option>
                    <option value="Live Masterclass">Live Masterclass</option>
                    <option value="Interactive Workshop">Interactive Workshop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Attendee Capacity
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={newCap}
                    onChange={(e) => setNewCap(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Schedule Session</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
