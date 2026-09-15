import { useQuery } from '@tanstack/react-query';
import { BookOpen, Clock, CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageTitle, StatCard, Loading, Empty } from '../../components/ui';

interface Enrollment {
  id: string;
  courseId: string;
  status: string;
  progress: number;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    duration: number;
    trainer?: { name: string };
    assessments?: { id: string; title: string }[];
  };
}

export default function TraineeDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'Trainee';

  const { data: enrollments = [], isLoading } = useQuery<Enrollment[]>({
    queryKey: ['enrollments'],
    queryFn: () => unwrap<Enrollment[]>(api.get('/users/me/enrollments')),
  });

  const totalCourses = enrollments.length;
  const activeCourses = enrollments.filter(
    (e) => e.status === 'ENROLLED' || e.status === 'IN_PROGRESS'
  ).length;
  const completed = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const learningHours = enrollments.reduce((acc, e) => acc + (e.course?.duration ?? 0), 0);

  const inProgress = enrollments.filter(
    (e) => e.status === 'ENROLLED' || e.status === 'IN_PROGRESS'
  );

  const upcomingAssessments = enrollments
    .filter((e) => e.course?.assessments && e.course.assessments.length > 0)
    .flatMap((e) =>
      (e.course.assessments ?? []).map((a) => ({ ...a, courseTitle: e.course.title }))
    );

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title={`Welcome, ${firstName} \uD83D\uDC4B`}
        subtitle="Here's an overview of your learning journey."
      />

      <div className="stats">
        <StatCard
          label="Total Courses"
          value={totalCourses}
          sub="enrolled"
          icon={<BookOpen size={22} color="#1677a8" />}
        />
        <StatCard
          label="Active Courses"
          value={activeCourses}
          sub="in progress"
          icon={<TrendingUp size={22} color="#00a6a6" />}
        />
        <StatCard
          label="Completed"
          value={completed}
          sub="courses done"
          icon={<CheckCircle size={22} color="#22c55e" />}
        />
        <StatCard
          label="Learning Hours"
          value={`${learningHours}h`}
          sub="total duration"
          icon={<Clock size={22} color="#f59e0b" />}
        />
      </div>

      <div className="grid-2" style={{ marginTop: '1.5rem' }}>
        {/* Continue Learning */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Continue Learning</h2>
            <Link to="/trainee/courses" className="btn btn-outline btn-sm">
              Browse Courses
            </Link>
          </div>

          {inProgress.length === 0 ? (
            <Empty>No courses in progress. <Link className="link" to="/trainee/courses">Browse courses &rarr;</Link></Empty>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              {inProgress.map((e) => (
                <div key={e.id} className="row-item">
                  <div className="row-item-info" style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{e.course.title}</div>
                    {e.course.trainer && (
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.4rem' }}>
                        Trainer: {e.course.trainer.name}
                      </div>
                    )}
                    <div className="progress-bar">
                      <div
                        className="progress-fill progress-fill-blue"
                        style={{ width: `${e.progress ?? 0}%` }}
                      />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>
                      {e.progress ?? 0}% complete
                    </div>
                  </div>
                  <Link
                    to="/trainee/learning"
                    className="btn btn-sm btn-outline"
                    style={{ whiteSpace: 'nowrap', marginLeft: '1rem' }}
                  >
                    Open course <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Assessments */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Assessments</h2>
          </div>

          {upcomingAssessments.length === 0 ? (
            <Empty icon={<CheckCircle size={40} color="#d1d5db" />}>
              No upcoming assessments right now.
            </Empty>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {upcomingAssessments.map((a) => (
                <div key={a.id} className="row-item">
                  <div className="row-item-info">
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{a.courseTitle}</div>
                  </div>
                  <Link to={`/trainee/assessment/${a.id}`} className="btn btn-sm">
                    Take Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
