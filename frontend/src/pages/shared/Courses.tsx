import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, CalendarDays, Clock, Image as ImageIcon, Layers, MapPin, Search, UserRound } from 'lucide-react';

type CourseValue = string | number | boolean | null | undefined | string[];

interface CourseRecord {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  trainer?: { name?: string };
  _count?: { modules?: number };
  [key: string]: unknown;
}

const FIELD_ALIASES: Record<string, string[]> = {
  title: ['title', 'courseName', 'course_name', 'name'],
  description: ['description', 'courseDescription', 'course_description'],
  sector: ['sector', 'industry'],
  domain: ['domain', 'category', 'subject'],
  skills: ['skills', 'skill', 'techStack', 'technologies'],
  competencies: ['competencies', 'competency', 'learningObjectives'],
  level: ['level', 'difficulty'],
  duration: ['duration', 'durationHours', 'hours'],
  trainer: ['trainer', 'trainerName', 'instructor', 'instructorName'],
  mode: ['trainingMode', 'training_mode', 'learningMode', 'mode'],
  image: ['courseImage', 'course_image', 'image', 'imageUrl', 'thumbnailUrl'],
  eligibility: ['eligibility', 'eligibilityCriteria', 'prerequisites'],
  dates: ['dates', 'courseDates', 'startDate', 'endDate', 'schedule'],
};

const SYSTEM_FIELDS = new Set(['id', 'status', 'createdAt', 'updatedAt', 'trainerId', '_count']);

function getCourseValue(course: CourseRecord, field: string): CourseValue {
  const key = FIELD_ALIASES[field]?.find(alias => course[alias] !== undefined && course[alias] !== null && course[alias] !== '');
  return key ? course[key] as CourseValue : undefined;
}

function formatValue(value: CourseValue): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value === undefined || value === null ? '' : String(value);
}

function fieldLabel(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/^./, char => char.toUpperCase());
}

function extraFields(course: CourseRecord) {
  const knownKeys = new Set(Object.values(FIELD_ALIASES).flat());
  return Object.entries(course).filter(([key, value]) => {
    return !SYSTEM_FIELDS.has(key) && !knownKeys.has(key) && value !== undefined && value !== null && value !== '' && typeof value !== 'object';
  });
}

export default function Courses() {
  const { user } = useAuth();
  const role = user!.role.toLowerCase();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery<CourseRecord[]>({
    queryKey: ['courses'],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  const filtered = data?.filter(course => {
    const q = search.toLowerCase();
    const searchableValues = Object.values(course).map(value => formatValue(value as CourseValue).toLowerCase()).join(' ');
    return (
      (!q || searchableValues.includes(q)) &&
      (!level || getCourseValue(course, 'level') === level) &&
      (!category || getCourseValue(course, 'domain') === category)
    );
  }) ?? [];

  const categories = [...new Set((data ?? []).map(course => formatValue(getCourseValue(course, 'domain'))).filter(Boolean))];

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
        {filtered.map(course => {
          const title = formatValue(getCourseValue(course, 'title')) || 'Untitled course';
          const description = formatValue(getCourseValue(course, 'description'));
          const image = formatValue(getCourseValue(course, 'image'));
          const levelValue = formatValue(getCourseValue(course, 'level'));
          const domain = formatValue(getCourseValue(course, 'domain'));
          const trainer = formatValue(getCourseValue(course, 'trainer')) || course.trainer?.name;
          const skills = formatValue(getCourseValue(course, 'skills'));
          const competencies = formatValue(getCourseValue(course, 'competencies'));
          const duration = formatValue(getCourseValue(course, 'duration'));
          const mode = formatValue(getCourseValue(course, 'mode'));
          const sector = formatValue(getCourseValue(course, 'sector'));
          const eligibility = formatValue(getCourseValue(course, 'eligibility'));
          const dates = formatValue(getCourseValue(course, 'dates'));

          return (
          <div key={course.id} className="course-card">
            <div className="course-card-thumb">
              {image ? <img src={image} alt="" /> : <BookOpen size={40} />}
            </div>
            <div className="course-card-body">
              <div style={{ marginBottom: 8 }}>
                {levelValue && <span className={`badge ${levelColor[levelValue] ?? 'badge-blue'}`}>{levelValue}</span>}
                {domain && <span className="badge badge-gray" style={{ marginLeft: 6 }}>{domain}</span>}
                {sector && <span className="badge badge-teal" style={{ marginLeft: 6 }}>{sector}</span>}
              </div>
              <div className="course-card-title">{title}</div>
              {description && <div className="course-card-desc">{description.slice(0, 140)}{description.length > 140 ? '…' : ''}</div>}
              <div className="course-card-meta">
                {duration && <span><Clock size={13} /> {duration}{/^[\d.]+$/.test(duration) ? 'h' : ''}</span>}
                {course._count?.modules !== undefined && <span><Layers size={13} /> {course._count.modules} modules</span>}
                {mode && <span><MapPin size={13} /> {mode}</span>}
              </div>
              {(trainer || skills || competencies || eligibility || dates || extraFields(course).length > 0) && (
                <div className="course-card-fields">
                  {trainer && <div><UserRound size={13} /><strong>Trainer</strong><span>{trainer}</span></div>}
                  {skills && <div><span className="course-card-field-label">Skills</span><span>{skills}</span></div>}
                  {competencies && <div><span className="course-card-field-label">Competencies</span><span>{competencies}</span></div>}
                  {eligibility && <div><span className="course-card-field-label">Eligibility</span><span>{eligibility}</span></div>}
                  {dates && <div><CalendarDays size={13} /><strong>Dates</strong><span>{dates}</span></div>}
                  {extraFields(course).map(([key, value]) => <div key={key}><span className="course-card-field-label">{fieldLabel(key)}</span><span>{formatValue(value as CourseValue)}</span></div>)}
                </div>
              )}
            </div>
            <div className="course-card-footer">
              <Link to={`/${role}/courses/${course.id}`} className="btn" style={{ width: '100%', justifyContent: 'center' }}>View Course</Link>
            </div>
          </div>
          );
        })}
      </div>
    </>
  );
}
