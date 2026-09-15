import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Clock, BarChart2, User, CheckCircle, Layers, FileText } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = user!.role.toLowerCase();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => unwrap<any>(api.get(`/courses/${id}`)),
  });

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => unwrap<any[]>(api.get('/users/me/enrollments')),
    enabled: user!.role !== 'ADMIN',
  });

  const isEnrolled = enrollments?.some((e: any) => e.course?.id === id || e.courseId === id);

  const enroll = useMutation({
    mutationFn: () => unwrap(api.post(`/courses/${id}/enroll`)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments'] });
      navigate(`/${role}/learning`);
    },
  });

  const levelColor: Record<string, string> = {
    BEGINNER: 'badge-green',
    INTERMEDIATE: 'badge-amber',
    ADVANCED: 'badge-red',
  };

  if (isLoading) return <div className="state-box loading-pulse"><p>Loading course…</p></div>;
  if (!course) return <div className="state-box"><p>Course not found.</p></div>;

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Link to={`/${role}/courses`} className="link" style={{ fontSize: 13 }}>← Back to catalogue</Link>
      </div>
      <div className="page-title">
        <div className="page-title-text">
          <div style={{ marginBottom: 8 }}>
            <span className={`badge ${levelColor[course.level]}`}>{course.level}</span>
            {' '}
            <span className="badge badge-gray">{course.category}</span>
          </div>
          <h1>{course.title}</h1>
          <p>{course.department}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexDirection: 'column', alignItems: 'flex-end' }}>
          {user!.role === 'TRAINEE' && (
            isEnrolled
              ? <Link to="/trainee/learning" className="btn btn-success">Continue Learning →</Link>
              : <button className="btn" onClick={() => enroll.mutate()} disabled={enroll.isPending}>
                  {enroll.isPending ? 'Enrolling…' : 'Enroll Now'}
                </button>
          )}
          {(user!.role === 'TRAINER' || user!.role === 'ADMIN') && (
            <Link to={`/${role}/courses/${id}/edit`} className="btn btn-outline">Edit Course</Link>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">About this course</div>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: 14.5 }}>{course.description}</p>

            <div style={{ display: 'flex', gap: 24, marginTop: 18, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', fontSize: 13.5 }}>
                <Clock size={15} /> {course.durationHours} hours
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', fontSize: 13.5 }}>
                <User size={15} /> {course.trainer?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', fontSize: 13.5 }}>
                <Layers size={15} /> {course.modules?.length ?? 0} modules
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#64748b', fontSize: 13.5 }}>
                <BarChart2 size={15} /> {course.level}
              </div>
            </div>
          </div>

          {course.learningObjectives?.length > 0 && (
            <div className="card">
              <div className="card-title">Learning Objectives</div>
              {course.learningObjectives.map((obj: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                  <CheckCircle size={15} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: '#475569' }}>{obj}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Course Modules ({course.modules?.length ?? 0})</div>
            {course.modules?.length ? course.modules.map((m: any) => (
              <div key={m.id} className="row-item">
                <div className="row-item-info">
                  <strong><span style={{ color: '#1677a8', marginRight: 6 }}>{m.order}.</span>{m.title}</strong>
                  <p>{m.description}</p>
                </div>
                <Layers size={15} color="#94a3b8" />
              </div>
            )) : <div className="state-box" style={{ padding: 30 }}><p>No modules added yet.</p></div>}
          </div>

          {course.assessments?.length > 0 && (
            <div className="card">
              <div className="card-title">Assessments</div>
              {course.assessments.map((a: any) => (
                <div key={a.id} className="row-item">
                  <div className="row-item-info">
                    <strong>{a.title}</strong>
                    <p>Passing score: {a.passingScore}%</p>
                  </div>
                  {user!.role === 'TRAINEE' && isEnrolled && (
                    <Link to={`/trainee/assessments/${a.id}`} className="btn btn-sm">Take Assessment</Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {course.resources?.length > 0 && (
            <div className="card">
              <div className="card-title">Resources</div>
              {course.resources.map((r: any) => (
                <div key={r.id} className="row-item">
                  <div className="row-item-info">
                    <strong>{r.title}</strong>
                    <p>{r.type}</p>
                  </div>
                  <a href={r.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">Open</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {user!.role === 'TRAINEE' && !isEnrolled && (
        <div className="alert alert-info">
          <BookOpen size={18} />
          <div>
            <strong>Ready to learn?</strong>
            <div>Enroll in this course to access modules, assessments, and earn a certificate on completion.</div>
          </div>
        </div>
      )}
    </>
  );
}
