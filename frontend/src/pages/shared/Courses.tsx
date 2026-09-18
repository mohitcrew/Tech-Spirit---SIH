import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  Globe,
  PlusCircle,
  Upload,
  X,
  CheckCircle2,
  Trash2,
  Edit3,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courseService, parseExcelUpload } from '../../services/courseService';
import { NormalizedCourse, CourseSortOption, CatalogueType } from '../../types/course';
import { CourseCard } from '../../components/courses/CourseCard';

const ITEMS_PER_PAGE = 24;

export default function Courses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const role = user?.role?.toLowerCase() || 'trainee';
  const isAdmin = user?.role === 'ADMIN';

  // Filters and search state
  const [activeCatalogue, setActiveCatalogue] = useState<'all' | CatalogueType | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [durationRange, setDurationRange] = useState('');
  const [sortBy, setSortBy] = useState<CourseSortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);

  // Admin Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<NormalizedCourse | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<NormalizedCourse | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Course Form State (Shared for Add & Edit)
  const initialFormState = {
    name: '',
    courseId: '',
    catalogue: 'general' as CatalogueType,
    sector: '',
    domain: '',
    level: 'Medium',
    duration: '4 Weeks',
    trainingMode: 'Instructor-led',
    trainer: '',
    skills: '',
    competencies: '',
    description: '',
    eligibility: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Excel Import State
  const [importedCourses, setImportedCourses] = useState<Partial<NormalizedCourse>[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Fetch all courses from courseService (in-memory cached Excel data + admin updates)
  const { data: allCourses = [], isLoading, isError, error } = useQuery({
    queryKey: ['excel-courses'],
    queryFn: () => courseService.getAllCourses(),
    staleTime: 1000 * 60 * 5,
  });

  // Auto-dismiss notifications
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCatalogue, searchQuery, selectedSector, selectedDomain, selectedLevel, selectedMode, durationRange, sortBy]);

  // Reset domain if selected sector changes
  useEffect(() => {
    setSelectedDomain('');
  }, [selectedSector]);

  // Reset sector & domain if catalogue changes
  const handleCatalogueChange = (cat: 'all' | CatalogueType | 'custom') => {
    setActiveCatalogue(cat);
    setSelectedSector('');
    setSelectedDomain('');
  };

  // Populate Edit form when editingCourse is set
  useEffect(() => {
    if (editingCourse) {
      setFormData({
        name: editingCourse.name || editingCourse.title || '',
        courseId: editingCourse.courseId || '',
        catalogue: editingCourse.catalogue || 'general',
        sector: editingCourse.sector || '',
        domain: editingCourse.domain || '',
        level: editingCourse.level || 'Medium',
        duration: editingCourse.duration || '',
        trainingMode: editingCourse.trainingMode || 'Instructor-led',
        trainer: editingCourse.trainer || '',
        skills: (editingCourse.skills || []).join(', '),
        competencies: (editingCourse.competencies || []).join(', '),
        description: editingCourse.description || '',
        eligibility: editingCourse.eligibility || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingCourse]);

  // Catalogue counts
  const generalCount = useMemo(() => allCourses.filter(c => c.catalogue === 'general').length, [allCourses]);
  const earthCount = useMemo(() => allCourses.filter(c => c.catalogue === 'earth_sciences').length, [allCourses]);
  const customCount = useMemo(() => allCourses.filter(c => c.isCustom).length, [allCourses]);

  // Dynamic Sector options
  const availableSectors = useMemo(() => {
    let pool = allCourses;
    if (activeCatalogue === 'custom') {
      pool = pool.filter(c => c.isCustom);
    } else if (activeCatalogue !== 'all') {
      pool = pool.filter(c => c.catalogue === activeCatalogue);
    }
    return Array.from(new Set(pool.map(c => c.sector).filter(Boolean))).sort();
  }, [allCourses, activeCatalogue]);

  // Dynamic Domain options
  const availableDomains = useMemo(() => {
    let pool = allCourses;
    if (activeCatalogue === 'custom') {
      pool = pool.filter(c => c.isCustom);
    } else if (activeCatalogue !== 'all') {
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
    if (activeCatalogue === 'custom') {
      result = result.filter(c => c.isCustom);
    } else if (activeCatalogue !== 'all') {
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

  // Handle Add Course Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setNotification({ type: 'error', message: 'Course name / title is required.' });
      return;
    }

    const created = courseService.addCourse({
      name: formData.name.trim(),
      courseId: formData.courseId.trim() || undefined,
      catalogue: formData.catalogue,
      sector: formData.sector.trim() || 'General Capacity',
      domain: formData.domain.trim() || 'Foundational Competence',
      level: formData.level,
      duration: formData.duration.trim() || '4 Weeks',
      trainingMode: formData.trainingMode,
      trainer: formData.trainer.trim() || (user?.name ? `Faculty (${user.name})` : 'Executive Faculty'),
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      competencies: formData.competencies ? formData.competencies.split(',').map(s => s.trim()).filter(Boolean) : [],
      description: formData.description.trim(),
      eligibility: formData.eligibility.trim(),
    });

    queryClient.invalidateQueries({ queryKey: ['excel-courses'] });
    setIsAddModalOpen(false);
    setFormData(initialFormState);
    setNotification({
      type: 'success',
      message: `Course "${created.name}" (${created.courseId}) created and published successfully!`,
    });
  };

  // Handle Edit Course Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (!formData.name.trim()) {
      setNotification({ type: 'error', message: 'Course name / title is required.' });
      return;
    }

    courseService.updateCourse(editingCourse.id, {
      name: formData.name.trim(),
      catalogue: formData.catalogue,
      sector: formData.sector.trim(),
      domain: formData.domain.trim(),
      level: formData.level,
      duration: formData.duration.trim(),
      trainingMode: formData.trainingMode,
      trainer: formData.trainer.trim(),
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      competencies: formData.competencies ? formData.competencies.split(',').map(s => s.trim()).filter(Boolean) : [],
      description: formData.description.trim(),
      eligibility: formData.eligibility.trim(),
    });

    queryClient.invalidateQueries({ queryKey: ['excel-courses'] });
    setEditingCourse(null);
    setFormData(initialFormState);
    setNotification({
      type: 'success',
      message: `Course "${formData.name}" was updated successfully!`,
    });
  };

  // Handle Delete Course Submission
  const handleDeleteConfirm = () => {
    if (!deletingCourse) return;
    courseService.deleteCourse(deletingCourse.id);
    queryClient.invalidateQueries({ queryKey: ['excel-courses'] });
    const deletedName = deletingCourse.name;
    setDeletingCourse(null);
    setNotification({
      type: 'info',
      message: `Course "${deletedName}" has been removed from the catalogue.`,
    });
  };

  // Handle File Upload for Bulk Excel/CSV Import
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setIsImporting(true);
    try {
      const parsed = await parseExcelUpload(file);
      setImportedCourses(parsed);
      if (parsed.length === 0) {
        setNotification({ type: 'error', message: 'No valid course rows found in this file.' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to parse file. Please upload a valid .xlsx or .csv.' });
    } finally {
      setIsImporting(false);
    }
  };

  // Execute Bulk Import
  const handleExecuteImport = () => {
    if (importedCourses.length === 0) return;
    const count = courseService.importCourses(importedCourses);
    queryClient.invalidateQueries({ queryKey: ['excel-courses'] });
    setIsImportModalOpen(false);
    setImportedCourses([]);
    setImportFileName('');
    setNotification({
      type: 'success',
      message: `Successfully imported ${count} course${count === 1 ? '' : 's'} into the catalogue!`,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 transition-all animate-slideUp text-sm font-semibold border ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20'
              : notification.type === 'error'
              ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/20'
              : 'bg-slate-900 text-white border-slate-700 shadow-slate-900/30 dark:bg-slate-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 flex-shrink-0 text-blue-400" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="page-header-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-cyan-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2 text-white"
            style={{ color: '#ffffff' }}
          >
            <Globe className="w-3.5 h-3.5 text-white" />
            <span className="text-white" style={{ color: '#ffffff' }}>
              Authoritative Course Catalogue · Excel Data Source
            </span>
            {isAdmin && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-extrabold flex items-center gap-1 shadow-sm">
                <Shield className="w-3 h-3" />
                ADMIN CONTROL
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ color: '#ffffff' }}>
            Competency & Capacity Course Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl" style={{ color: '#dbeafe' }}>
            Explore verified capacity building programmes across General and Earth Sciences tracks, mapped directly to institutional competencies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto flex-shrink-0">
          {/* Stat Badges */}
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-center flex-1">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Total Tracks</span>
              <span className="text-base sm:text-lg font-black">{isAdmin && customCount > 0 ? '3 Tracks' : '2 Sources'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-center flex-1">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Active Courses</span>
              <span className="text-base sm:text-lg font-black">{allCourses.length}</span>
            </div>
          </div>

          {/* Admin Action Buttons (STRICTLY rendered for Admin only) */}
          {isAdmin && (
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                onClick={() => {
                  setFormData(initialFormState);
                  setIsAddModalOpen(true);
                }}
                className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-102 flex-1 sm:flex-initial"
                style={{ color: '#020617', backgroundColor: '#fbbf24' }}
                title="Add a new custom course to the catalogue"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" style={{ color: '#020617' }} />
                <span style={{ color: '#020617', fontWeight: 800 }}>+ Add Course</span>
              </button>

              <button
                onClick={() => {
                  setImportedCourses([]);
                  setImportFileName('');
                  setIsImportModalOpen(true);
                }}
                className="py-2.5 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 backdrop-blur-md flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial"
                title="Import multiple courses from Excel or CSV file"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
            </div>
          )}
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

        {/* Custom Tab - Visible only to Admin when there are custom courses, or if admin wants to view custom */}
        {isAdmin && (
          <button
            onClick={() => handleCatalogueChange('custom')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeCatalogue === 'custom'
                ? 'bg-amber-400 text-slate-950 shadow-sm border border-amber-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>⭐ Admin Custom</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeCatalogue === 'custom' ? 'bg-slate-950 text-white' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
              }`}
            >
              {customCount}
            </span>
          </button>
        )}
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
              isAdmin={isAdmin}
              onEditCourse={(c) => setEditingCourse(c)}
              onDeleteCourse={(c) => setDeletingCourse(c)}
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

      {/* ========================================================================= */}
      {/* ADMIN EXCLUSIVE MODALS (Add Course, Edit Course, Delete, Import)          */}
      {/* ========================================================================= */}

      {/* 1. Add New Course Modal */}
      {isAdmin && isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-scaleIn">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">Add New Course to Catalogue</h3>
                  <p className="text-xs text-blue-100">Create a capacity building programme with role-based visibility</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Course Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Geospatial Intelligence & Sat-Data Analytics"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Course Code / ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. C1050 (Auto-assigned if blank)"
                    value={formData.courseId}
                    onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Catalogue Track <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.catalogue}
                    onChange={e => setFormData({ ...formData, catalogue: e.target.value as CatalogueType })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="general">General Capacity Catalogue</option>
                    <option value="earth_sciences">Earth Sciences Track</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Information Technology, Space Systems"
                    value={formData.sector}
                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote Sensing, AI Automation"
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Easy">Easy (Foundational)</option>
                    <option value="Medium">Medium (Intermediate)</option>
                    <option value="Advanced">Advanced (Specialist)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Training Mode
                  </label>
                  <select
                    value={formData.trainingMode}
                    onChange={e => setFormData({ ...formData, trainingMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Instructor-led">Instructor-led</option>
                    <option value="Blended">Blended</option>
                    <option value="Self-paced">Self-paced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Hours, 4 Weeks"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Trainer / Lead Lecturer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Kumar / Center of Excellence"
                  value={formData.trainer}
                  onChange={e => setFormData({ ...formData, trainer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, Python, Satellite Imagery, GIS"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Competencies (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Predictive Modelling, Climate Risk Mitigation"
                  value={formData.competencies}
                  onChange={e => setFormData({ ...formData, competencies: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Course Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed course overview, learning goals, and institutional relevance..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Prerequisites / Eligibility
                </label>
                <input
                  type="text"
                  placeholder="e.g. Open to all technical officers, basic computer literacy"
                  value={formData.eligibility}
                  onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/20 transition-all"
                >
                  Publish to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Course Modal */}
      {isAdmin && editingCourse && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-scaleIn">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">Edit Course: {editingCourse.courseId}</h3>
                  <p className="text-xs text-blue-100">Modify course details, metadata, and competencies</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Course Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Course Code (Locked)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.courseId}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-400 text-xs font-mono font-bold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Catalogue Track
                  </label>
                  <select
                    value={formData.catalogue}
                    onChange={e => setFormData({ ...formData, catalogue: e.target.value as CatalogueType })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="general">General Capacity Catalogue</option>
                    <option value="earth_sciences">Earth Sciences Track</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Sector
                  </label>
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Easy">Easy (Foundational)</option>
                    <option value="Medium">Medium (Intermediate)</option>
                    <option value="Advanced">Advanced (Specialist)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Training Mode
                  </label>
                  <select
                    value={formData.trainingMode}
                    onChange={e => setFormData({ ...formData, trainingMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Instructor-led">Instructor-led</option>
                    <option value="Blended">Blended</option>
                    <option value="Self-paced">Self-paced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Trainer / Lecturer
                </label>
                <input
                  type="text"
                  value={formData.trainer}
                  onChange={e => setFormData({ ...formData, trainer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Competencies (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.competencies}
                  onChange={e => setFormData({ ...formData, competencies: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Delete Course Confirmation Dialog */}
      {isAdmin && deletingCourse && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Delete Course from Catalogue?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to remove{' '}
                <strong className="text-slate-900 dark:text-white">"{deletingCourse.name}"</strong> (
                <span className="font-mono">{deletingCourse.courseId}</span>)?
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20 mt-2.5 font-medium">
                ⚠️ This course will no longer be visible to students (trainees), lecturers (trainers), or administrators.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Import Courses from Excel / CSV Modal */}
      {isAdmin && isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">Import Courses from Excel / CSV</h3>
                  <p className="text-xs text-emerald-100">Upload batch course curriculum records</p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 text-center bg-slate-50 dark:bg-slate-800/40 transition-colors">
                <input
                  type="file"
                  id="excelUpload"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="excelUpload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drag and drop your spreadsheet
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Supported: .xlsx, .xls, .csv
                  </span>
                </label>
              </div>

              {isImporting && (
                <div className="text-center py-2 text-xs text-slate-500 font-medium animate-pulse">
                  Parsing workbook data and normalizing rows...
                </div>
              )}

              {importFileName && importedCourses.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="truncate max-w-[280px]">📄 {importFileName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-extrabold">
                      {importedCourses.length} courses detected
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Ready to append to the active course catalogue.
                  </p>
                </div>
              )}

              <div className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-600 dark:text-slate-300 block mb-1">Supported Columns:</span>
                Course ID, Course name, Sector, Domain, Skills, Competencies, Level, Duration, Trainer, Training mode, Catalogue
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={importedCourses.length === 0}
                  onClick={handleExecuteImport}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  Import {importedCourses.length > 0 ? `${importedCourses.length} Courses` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
