import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loading, PageTitle } from '../../components/ui';

export default function TrainerAssessments() {
  const { user } = useAuth();

  const { data: allCourses, isLoading } = useQuery({
    queryKey: ['trainer-courses', user?.id],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  const courses = (allCourses ?? []).filter(
    (c: any) => c.trainerId === user?.id || c.trainer?.id === user?.id
  );

  const coursesWithAssessments = courses.filter(
    (c: any) => c.assessments && c.assessments.length > 0
  );

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title="Assessments"
        subtitle="Assessments linked to your courses."
      />

      {coursesWithAssessments.length === 0 ? (
        <div className="card">
          <div className="state-box">
            <ClipboardCheck size={40} color="#94a3b8" />
            <p>No assessments found for your courses yet.</p>
          </div>
        </div>
      ) : (
        coursesWithAssessments.map((course: any) => (
          <div className="card" key={course.id} style={{ marginBottom: 20 }}>
            <div className="card-header">
              <h3 className="card-title">{course.title}</h3>
              <span
                className={`badge ${
                  course.status === 'PUBLISHED' ? 'badge-green' : 'badge-amber'
                }`}
              >
                {course.status}
              </span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Assessment Title</th>
                    <th>Passing Score</th>
                    <th>Questions</th>
                    <th>Published</th>
                  </tr>
                </thead>
                <tbody>
                  {course.assessments.map((a: any) => (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.title}</strong>
                      </td>
                      <td>{a.passingScore}%</td>
                      <td>{a._count?.questions ?? a.questions?.length ?? '—'}</td>
                      <td>
                        <span
                          className={`badge ${
                            a.isPublished ? 'badge-green' : 'badge-amber'
                          }`}
                        >
                          {a.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </>
  );
}
