import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { BookOpen, Users, PlusCircle, Award, CheckCircle, BarChart3, Clock, AlertCircle, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Interactive Modal States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillCompetency | null>(null);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  const role = user?.role || 'TRAINEE';

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
    return (
      <div className="space-y-6 page-enter">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-lg">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
              Educator & Trainer Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Welcome back, {user?.name.split(' ')[0]} 👨‍🏫
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 mt-1">
              Curate capacity building curricula, review trainee assessments, and host live sessions.
            </p>
          </div>
          <button
            onClick={() => navigate('/trainer/courses/create')}
            className="px-5 py-3 rounded-2xl bg-white text-purple-700 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:bg-purple-50 transition-all flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Trainer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="cc-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Active Courses</div>
            <div className="text-2xl font-black text-slate-900 mt-1">6 Modules</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">All published & live</div>
          </div>
          <div className="cc-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Enrolled Trainees</div>
            <div className="text-2xl font-black text-slate-900 mt-1">284 Students</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">+38 this month</div>
          </div>
          <div className="cc-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Avg Quiz Score</div>
            <div className="text-2xl font-black text-slate-900 mt-1">88.4%</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">High retention rate</div>
          </div>
          <div className="cc-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Upcoming Live</div>
            <div className="text-2xl font-black text-slate-900 mt-1">Oct 18 · 11:00 AM</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">48 registered</div>
          </div>
        </div>

        {/* Course management cards */}
        <div className="cc-card p-6">
          <h3 className="font-extrabold text-base text-slate-900 mb-4">Assigned Curriculum Tracks</h3>
          <div className="space-y-3">
            {myLearningCourses.slice(0, 3).map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${c.thumbnailGradient} text-white flex items-center justify-center font-bold`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-500">{c.category} · {c.totalModules} modules · Level: {c.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="cc-pill cc-pill-green">Published</span>
                  <button className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. ADMIN DASHBOARD VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (role === 'ADMIN') {
    return (
      <div className="space-y-6 page-enter">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30">
              Institutional Governance & Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Capacity Portal Oversight 🏛️
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Ministry of Earth Sciences · Digital Capacity Building Command Center
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all flex-shrink-0"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Generate Impact Report</span>
          </button>
        </div>

        {/* Admin Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="cc-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Learners</div>
            <div className="text-2xl font-black text-slate-900 mt-1">1,420</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">94% Active Engagement</div>
          </div>
          <div className="cc-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Trainers & Faculty</div>
            <div className="text-2xl font-black text-slate-900 mt-1">64 Educators</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">Across 18 Institutes</div>
          </div>
          <div className="cc-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Certifications Issued</div>
            <div className="text-2xl font-black text-slate-900 mt-1">892 Issued</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">100% Blockchain Verified</div>
          </div>
          <div className="cc-card p-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Platform Uptime</div>
            <div className="text-2xl font-black text-slate-900 mt-1">99.98%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">MeitY Cloud Standards</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cc-card p-6">
            <h3 className="font-extrabold text-base text-slate-900 mb-3">Institutional Cohorts</h3>
            <p className="text-xs text-slate-500 mb-4">Live capacity progress across divisions</p>
            <div className="space-y-3">
              {[
                { name: 'Meteorological Officers Batch 2026', progress: 84, trainees: 120 },
                { name: 'Radar & Satellite Instrumentation Group', progress: 72, trainees: 85 },
                { name: 'Disaster Early Warning Analytics Cohort', progress: 91, trainees: 64 },
              ].map((b, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                    <span>{b.name}</span>
                    <span className="text-blue-600">{b.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${b.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{b.trainees} registered trainees</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cc-card p-6">
            <h3 className="font-extrabold text-base text-slate-900 mb-3">System Audit & Compliance</h3>
            <p className="text-xs text-slate-500 mb-4">Recent security and user audit events</p>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                <span className="font-bold">Automated Security Scan:</span> 0 vulnerabilities detected.
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
                <span className="font-bold">New Curriculum Published:</span> AI for Education track approved.
              </div>
              <div className="p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-950/90 to-slate-900 border border-purple-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 my-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Role Progression</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Goal: Data Scientist at Microsoft
          </h3>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl">
            Currently on Stage 3 (Machine Learning & Predictive Modeling). 1,650 / 2,000 XP accrued toward National Competency Certification.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => navigate('/trainee/roadmap')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
          >
            <span>View 7-Stage Roadmap</span>
          </button>
          <button
            onClick={() => navigate('/trainee/profile')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <span>Update Profile</span>
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
            <div className={`p-6 bg-gradient-to-r ${activeCourseModal.thumbnailGradient} text-white`}>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                {activeCourseModal.category}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2 leading-tight">
                {activeCourseModal.title}
              </h3>
              <p className="text-xs text-blue-100 mt-1">
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
