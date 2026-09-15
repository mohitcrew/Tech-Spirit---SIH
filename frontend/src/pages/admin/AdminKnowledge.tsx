import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookMarked, Plus, Trash2 } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { Loading, PageTitle, Alert } from '../../components/ui';

interface Article {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  author?: { name: string };
}

export default function AdminKnowledge() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState('');

  const { data: articles, isLoading } = useQuery({
    queryKey: ['knowledge'],
    queryFn: () => unwrap<Article[]>(api.get('/knowledge')),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      unwrap<any>(
        api.post('/knowledge', {
          title: form.title,
          content: form.content,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['knowledge'] });
      setForm({ title: '', content: '', tags: '' });
      setShowForm(false);
    },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Failed to create article.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/knowledge/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['knowledge'] }),
  });

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title="Knowledge Hub"
        subtitle="Manage all knowledge base articles."
        action={
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} style={{ marginRight: 6 }} />
            New Article
          </button>
        }
      />

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>New Knowledge Article</h3>
          {error && <Alert type="error">{error}</Alert>}
          <div className="form-group">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Article title"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your article content here..."
            />
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. NWP, Forecasting, Safety"
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !form.title}
            >
              {createMutation.isPending ? 'Publishing…' : 'Publish'}
            </button>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!articles?.length ? (
        <div className="card">
          <div className="state-box">
            <BookMarked size={40} color="#94a3b8" />
            <p>No articles in the knowledge hub yet.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Tags</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.title}</strong>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        {a.content.slice(0, 60)}
                        {a.content.length > 60 ? '…' : ''}
                      </div>
                    </td>
                    <td>{a.author?.name ?? '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(a.tags ?? []).map((t) => (
                          <span key={t} className="badge badge-blue">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: '#94a3b8' }}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteMutation.mutate(a.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
