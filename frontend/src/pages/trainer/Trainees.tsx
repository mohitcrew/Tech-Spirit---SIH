import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loading, PageTitle, Alert } from '../../components/ui';

export default function Trainees() {
  const { user } = useAuth();

  const { data: allCourses, isLoading } = useQuery({
    queryKey: ['trainer-courses', user?.id],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  const courses = (allCourses ?? []).filter(
    (c: any) => c.trainerId === user?.id || c.trainer?.id === user?.id
  );

  const totalEnrolled = courses.reduce(
    (acc: number, c: any) => acc + (c._count?.enrollments ?? 0),
    0
  );

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title="Trainees"
        subtitle="Enrolled trainees across your courses."
      />

      <Alert type="info">
        Showing enrollment counts per course. To see individual trainee details, view the course page.
      </Alert>

      <div className="stats" style={{ marginTop: 16 }}>
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={22} color="#1677a8" />
          </div>
          <div className="stat-label">Total Enrollments</div>
          <div className="stat-value">{totalEnrolled}</div>
          <div className="stat-sub">across {courses.length} course(s)</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h2 className="card-title">Courses & Enrollment Counts</h2>
        </div>

        {courses.length === 0 ? (
          <div className="state-box">
            <p>
              No courses found.{' '}
              <Link className="link" to="/trainer/courses/create">
                Create a course to get started →
              </Link>
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Enrolled</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c: any) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.title}</strong>
                    </td>
                    <td>{c.category}</td>
                    <td>{c.level}</td>
                    <td>
                      <span
                        className={`badge ${
                          c.status === 'PUBLISHED'
                            ? 'badge-green'
                            : c.status === 'DRAFT'
                            ? 'badge-amber'
                            : 'badge-gray'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#1677a8' }}>
                        {c._count?.enrollments ?? 0}
                      </strong>
                    </td>
                    <td>
                      <Link
                        to={`/trainer/courses/${c.id}`}
                        className="btn btn-sm btn-outline"
                      >
                        View Course
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
