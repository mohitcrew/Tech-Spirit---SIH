import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { Library, CheckCircle, Clock } from 'lucide-react';

export default function Learning() {
  const { data, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => unwrap<any[]>(api.get('/users/me/enrollments')),
  });

  if (isLoading) return <div className="state-box loading-pulse"><p>Loading your learning…</p></div>;

  return (
    <>
      <div className="page-title">
        <div className="page-title-text">
          <h1>My Learning</h1>
          <p>Track your progress across all enrolled courses</p>
        </div>
      </div>

      {!data?.length && (
        <div className="state-box">
          <Library size={40} opacity={0.3} />
          <p style={{ marginTop: 10 }}>You are not enrolled in any courses yet.</p>
          <Link to="/trainee/courses" className="btn" style={{ marginTop: 14, display: 'inline-flex' }}>Browse Course Catalogue</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data?.map((e: any) => (
          <div key={e.id} className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span className={`badge ${e.status === 'COMPLETED' ? 'badge-green' : 'badge-amber'}`}>
                    {e.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="badge badge-gray">{e.course?.level}</span>
                </div>
                <h2 style={{ color: '#123b5d', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{e.course?.title}</h2>
                <p style={{ color: '#64748b', fontSize: 13 }}>
                  Instructor: {e.course?.trainer?.name} · {e.course?.durationHours}h total
                </p>

                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>Progress</span>
                    <strong style={{ color: '#123b5d' }}>{e.progress}%</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>

                {e.status === 'COMPLETED' && (
                  <div className="alert alert-success" style={{ marginTop: 14 }}>
                    <CheckCircle size={16} />
                    <span>Course completed! {e.course?.assessments?.length > 0 ? 'Check your certificate.' : ''}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160 }}>
                <Link to={`/trainee/courses/${e.course?.id}`} className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>
                  View Course
                </Link>
                {e.course?.assessments?.[0] && e.status !== 'COMPLETED' && (
                  <Link to={`/trainee/assessments/${e.course.assessments[0].id}`} className="btn btn-sm" style={{ justifyContent: 'center' }}>
                    Take Assessment
                  </Link>
                )}
                {e.status === 'COMPLETED' && (
                  <Link to="/trainee/certificates" className="btn btn-sm btn-success" style={{ justifyContent: 'center' }}>
                    View Certificate
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
