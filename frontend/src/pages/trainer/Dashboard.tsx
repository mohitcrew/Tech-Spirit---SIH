import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loading, PageTitle, StatCard } from '../../components/ui';

import { trainerCourses, trainerAggregatedStats } from '../../data/trainerData';

function statusVariant(status: string) {
  if (status === 'PUBLISHED') return 'badge-green';
  if (status === 'DRAFT') return 'badge-amber';
  return 'badge-gray';
}

export default function TrainerDashboard() {
  const { user } = useAuth();

  const { data: allCourses, isLoading } = useQuery({
    queryKey: ['trainer-courses', user?.id],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  const apiFiltered = (allCourses ?? []).filter(
    (c: any) => c.trainerId === user?.id || c.trainer?.id === user?.id
  );

  const courses = apiFiltered.length > 0 ? apiFiltered : trainerCourses;

  const published = courses.filter((c: any) => c.status === 'PUBLISHED');
  const totalEnrolled = courses.reduce(
    (acc: number, c: any) => acc + (c._count?.enrollments ?? c.enrolledCount ?? 0),
    0
  );

  const avgScore = (() => {
    const all: number[] = [];
    courses.forEach((c: any) => {
      (c.assessments ?? []).forEach((a: any) => {
        if (typeof a.passingScore === 'number') all.push(a.passingScore);
      });
    });
    if (!all.length) return trainerAggregatedStats.avgDiagnosticScore;
    return Math.round(all.reduce((s, v) => s + v, 0) / all.length);
  })();

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title={`Welcome, ${user?.name.split(' ')[0]}`}
        subtitle="Trainer dashboard — manage your courses and track trainees."
      />

      <div className="stats">
        <StatCard
          label="My Courses"
          value={courses.length}
          sub="total created"
          icon={<BookOpen size={22} color="#1677a8" />}
        />
        <StatCard
          label="Total Trainees Enrolled"
          value={totalEnrolled}
          sub="across all courses"
          icon={<Users size={22} color="#00a6a6" />}
        />
        <StatCard
          label="Published Courses"
          value={published.length}
          sub="live & active"
          icon={<CheckCircle size={22} color="#16a34a" />}
        />
        <StatCard
          label="Avg Assessment Score"
          value={avgScore ? `${avgScore}%` : '—'}
          sub="passing threshold avg"
          icon={<TrendingUp size={22} color="#d97706" />}
        />
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h2 className="card-title">Recent Courses</h2>
          <Link to="/trainer/courses" className="btn btn-sm btn-outline">
            View all
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="state-box">
            <p>
              No courses yet.{' '}
              <Link className="link" to="/trainer/courses/create">
                Create one →
              </Link>
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Enrolled</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 8).map((c: any) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.title}</strong>
                    </td>
                    <td>{c.category}</td>
                    <td>{c.level}</td>
                    <td>{c._count?.enrollments ?? c.enrolledCount ?? 0}</td>
                    <td>
                      <span className={`badge ${statusVariant(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        className="btn btn-sm btn-outline"
                        to={`/trainer/courses/${c.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
