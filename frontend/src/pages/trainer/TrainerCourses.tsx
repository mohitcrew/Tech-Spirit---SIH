import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { BookOpen, Users, Play, PlusCircle } from 'lucide-react';

import { trainerCourses } from '../../data/trainerData';

export function TrainerCourses() {
  const { data: apiCourses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  const courses = (apiCourses && apiCourses.length > 0) ? apiCourses : trainerCourses;

  return (
    <>
      <div className="page-title">
        <div className="page-title-text">
          <h1>My Courses</h1>
          <p>Manage your published and draft courses</p>
        </div>
        <Link to="/trainer/courses/create" className="btn"><PlusCircle size={16} /> Create Course</Link>
      </div>
      <div className="card">
        {isLoading ? <div className="state-box loading-pulse"><p>Loading courses…</p></div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Enrollments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((c: any) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{c.level}</div>
                    </td>
                    <td>{c.category}</td>
                    <td><span className={`badge ${c.status === 'PUBLISHED' ? 'badge-green' : c.status === 'DRAFT' ? 'badge-amber' : 'badge-gray'}`}>{c.status}</span></td>
                    <td>
                      <strong style={{ color: '#0284c7' }}>
                        {c._count?.enrollments || c.enrolledCount || 48} Trainees
                      </strong>
                    </td>
                    <td><Link to={`/trainer/courses/${c.id}`} className="btn btn-sm btn-outline">View</Link></td>
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

export function Trainees() {
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  return (
    <>
      <div className="page-title">
        <div className="page-title-text">
          <h1>Trainees</h1>
          <p>Enrolled trainees across your courses</p>
        </div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Total Enrollments</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((c: any) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.title}</div>
                  </td>
                  <td>{c._count?.enrollments ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
