import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Search,
  Layers,
  Globe,
  Database,
  Info,
  Upload,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { NormalizedCourse, CatalogueType } from '../../types/course';
import * as XLSX from 'xlsx';

const ADMIN_ITEMS_PER_PAGE = 20;

export default function AdminCourses() {
  const [activeCatalogue, setActiveCatalogue] = useState<'all' | CatalogueType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // In-session preview of an imported Excel workbook
  const [previewWorkbookName, setPreviewWorkbookName] = useState<string | null>(null);
  const [previewCourses, setPreviewCourses] = useState<NormalizedCourse[] | null>(null);

  // Detail modal state
  const [selectedCourse, setSelectedCourse] = useState<NormalizedCourse | null>(null);

  // Fetch all courses
  const { data: allCourses = [], isLoading } = useQuery({
    queryKey: ['excel-admin-courses'],
    queryFn: () => courseService.getAllCourses(),
    staleTime: Infinity,
  });

  // Fetch catalogue metadata
  const { data: meta } = useQuery({
    queryKey: ['excel-admin-meta'],
    queryFn: () => courseService.getCatalogueMeta(),
    staleTime: Infinity,
  });

  const baseCourses = previewCourses || allCourses;

  // Filtered dataset
  const filteredCourses = useMemo(() => {
    let result = baseCourses;

    if (activeCatalogue !== 'all') {
      result = result.filter(c => c.catalogue === activeCatalogue);
    }

    if (searchQuery.trim()) {
      result = courseService.searchCourses(searchQuery, result);
    }

    if (selectedSector) {
      result = result.filter(c => c.sector.toLowerCase() === selectedSector.toLowerCase());
    }

    if (selectedLevel) {
      result = result.filter(c => c.level.toLowerCase() === selectedLevel.toLowerCase());
    }

    if (selectedMode) {
      result = result.filter(c => c.trainingMode.toLowerCase() === selectedMode.toLowerCase());
    }

    return result;
  }, [baseCourses, activeCatalogue, searchQuery, selectedSector, selectedLevel, selectedMode]);

  const totalFiltered = filteredCourses.length;
  const totalPages = Math.ceil(totalFiltered / ADMIN_ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ADMIN_ITEMS_PER_PAGE;
  const displayedCourses = filteredCourses.slice(startIndex, startIndex + ADMIN_ITEMS_PER_PAGE);

  // Handle local browser-side Excel file upload for safe in-session preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const sheetName = wb.SheetNames.includes('All Courses') ? 'All Courses' : wb.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[sheetName]);

        const parsed: NormalizedCourse[] = rows.map((r, i) => {
          const rawId = String(r['Course ID'] || `IMPORT-${i + 1}`).trim();
          const name = String(r['Course name'] || r['Title'] || 'Untitled Course').trim();
          const skills = String(r['Skills'] || '')
            .split(/[,;]+/)
            .map(s => s.trim())
            .filter(Boolean);
          const competencies = String(r['Competencies'] || '')
            .split(/[,;]+/)
            .map(s => s.trim())
            .filter(Boolean);

          return {
            id: `PREVIEW-${rawId}`,
            courseId: rawId,
            catalogue: 'general',
            catalogueName: 'Imported Preview',
            name,
            title: name,
            description: String(r['Description'] || ''),
            sector: String(r['Sector'] || 'General'),
            domain: String(r['Domain'] || 'General'),
            skills,
            competencies,
            level: String(r['Level'] || 'Intermediate'),
            duration: String(r['Duration'] || '4 hours'),
            durationHours: 4,
            trainer: String(r['Trainer'] || 'Faculty'),
            trainingMode: String(r['Training mode'] || 'Instructor-led'),
            courseImage: String(r['Course image'] || ''),
            eligibility: String(r['Eligibility'] || ''),
            dates: String(r['Dates'] || ''),
          };
        });

        setPreviewWorkbookName(file.name);
        setPreviewCourses(parsed);
        setCurrentPage(1);
      } catch (err) {
        alert('Failed to parse Excel file. Ensure it contains a valid worksheet.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const clearPreview = () => {
    setPreviewWorkbookName(null);
    setPreviewCourses(null);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Read-Only Excel Catalogue Notice Banner */}
      <div className="p-5 rounded-3xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm text-blue-950 dark:text-blue-100 flex items-center gap-2">
              <span>Course Catalogue is Currently Managed Through Excel</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-200/70 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Zero-Database Mode
              </span>
            </h2>
            <p className="text-xs text-blue-700/90 dark:text-blue-300/90 mt-1 max-w-2xl leading-relaxed">
              In this version of SkillSync, courses are parsed directly from authoritative Excel catalogues without an underlying database.
              Admin modifications are read-only to preserve Excel file integrity.
            </p>
          </div>
        </div>

        {/* Excel Import for in-session preview */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
          <label className="cursor-pointer px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Import Excel (Preview)</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {previewWorkbookName && (
            <button
              onClick={clearPreview}
              className="px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-200 transition-colors"
            >
              Exit Preview
            </button>
          )}
        </div>
      </div>

      {previewWorkbookName && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <span>
            ⚠️ Currently previewing imported workbook: <strong>{previewWorkbookName}</strong> ({previewCourses?.length} rows parsed). This does not permanently alter the server storage.
          </span>
          <button onClick={clearPreview} className="font-bold underline ml-2">
            Revert to Master Catalogue
          </button>
        </div>
      )}

      {/* Metric Cards Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Courses</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{baseCourses.length}</h3>
          <p className="text-[11px] text-slate-500">Across all catalogues</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-500">General Catalogue</span>
          <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{meta?.totalGeneral || 1011}</h3>
          <p className="text-[11px] text-slate-500">LMS_Course_Catalog.xlsx</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-cyan-500">Earth Sciences</span>
          <h3 className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{meta?.totalEarthSciences || 1014}</h3>
          <p className="text-[11px] text-slate-500">EarthSciences.xlsx</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-500">Unique Sectors</span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{meta?.sectors.length || 11}</h3>
          <p className="text-[11px] text-slate-500">{meta?.domains.length || 50}+ distinct domains</p>
        </div>
      </div>

      {/* Catalogue Selector and Filter Controls */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Switcher & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => {
                setActiveCatalogue('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCatalogue === 'all'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({baseCourses.length})
            </button>
            <button
              onClick={() => {
                setActiveCatalogue('general');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCatalogue === 'general'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              General ({meta?.totalGeneral || 1011})
            </button>
            <button
              onClick={() => {
                setActiveCatalogue('earth_sciences');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCatalogue === 'earth_sciences'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Earth Sciences ({meta?.totalEarthSciences || 1014})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title, ID, trainer, skills..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={e => {
                setSelectedSector(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
            >
              <option value="">All Sectors ({meta?.sectors.length || 0})</option>
              {meta?.sectors.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Level</label>
            <select
              value={selectedLevel}
              onChange={e => {
                setSelectedLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
            >
              <option value="">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Training Mode</label>
            <select
              value={selectedMode}
              onChange={e => {
                setSelectedMode(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
            >
              <option value="">All Modes</option>
              <option value="Instructor-led">Instructor-led</option>
              <option value="Blended">Blended</option>
              <option value="Self-paced">Self-paced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Master Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Displaying <strong>{totalFiltered > 0 ? startIndex + 1 : 0}</strong> -{' '}
            <strong>{Math.min(startIndex + ADMIN_ITEMS_PER_PAGE, totalFiltered)}</strong> of{' '}
            <strong>{totalFiltered}</strong> courses
          </span>
          <span className="font-mono text-[11px]">Page {currentPage} of {totalPages}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Course ID</th>
                <th className="py-3 px-4">Catalogue</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Sector & Domain</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Trainer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedCourses.map(course => (
                <tr key={course.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {course.courseId}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        course.catalogue === 'earth_sciences'
                          ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                          : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      {course.catalogue === 'earth_sciences' ? 'Earth' : 'General'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white max-w-xs truncate">
                    {course.name}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                    <span className="font-semibold block truncate">{course.sector}</span>
                    <span className="text-[10px] text-slate-400 truncate">{course.domain}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        course.level.toLowerCase() === 'easy'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : course.level.toLowerCase() === 'advanced'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {course.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{course.duration}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{course.trainingMode}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[140px] truncate" title={course.trainer}>
                    {course.trainer}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-xs font-bold flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedCourse.courseId}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-blue-600">{selectedCourse.catalogueName}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedCourse.name}</h3>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedCourse.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sector</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCourse.sector}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Domain</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCourse.domain}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCourse.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mode</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCourse.trainingMode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Trainer</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCourse.trainer}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Dates</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCourse.dates || 'Rolling'}</span>
              </div>
            </div>

            {selectedCourse.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Skills ({selectedCourse.skills.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCourse.skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedCourse.competencies.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Competencies ({selectedCourse.competencies.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCourse.competencies.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
