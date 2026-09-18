import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Filter, Clock, Star, Users, BookOpen, ArrowRight, CheckCircle, ChevronDown, Sparkles, Layers, Globe
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { NormalizedCourse, CatalogueType } from '../../types/course';
import { CourseCard } from '../courses/CourseCard';

interface CourseExplorerProps {
  onEnrollCourse?: (course: NormalizedCourse) => void;
  showAllInitially?: boolean;
  title?: string;
  subtitle?: string;
}

export const CourseExplorer: React.FC<CourseExplorerProps> = ({
  onEnrollCourse,
  showAllInitially = false,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();
  const [activeCatalogue, setActiveCatalogue] = useState<'all' | CatalogueType>('all');
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [previewCourse, setPreviewCourse] = useState<NormalizedCourse | null>(null);

  // Load real courses from Excel
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['public-courses-excel'],
    queryFn: () => courseService.getAllCourses(),
    staleTime: Infinity,
  });

  // Dynamic sectors
  const sectors = useMemo(() => {
    let pool = courses;
    if (activeCatalogue !== 'all') {
      pool = pool.filter(c => c.catalogue === activeCatalogue);
    }
    return Array.from(new Set(pool.map(c => c.sector).filter(Boolean))).sort();
  }, [courses, activeCatalogue]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchCat = activeCatalogue === 'all' || c.catalogue === activeCatalogue;

      const q = search.toLowerCase();
      const matchSearch =
        search === '' ||
        c.name.toLowerCase().includes(q) ||
        c.courseId.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q)) ||
        c.competencies.some(comp => comp.toLowerCase().includes(q));

      const matchLevel = selectedLevel === 'All' || c.level.toLowerCase() === selectedLevel.toLowerCase();
      const matchSector = selectedSector === 'All' || c.sector.toLowerCase() === selectedSector.toLowerCase();
      const matchMode = selectedMode === 'All' || c.trainingMode.toLowerCase() === selectedMode.toLowerCase();

      return matchCat && matchSearch && matchLevel && matchSector && matchMode;
    });
  }, [courses, activeCatalogue, search, selectedLevel, selectedSector, selectedMode]);

  const displayedCourses = showAllInitially ? filteredCourses : filteredCourses.slice(0, 8);

  return (
    <section id="courses" className={`bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850 ${showAllInitially ? 'pt-8 pb-16' : 'py-20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider bg-blue-50 dark:bg-cyan-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-cyan-500/20 inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Real Excel Course Catalogue · 2,025 Verified Programmes</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
              {title || "Learn Something That Moves You Forward"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {subtitle || "Curated, competency-benchmarked curricula delivered by seasoned institutional faculty across General & Earth Sciences tracks."}
            </p>
          </div>

          <Link
            to="/login?redirect=/trainee/courses"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            <span>Open Full Interactive Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Catalogue Switcher Tab Bar */}
        <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1 mb-6">
          <button
            onClick={() => {
              setActiveCatalogue('all');
              setSelectedSector('All');
            }}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeCatalogue === 'all'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Catalogues ({courses.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCatalogue('general');
              setSelectedSector('All');
            }}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeCatalogue === 'general'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>General Catalogue (1,011)</span>
          </button>

          <button
            onClick={() => {
              setActiveCatalogue('earth_sciences');
              setSelectedSector('All');
            }}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeCatalogue === 'earth_sciences'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Earth Sciences (1,014)</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8 space-y-3 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, skills (e.g. Python, Climate, GIS) or Course ID..."
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mr-2 font-bold">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Sector */}
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            >
              <option value="All">All Sectors ({sectors.length})</option>
              {sectors.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Level */}
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Mode */}
            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
            >
              <option value="All">All Learning Modes</option>
              <option value="Instructor-led">Instructor-led</option>
              <option value="Blended">Blended</option>
              <option value="Self-paced">Self-paced</option>
            </select>

            {/* Reset */}
            {(selectedLevel !== 'All' || selectedSector !== 'All' || selectedMode !== 'All' || search !== '') && (
              <button
                onClick={() => {
                  setSelectedLevel('All');
                  setSelectedSector('All');
                  setSelectedMode('All');
                  setSearch('');
                }}
                className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-semibold px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-16 text-center animate-pulse">
            <p className="text-xs text-slate-400">Loading course catalogue...</p>
          </div>
        )}

        {/* Course Cards Grid */}
        {!isLoading && displayedCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                rolePrefix="/trainee"
                onViewCourse={c => {
                  if (onEnrollCourse) {
                    onEnrollCourse(c);
                  } else {
                    navigate(`/login?intent=${encodeURIComponent(`view course ${c.name}`)}&redirect=/trainee/courses/${c.id}`);
                  }
                }}
              />
            ))}
          </div>
        )}

        {!isLoading && displayedCourses.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No courses found</h3>
            <p className="text-xs text-slate-500 mt-1">Try changing your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};
