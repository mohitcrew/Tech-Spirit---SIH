import { useState } from 'react';
import { Search, FileText, Video, Presentation, FileSpreadsheet, Info } from 'lucide-react';
import { PageTitle, Alert } from '../../components/ui';

interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'PRESENTATION' | 'GUIDELINES';
  category: string;
  description: string;
  updatedAt: string;
}

const SAMPLE_RESOURCES: Resource[] = [
  { id: '1', title: 'Workplace Safety Guidelines', type: 'GUIDELINES', category: 'Safety', description: 'Comprehensive guide to maintaining a safe workplace environment.', updatedAt: '2026-09-01' },
  { id: '2', title: 'Introduction to Agile Methodology', type: 'PDF', category: 'Project Management', description: 'Core concepts of Agile, Scrum, and Kanban frameworks.', updatedAt: '2026-08-20' },
  { id: '3', title: 'Cybersecurity Awareness Training', type: 'VIDEO', category: 'IT Security', description: 'Video module on phishing, password hygiene, and data protection.', updatedAt: '2026-09-10' },
  { id: '4', title: 'Leadership & Communication Skills', type: 'PRESENTATION', category: 'Soft Skills', description: 'Slide deck covering effective communication and leadership.', updatedAt: '2026-07-15' },
  { id: '5', title: 'Data Analysis with Excel', type: 'PDF', category: 'Analytics', description: 'Step-by-step guide to using pivot tables, VLOOKUP, and charts.', updatedAt: '2026-08-05' },
  { id: '6', title: 'Compliance & Ethics Overview', type: 'GUIDELINES', category: 'Compliance', description: 'Organisational ethics policy and regulatory compliance essentials.', updatedAt: '2026-09-12' },
  { id: '7', title: 'React & TypeScript Crash Course', type: 'VIDEO', category: 'Engineering', description: 'Quick-start video series for modern frontend development.', updatedAt: '2026-08-30' },
  { id: '8', title: 'Q3 2026 Strategy Deck', type: 'PRESENTATION', category: 'Strategy', description: 'Company roadmap and OKRs for Q3 2026.', updatedAt: '2026-09-05' },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  PDF: <FileText size={24} color="#dc2626" />,
  VIDEO: <Video size={24} color="#1677a8" />,
  PRESENTATION: <Presentation size={24} color="#d97706" />,
  GUIDELINES: <FileSpreadsheet size={24} color="#16a34a" />,
};

const TYPE_COLORS: Record<string, string> = {
  PDF: '#fef2f2',
  VIDEO: '#eff6ff',
  PRESENTATION: '#fffbeb',
  GUIDELINES: '#f0fdf4',
};

const ALL_TYPES = ['PDF', 'VIDEO', 'PRESENTATION', 'GUIDELINES'];

export default function KnowledgeHub() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [category, setCategory] = useState('');

  const categories = Array.from(new Set(SAMPLE_RESOURCES.map((r) => r.category)));

  const filtered = SAMPLE_RESOURCES.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || r.type === typeFilter;
    const matchCat = !category || r.category === category;
    return matchSearch && matchType && matchCat;
  });

  return (
    <>
      <PageTitle
        title="Knowledge Hub"
        subtitle="Browse training materials, guidelines, and resources."
      />

      <Alert type="info">
        <Info size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
        Full RAG-powered semantic search is coming in Phase 3. Currently showing curated resources.
      </Alert>

      {/* Filters */}
      <div className="card" style={{ margin: '1.25rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
            />
            <input
              style={{ paddingLeft: '2rem', width: '100%' }}
              placeholder="Search resourcesâ€¦"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ flex: '0 0 160px' }}>
            <option value="">All Types</option>
            {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: '0 0 180px' }}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {(search || typeFilter || category) && (
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setTypeFilter(''); setCategory(''); }}>
              Clear
            </button>
          )}
        </div>

        {/* Type chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${typeFilter === t ? '' : 'btn-outline'}`}
              onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              {TYPE_ICONS[t]} {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="state-box">
          <Search size={40} color="#d1d5db" />
          <p>No resources match your search. Try different filters.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((r) => (
            <div key={r.id} className="resource-card">
              <div
                className="resource-icon"
                style={{ background: TYPE_COLORS[r.type] ?? '#f3f4f6' }}
              >
                {TYPE_ICONS[r.type] ?? <FileText size={24} />}
              </div>
              <div className="resource-info">
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{r.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.4rem', lineHeight: 1.5 }}>
                  {r.description}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <span className="badge badge-gray">{r.type}</span>
                  <span className="badge badge-blue">{r.category}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                  Updated: {new Date(r.updatedAt).toLocaleDateString()}
                </div>
                <button className="btn btn-sm btn-outline" style={{ marginTop: '0.5rem', width: '100%' }}>
                  View Resource
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
