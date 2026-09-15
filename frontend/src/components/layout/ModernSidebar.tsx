import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Compass, Route, Target, Award,
  BookMarked, Users, Trophy, Calendar, HelpCircle, LogOut, X, Sparkles
} from 'lucide-react';
import { currentUserProfile } from '../../data/capacityConnectData';

interface ModernSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeRole: string;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isOpen = false,
  onClose,
  activeRole,
}) => {
  const navigate = useNavigate();
  const rolePrefix = `/${activeRole.toLowerCase()}`;

  const navItems = [
    { label: 'Dashboard', path: `${rolePrefix}/dashboard`, icon: LayoutDashboard },
    { label: 'My Learning', path: `${rolePrefix}/learning`, icon: BookOpen },
    { label: 'Explore Courses', path: `${rolePrefix}/courses`, icon: Compass },
    { label: 'Learning Paths', path: `${rolePrefix}/paths`, icon: Route },
    { label: 'Skills', path: `${rolePrefix}/skills`, icon: Target },
    { label: 'Certificates', path: `${rolePrefix}/certificates`, icon: Award },
    { label: 'Knowledge Hub', path: `${rolePrefix}/knowledge`, icon: BookMarked },
    { label: 'Community', path: `${rolePrefix}/community`, icon: Users },
    { label: 'Leaderboard', path: `${rolePrefix}/leaderboard`, icon: Trophy },
    { label: 'Calendar', path: `${rolePrefix}/calendar`, icon: Calendar },
    { label: 'Help & Support', path: `${rolePrefix}/help`, icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/20 overflow-hidden">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                <img
                  src="https://res.cloudinary.com/djmqwehwk/image/upload/v1789454602/Skill_Sync_WB_ehnf16.png"
                  alt="SkillSync Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight text-sm leading-tight">
                Skill<span className="text-blue-600">Sync</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase mt-0.5">
                Capacity Intelligence
              </div>
            </div>
          </div>

          {/* Close for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Learning Portal
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.label === 'Dashboard' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                    {item.label === 'Community' && (
                      <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[9px] font-extrabold">
                        New
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Profile Mini-card */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/60">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs mb-2 flex items-center gap-3">
            <img
              src={currentUserProfile.avatarUrl}
              alt={currentUserProfile.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-900 truncate">
                {currentUserProfile.name}
              </div>
              <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Level {currentUserProfile.level} Explorer</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
