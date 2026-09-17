import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search, Bell, HelpCircle, Menu, Flame, Star, ChevronDown, Check, UserRound, Shield, LogOut, Sun, Moon
} from 'lucide-react';
import { currentUserProfile } from '../../data/capacityConnectData';
import { learnerService } from '../../services/learnerService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

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
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: traineeProfile } = useQuery({
    queryKey: ['traineeProfile', user?.email],
    queryFn: () => learnerService.getTraineeProfile(),
  });

  const displayName = traineeProfile?.name || user?.name || currentUserProfile.name;
  const displayEmail = user?.email || traineeProfile?.email || currentUserProfile.email;
  const displayAvatar = traineeProfile?.photoUrl || user?.profile?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=0284c7,2563eb,7c3aed&textColor=ffffff`;
  const firstName = displayName.split(' ')[0];


  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md db-top-search-anim">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search courses, skills, live workshops... (⌘K)"
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl pl-10 pr-12 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 dark:text-slate-400 shadow-2xs db-kbd-badge">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Center: Subtle Demo Mode Indicator */}
      <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-semibold tracking-wide shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        Demo Environment &bull; Synthetic Data
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 db-top-controls-anim">
        {/* Quick Streak & XP Pill (Desktop) */}
        <div className="hidden md:flex items-center gap-2 p-1.5 px-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-500/30 rounded-2xl">
          <div className="flex items-center gap-1 text-xs font-black text-amber-800 dark:text-amber-300 db-flame-hover cursor-pointer" title="Daily Streak Active">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:text-amber-400" />
            <span>{currentUserProfile.streakDays}d</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-amber-300 dark:bg-amber-600" />
          <div className="flex items-center gap-1 text-xs font-black text-blue-700 dark:text-sky-300 db-star-hover cursor-pointer" title="Total Accumulated XP">
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500 dark:fill-sky-400 dark:text-sky-400" />
            <span>{currentUserProfile.currentXp} XP</span>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Role: {activeRole}</span>
            <ChevronDown className={`w-3 h-3 text-blue-500 dark:text-blue-400 transition-transform duration-200 ${showRoleMenu ? 'rotate-180' : ''}`} />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 db-dropdown-anim">
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
                    activeRole === role ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>
                    {role === 'TRAINEE' ? 'Student / Learner' : role === 'TRAINER' ? 'Trainer / Educator' : 'Org Admin'}
                  </span>
                  {activeRole === role && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
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
            title={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No unread notifications'}
            aria-label="Open notifications menu"
          >
            <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'db-bell-shake-anim text-blue-600' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 ring-2 ring-white text-[9px] font-black text-white flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-84 sm:w-92 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 db-dropdown-anim">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="text-[11px] text-blue-600 dark:text-cyan-400 hover:underline font-bold cursor-pointer transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 6).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.link) {
                          setShowNotifMenu(false);
                          navigate(n.link);
                        }
                      }}
                      className={`p-2.5 rounded-xl transition-all text-xs cursor-pointer border ${
                        !n.isRead
                          ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/50 hover:bg-blue-50'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100/70 text-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className={`font-semibold leading-tight ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {n.title}
                        </div>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {n.message}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60 dark:border-slate-800/60 text-[10px] text-slate-400">
                        <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {n.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                            {n.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifMenu(false);
                    navigate(`/${activeRole.toLowerCase()}/notifications`);
                  }}
                  className="w-full py-1.5 text-center text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
          className="hidden sm:flex w-10 h-10 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white items-center justify-center transition-colors cursor-pointer db-help-icon"
          title="Help & Knowledge Center"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer db-profile-pill"
          >
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-8 h-8 rounded-xl object-cover border-2 border-blue-500 shadow-xs"
            />
            <span className="hidden xl:inline-block font-bold text-xs text-slate-800 dark:text-white">
              {firstName}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 dark:text-slate-400 hidden xl:inline-block transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 db-dropdown-anim">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{displayName}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 truncate">{displayEmail}</div>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(`/${activeRole.toLowerCase()}/profile`);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <UserRound className="w-3.5 h-3.5 text-slate-400" />
                <span>My Learning Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
