import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Course, SkillCompetency, LiveSession, myLearningCourses,
  currentUserProfile
} from '../../data/capacityConnectData';
import { HeroSection } from '../../components/dashboard/HeroSection';
import { MotivationalBanner } from '../../components/dashboard/MotivationalBanner';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { MyLearningJourney } from '../../components/dashboard/MyLearningJourney';
import { AchievementsSection } from '../../components/dashboard/AchievementsSection';
import { SkillMapSection } from '../../components/dashboard/SkillMapSection';
import { LearningAnalyticsSection } from '../../components/dashboard/LearningAnalyticsSection';
import { UpcomingSessionsSection } from '../../components/dashboard/UpcomingSessionsSection';
import { CommunitySection } from '../../components/dashboard/CommunitySection';
import { RecommendedSection } from '../../components/dashboard/RecommendedSection';
import { LeaderboardSection } from '../../components/dashboard/LeaderboardSection';
import { QuizModal } from '../../components/modals/QuizModal';
import { SkillDetailDrawer } from '../../components/modals/SkillDetailDrawer';
import { LiveSessionModal } from '../../components/modals/LiveSessionModal';
import {
  BookOpen, Users, PlusCircle, Award, CheckCircle, CheckCircle2, BarChart3, Clock,
  AlertCircle, Sparkles, Send, FileText, ChevronRight, Video, Calendar, ArrowUpRight,
  TrendingUp, Layers, GraduationCap, Shield, Search, Mail, UserCheck, UserX, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import {
  trainerCourses, assignedTrainees, upcomingLiveClinics, trainerAggregatedStats
} from '../../data/trainerData';

function getDefaultAdminUsers() {
  return [
    {
      id: '69a1ccda-ddb7-422d-8b7b-071406257524',
      name: 'Yandrapu Bhavish',
      email: 'yandrapubhavish2701@gmail.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: false,
      onboardingStatus: 'PENDING',
      profile: {
        department: 'Ministry of Earth Sciences Governance',
        designation: 'Platform Administrator & Governance Lead',
      },
    },
    {
      id: 'adm-001',
      name: 'Dr. Rajesh Verma',
      email: 'admin@capacityconnect.demo',
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      profile: {
        department: 'National Skill & Competency Directorate',
        designation: 'Chief Capacity Director & System Architect',
      },
    },
    {
      id: 'adm-002',
      name: 'SkillSync Master Admin',
      email: 'admin@skillsync.demo',
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      profile: {
        department: 'Platform Administration & Security',
        designation: 'Lead Platform Administrator',
      },
    },
    {
      id: 'c35271a1-ae3c-4f49-bdbe-c2e81b8b323a',
      name: 'Prof. Vikram Rao',
      email: 'vikram.rao@moes.gov.in',
      role: 'TRAINER',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      profile: {
        department: 'Division of Earth & Atmospheric Informatics',
        designation: 'Lead Instructor & AI Ethics Researcher',
      },
    },
    ...assignedTrainees.map((t, idx) => ({
      id: t.id || `trainee-${idx}`,
      name: t.name,
      email: t.email,
      role: 'TRAINEE',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      profile: {
        department: t.organization,
        designation: t.department || 'Atmospheric Research Scholar',
      },
    })),
  ];
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Interactive Modal States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillCompetency | null>(null);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const location = useLocation();
  const pathPrefix = location.pathname.split('/')[1]?.toUpperCase();
  // An Admin user has master authority to view & control all dashboards (student, lecturer, management)
  const role = (user?.role === 'ADMIN' && (pathPrefix === 'TRAINEE' || pathPrefix === 'TRAINER' || pathPrefix === 'ADMIN'))
    ? pathPrefix
    : (user?.role || 'TRAINEE');

  // Admin User Directory State
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminRoleFilter, setAdminRoleFilter] = useState('ALL');
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    if (role === 'ADMIN') {
      setAdminLoading(true);
      api.get('/admin/users?page=1&limit=50')
        .then((res) => {
          if (res.data?.data?.users && res.data.data.users.length > 0) {
            setAdminUsers(res.data.data.users);
          } else {
            setAdminUsers(getDefaultAdminUsers());
          }
        })
        .catch(() => {
          setAdminUsers(getDefaultAdminUsers());
        })
        .finally(() => setAdminLoading(false));
    }
  }, [role]);

  // ── 1. Cinematic 3D Scroll Reveal (IntersectionObserver — single-trigger, no spam)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    // Also observe legacy reveal classes from existing code
    const legacyElements = document.querySelectorAll(
      '.reveal-fade-up, .reveal-scale, .reveal-slide-left, .reveal-slide-right, .reveal-blur'
    );
    legacyElements.forEach((el) => observer.observe(el));

    if (prefersReduced) {
      // Immediately reveal everything with no animation
      elements.forEach((el) => el.classList.add('is-revealed'));
      legacyElements.forEach((el) => el.classList.add('is-revealed'));
    }

    return () => observer.disconnect();
  }, [role]);

  // ── 2. Scroll Progress Indicator (scaleX — GPU only, no width change)
  useEffect(() => {
    const bar = document.getElementById('ss-scroll-progress');
    if (!bar) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── 3. Cursor-Reactive Card Lighting (CSS custom properties --mouse-x/y)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleCardMove = (e: MouseEvent) => {
      const card = (e.currentTarget as HTMLElement);
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };
    const resetCard = (e: MouseEvent) => {
      const card = (e.currentTarget as HTMLElement);
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    };

    const cards = document.querySelectorAll<HTMLElement>('.cc-card, .db-qa-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', handleCardMove, { passive: true });
      card.addEventListener('mouseleave', resetCard, { passive: true });
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleCardMove);
        card.removeEventListener('mouseleave', resetCard);
      });
    };
  }, [role]);



  // ─────────────────────────────────────────────────────────────────────────────
  // 1. TRAINER DASHBOARD VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (role === 'TRAINER') {
    const pendingSubmissions = assignedTrainees.filter(t => !!t.pendingSubmission);
    const atRiskLearners = assignedTrainees.filter(t => t.status === 'NEEDS_HELP');

    return (
      <div className="space-y-6 page-enter pb-10">
        {/* Executive Welcome Banner */}
        <div className="trainer-executive-banner flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-100/95 via-indigo-50/90 to-blue-50/90 dark:from-purple-950 dark:via-indigo-950 dark:to-slate-900 border border-purple-200/90 dark:border-purple-800/40 shadow-sm dark:shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-200/80 dark:bg-white/20 text-purple-900 dark:text-white border border-purple-300/80 dark:border-white/20 flex items-center gap-1.5 shadow-sm">
                <GraduationCap className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
                Educator & Trainer Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/30">
                4 Active Cohorts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white" style={{ color: 'var(--text-primary)' }}>
              Welcome back, {user?.name.split(' ')[0]} 👨‍🏫
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-purple-100 mt-1.5 max-w-xl font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Manage your curricula tracks, review practical project submissions from MoES trainees, and facilitate interactive live clinics.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => navigate('/trainer/trainees')}
              className="btn-secondary-banner px-4 py-2.5 rounded-2xl bg-white dark:bg-white/10 hover:bg-purple-50 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-300/90 dark:border-white/20 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-700 dark:text-cyan-300" />
              <span className="text-slate-900 dark:text-white font-bold">Assigned Learners ({trainerAggregatedStats.totalLearners})</span>
            </button>
            <button
              onClick={() => navigate('/trainer/courses/create')}
              className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 dark:bg-white text-white dark:text-purple-900 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg dark:hover:bg-purple-50 transition-all flex-shrink-0 active:scale-95 border border-purple-800 dark:border-white cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white dark:text-purple-600" />
              <span className="font-extrabold">Create New Course</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Tracks</span>
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {trainerCourses.length} Courses
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              100% published & live
            </div>
          </div>

          <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Enrolled Trainees</span>
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {trainerAggregatedStats.totalLearners}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              {trainerAggregatedStats.monthlyEnrollmentGrowth}
            </div>
          </div>

          <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Assessment</span>
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {trainerAggregatedStats.avgDiagnosticScore}%
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
              Top 5% MoES Retention
            </div>
          </div>

          <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">To Grade</span>
              <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-2">
              <span>{pendingSubmissions.length} Submissions</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Action required
            </div>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left Column (2 Cols wide) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Curriculum Tracks */}
            <div className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    Assigned Curriculum Tracks
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live scientific & technical programs under your instruction
                  </p>
                </div>
                <button
                  onClick={() => navigate('/trainer/courses')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  View All Tracks
                </button>
              </div>

              <div className="space-y-3.5">
                {trainerCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-r ${c.thumbnailGradient} text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {c.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-semibold text-purple-600 dark:text-purple-400">{c.cohortName}</span>
                          <span>·</span>
                          <span>{c.enrolledCount} Trainees</span>
                          <span>·</span>
                          <span>{c.level}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="w-24 hidden md:block">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span>Progress</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{c.avgCompletion}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${c.thumbnailGradient}`} style={{ width: `${c.avgCompletion}%` }} />
                        </div>
                      </div>
                      <Link
                        to={`/trainer/courses/${c.id}`}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trainee Submissions Feed */}
            <div className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                      Submissions Awaiting Grading ({pendingSubmissions.length})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recent practical assignments and telemetry telemetry exercises submitted by trainees
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/trainer/trainees')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Grading Desk</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {pendingSubmissions.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {t.organization}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mt-0.5">
                          {t.pendingSubmission?.assignmentTitle}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{t.pendingSubmission?.submittedAt}</span>
                          <span>·</span>
                          <span>{t.pendingSubmission?.fileSize}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/trainer/trainees')}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all self-end sm:self-center"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Grade Now</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Right Column (1 Col) */}
          <div className="space-y-6">
            {/* Cohort Progress Distribution */}
            <div className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                Cohort Progress Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Real-time velocity across active cohorts
              </p>

              <div className="space-y-4">
                {trainerCourses.map((c) => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[170px]" title={c.cohortName}>
                        {c.cohortName}
                      </span>
                      <span className="font-black text-slate-900 dark:text-white">{c.avgCompletion}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${c.thumbnailGradient}`}
                        style={{ width: `${c.avgCompletion}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>{c.enrolledCount} Trainees</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">On Track</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Live Training Clinics */}
            <div className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Live Clinics & Labs
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  Scheduled
                </span>
              </div>

              <div className="space-y-3">
                {upcomingLiveClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800"
                  >
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {clinic.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {clinic.courseTitle}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{clinic.date} · {clinic.time}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {clinic.enrolledCount} Joined
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* At-Risk Learner Attention Box */}
            {atRiskLearners.length > 0 && (
              <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{atRiskLearners.length} Trainees Flagged For Mentorship</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                  These learners have diagnostic scores below 70% or have missed recent telemetry labs.
                </p>
                <button
                  onClick={() => navigate('/trainer/trainees')}
                  className="mt-2.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors w-full text-center"
                >
                  Review Mentorship Candidates
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ADMIN DASHBOARD VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (role === 'ADMIN') {
    const filteredAdminUsers = adminUsers.filter((u) => {
      const matchesSearch =
        !adminSearch.trim() ||
        u.name?.toLowerCase().includes(adminSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(adminSearch.toLowerCase()) ||
        (u.profile?.department && u.profile.department.toLowerCase().includes(adminSearch.toLowerCase()));
      const matchesRole = adminRoleFilter === 'ALL' || u.role === adminRoleFilter;
      return matchesSearch && matchesRole;
    });

    const adminCount = adminUsers.filter((u) => u.role === 'ADMIN').length;
    const trainerCount = adminUsers.filter((u) => u.role === 'TRAINER').length;
    const traineeCount = adminUsers.filter((u) => u.role === 'TRAINEE').length;

    return (
      <div className="space-y-6 page-enter pb-12">
        {/* Executive Welcome Banner */}
        <div className="admin-executive-banner flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-100/95 via-indigo-50/90 to-blue-50/90 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border border-purple-200/90 dark:border-slate-800 shadow-sm dark:shadow-xl relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-500/30 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-400/30 flex items-center gap-1.5 shadow-xs">
                <Shield className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300" />
                Institutional Governance & Administration
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/30">
                MoES Executive Tier
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white" style={{ color: 'var(--text-primary)' }}>
              Capacity Portal Oversight 🏛️
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-2xl font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Ministry of Earth Sciences · Digital Capacity Building Command Center & User Management
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => navigate('/admin/users')}
              className="btn-secondary-banner px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 dark:border-slate-700 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-600 dark:text-cyan-300" />
              <span className="text-slate-900 dark:text-white font-bold">Full User Directory ({adminUsers.length || 77})</span>
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all flex-shrink-0 active:scale-95 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Generate Impact Report</span>
            </button>
          </div>
        </div>

        {/* Admin Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Total Accounts</span>
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {adminUsers.length || 77}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {traineeCount || 54} Trainees &bull; {trainerCount || 22} Trainers
            </div>
          </div>
          <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Trainers & Faculty</span>
              <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {trainerCount || 22} Educators
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
              Across 18 MoES Institutes
            </div>
          </div>
          <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Certifications Issued</span>
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">892 Issued</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">100% Blockchain Verified</div>
          </div>
          <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Platform Uptime</span>
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">99.98%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">MeitY Cloud Standards &bull; EmailJS Live</div>
          </div>
        </div>

        {/* ── Multi-Dashboard Master Control Center ─────────────────────── */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-purple-50/80 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-slate-900 dark:text-white border border-indigo-200/90 dark:border-indigo-500/30 shadow-sm dark:shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Tri-Portal Master Governance
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/30">
                  Full Administrative Privileges
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Multi-Dashboard Command Hub 🎛️
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-indigo-200 mt-1 max-w-2xl font-medium">
                Directly supervise, inspect, and configure the Student Learning Portal, Lecturer Studio, and Institutional Management Center.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 dark:text-indigo-300 font-semibold bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl shadow-2xs">
                Logged in as Master Admin: <strong className="text-slate-900 dark:text-white">{user?.name}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {/* 1. Student / Trainee Dashboard Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-white/5 hover:bg-slate-50/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all group flex flex-col justify-between hover:border-blue-400 shadow-xs hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30">
                    54 Enrolled Trainees
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  Student / Learner Dashboard
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                  Inspect learner competency diagnostics, radar matrices, skill gap roadmaps, and course completion telemetry.
                </p>
                <div className="mt-4 space-y-2 text-[11px] font-medium border-t border-slate-100 dark:border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Average Competency Score</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">78.4%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Active Diagnostics</span>
                    <strong className="text-slate-800 dark:text-white font-bold">14 Curricula</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10 space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/trainee/dashboard')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>Launch Student Dashboard</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between text-[11px] px-1 font-semibold">
                  <button
                    type="button"
                    onClick={() => navigate('/trainee/assessments')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    View Assessments &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/trainee/roadmap')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Skill Roadmaps &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Lecturer / Trainer Studio Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-white/5 hover:bg-slate-50/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all group flex flex-col justify-between hover:border-purple-400 shadow-xs hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-400/30">
                    22 MoES Faculty
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  Lecturer / Trainer Studio
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                  Supervise teaching cohorts, scheduled live training clinics, interactive curriculum publishing, and project grading.
                </p>
                <div className="mt-4 space-y-2 text-[11px] font-medium border-t border-slate-100 dark:border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Upcoming Live Clinics</span>
                    <strong className="text-purple-700 dark:text-purple-400 font-bold">4 Scheduled</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Mentorship Queue</span>
                    <strong className="text-amber-700 dark:text-amber-400 font-bold">3 Learners Flagged</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/10 space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/trainer/dashboard')}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>Launch Lecturer Studio</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between text-[11px] px-1 font-semibold">
                  <button
                    type="button"
                    onClick={() => navigate('/trainer/sessions')}
                    className="text-purple-700 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    Live Clinics &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/trainer/trainees')}
                    className="text-purple-700 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    Trainee Submissions &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Management & Institutional Governance Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-50/90 dark:hover:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-500/30 transition-all group flex flex-col justify-between shadow-xs hover:shadow-md ring-1 ring-emerald-400/40 dark:ring-emerald-500/20">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-400/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Active Command Portal
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  Management & Governance
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                  Full institutional administration: 77 user profiles, automated welcome email delivery, role governance, and security audit logs.
                </p>
                <div className="mt-4 space-y-2 text-[11px] font-medium border-t border-emerald-200/60 dark:border-emerald-500/20 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Platform Users</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{adminUsers.length || 77} Total Verified</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Automated Email Status</span>
                    <strong className="text-teal-700 dark:text-cyan-400 font-bold">EmailJS Dispatch Active</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-emerald-200/60 dark:border-emerald-500/20 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('user-directory-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Platform Directory</span>
                </button>
                <div className="flex items-center justify-between text-[11px] px-1 font-semibold">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/email-center')}
                    className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    Email Command Center &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/analytics')}
                    className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    MoES Analytics &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Registered Platform Users Table (Direct on Admin Dashboard) ──────── */}
        <div id="user-directory-section" className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    Platform User Directory & Identity Management
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live account status, roles, and onboarding verification across all MoES divisions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/admin/users')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open Full Directory ({adminUsers.length || 77})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search user by name, email, department..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'ALL', label: `All (${adminUsers.length || 77})` },
                { id: 'ADMIN', label: `Admins (${adminCount || 3})` },
                { id: 'TRAINER', label: `Trainers (${trainerCount || 22})` },
                { id: 'TRAINEE', label: `Trainees (${traineeCount || 54})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminRoleFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    adminRoleFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Rows */}
          {adminLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Loading user directory...</span>
            </div>
          ) : filteredAdminUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No users found matching "{adminSearch}".
            </div>
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">User & Credentials</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Department / Institute</th>
                    <th className="py-3 px-3">Onboarding</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredAdminUsers.slice(0, 8).map((u) => {
                    const avatarUrl =
                      u.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=0284c7,2563eb,7c3aed&textColor=ffffff`;
                    const roleBadgeClass =
                      u.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                        : u.role === 'TRAINER'
                        ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {u.email === 'yandrapubhavish2701@gmail.com' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-500 text-white uppercase tracking-wider">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleBadgeClass}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                          {u.profile?.department || u.organization || 'Ministry of Earth Sciences'}
                        </td>
                        <td className="py-3 px-3">
                          {u.onboardingCompleted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                            ACTIVE
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/admin/email-center?tab=composer&recipientEmail=${encodeURIComponent(u.email)}&recipientName=${encodeURIComponent(u.name)}&recipientRole=${u.role}`)}
                              title="Compose Email"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => navigate('/admin/users')}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-[11px] transition"
                            >
                              Manage
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filteredAdminUsers.length > 8 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Showing 8 of {filteredAdminUsers.length} filtered accounts</span>
              <button
                onClick={() => navigate('/admin/users')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View all {filteredAdminUsers.length} in full table</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Cohorts & Audit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">Institutional Cohorts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Live capacity progress across divisions</p>
            <div className="space-y-3">
              {[
                { name: 'Meteorological Officers Batch 2026', progress: 84, trainees: 120 },
                { name: 'Radar & Satellite Instrumentation Group', progress: 72, trainees: 85 },
                { name: 'Disaster Early Warning Analytics Cohort', progress: 91, trainees: 64 },
              ].map((b, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    <span>{b.name}</span>
                    <span className="text-blue-600 dark:text-blue-400">{b.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${b.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{b.trainees} registered trainees</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">System Audit & Compliance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Recent security and user audit events</p>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                <span className="font-bold">Automated Security Scan:</span> 0 vulnerabilities detected.
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                <span className="font-bold">New Curriculum Published:</span> AI for Education track approved.
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                <span className="font-bold">Sync Completed:</span> User database synchronized with CBC portal.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. COMPLETE STUDENT / LEARNER DASHBOARD (PRIMARY SHOWCASE)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-2 page-enter">
      {/* Scroll Progress Indicator */}
      <div id="ss-scroll-progress" aria-hidden="true" />
      {/* Hero Section */}
      <HeroSection
        onContinueLearning={() => {
          // Open the in-progress course
          setActiveCourseModal(myLearningCourses[0]);
        }}
        onExploreCourses={() => navigate(`/${role.toLowerCase()}/courses`)}
      />

      {/* Personalized Career Roadmap & Goal Spotlight */}
      <div className="role-progression-spotlight p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border border-purple-500/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 my-4 relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Role Progression</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight" style={{ color: '#ffffff' }}>
            Goal: Data Scientist at Microsoft
          </h3>
          <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl leading-relaxed font-normal" style={{ color: '#e9d5ff' }}>
            Currently on Stage 3 (Machine Learning & Predictive Modeling). 1,650 / 2,000 XP accrued toward National Competency Certification.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          <button
            onClick={() => navigate('/trainee/roadmap')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <span style={{ color: '#ffffff' }}>View 7-Stage Roadmap</span>
          </button>
          <button
            onClick={() => navigate('/trainee/profile')}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <span style={{ color: '#ffffff' }}>Update Profile</span>
          </button>
        </div>
      </div>

      {/* Motivational Banner */}
      <MotivationalBanner
        onContinue={() => setActiveCourseModal(myLearningCourses[2])}
      />

      {/* Quick Actions Grid */}
      <QuickActions
        onBrowseCourses={() => navigate(`/${role.toLowerCase()}/courses`)}
        onJoinTraining={() => setSelectedSession(myLearningCourses.length ? {
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
        } : null)}
        onTakeQuiz={() => setIsQuizOpen(true)}
        onAskMentor={() => alert('Opening 1-on-1 Mentor consultation booking...')}
        onShareKnowledge={() => window.scrollTo({ top: document.body.scrollHeight - 1000, behavior: 'smooth' })}
        onEarnCertificate={() => navigate(`/${role.toLowerCase()}/certificates`)}
      />

      {/* My Learning Journey Section — bottom-to-front depth reveal */}
      <div className="reveal-on-scroll reveal-depth-up">
        <MyLearningJourney
          courses={myLearningCourses}
          onOpenCourse={course => setActiveCourseModal(course)}
        />
      </div>

      {/* Gamification: Your Achievements — scale + depth reveal */}
      <div className="reveal-on-scroll reveal-depth-scale">
        <AchievementsSection
          onViewAllBadges={() => navigate(`/${role.toLowerCase()}/certificates`)}
        />
      </div>

      {/* Skill Development Radar & Cards — radial depth entrance */}
      <div className="reveal-on-scroll reveal-depth-radial">
        <SkillMapSection
          onSelectSkill={skill => setSelectedSkill(skill)}
        />
      </div>

      {/* Learning Analytics & Insights — horizontal depth slide */}
      <div className="reveal-on-scroll reveal-depth-right">
        <LearningAnalyticsSection />
      </div>

      {/* Upcoming Sessions — depth upward reveal */}
      <div className="reveal-on-scroll reveal-depth-up">
        <UpcomingSessionsSection
          onJoinSession={session => setSelectedSession(session)}
        />
      </div>

      {/* Recommended For You — blur + depth emerge */}
      <div className="reveal-on-scroll reveal-depth-blur">
        <RecommendedSection />
      </div>

      {/* Learning Community Social Hub — depth + scale reveal */}
      <div className="reveal-on-scroll reveal-depth-scale">
        <CommunitySection />
      </div>

      {/* Leaderboard: Learn Together — row-by-row depth reveal */}
      <div className="reveal-on-scroll reveal-depth-rows">
        <LeaderboardSection />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          INTERACTIVE MODALS & DRAWERS
          ───────────────────────────────────────────────────────────────────────────── */}
      {/* 1. Interactive Quiz Modal with Confetti */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onEarnXp={xp => alert(`Awesome! You earned +${xp} XP! Check your updated total on the top bar.`)}
      />

      {/* 2. Slide-over Skill Detail Drawer */}
      <SkillDetailDrawer
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      {/* 3. Live Session Classroom Simulation */}
      <LiveSessionModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />

      {/* 4. Course Quick Detail Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className={`course-modal-gradient p-6 bg-gradient-to-r ${activeCourseModal.thumbnailGradient} text-white`}>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/25 border border-white/35 backdrop-blur-md text-white shadow-xs"
                style={{ color: '#ffffff' }}
              >
                {activeCourseModal.category}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2 leading-tight" style={{ color: '#ffffff' }}>
                {activeCourseModal.title}
              </h3>
              <p className="text-xs text-blue-100 mt-1" style={{ color: '#dbeafe' }}>
                Instructor: {activeCourseModal.instructor} ({activeCourseModal.instructorRole})
              </p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeCourseModal.description}
              </p>

              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Progress</span>
                  <span className="text-sm font-black text-blue-600">{activeCourseModal.progress}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Modules</span>
                  <span className="text-sm font-black text-slate-800">
                    {activeCourseModal.completedModules}/{activeCourseModal.totalModules}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Remaining</span>
                  <span className="text-sm font-black text-slate-800">{activeCourseModal.estimatedTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveCourseModal(null)}
                  className="cc-btn-secondary flex-1 text-xs py-2.5"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    const id = activeCourseModal.id;
                    setActiveCourseModal(null);
                    navigate(`/${role.toLowerCase()}/courses/${id}`);
                  }}
                  className="cc-btn-primary flex-1 text-xs py-2.5"
                >
                  Open Full Course Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
