import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { PageTitle, Loading, Empty } from '../../components/ui';

interface Enrollment {
  id: string;
  courseId: string;
  status: string;
  progress: number;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    duration: number;
    assessments?: { id: string; title: string }[];
  };
}

function statusBadge(status: string) {
  if (status === 'COMPLETED') return 'badge-green';
  if (status === 'IN_PROGRESS') return 'badge-blue';
  return 'badge-amber';
}

function statusLabel(status: string) {
  if (status === 'COMPLETED') return 'Completed';
  if (status === 'IN_PROGRESS') return 'In Progress';
  return 'Enrolled';
}

export default function MyLearning() {
  const { data: enrollments = [], isLoading } = useQuery<Enrollment[]>({
    queryKey: ['enrollments'],
    queryFn: () => unwrap<Enrollment[]>(api.get('/users/me/enrollments')),
  });

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title="My Learning"
        subtitle="Track your enrolled courses and progress."
      />

      {enrollments.length === 0 ? (
        <Empty icon={<BookOpen size={40} color="#d1d5db" />}>
          You haven't enrolled in any courses yet.{' '}
          <Link className="link" to="/trainee/courses">Browse courses &rarr;</Link>
        </Empty>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {enrollments.map((e) => {
            const firstAssessment = e.course.assessments?.[0];
            return (
              <div key={e.id} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg,#1677a8,#00a6a6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <BookOpen size={26} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{e.course.title}</h3>
                      <span className={`badge ${statusBadge(e.status)}`}>{statusLabel(e.status)}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '0.6rem' }}>
                      Duration: {e.course.duration}h &bull; Enrolled {new Date(e.enrolledAt).toLocaleDateString()}
                    </div>
                    <div className="progress-bar" style={{ marginBottom: '0.25rem' }}>
                      <div
                        className="progress-fill progress-fill-blue"
                        style={{ width: `${e.progress ?? 0}%` }}
                      />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {e.progress ?? 0}% complete
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <Link to={`/trainee/courses/${e.courseId}`} className="btn btn-sm btn-outline">
                      View Course
                    </Link>
                    {firstAssessment && e.status !== 'COMPLETED' && (
                      <Link to={`/trainee/assessment/${firstAssessment.id}`} className="btn btn-sm">
                        Take Assessment &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
