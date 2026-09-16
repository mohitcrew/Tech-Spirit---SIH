import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, RotateCcw, BookOpen, AlertCircle, Sparkles, ChevronLeft, ChevronRight, Layers, Clock, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { NormalizedCourse, CourseSortOption, CatalogueType } from '../../types/course';
import { CourseCard } from '../../components/courses/CourseCard';

const ITEMS_PER_PAGE = 24;

export default function Courses() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || 'trainee';

  // Filters and search state
  const [activeCatalogue, setActiveCatalogue] = useState<'all' | CatalogueType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [durationRange, setDurationRange] = useState('');
  const [sortBy, setSortBy] = useState<CourseSortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all courses from courseService (in-memory cached Excel data)
  const { data: allCourses = [], isLoading, isError, error } = useQuery({
    queryKey: ['excel-courses'],
    queryFn: () => courseService.getAllCourses(),
    staleTime: Infinity,
  });

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCatalogue, searchQuery, selectedSector, selectedDomain, selectedLevel, selectedMode, durationRange, sortBy]);

  // Reset domain if selected sector changes
  useEffect(() => {
    setSelectedDomain('');
  }, [selectedSector]);

  // Reset sector & domain if catalogue changes
  const handleCatalogueChange = (cat: 'all' | CatalogueType) => {
    setActiveCatalogue(cat);
    setSelectedSector('');
    setSelectedDomain('');
  };

  // Catalogue counts
  const generalCount = useMemo(() => allCourses.filter(c => c.catalogue === 'general').length, [allCourses]);
  const earthCount = useMemo(() => allCourses.filter(c => c.catalogue === 'earth_sciences').length, [allCourses]);

  // Dynamic Sector options (based on selected catalogue)
  const availableSectors = useMemo(() => {
    let pool = allCourses;
    if (activeCatalogue !== 'all') {
      pool = pool.filter(c => c.catalogue === activeCatalogue);
    }
    return Array.from(new Set(pool.map(c => c.sector).filter(Boolean))).sort();
  }, [allCourses, activeCatalogue]);

  // Dynamic Domain options (based on selected sector or catalogue)
  const availableDomains = useMemo(() => {
    let pool = allCourses;
    if (activeCatalogue !== 'all') {
      pool = pool.filter(c => c.catalogue === activeCatalogue);
    }
    if (selectedSector) {
      pool = pool.filter(c => c.sector.toLowerCase() === selectedSector.toLowerCase());
    }
    return Array.from(new Set(pool.map(c => c.domain).filter(Boolean))).sort();
  }, [allCourses, activeCatalogue, selectedSector]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    let result = allCourses;

    // Catalogue filter
    if (activeCatalogue !== 'all') {
      result = result.filter(c => c.catalogue === activeCatalogue);
    }

    // Search query
    if (searchQuery.trim()) {
      result = courseService.searchCourses(searchQuery, result);
    }

    // Sector filter
    if (selectedSector) {
      result = result.filter(c => c.sector.toLowerCase() === selectedSector.toLowerCase());
    }

    // Domain filter
    if (selectedDomain) {
      result = result.filter(c => c.domain.toLowerCase() === selectedDomain.toLowerCase());
    }

    // Level filter
    if (selectedLevel) {
      result = result.filter(c => c.level.toLowerCase() === selectedLevel.toLowerCase());
    }

    // Training mode filter
    if (selectedMode) {
      result = result.filter(c => c.trainingMode.toLowerCase() === selectedMode.toLowerCase());
    }

    // Duration filter
    if (durationRange === 'short') {
      result = result.filter(c => c.durationHours > 0 && c.durationHours <= 5);
    } else if (durationRange === 'medium') {
      result = result.filter(c => c.durationHours > 5 && c.durationHours <= 15);
    } else if (durationRange === 'long') {
      result = result.filter(c => c.durationHours > 15);
    }

    // Sorting
    return courseService.sortCourses(result, sortBy);
  }, [allCourses, activeCatalogue, searchQuery, selectedSector, selectedDomain, selectedLevel, selectedMode, durationRange, sortBy]);

  // Pagination calculation
  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasActiveFilters =
    searchQuery || selectedSector || selectedDomain || selectedLevel || selectedMode || durationRange || sortBy !== 'default';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSector('');
    setSelectedDomain('');
    setSelectedLevel('');
    setSelectedMode('');
    setDurationRange('');
    setSortBy('default');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-cyan-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Authoritative Course Catalogue · Excel Data Source</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Competency & Capacity Course Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
            Explore verified capacity building programmes across General and Earth Sciences tracks, mapped directly to institutional competencies.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Total Catalogues</span>
            <span className="text-xl font-black">2 Master Sources</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Active Courses</span>
            <span className="text-xl font-black">{allCourses.length}</span>
          </div>
        </div>
      </div>

      {/* Catalogue Switcher Tab Bar */}
      <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1">
        <button
          onClick={() => handleCatalogueChange('all')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeCatalogue === 'all'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Catalogues</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {allCourses.length}
          </span>
        </button>

        <button
          onClick={() => handleCatalogueChange('general')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeCatalogue === 'general'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>General Catalogue</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            {generalCount}
          </span>
        </button>

        <button
          onClick={() => handleCatalogueChange('earth_sciences')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeCatalogue === 'earth_sciences'
              ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Earth Sciences</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
            {earthCount}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Search input & Sort controls */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by course name, Course ID, skills, sector, domain, or trainer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as CourseSortOption)}
              className="flex-1 md:w-48 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Sort: Default Order</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="duration-asc">Duration (Shortest first)</option>
              <option value="duration-desc">Duration (Longest first)</option>
              <option value="level-asc">Level (Easy → Advanced)</option>
              <option value="level-desc">Level (Advanced → Easy)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors flex-shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Sector */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs truncate focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sectors ({availableSectors.length})</option>
              {availableSectors.map(sec => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Domain */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Domain</label>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs truncate focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Domains ({availableDomains.length})</option>
              {availableDomains.map(dom => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Level</label>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="Easy">Easy (Foundational)</option>
              <option value="Medium">Medium (Intermediate)</option>
              <option value="Advanced">Advanced (Specialist)</option>
            </select>
          </div>

          {/* Training Mode */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Training Mode</label>
            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Modes</option>
              <option value="Instructor-led">Instructor-led</option>
              <option value="Blended">Blended</option>
              <option value="Self-paced">Self-paced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Duration</label>
            <select
              value={durationRange}
              onChange={e => setDurationRange(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Duration</option>
              <option value="short">Short (&le; 5 hours)</option>
              <option value="medium">Medium (6 - 15 hours)</option>
              <option value="long">Comprehensive (&gt; 15 hours)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Showing <strong>{totalCourses > 0 ? startIndex + 1 : 0}</strong> -{' '}
          <strong>{Math.min(startIndex + ITEMS_PER_PAGE, totalCourses)}</strong> of{' '}
          <strong>{totalCourses}</strong> courses
          {hasActiveFilters && <span className="text-blue-600 dark:text-blue-400 font-semibold ml-1.5">(Filtered)</span>}
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Loading course catalogue...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Parsing master Excel datasets and building in-memory competency indexes.
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-bold text-sm text-rose-800 dark:text-rose-300">
            Course catalogue could not be loaded. Please try again.
          </h3>
          <p className="text-xs text-rose-600 dark:text-rose-400">
            {error instanceof Error ? error.message : 'Please check file availability in public/data.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && displayedCourses.length === 0 && (
        <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 opacity-40" />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">No courses found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try changing your search or filters. We couldn't find any courses matching your criteria.
            </p>
          </div>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && displayedCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              rolePrefix={`/${role}`}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
