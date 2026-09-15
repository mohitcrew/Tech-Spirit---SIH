import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PortalLayout } from './layouts/PortalLayout';

// ── Auth pages (inline for fast load) ───────────────────────────────────
import { Login, Register } from './pages/auth/AuthPages';

// ── Public pages ─────────────────────────────────────────────────────────
const Landing = lazy(() => import('./pages/public/Landing').then(m => ({ default: m.Landing })));

// ── Shared pages ─────────────────────────────────────────────────────────
const Dashboard   = lazy(() => import('./pages/shared/Dashboard'));
const Courses     = lazy(() => import('./pages/shared/Courses'));
const CourseDetail = lazy(() => import('./pages/shared/CourseDetail'));
const Learning    = lazy(() => import('./pages/shared/Learning'));
const Assessment  = lazy(() => import('./pages/shared/Assessment'));
const Results     = lazy(() => import('./pages/shared/Results'));
const Certificates = lazy(() => import('./pages/shared/Certificates'));
const Profile     = lazy(() => import('./pages/shared/Profile'));
const Notifications = lazy(() => import('./pages/shared/Notifications'));
const Knowledge   = lazy(() => import('./pages/shared/Knowledge'));
const Settings    = lazy(() => import('./pages/shared/SettingsPage'));

// ── Trainer-specific ──────────────────────────────────────────────────────
const CreateCourse = lazy(() => import('./pages/trainer/CreateCourse').then(m => ({ default: m.CreateCourse })));
const Trainees    = lazy(() => import('./pages/trainer/Trainees').then(m => ({ default: m.Trainees })));

// ── Admin-specific ────────────────────────────────────────────────────────
const AdminUsers  = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.AdminUsers })));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics').then(m => ({ default: m.AdminAnalytics })));
const AuditLogs   = lazy(() => import('./pages/admin/AuditLogs').then(m => ({ default: m.AuditLogs })));
const Announcements = lazy(() => import('./pages/admin/Announcements').then(m => ({ default: m.Announcements })));

// ── Fallback ──────────────────────────────────────────────────────────────
function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="state-box loading-pulse"><p>Loading...</p></div>}>
      {children}
    </Suspense>
  );
}

function NotFound() {
  return (
    <div className="state-box" style={{ minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 18, fontWeight: 600, color: '#123b5d' }}>Page not found</p>
      <p style={{ marginTop: 8 }}>This section is under development.</p>
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
  return (
    <Routes>
      <Route path="/" element={<SuspenseWrap><Landing /></SuspenseWrap>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
