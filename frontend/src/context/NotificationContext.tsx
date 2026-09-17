import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api, unwrap } from '../services/api';
import {
  Bell, CheckCircle2, Flame, Trophy, Award, Sparkles, X, Info, AlertTriangle, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type NotificationType =
  | 'COURSE'
  | 'CONTEST'
  | 'XP'
  | 'CERTIFICATE'
  | 'SYSTEM'
  | 'ANNOUNCEMENT'
  | 'EMAIL';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
  badge?: string;
}

interface ToastItem {
  id: string;
  notif: AppNotification;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  pushNotification: (data: {
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
    badge?: string;
  }) => void;
  dismissToast: (id: string) => void;
  refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>(null as any);

const DEFAULT_NOTIFICATIONS: Record<string, AppNotification[]> = {
  TRAINEE: [
    {
      id: 'demo-notif-1',
      title: 'MoES Satellite Doppler Radar Masterclass',
      message: 'Interactive live session starting in 15 minutes. Join room to calibrate sensors.',
      type: 'COURSE',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      link: '/trainee/courses',
      badge: 'Live Now',
    },
    {
      id: 'demo-notif-2',
      title: 'SIH 2026 Grand Challenge: PS SIH26075 Live!',
      message: 'Ministry of Earth Sciences Grand Challenge is open with ₹1,50,000 in bounties.',
      type: 'CONTEST',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      link: '/trainee/contests',
      badge: 'Bounty Alert',
    },
    {
      id: 'demo-notif-3',
      title: '+150 XP Daily Diagnostic Bonus',
      message: 'You completed your competency roadmap calibration! Your rank elevated to Top 5%.',
      type: 'XP',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      link: '/trainee/roadmap',
      badge: '+150 XP',
    },
    {
      id: 'demo-notif-4',
      title: 'Verified Credential Ready: Cloud Telemetry',
      message: 'Your official certificate of competency has been minted with cryptographic verification.',
      type: 'CERTIFICATE',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      link: '/trainee/certificates',
    },
  ],
  TRAINER: [
    {
      id: 'demo-notif-tr-1',
      title: 'New Cohort Submissions Awaiting Evaluation',
      message: '12 Trainees submitted their Doppler Radar netCDF telemetry assignments.',
      type: 'COURSE',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      link: '/trainer/trainees',
      badge: '12 Pending',
    },
    {
      id: 'demo-notif-tr-2',
      title: 'Masterclass Scheduled: Friday 10:00 AM',
      message: 'Live containerized microservices session has reached 100% attendee capacity.',
      type: 'ANNOUNCEMENT',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      link: '/trainer/dashboard',
    },
  ],
  ADMIN: [
    {
      id: 'demo-notif-adm-1',
      title: 'New Learner Registration Batch Completed',
      message: '75 synthetic demo candidates were successfully provisioned and verified in dev.db.',
      type: 'SYSTEM',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      link: '/admin/users',
      badge: '75 Verified',
    },
    {
      id: 'demo-notif-adm-2',
      title: 'Email Delivery Gateway Status: Healthy',
      message: 'Browser and backend EmailJS dispatchers operating at 100% throughput.',
      type: 'EMAIL',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      link: '/admin/email-center',
    },
  ],
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const userRole = user?.role || 'TRAINEE';
  const storageKey = user?.email
    ? `skillsync_notifications_${user.email.toLowerCase().trim()}`
    : 'skillsync_notifications_guest';

  // Load and merge notifications
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    let remoteNotifs: AppNotification[] = [];

    // 1. Try to fetch from backend if logged in
    const token = localStorage.getItem('cc_token');
    if (token && !token.startsWith('demo_token_')) {
      try {
        const res = await unwrap<any[]>(api.get('/notifications'));
        if (Array.isArray(res) && res.length > 0) {
          remoteNotifs = res.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: (n.type as NotificationType) || 'SYSTEM',
            isRead: Boolean(n.isRead),
            createdAt: n.createdAt,
            link: n.type === 'CONTEST' ? '/trainee/contests' : n.type === 'COURSE' ? '/trainee/courses' : undefined,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch backend notifications:', err);
      }
    }

    // 2. Check localStorage
    const saved = localStorage.getItem(storageKey);
    let localNotifs: AppNotification[] = [];
    if (saved) {
      try {
        localNotifs = JSON.parse(saved);
      } catch {}
    }

    // 3. Fallback defaults if both empty
    const defaults = DEFAULT_NOTIFICATIONS[userRole] || DEFAULT_NOTIFICATIONS.TRAINEE;

    // Combine avoiding duplicate IDs
    const map = new Map<string, AppNotification>();

    // Add defaults first
    defaults.forEach(d => map.set(d.id, { ...d }));

    // Merge saved local states (e.g. read status changes)
    localNotifs.forEach(l => {
      const existing = map.get(l.id);
      if (existing) {
        map.set(l.id, { ...existing, isRead: l.isRead });
      } else {
        map.set(l.id, l);
      }
    });

    // Merge remote database notifications (they take precedence)
    remoteNotifs.forEach(r => map.set(r.id, r));

    const combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setNotifications(combined);
    localStorage.setItem(storageKey, JSON.stringify(combined));
    setLoading(false);
  }, [userRole, storageKey]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Periodic check for new notifications every 45s
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 45000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Dismiss a toast
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Display on-screen toast notification
  const showToast = useCallback((notif: AppNotification) => {
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [
      { id: toastId, notif },
      ...prev.slice(0, 2), // Max 3 toasts at once
    ]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 6000);
  }, []);

  // Push a new dynamic notification
  const pushNotification = useCallback((data: {
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
    badge?: string;
  }) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title,
      message: data.message,
      type: data.type || 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: data.link,
      badge: data.badge,
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    // Also notify backend if online
    const token = localStorage.getItem('cc_token');
    if (token && !token.startsWith('demo_token_')) {
      api.post('/notifications/test', {
        title: data.title,
        message: data.message,
        type: data.type || 'SYSTEM',
      }).catch(() => {});
    }

    // Trigger on-screen banner/toast!
    showToast(newNotif);
  }, [storageKey, showToast]);

  // Mark single as read
  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, isRead: true } : n));
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    const token = localStorage.getItem('cc_token');
    if (token && !token.startsWith('demo_token_')) {
      try {
        await api.patch(`/notifications/${id}/read`);
      } catch (err) {
        console.warn('Could not sync markRead with backend:', err);
      }
    }
  }, [storageKey]);

  // Mark ALL as read
  const markAllAsRead = useCallback(async () => {
    // 1. Immediately update frontend state so badge clears instantly
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    // 2. Sync with backend API
    const token = localStorage.getItem('cc_token');
    if (token && !token.startsWith('demo_token_')) {
      try {
        await api.patch('/notifications/read-all');
      } catch (err) {
        console.warn('Could not sync read-all with backend:', err);
      }
    }
  }, [storageKey]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    const token = localStorage.getItem('cc_token');
    if (token && !token.startsWith('demo_token_')) {
      try {
        await api.delete(`/notifications/${id}`);
      } catch (err) {
        console.warn('Could not delete notification on backend:', err);
      }
    }
  }, [storageKey]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        pushNotification,
        dismissToast,
        refetch: loadNotifications,
      }}
    >
      {children}

      {/* Global Live On-Screen Notification Banner / Toast Overlay */}
      <div
        className="fixed top-20 right-4 sm:right-8 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm sm:max-w-md w-full"
        aria-live="polite"
      >
        {toasts.map(toast => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
            onMarkRead={() => markAsRead(toast.notif.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);

// Floating Toast Card Component
function ToastCard({
  toast,
  onDismiss,
  onMarkRead,
}: {
  toast: ToastItem;
  onDismiss: () => void;
  onMarkRead: () => void;
}) {
  const navigate = useNavigate();
  const { notif } = toast;

  const getIcon = () => {
    switch (notif.type) {
      case 'CONTEST':
        return <Flame className="w-5 h-5 text-rose-400 animate-pulse" />;
      case 'XP':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'CERTIFICATE':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'COURSE':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorder = () => {
    switch (notif.type) {
      case 'CONTEST':
        return 'border-rose-500/50 shadow-rose-500/20';
      case 'XP':
        return 'border-amber-500/50 shadow-amber-500/20';
      case 'CERTIFICATE':
        return 'border-emerald-500/50 shadow-emerald-500/20';
      case 'COURSE':
        return 'border-cyan-500/50 shadow-cyan-500/20';
      default:
        return 'border-blue-500/50 shadow-blue-500/20';
    }
  };

  return (
    <div
      className={`pointer-events-auto bg-slate-900/95 backdrop-blur-xl border ${getBorder()} text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3.5 relative overflow-hidden group hover:scale-[1.02]`}
    >
      {/* Top accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {notif.badge || notif.type}
          </span>
          <span className="text-[11px] text-slate-400">Just now</span>
        </div>
        <h4 className="font-bold text-sm text-slate-100 leading-snug line-clamp-1">
          {notif.title}
        </h4>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
          {notif.message}
        </p>

        {notif.link && (
          <button
            onClick={() => {
              onMarkRead();
              onDismiss();
              navigate(notif.link!);
            }}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        title="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
