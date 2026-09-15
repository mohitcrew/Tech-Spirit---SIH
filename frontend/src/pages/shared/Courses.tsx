import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Clock, Layers, Search } from 'lucide-react';

export default function Courses() {
  const { user } = useAuth();
  const role = user!.role.toLowerCase();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  const filtered = data?.filter(c => {
    const q = search.toLowerCase();
    return (
      (!q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) &&
      (!level || c.level === level) &&
      (!category || c.category === category)
    );
  }) ?? [];

  const categories = [...new Set(data?.map((c: any) => c.category) ?? [])];

  const levelColor: Record<string, string> = {
    BEGINNER: 'badge-green',
    INTERMEDIATE: 'badge-amber',
    ADVANCED: 'badge-red',
  };

  return (
    <>
      <div className="page-title">
        <div className="page-title-text">
          <h1>Course Catalogue</h1>
          <p>Explore published learning programmes · {filtered.length} courses available</p>
        </div>
        {(user!.role === 'ADMIN' || user!.role === 'TRAINER') && (
          <Link to={`/${role}/courses/create`} className="btn">+ Create Course</Link>
        )}
      </div>

      <div className="card" style={{ padding: '16px 22px', marginBottom: 20, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input style={{ paddingLeft: 34 }} placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={{ width: 'auto' }} value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">All levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <select style={{ width: 'auto' }} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={String(c)} value={String(c)}>{String(c)}</option>)}
        </select>
        {(search || level || category) && (
          <button className="btn-outline btn btn-sm" onClick={() => { setSearch(''); setLevel(''); setCategory(''); }}>Clear</button>
        )}
      </div>

      {isLoading && <div className="state-box loading-pulse"><p>Loading courses…</p></div>}

      {!isLoading && !filtered.length && (
        <div className="state-box">
          <BookOpen size={36} opacity={0.3} />
          <p style={{ marginTop: 10 }}>No courses match your filters.</p>
        </div>
      )}

      <div className="course-grid">
        {filtered.map((c: any) => (
          <div key={c.id} className="course-card">
            <div className="course-card-thumb">
              <BookOpen size={40} />
            </div>
            <div className="course-card-body">
              <div style={{ marginBottom: 8 }}>
                <span className={`badge ${levelColor[c.level] ?? 'badge-blue'}`}>{c.level}</span>
                {' '}
                <span className="badge badge-gray">{c.category}</span>
              </div>
              <div className="course-card-title">{c.title}</div>
              <div className="course-card-desc">{c.description.slice(0, 110)}…</div>
              <div className="course-card-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {c.durationHours}h</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Layers size={13} /> {c._count?.modules ?? 0} modules</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12.5, color: '#64748b' }}>by {c.trainer?.name}</div>
            </div>
            <div className="course-card-footer">
              <Link to={`/${role}/courses/${c.id}`} className="btn" style={{ width: '100%', justifyContent: 'center' }}>View Course</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
