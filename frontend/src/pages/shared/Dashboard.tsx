import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, CheckCircle, Clock, Award, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const role = user!.role.toLowerCase();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => unwrap<any[]>(api.get('/users/me/enrollments')),
    enabled: user!.role !== 'ADMIN',
  });

  const { data: courses } = useQuery({
    queryKey: ['all-courses'],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  const { data: allUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => unwrap<any[]>(api.get('/users')),
    enabled: user!.role === 'ADMIN',
  });

  if (user!.role === 'ADMIN') {
    const trainees = allUsers?.filter((u: any) => u.role === 'TRAINEE').length ?? 0;
    const trainers = allUsers?.filter((u: any) => u.role === 'TRAINER').length ?? 0;
    const published = courses?.filter((c: any) => c.status === 'PUBLISHED').length ?? 0;

    return (
      <>
        <div className="page-title">
          <div className="page-title-text">
            <h1>Admin Dashboard</h1>
            <p>Platform overview — Ministry of Earth Sciences · IMD</p>
          </div>
        </div>
        <div className="stats">
          {[
            { label: 'Total Users', value: allUsers?.length ?? 0, icon: <BookOpen size={20} /> },
            { label: 'Trainees', value: trainees, icon: <CheckCircle size={20} /> },
            { label: 'Trainers', value: trainers, icon: <Clock size={20} /> },
            { label: 'Published Courses', value: published, icon: <Award size={20} /> },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="grid-2">
          <div className="card">
            <div className="card-title">Recent Users</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {allUsers?.slice(0, 8).map((u: any) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="table-avatar">{u.name.slice(0, 2).toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-red' : u.role === 'TRAINER' ? 'badge-amber' : 'badge-teal'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Course Overview</div>
            {courses?.slice(0, 8).map((c: any) => (
              <div key={c.id} className="row-item">
                <div className="row-item-info">
                  <strong>{c.title}</strong>
                  <p>{c.category} · {c.level}</p>
                </div>
                <span className={`badge ${c.status === 'PUBLISHED' ? 'badge-green' : c.status === 'DRAFT' ? 'badge-amber' : 'badge-gray'}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (user!.role === 'TRAINER') {
    const myCourses = courses?.filter((c: any) => c.trainerId === user!.id) ?? [];
    return (
      <>
        <div className="page-title">
          <div className="page-title-text">
            <h1>Welcome, {user!.name.split(' ')[0]}</h1>
            <p>Trainer dashboard — your courses and trainees</p>
          </div>
          <Link to="/trainer/courses/create" className="btn">+ Create Course</Link>
        </div>
        <div className="stats">
          {[
            { label: 'My Courses', value: myCourses.length },
            { label: 'Published', value: myCourses.filter((c: any) => c.status === 'PUBLISHED').length },
            { label: 'Total Enrollments', value: myCourses.reduce((n: number, c: any) => n + (c._count?.enrollments ?? 0), 0) },
            { label: 'Draft Courses', value: myCourses.filter((c: any) => c.status === 'DRAFT').length },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">My Courses</div>
          {myCourses.length ? myCourses.map((c: any) => (
            <div key={c.id} className="row-item">
              <div className="row-item-info">
                <strong>{c.title}</strong>
                <p>{c.category} · {c.durationHours}h · {c._count?.enrollments ?? 0} enrolled</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`badge ${c.status === 'PUBLISHED' ? 'badge-green' : 'badge-amber'}`}>{c.status}</span>
                <Link to={`/trainer/courses/${c.id}`} className="btn btn-sm btn-outline">View</Link>
              </div>
            </div>
          )) : <div className="state-box"><p>No courses created yet. <Link to="/trainer/courses/create" className="link">Create your first course.</Link></p></div>}
        </div>
      </>
    );
  }

  // TRAINEE dashboard
  const completed = enrollments?.filter((e: any) => e.status === 'COMPLETED').length ?? 0;
  const active = enrollments?.filter((e: any) => e.status === 'ENROLLED').length ?? 0;
  const hours = enrollments?.reduce((n: number, e: any) => n + (e.course?.durationHours ?? 0), 0) ?? 0;

  return (
    <>
      <div className="page-title">
        <div className="page-title-text">
          <h1>Welcome, {user!.name.split(' ')[0]}</h1>
          <p>Your personal learning dashboard — IMD Capacity Connect</p>
        </div>
        <Link to="/trainee/courses" className="btn">Browse Courses</Link>
      </div>

      <div className="stats">
        {[
          { label: 'Enrolled Courses', value: enrollments?.length ?? 0, icon: <BookOpen size={20} /> },
          { label: 'Active Learning', value: active, icon: <Clock size={20} /> },
          { label: 'Completed', value: completed, icon: <CheckCircle size={20} /> },
          { label: 'Learning Hours', value: hours, icon: <Award size={20} /> },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2>Continue Learning</h2>
            <Link to="/trainee/learning" className="link" style={{ fontSize: 13 }}>View all →</Link>
          </div>
          {isLoading && <div className="state-box loading-pulse"><p>Loading enrollments…</p></div>}
          {!isLoading && !enrollments?.length && (
            <div className="state-box">
              <BookOpen size={32} opacity={0.3} />
              <p style={{ marginTop: 8 }}>No courses yet. <Link to="/trainee/courses" className="link">Browse the catalogue.</Link></p>
            </div>
          )}
          {enrollments?.filter((e: any) => e.status === 'ENROLLED').slice(0, 4).map((e: any) => (
            <div key={e.id} className="row-item">
              <div className="row-item-info">
                <strong>{e.course?.title}</strong>
                <p>{e.course?.trainer?.name} · {e.progress}% complete</p>
                <div style={{ marginTop: 6 }}>
                  <div className="progress-bar" style={{ width: 200 }}>
                    <div className="progress-fill" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>
              </div>
              <Link to={`/trainee/courses/${e.course?.id}`} className="btn btn-sm btn-outline">Open</Link>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Upcoming Assessments</h2>
          </div>
          {enrollments?.filter((e: any) => e.course?.assessments?.length > 0).slice(0, 4).map((e: any) => (
            <div key={e.id} className="row-item">
              <div className="row-item-info">
                <strong>{e.course?.assessments?.[0]?.title}</strong>
                <p>From: {e.course?.title}</p>
              </div>
              <Link to={`/trainee/assessments/${e.course?.assessments?.[0]?.id}`} className="btn btn-sm">Start</Link>
            </div>
          ))}
          {!enrollments?.filter((e: any) => e.course?.assessments?.length > 0).length && (
            <div className="state-box">
              <AlertCircle size={28} opacity={0.3} />
              <p style={{ marginTop: 8 }}>No assessments available yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
