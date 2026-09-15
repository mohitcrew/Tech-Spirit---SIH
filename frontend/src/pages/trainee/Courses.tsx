import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen, Clock, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../../services/api';
import { PageTitle, Loading, Empty } from '../../components/ui';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  status: string;
  trainer?: { name: string };
  _count?: { modules: number };
}

function levelBadge(level: string) {
  if (level === 'BEGINNER') return 'badge-green';
  if (level === 'INTERMEDIATE') return 'badge-blue';
  if (level === 'ADVANCED') return 'badge-red';
  return 'badge-gray';
}

const THUMB_COLORS = [
  'linear-gradient(135deg,#1677a8,#00a6a6)',
  'linear-gradient(135deg,#123b5d,#1677a8)',
  'linear-gradient(135deg,#00a6a6,#22c55e)',
  'linear-gradient(135deg,#7c3aed,#1677a8)',
  'linear-gradient(135deg,#d97706,#ef4444)',
];

export default function TraineeCourses() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: allCourses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => unwrap<Course[]>(api.get('/courses')),
  });

  const published = allCourses.filter((c) => c.status === 'PUBLISHED');

  const categories = Array.from(new Set(published.map((c) => c.category).filter(Boolean)));

  const filtered = published.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <PageTitle
        title="Course Catalogue"
        subtitle="Browse and enrol in available training courses."
      />

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
            />
            <input
              style={{ paddingLeft: '2rem', width: '100%' }}
              placeholder="Search coursesâ€¦"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ flex: '0 0 180px' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {(search || category) && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { setSearch(''); setCategory(''); }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Empty icon={<BookOpen size={40} color="#d1d5db" />}>
          No courses found. Try adjusting your search.
        </Empty>
      ) : (
        <div className="course-grid">
          {filtered.map((course, i) => (
            <div key={course.id} className="course-card">
              <div
                className="course-card-thumb"
                style={{ background: THUMB_COLORS[i % THUMB_COLORS.length] }}
              >
                <BookOpen size={36} color="rgba(255,255,255,0.8)" />
              </div>
              <div className="course-card-body">
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <span className={`badge ${levelBadge(course.level)}`}>{course.level}</span>
                  {course.category && <span className="badge badge-gray">{course.category}</span>}
                </div>
                <div className="course-card-title">{course.title}</div>
                <div className="course-card-desc">
                  {course.description?.length > 120
                    ? course.description.slice(0, 120) + 'â€¦'
                    : course.description}
                </div>
                <div className="course-card-meta">
                  {course.trainer && <span>By {course.trainer.name}</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={13} /> {course.duration}h
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Layers size={13} /> {course._count?.modules ?? 0} modules
                  </span>
                </div>
              </div>
              <div className="course-card-footer">
                <Link to={`/trainee/courses/${course.id}`} className="btn btn-sm">
                  View course &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
