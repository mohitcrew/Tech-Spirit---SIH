import React, { useState } from 'react';
import {
  Search, Bell, HelpCircle, Menu, Flame, Star, ChevronDown, Check, UserRound, Shield, LogOut, Sun, Moon
} from 'lucide-react';
import { currentUserProfile } from '../../data/capacityConnectData';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface ModernTopNavProps {
  onToggleSidebar: () => void;
  activeRole: string;
  onSwitchRole: (role: 'TRAINEE' | 'TRAINER' | 'ADMIN') => void;
  onOpenSearchModal?: () => void;
}

export const ModernTopNav: React.FC<ModernTopNavProps> = ({
  onToggleSidebar,
  activeRole,
  onSwitchRole,
}) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const notifications = [
    { id: 1, title: 'Live session starting in 15 mins', time: '10:45 AM', unread: true },
    { id: 2, title: 'You earned +50 XP from Daily Quiz', time: '1 hour ago', unread: true },
    { id: 3, title: 'Aisha commented on your reflection', time: '3 hours ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md db-top-search-anim">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search courses, skills, live workshops... (⌘K)"
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 rounded-2xl pl-10 pr-12 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 shadow-2xs db-kbd-badge">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 db-top-controls-anim">
        {/* Quick Streak & XP Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-2 p-1.5 px-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl">
          <div className="flex items-center gap-1 text-xs font-black text-amber-800 db-flame-hover cursor-pointer" title="Daily Streak Active">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentUserProfile.streakDays}d</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-amber-300" />
          <div className="flex items-center gap-1 text-xs font-black text-blue-700 db-star-hover cursor-pointer" title="Total Accumulated XP">
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            <span>{currentUserProfile.currentXp} XP</span>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="px-3 py-1.5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Role: {activeRole}</span>
            <ChevronDown className={`w-3 h-3 text-blue-500 transition-transform duration-200 ${showRoleMenu ? 'rotate-180' : ''}`} />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 db-dropdown-anim">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                Switch View Mode
              </div>
              {(['TRAINEE', 'TRAINER', 'ADMIN'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    onSwitchRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    activeRole === role ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>
                    {role === 'TRAINEE' ? 'Student / Learner' : role === 'TRAINER' ? 'Trainer / Educator' : 'Org Admin'}
                  </span>
                  {activeRole === role && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon with indicator */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-10 h-10 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className={`w-4 h-4 ${notifications.some(n => n.unread) ? 'db-bell-shake-anim' : ''}`} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 db-dropdown-anim">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors text-xs cursor-pointer">
                    <div className="font-semibold text-slate-800 leading-tight">{n.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-300 hover:-rotate-45" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
          )}
        </button>

        {/* Help Icon */}
        <button
          onClick={() => alert('CAPACITY CONNECT Support: Contact support@capacityconnect.edu or visit the Help Hub.')}
          className="hidden sm:flex w-10 h-10 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 items-center justify-center transition-colors cursor-pointer db-help-icon"
          title="Help & Knowledge Center"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer db-profile-pill"
          >
            <img
              src={currentUserProfile.avatarUrl}
              alt={currentUserProfile.name}
              className="w-8 h-8 rounded-xl object-cover border-2 border-blue-500 shadow-xs"
            />
            <span className="hidden xl:inline-block font-bold text-xs text-slate-800">
              {currentUserProfile.name.split(' ')[0]}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 hidden xl:inline-block transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 db-dropdown-anim">
              <div className="p-2 border-b border-slate-100 mb-1">
                <div className="font-bold text-xs text-slate-900">{currentUserProfile.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUserProfile.email}</div>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(`/${activeRole.toLowerCase()}/profile`);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <UserRound className="w-3.5 h-3.5 text-slate-400" />
                <span>My Learning Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
