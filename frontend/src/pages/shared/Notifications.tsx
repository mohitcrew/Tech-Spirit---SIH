import React, { useState } from 'react';
import { useNotifications, NotificationType, AppNotification } from '../../context/NotificationContext';
import {
  Bell, CheckCircle2, Flame, Trophy, Award, Sparkles, Filter, Trash2,
  ExternalLink, Search, RefreshCw, Send, CheckCheck, Shield, Clock, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    pushNotification,
    refetch,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | NotificationType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered list
  const filteredNotifications = notifications.filter(n => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      if (!matches) return false;
    }

    // Tab filter
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return !n.isRead;
    return n.type === activeFilter;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'CONTEST':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'XP':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'CERTIFICATE':
        return <Award className="w-5 h-5 text-emerald-500" />;
      case 'COURSE':
        return <Sparkles className="w-5 h-5 text-cyan-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBadgeStyle = (type: NotificationType) => {
    switch (type) {
      case 'CONTEST':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'XP':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'CERTIFICATE':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'COURSE':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Bell className="w-3.5 h-3.5" />
              Live Notification Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Platform Alerts & Updates
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Stay synchronized with SIH 2026 contests, live competency sessions, evaluation feedback, and XP bonuses.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read ({unreadCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Live Notification Tester Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-extrabold text-white">Interactive Live Notification Tester:</span>
            <span className="text-xs text-slate-400 hidden md:inline">Click any button to trigger an on-screen live website alert</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => pushNotification({
                title: '🔥 New SIH 2026 Bounty Unlocked!',
                message: 'MoES Satellite Doppler Radar sprint is live with ₹1,00,000 prize pool.',
                type: 'CONTEST',
                link: '/trainee/contests',
                badge: 'SIH 2026',
              })}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition cursor-pointer"
            >
              🔥 Test Contest Alert
            </button>

            <button
              onClick={() => pushNotification({
                title: '🏆 +200 XP Awarded!',
                message: 'Your diagnostic benchmark submission elevated your standing to Top 3%.',
                type: 'XP',
                link: '/trainee/roadmap',
                badge: '+200 XP',
              })}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
            >
              🏆 Test XP Award
            </button>

            <button
              onClick={() => pushNotification({
                title: '🎓 MoES Certified Specialist',
                message: 'Your cryptographic certificate for Full Stack Microservices is minted.',
                type: 'CERTIFICATE',
                link: '/trainee/certificates',
                badge: 'Verified',
              })}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
            >
              📜 Test Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts, announcements or events..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'CONTEST', label: 'Contests' },
            { id: 'COURSE', label: 'Courses' },
            { id: 'XP', label: 'XP & Badges' },
            { id: 'CERTIFICATE', label: 'Certificates' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              You're all caught up!
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {activeFilter === 'UNREAD'
                ? 'No unread notifications at the moment. All alerts have been reviewed.'
                : 'No notifications matched your current filter criteria.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(n => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden group ${
                !n.isRead
                  ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {/* Left Accent indicator */}
              {!n.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 dark:bg-cyan-400" />
              )}

              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getBadgeStyle(n.type)}`}>
                        {n.badge || n.type}
                      </span>
                      {!n.isRead && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          Unread
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <h3 className={`font-bold text-sm sm:text-base ${!n.isRead ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-800 dark:text-slate-300'}`}>
                    {n.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  {/* Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                      {n.link && (
                        <button
                          onClick={() => {
                            markAsRead(n.id);
                            navigate(n.link!);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                        >
                          <span>Open Resource</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {!n.isRead && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
