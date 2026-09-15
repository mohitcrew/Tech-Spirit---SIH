import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookMarked, ExternalLink, Plus, Trash2 } from 'lucide-react';
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

export default function TrainerKnowledge() {
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
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Failed to post article.'),
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
        subtitle="Share articles and resources with your trainees."
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
              placeholder="e.g. NWP, Forecasting, Python"
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
        <div className="grid-2">
          {articles.map((a) => (
            <div className="resource-card" key={a.id}>
              <div className="resource-icon">
                <BookMarked size={22} color="#1677a8" />
              </div>
              <div className="resource-info">
                <strong>{a.title}</strong>
                <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0' }}>
                  {a.content.slice(0, 100)}
                  {a.content.length > 100 ? '…' : ''}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                  {(a.tags ?? []).map((t) => (
                    <span key={t} className="badge badge-blue">
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 12,
                    color: '#94a3b8',
                  }}
                >
                  <span>{a.author?.name ?? 'Unknown'} · {new Date(a.createdAt).toLocaleDateString()}</span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteMutation.mutate(a.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
