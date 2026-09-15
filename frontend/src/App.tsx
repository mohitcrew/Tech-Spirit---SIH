import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PortalLayout } from './layouts/PortalLayout';

// ── Auth pages ──────────────────────────────────────────────────────────
import { Login, Register } from './pages/auth/AuthPages';

// ── Public pages ─────────────────────────────────────────────────────────
const Landing = lazy(() => import('./pages/public/Landing').then(m => ({ default: m.Landing })));
const CoursesView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.CoursesView })));
const SkillsView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.SkillsView })));
const CompetenciesView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.CompetenciesView })));
const TrainersView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.TrainersView })));
const SectorsView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.SectorsView })));
const KnowledgeView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.KnowledgeView })));
const HowItWorksView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.HowItWorksView })));
const FeaturesView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.FeaturesView })));
const AboutView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.AboutView })));
const AiView = lazy(() => import('./pages/public/PublicViews').then(m => ({ default: m.AiView })));

// ── Shared Portal pages ──────────────────────────────────────────────────
const Dashboard = lazy(() => import('./pages/shared/Dashboard'));
const Courses = lazy(() => import('./pages/shared/Courses'));
const CourseDetail = lazy(() => import('./pages/shared/CourseDetail'));
const Learning = lazy(() => import('./pages/shared/Learning'));
const Assessment = lazy(() => import('./pages/shared/Assessment'));
const Results = lazy(() => import('./pages/shared/Results'));
const Certificates = lazy(() => import('./pages/shared/Certificates'));
const Profile = lazy(() => import('./pages/shared/Profile'));
const Notifications = lazy(() => import('./pages/shared/Notifications'));
const Knowledge = lazy(() => import('./pages/shared/Knowledge'));
const Settings = lazy(() => import('./pages/shared/SettingsPage'));

// ── Trainer-specific ──────────────────────────────────────────────────────
const CreateCourse = lazy(() => import('./pages/trainer/CreateCourse').then(m => ({ default: m.CreateCourse })));
const Trainees = lazy(() => import('./pages/trainer/Trainees'));

// ── Admin-specific ────────────────────────────────────────────────────────
const AdminUsers = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.AdminUsers })));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics').then(m => ({ default: m.AdminAnalytics })));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs').then(m => ({ default: m.AuditLogs })));
const Announcements = lazy(() => import('./pages/admin/Announcements').then(m => ({ default: m.Announcements })));

// ── Fallback ──────────────────────────────────────────────────────────────
function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="state-box loading-pulse"><p>Loading SkillSync...</p></div>}>
      {children}
    </Suspense>
  );
}

function NotFound() {
  return (
    <div className="state-box" style={{ minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>Section In Development</p>
      <p style={{ marginTop: 8, color: '#64748B' }}>This prototype module is being prepared for SIH 2026.</p>
    </div>
  );
}

function Protected() {
  const { user, loading } = useAuth();
  const part = useLocation().pathname.split('/')[1];
  if (loading) return <div />;
  if (!user) return <Navigate to="/login" />;
  if (part && part !== user.role.toLowerCase()) {
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} />;
  }
  return <PortalLayout />;
}

export default function App() {
  const { user } = useAuth();
  const rolePrefix = user ? `/${user.role.toLowerCase()}` : '/trainee';

  return (
    <Routes>
      {/* ── Public SkillSync Web Pages ────────────────────────────── */}
      <Route path="/" element={<SuspenseWrap><Landing /></SuspenseWrap>} />
      <Route path="/courses" element={<SuspenseWrap><CoursesView /></SuspenseWrap>} />
      <Route path="/courses/:id" element={<SuspenseWrap><CoursesView /></SuspenseWrap>} />
      <Route path="/skills" element={<SuspenseWrap><SkillsView /></SuspenseWrap>} />
      <Route path="/skills/:id" element={<SuspenseWrap><SkillsView /></SuspenseWrap>} />
      <Route path="/competencies" element={<SuspenseWrap><CompetenciesView /></SuspenseWrap>} />
      <Route path="/competencies/:id" element={<SuspenseWrap><CompetenciesView /></SuspenseWrap>} />
      <Route path="/trainers" element={<SuspenseWrap><TrainersView /></SuspenseWrap>} />
      <Route path="/trainers/:id" element={<SuspenseWrap><TrainersView /></SuspenseWrap>} />
      <Route path="/sectors" element={<SuspenseWrap><SectorsView /></SuspenseWrap>} />
      <Route path="/knowledge" element={<SuspenseWrap><KnowledgeView /></SuspenseWrap>} />
      <Route path="/how-it-works" element={<SuspenseWrap><HowItWorksView /></SuspenseWrap>} />
      <Route path="/features" element={<SuspenseWrap><FeaturesView /></SuspenseWrap>} />
      <Route path="/about" element={<SuspenseWrap><AboutView /></SuspenseWrap>} />
      <Route path="/ai" element={<SuspenseWrap><AiView /></SuspenseWrap>} />

      {/* ── Authentication ────────────────────────────────────────── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── Personalized Shortcuts ─────────────────────────────────── */}
      <Route path="/dashboard" element={<Navigate to={`${rolePrefix}/dashboard`} replace />} />
      <Route path="/my-learning" element={<Navigate to={`${rolePrefix}/learning`} replace />} />
      <Route path="/my-competencies" element={<Navigate to={`${rolePrefix}/dashboard`} replace />} />
      <Route path="/skill-gaps" element={<Navigate to={`${rolePrefix}/dashboard`} replace />} />
      <Route path="/learning-path" element={<Navigate to={`${rolePrefix}/learning`} replace />} />
      <Route path="/recommendations" element={<Navigate to={`${rolePrefix}/dashboard`} replace />} />
      <Route path="/assessments" element={<Navigate to={`${rolePrefix}/assessments`} replace />} />
      <Route path="/certificates" element={<Navigate to={`${rolePrefix}/certificates`} replace />} />

      {/* ── Protected Portal Routes ───────────────────────────────── */}
      <Route element={<Protected />}>
        {/* Dashboard */}
        <Route path=":role/dashboard" element={<SuspenseWrap><Dashboard /></SuspenseWrap>} />

        {/* Courses */}
        <Route path=":role/courses" element={<SuspenseWrap><Courses /></SuspenseWrap>} />
        <Route path=":role/courses/create" element={<SuspenseWrap><CreateCourse /></SuspenseWrap>} />
        <Route path=":role/courses/:id" element={<SuspenseWrap><CourseDetail /></SuspenseWrap>} />

        {/* Learning */}
        <Route path=":role/learning" element={<SuspenseWrap><Learning /></SuspenseWrap>} />

        {/* Assessments */}
        <Route path=":role/assessments/:id" element={<SuspenseWrap><Assessment /></SuspenseWrap>} />
        <Route path=":role/assessments" element={<SuspenseWrap><NotFound /></SuspenseWrap>} />

        {/* Results & Certificates */}
        <Route path=":role/results" element={<SuspenseWrap><Results /></SuspenseWrap>} />
        <Route path=":role/certificates" element={<SuspenseWrap><Certificates /></SuspenseWrap>} />

        {/* Knowledge Hub */}
        <Route path=":role/knowledge" element={<SuspenseWrap><Knowledge /></SuspenseWrap>} />

        {/* Profile, Settings, Notifications */}
        <Route path=":role/profile" element={<SuspenseWrap><Profile /></SuspenseWrap>} />
        <Route path=":role/settings" element={<SuspenseWrap><Settings /></SuspenseWrap>} />
        <Route path=":role/notifications" element={<SuspenseWrap><Notifications /></SuspenseWrap>} />

        {/* Trainer-specific */}
        <Route path=":role/trainees" element={<SuspenseWrap><Trainees /></SuspenseWrap>} />

        {/* Admin-specific */}
        <Route path=":role/users" element={<SuspenseWrap><AdminUsers /></SuspenseWrap>} />
        <Route path=":role/analytics" element={<SuspenseWrap><AdminAnalytics /></SuspenseWrap>} />
        <Route path=":role/audit-logs" element={<SuspenseWrap><AuditLogs /></SuspenseWrap>} />
        <Route path=":role/announcements" element={<SuspenseWrap><Announcements /></SuspenseWrap>} />

        {/* Catch-all for role */}
        <Route path=":role/*" element={<SuspenseWrap><NotFound /></SuspenseWrap>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
