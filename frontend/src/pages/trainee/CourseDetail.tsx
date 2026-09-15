import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, Layers, User, Target, BookOpen, FileText } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { PageTitle, Loading, Empty, Badge } from '../../components/ui';

interface Module {
  id: string;
  order: number;
  title: string;
  description: string;
}

interface Assessment {
  id: string;
  title: string;
  passingScore: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  objectives: string[];
  trainer?: { id: string; name: string };
  modules: Module[];
  assessments: Assessment[];
}

interface Enrollment {
  id: string;
  courseId: string;
  status: string;
  progress: number;
}

function levelBadge(level: string) {
  if (level === 'BEGINNER') return 'green';
  if (level === 'INTERMEDIATE') return 'blue';
  if (level === 'ADVANCED') return 'red';
  return 'gray';
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: course, isLoading: loadingCourse } = useQuery<Course>({
    queryKey: ['course', id],
    queryFn: () => unwrap<Course>(api.get(`/courses/${id}`)),
    enabled: !!id,
  });

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ['enrollments'],
    queryFn: () => unwrap<Enrollment[]>(api.get('/users/me/enrollments')),
  });

  const enrollment = enrollments.find((e) => e.courseId === id);
  const isEnrolled = !!enrollment;

  async function handleEnroll() {
    try {
      await api.post(`/courses/${id}/enroll`);
      await qc.invalidateQueries({ queryKey: ['enrollments'] });
      navigate('/trainee/learning');
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Failed to enrol. Please try again.');
    }
  }

  if (loadingCourse) return <Loading />;
  if (!course) return <Empty>Course not found.</Empty>;

  return (
    <>
      <PageTitle
        title={course.title}
        subtitle={course.trainer ? `By ${course.trainer.name}` : undefined}
      />

      {/* Meta bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Badge variant={levelBadge(course.level)}>{course.level}</Badge>
          {course.category && <Badge variant="gray">{course.category}</Badge>}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6b7280', fontSize: '0.875rem' }}>
            <Clock size={15} /> {course.duration} hours
          </span>
          {course.trainer && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6b7280', fontSize: '0.875rem' }}>
              <User size={15} /> {course.trainer.name}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6b7280', fontSize: '0.875rem' }}>
            <Layers size={15} /> {course.modules.length} modules
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Description */}
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: '0.75rem' }}>About this Course</h2>
            <p style={{ color: '#374151', lineHeight: 1.7 }}>{course.description}</p>
          </div>

          {/* Objectives */}
          {course.objectives && course.objectives.length > 0 && (
            <div className="card">
              <h2 className="card-title" style={{ marginBottom: '0.75rem' }}>
                <Target size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                Learning Objectives
              </h2>
              <ul style={{ paddingLeft: '1.25rem', color: '#374151', lineHeight: 2 }}>
                {course.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Modules */}
          {course.modules.length > 0 && (
            <div className="card">
              <h2 className="card-title" style={{ marginBottom: '0.75rem' }}>
                <BookOpen size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                Course Modules
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {course.modules.map((m) => (
                  <div key={m.id} className="row-item">
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: '#e8f4fd', color: '#1677a8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                      }}
                    >
                      {m.order}
                    </div>
                    <div className="row-item-info">
                      <div style={{ fontWeight: 600 }}>{m.title}</div>
                      {m.description && (
                        <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{m.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: enrol & assessments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            {isEnrolled ? (
              <>
                <div className="badge badge-green" style={{ marginBottom: '0.75rem' }}>Enrolled</div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill progress-fill-blue"
                      style={{ width: `${enrollment.progress ?? 0}%` }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {enrollment.progress ?? 0}% complete
                  </div>
                </div>
                <Link to="/trainee/learning" className="btn" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Continue Learning &rarr;
                </Link>
              </>
            ) : (
              <>
                <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Ready to start learning?
                </p>
                <button onClick={handleEnroll} className="btn" style={{ width: '100%' }}>
                  Enrol Now
                </button>
              </>
            )}
          </div>

          {course.assessments.length > 0 && (
            <div className="card">
              <h2 className="card-title" style={{ marginBottom: '0.75rem' }}>
                <FileText size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                Assessments
              </h2>
              {course.assessments.map((a) => (
                <div key={a.id} className="row-item" style={{ marginBottom: '0.5rem' }}>
                  <div className="row-item-info">
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Passing score: {a.passingScore}%
                    </div>
                  </div>
                  {isEnrolled && (
                    <Link to={`/trainee/assessment/${a.id}`} className="btn btn-sm btn-outline">
                      Take
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
