import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../../services/api';
import { Loading, PageTitle, Alert } from '../../components/ui';

const STATUSES = ['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'];

export default function AdminCourses() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/courses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-courses'] });
      setConfirmId(null);
    },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Delete failed.'),
  });

  const filtered = (courses ?? []).filter(
    (c: any) => statusFilter === 'ALL' || c.status === statusFilter
  );

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title="Courses"
        subtitle={`${courses?.length ?? 0} total courses`}
        action={
          <Link to="/admin/courses/create" className="btn">
            <PlusCircle size={16} style={{ marginRight: 6 }} />
            Create Course
          </Link>
        }
      />

      {error && <Alert type="error">{error}</Alert>}

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Trainer</th>
                <th>Category</th>
                <th>Level</th>
                <th>Status</th>
                <th>Enrollments</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.title}</strong>
                  </td>
                  <td>{c.trainer?.name ?? '—'}</td>
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
                  <td>{c._count?.enrollments ?? 0}</td>
                  <td style={{ fontSize: 12, color: '#94a3b8' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {confirmId === c.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteMutation.mutate(c.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setConfirmId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmId(c.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="state-box">
            <p>No courses found.</p>
          </div>
        )}
      </div>
    </>
  );
}
