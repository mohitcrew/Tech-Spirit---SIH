import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Shield, GraduationCap, BookOpen, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ModernSidebar } from '../components/layout/ModernSidebar';
import { ModernTopNav } from '../components/layout/ModernTopNav';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';

export function PortalLayout() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If the logged-in user is an ADMIN, activeRole reflects whichever tier they are inspecting/controlling:
  // /trainee/* -> TRAINEE view (Student Dashboard)
  // /trainer/* -> TRAINER view (Lecturer / Trainer Studio)
  // /admin/*   -> ADMIN view (Management & Governance)
  const pathPrefix = location.pathname.split('/')[1]?.toUpperCase();
  const activeRole: 'TRAINEE' | 'TRAINER' | 'ADMIN' =
    (user?.role === 'ADMIN' && (pathPrefix === 'TRAINEE' || pathPrefix === 'TRAINER' || pathPrefix === 'ADMIN'))
      ? pathPrefix
      : (user?.role || 'TRAINEE');

  const handleSwitchRole = (newRole: 'TRAINEE' | 'TRAINER' | 'ADMIN') => {
    if (user?.role === 'ADMIN') {
      // Direct navigation preserves the admin's session and authority
      navigate(`/${newRole.toLowerCase()}/dashboard`);
    } else {
      switchRole(newRole);
      navigate(`/${newRole.toLowerCase()}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors duration-250">
      {/* Admin Multi-Dashboard Master Control Banner */}
      {user?.role === 'ADMIN' && (
        <div className="master-admin-control-bar bg-gradient-to-r from-indigo-50/95 via-sky-50/90 to-purple-50/95 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 border-b border-indigo-200/90 dark:border-indigo-500/30 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xs dark:shadow-md z-40 transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-400"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300/90 dark:bg-amber-400/20 dark:text-amber-300 dark:border-amber-400/30 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
              Master Admin Mode
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold hidden sm:inline-flex items-center gap-1.5">
              <span>Supervising:</span>
              <strong className="active-role-badge px-2 py-0.5 rounded-md text-xs font-black tracking-wide border shadow-2xs transition-all bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-200 dark:border-indigo-700">
                {activeRole === 'TRAINEE'
                  ? 'Student / Learner Portal'
                  : activeRole === 'TRAINER'
                  ? 'Lecturer / Trainer Studio'
                  : 'Institutional Management Center'}
              </strong>
            </span>
          </div>

          <div className="admin-switcher-container flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/80 backdrop-blur-sm p-1 rounded-xl border border-slate-300/80 dark:border-slate-700/60 shadow-xs">
            <button
              type="button"
              onClick={() => navigate('/trainee/dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeRole === 'TRAINEE'
                  ? 'btn-admin-nav-active bg-blue-600 text-white shadow-xs ring-1 ring-blue-500 font-extrabold'
                  : 'btn-admin-nav-inactive text-slate-800 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10'
              }`}
              style={{
                backgroundColor: activeRole === 'TRAINEE' ? '#2563eb' : undefined,
              }}
              title="Inspect & Control Student Dashboard"
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeRole === 'TRAINEE' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
              <span
                style={{
                  color: activeRole === 'TRAINEE' ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: activeRole === 'TRAINEE' ? 800 : 700,
                }}
              >
                Student Dashboard
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/trainer/dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeRole === 'TRAINER'
                  ? 'btn-admin-nav-active bg-purple-600 text-white shadow-xs ring-1 ring-purple-500 font-extrabold'
                  : 'btn-admin-nav-inactive text-slate-800 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10'
              }`}
              style={{
                backgroundColor: activeRole === 'TRAINER' ? '#9333ea' : undefined,
              }}
              title="Inspect & Control Lecturer / Trainer Studio"
            >
              <GraduationCap className={`w-3.5 h-3.5 ${activeRole === 'TRAINER' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
              <span
                style={{
                  color: activeRole === 'TRAINER' ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: activeRole === 'TRAINER' ? 800 : 700,
                }}
              >
                Lecturer Studio
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeRole === 'ADMIN'
                  ? 'btn-admin-nav-active bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500 font-extrabold'
                  : 'btn-admin-nav-inactive text-slate-800 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10'
              }`}
              style={{
                backgroundColor: activeRole === 'ADMIN' ? '#059669' : undefined,
              }}
              title="Return to Management Dashboard"
            >
              <Layers className={`w-3.5 h-3.5 ${activeRole === 'ADMIN' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span
                style={{
                  color: activeRole === 'ADMIN' ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: activeRole === 'ADMIN' ? 800 : 700,
                }}
              >
                Management Center
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex min-w-0">
        {/* Modern Desktop & Mobile Sidebar */}
        <ModernSidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          activeRole={activeRole}
        />

        {/* Main App Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 lg:pb-0">
          {/* Modern Top Header */}
          <ModernTopNav
            onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            activeRole={activeRole}
            onSwitchRole={handleSwitchRole}
          />

          {/* Page Content Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav activeRole={activeRole} />
      </div>
    </div>
  );
}
