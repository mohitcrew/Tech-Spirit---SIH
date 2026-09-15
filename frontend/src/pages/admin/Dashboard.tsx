import { useQuery } from '@tanstack/react-query';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Users, BookOpen, CheckCircle, GraduationCap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../../services/api';
import { Loading, PageTitle, StatCard } from '../../components/ui';

const PIE_COLORS = ['#123b5d', '#1677a8', '#00a6a6'];

export default function AdminDashboard() {
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => unwrap<any[]>(api.get('/users')),
  });

  const { data: courses, isLoading: loadingCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  if (loadingUsers || loadingCourses) return <Loading />;

  const totalUsers = users?.length ?? 0;
  const trainees = (users ?? []).filter((u: any) => u.role === 'TRAINEE').length;
  const trainers = (users ?? []).filter((u: any) => u.role === 'TRAINER').length;
  const admins = (users ?? []).filter((u: any) => u.role === 'ADMIN').length;
  const totalCourses = courses?.length ?? 0;
  const publishedCourses = (courses ?? []).filter((c: any) => c.status === 'PUBLISHED').length;

  const rolePieData = [
    { name: 'Admin', value: admins },
    { name: 'Trainer', value: trainers },
    { name: 'Trainee', value: trainees },
  ].filter((d) => d.value > 0);

  // Bar chart: courses by category
  const catMap: Record<string, number> = {};
  (courses ?? []).forEach((c: any) => {
    const cat = c.category ?? 'Uncategorised';
    catMap[cat] = (catMap[cat] ?? 0) + 1;
  });
  const categoryData = Object.entries(catMap).map(([name, count]) => ({ name, count }));

  const recentUsers = (users ?? []).slice(0, 6);

  return (
    <>
      <PageTitle
        title="Admin Dashboard"
        subtitle="Overview of the Capacity Connect platform."
      />

      <div className="stats">
        <StatCard
          label="Total Users"
          value={totalUsers}
          sub="all roles"
          icon={<Users size={22} color="#1677a8" />}
        />
        <StatCard
          label="Trainees"
          value={trainees}
          sub="registered learners"
          icon={<GraduationCap size={22} color="#00a6a6" />}
        />
        <StatCard
          label="Trainers"
          value={trainers}
          sub="course instructors"
          icon={<ShieldCheck size={22} color="#d97706" />}
        />
        <StatCard
          label="Total Courses"
          value={totalCourses}
          sub={`${publishedCourses} published`}
          icon={<BookOpen size={22} color="#7c3aed" />}
        />
        <StatCard
          label="Published Courses"
          value={publishedCourses}
          sub="live & active"
          icon={<CheckCircle size={22} color="#16a34a" />}
        />
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        {/* Pie chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">User Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={rolePieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {rolePieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Courses by Category</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#1677a8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent users */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h2 className="card-title">Recent Users</h2>
          <Link to="/admin/users" className="btn btn-sm btn-outline">
            View all
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u: any) => (
                <tr key={u.id}>
                  <td>
                    <div className="table-avatar">
                      <div className="avatar-circle">
                        {u.name
                          .split(' ')
                          .map((p: string) => p[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'ADMIN'
                          ? 'badge-red'
                          : u.role === 'TRAINER'
                          ? 'badge-amber'
                          : 'badge-teal'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{u.profile?.department ?? '—'}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
