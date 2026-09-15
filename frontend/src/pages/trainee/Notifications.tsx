import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { PageTitle, Loading, Empty } from '../../components/ui';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function Notifications() {
  const qc = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => unwrap<Notification[]>(api.get('/notifications')),
  });

  async function markRead(id: string) {
    try {
      await api.patch(`/notifications/${id}/read`);
      qc.setQueryData<Notification[]>(['notifications'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // silently ignore
    }
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markRead(n.id)));
  }

  if (isLoading) return <Loading />;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <PageTitle
        title="Notifications"
        subtitle={
          unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'
        }
        action={
          unreadCount > 0 ? (
            <button className="btn btn-outline btn-sm" onClick={markAllRead}>
              Mark all as read
            </button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <Empty icon={<Bell size={40} color="#d1d5db" />}>
          No notifications yet.
        </Empty>
      ) : (
        <div className="card">
          {notifications.map((n, i) => (
            <div
              key={n.id}
              className="notif-item"
              style={{ cursor: n.isRead ? 'default' : 'pointer', borderBottom: i < notifications.length - 1 ? '1px solid #f3f4f6' : 'none' }}
              onClick={() => !n.isRead && markRead(n.id)}
            >
              <div className={`notif-dot${n.isRead ? ' read' : ''}`} />
              <div className="notif-content">
                <div style={{ fontWeight: n.isRead ? 500 : 700, fontSize: '0.9rem' }}>{n.title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '0.2rem' }}>{n.message}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              {!n.isRead && (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={(ev) => { ev.stopPropagation(); markRead(n.id); }}
                  style={{ flexShrink: 0 }}
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
