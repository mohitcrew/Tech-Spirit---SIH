import {
  BookOpen, Bell, LayoutDashboard, UserRound, LogOut, Award,
  ClipboardCheck, Library, Users, BarChart3, Settings, BookMarked,
  PlusCircle, GraduationCap, FileText, Megaphone
} from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../services/api';

const traineeNav = [
  { path: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
  { path: 'courses', Icon: BookOpen, label: 'Courses' },
  { path: 'learning', Icon: Library, label: 'My Learning' },
  { path: 'assessments', Icon: ClipboardCheck, label: 'Assessments' },
  { path: 'certificates', Icon: Award, label: 'Certificates' },
  { path: 'knowledge', Icon: BookMarked, label: 'Knowledge Hub' },
  { path: 'notifications', Icon: Bell, label: 'Notifications' },
  { path: 'profile', Icon: UserRound, label: 'Profile' },
];

const trainerNav = [
  { path: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
  { path: 'courses', Icon: BookOpen, label: 'My Courses' },
  { path: 'courses/create', Icon: PlusCircle, label: 'Create Course' },
  { path: 'trainees', Icon: Users, label: 'Trainees' },
  { path: 'assessments', Icon: ClipboardCheck, label: 'Assessments' },
  { path: 'knowledge', Icon: BookMarked, label: 'Knowledge Hub' },
  { path: 'notifications', Icon: Bell, label: 'Notifications' },
  { path: 'profile', Icon: UserRound, label: 'Profile' },
];

const adminNav = [
  { path: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
  { path: 'users', Icon: Users, label: 'All Users' },
  { path: 'courses', Icon: BookOpen, label: 'Courses' },
  { path: 'enrollments', Icon: GraduationCap, label: 'Enrollments' },
  { path: 'assessments', Icon: ClipboardCheck, label: 'Assessments' },
  { path: 'certificates', Icon: Award, label: 'Certificates' },
  { path: 'knowledge', Icon: BookMarked, label: 'Knowledge Hub' },
  { path: 'analytics', Icon: BarChart3, label: 'Analytics' },
  { path: 'announcements', Icon: Megaphone, label: 'Announcements' },
  { path: 'audit-logs', Icon: FileText, label: 'Audit Logs' },
  { path: 'notifications', Icon: Bell, label: 'Notifications' },
  { path: 'settings', Icon: Settings, label: 'Settings' },
];

const navMap: any = { TRAINEE: traineeNav, TRAINER: trainerNav, ADMIN: adminNav };

function RoleBadge({ role }: any) {
  const map: any = { ADMIN: 'badge-red', TRAINER: 'badge-amber', TRAINEE: 'badge-teal' };
  return <span className={`badge ${map[role] || 'badge-gray'}`}>{role}</span>;
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

export function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const prefix = `/${user!.role.toLowerCase()}`;
  const navItems = navMap[user!.role] || traineeNav;

  const { data: unread } = useQuery({
    queryKey: ['notif-count'],
    queryFn: () => unwrap<any[]>(api.get('/notifications')).then(n => n.filter((x: any) => !x.isRead).length),
    refetchInterval: 30000,
  });

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="shell">
      <aside>
        <Link to="/" className="brand">
          <div className="brand-logo">CAP<span>ACITY</span></div>
        </Link>
        <div className="sidebar-section">Navigation</div>
        <nav>
          {navItems.map(({ path, Icon, label }: any) => (
            <NavLink key={path} to={`${prefix}/${path}`} end={path === 'dashboard'}>
              <Icon size={17} />
              <span>{label}</span>
              {path === 'notifications' && unread ? (
                <span className="badge badge-red" style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 7px' }}>{unread}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ padding: '10px 12px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1b527d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {initials(user!.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user!.name}</div>
              <RoleBadge role={user!.role} />
            </div>
          </div>
          <button className="logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main>
        <header>
          <span className="header-left">Ministry of Earth Sciences · India Meteorological Department</span>
          <div className="header-right">
            <button className="notif-btn" onClick={() => navigate(`${prefix}/notifications`)}>
              <Bell size={19} color="#64748b" />
              {(unread ?? 0) > 0 && <span className="notif-badge" />}
            </button>
            <div className="header-avatar">{initials(user!.name)}</div>
            <span className="header-user">{user!.name}</span>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
