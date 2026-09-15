import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ModernSidebar } from '../components/layout/ModernSidebar';
import { ModernTopNav } from '../components/layout/ModernTopNav';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';

export function PortalLayout() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeRole = user?.role || 'TRAINEE';

  const handleSwitchRole = (newRole: 'TRAINEE' | 'TRAINER' | 'ADMIN') => {
    switchRole(newRole);
    navigate(`/${newRole.toLowerCase()}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
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
  );
}
