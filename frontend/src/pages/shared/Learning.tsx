import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { Library, CheckCircle, Clock, Layers, MapPin, UserRound } from 'lucide-react';

interface CourseRecord {
  id: string;
  [key: string]: unknown;
}

const COURSE_ALIASES: Record<string, string[]> = {
  title: ['title', 'courseName', 'course_name', 'name'],
  description: ['description', 'courseDescription', 'course_description'],
  sector: ['sector', 'industry'],
  domain: ['domain', 'category', 'subject'],
  skills: ['skills', 'skill', 'techStack', 'technologies'],
  competencies: ['competencies', 'competency', 'learningObjectives'],
  level: ['level', 'difficulty'],
  duration: ['duration', 'durationHours', 'hours'],
  trainer: ['trainerName', 'instructor', 'instructorName'],
  mode: ['trainingMode', 'training_mode', 'learningMode', 'mode'],
  eligibility: ['eligibility', 'eligibilityCriteria', 'prerequisites'],
  dates: ['dates', 'courseDates', 'startDate', 'endDate', 'schedule'],
};

function courseValue(course: CourseRecord, field: string): string {
  const key = COURSE_ALIASES[field]?.find(alias => course[alias] !== undefined && course[alias] !== null && course[alias] !== '');
  const value = key ? course[key] : undefined;
  if (Array.isArray(value)) return value.join(', ');
  return value === undefined || value === null ? '' : String(value);
}

export default function Learning() {
  const { data, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => unwrap<any[]>(api.get('/users/me/enrollments')),
  });
  const { data: recommendedCourses = [] } = useQuery<CourseRecord[]>({
    queryKey: ['courses'],
    queryFn: () => unwrap<CourseRecord[]>(api.get('/courses')),
    enabled: !isLoading && !data?.length,
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
        <>
          <div className="state-box">
            <Library size={40} opacity={0.3} />
            <p style={{ marginTop: 10 }}>You are not enrolled in any courses yet.</p>
            <Link to="/trainee/courses" className="btn" style={{ marginTop: 14, display: 'inline-flex' }}>Browse Course Catalogue</Link>
          </div>

          {recommendedCourses.length > 0 && (
            <section>
              <div className="page-title" style={{ marginBottom: 16 }}>
                <div className="page-title-text">
                  <h2 style={{ fontSize: 18 }}>Recommended courses</h2>
                  <p>Explore published programmes and start building your learning plan.</p>
                </div>
                <Link to="/trainee/courses" className="link">View all courses &rarr;</Link>
              </div>
              <div className="course-grid">
                {recommendedCourses.slice(0, 3).map(course => {
                  const title = courseValue(course, 'title') || 'Untitled course';
                  const description = courseValue(course, 'description');
                  const domain = courseValue(course, 'domain');
                  const sector = courseValue(course, 'sector');
                  const skills = courseValue(course, 'skills');
                  const competencies = courseValue(course, 'competencies');
                  const trainer = courseValue(course, 'trainer') || (course.trainer as { name?: string } | undefined)?.name || 'Assigned trainer';
                  const duration = courseValue(course, 'duration');
                  const mode = courseValue(course, 'mode');
                  const level = courseValue(course, 'level');
                  const eligibility = courseValue(course, 'eligibility');
                  const dates = courseValue(course, 'dates');

                  return (
                    <article key={course.id} className="course-card">
                      <div className="course-card-body">
                        <div style={{ marginBottom: 8 }}>
                          {level && <span className="badge badge-blue">{level}</span>}
                          {domain && <span className="badge badge-gray" style={{ marginLeft: 6 }}>{domain}</span>}
                          {sector && <span className="badge badge-teal" style={{ marginLeft: 6 }}>{sector}</span>}
                        </div>
                        <h3 className="course-card-title">{title}</h3>
                        {description && <p className="course-card-desc">{description.slice(0, 140)}{description.length > 140 ? '…' : ''}</p>}
                        <div className="course-card-meta">
                          {duration && <span><Clock size={13} /> {duration}{/^\d+(\.\d+)?$/.test(duration) ? 'h' : ''}</span>}
                          {mode && <span><MapPin size={13} /> {mode}</span>}
                        </div>
                        <div className="course-card-fields">
                          <div><UserRound size={13} /><strong>Trainer</strong><span>{trainer}</span></div>
                          {skills && <div><Layers size={13} /><strong>Skills</strong><span>{skills}</span></div>}
                          {competencies && <div><strong>Competencies</strong><span>{competencies}</span></div>}
                          {eligibility && <div><strong>Eligibility</strong><span>{eligibility}</span></div>}
                          {dates && <div><strong>Dates</strong><span>{dates}</span></div>}
                        </div>
                      </div>
                      <div className="course-card-footer">
                        <Link to={`/trainee/courses/${course.id}`} className="btn" style={{ width: '100%', justifyContent: 'center' }}>View course</Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
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
