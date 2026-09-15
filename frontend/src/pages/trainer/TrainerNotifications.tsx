import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { Loading, PageTitle } from '../../components/ui';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
}

export default function TrainerNotifications() {
  const qc = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => unwrap<Notification[]>(api.get('/notifications')),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAll = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = (notifications ?? []).filter((n) => !n.isRead).length;

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title="Notifications"
        subtitle={`${unread} unread notification${unread !== 1 ? 's' : ''}`}
        action={
          unread > 0 ? (
            <button className="btn btn-outline btn-sm" onClick={() => markAll.mutate()}>
              <CheckCheck size={15} style={{ marginRight: 5 }} />
              Mark all read
            </button>
          ) : undefined
        }
      />

      {!notifications?.length ? (
        <div className="card">
          <div className="state-box">
            <Bell size={40} color="#94a3b8" />
            <p>No notifications yet.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="notif-item"
              style={{ cursor: n.isRead ? 'default' : 'pointer' }}
              onClick={() => !n.isRead && markRead.mutate(n.id)}
            >
              <div className={`notif-dot ${n.isRead ? 'read' : ''}`} />
              <div className="notif-content">
                <strong>{n.title}</strong>
                <p style={{ margin: '2px 0', color: '#475569', fontSize: 14 }}>{n.message}</p>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
