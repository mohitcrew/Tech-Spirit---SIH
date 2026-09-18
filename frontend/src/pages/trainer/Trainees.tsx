import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  FileText,
  Layers,
  GraduationCap,
  TrendingUp,
  X,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  assignedTrainees,
  trainerCourses,
  trainerAggregatedStats,
  AssignedTrainee,
  TrainerCourse,
  TraineeSubmission
} from '../../data/trainerData';

export default function Trainees() {
  const { user } = useAuth();

  // Fetch courses from API as well (if present in DB)
  const { data: apiCourses } = useQuery({
    queryKey: ['trainer-courses', user?.id],
    queryFn: () => unwrap<any[]>(api.get('/courses')),
  });

  // Local state for interactivity
  const [traineesList, setTraineesList] = useState<AssignedTrainee[]>(assignedTrainees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'AT_RISK' | 'COMPLETED' | 'COURSES'>('ALL');

  // Modals state
  const [selectedTrainee, setSelectedTrainee] = useState<AssignedTrainee | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<{ trainee: AssignedTrainee; submission: TraineeSubmission } | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(92);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Merge API courses with trainerCourses
  const courses: TrainerCourse[] = useMemo(() => {
    if (!apiCourses || apiCourses.length === 0) return trainerCourses;
    // Map API courses to TrainerCourse shape if any
    const mappedApi = apiCourses.map((c: any) => ({
      id: c.id,
      title: c.title,
      category: c.category || 'General',
      level: (c.level?.charAt(0) + c.level?.slice(1).toLowerCase()) as any || 'Intermediate',
      cohortName: 'Batch 2026-Live',
      enrolledCount: c._count?.enrollments ?? 18,
      avgCompletion: 76,
      status: (c.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT') as any,
      pendingSubmissions: 2,
      thumbnailGradient: 'from-blue-600 to-indigo-700',
      durationHours: c.durationHours || 16,
      startDate: 'Current Session',
      endDate: 'Continuous',
    }));
    return [...trainerCourses, ...mappedApi.filter(a => !trainerCourses.some(tc => tc.id === a.id))];
  }, [apiCourses]);

  // Filtered trainees
  const filteredTrainees = useMemo(() => {
    return traineesList.filter((t) => {
      // Tab filter
      if (activeTab === 'PENDING' && !t.pendingSubmission) return false;
      if (activeTab === 'AT_RISK' && t.status !== 'NEEDS_HELP') return false;
      if (activeTab === 'COMPLETED' && t.status !== 'COMPLETED') return false;

      // Course filter
      if (selectedCourseFilter !== 'ALL' && t.courseId !== selectedCourseFilter) return false;

      // Status filter
      if (selectedStatusFilter !== 'ALL' && t.status !== selectedStatusFilter) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = t.name.toLowerCase().includes(query);
        const matchEmail = t.email.toLowerCase().includes(query);
        const matchId = t.employeeId.toLowerCase().includes(query);
        const matchOrg = t.organization.toLowerCase().includes(query);
        const matchCourse = t.courseTitle.toLowerCase().includes(query);
        return matchName || matchEmail || matchId || matchOrg || matchCourse;
      }

      return true;
    });
  }, [traineesList, activeTab, selectedCourseFilter, selectedStatusFilter, searchTerm]);

  // Stats calculation
  const totalEnrolledCount = trainerAggregatedStats.totalLearners;
  const pendingSubmissionsCount = traineesList.filter(t => !!t.pendingSubmission).length;
  const atRiskCount = traineesList.filter(t => t.status === 'NEEDS_HELP').length;
  const completedCount = traineesList.filter(t => t.status === 'COMPLETED').length;

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Organization', 'Department', 'Course', 'Cohort', 'Progress %', 'Diagnostic Score', 'Status', 'Last Active'];
    const rows = traineesList.map(t => [
      t.employeeId,
      `"${t.name}"`,
      t.email,
      `"${t.organization}"`,
      `"${t.department}"`,
      `"${t.courseTitle}"`,
      t.cohort,
      `${t.progress}%`,
      `${t.diagnosticScore}%`,
      t.status,
      `"${t.lastActive}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Assigned_Learners_Prof_Vikram_Rao_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Trainee roster exported successfully as CSV!');
  };

  // Submit Grade handler
  const handleGradeSubmit = () => {
    if (!gradingSubmission) return;
    const { trainee } = gradingSubmission;

    setTraineesList(prev => prev.map(t => {
      if (t.id === trainee.id) {
        return {
          ...t,
          progress: Math.min(100, t.progress + 10),
          modulesCompleted: Math.min(t.totalModules, t.modulesCompleted + 1),
          diagnosticScore: Math.round((t.diagnosticScore + gradeInput) / 2),
          pendingSubmission: undefined, // Cleared after grading!
        };
      }
      return t;
    }));

    showToast(`Grade ${gradeInput}% & feedback recorded for ${trainee.name}!`);
    setGradingSubmission(null);
    setGradeFeedback('');
  };

  // Broadcast announcement handler
  const handleBroadcastSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;
    showToast(`Announcement "${broadcastTitle}" broadcasted to ${broadcastTarget === 'ALL' ? 'all 284 enrolled trainees' : broadcastTarget}!`);
    setIsBroadcastOpen(false);
    setBroadcastTitle('');
    setBroadcastBody('');
  };

  // Direct feedback send
  const handleSendFeedback = () => {
    if (!selectedTrainee || !feedbackNote.trim()) return;
    showToast(`Private feedback note dispatched to ${selectedTrainee.name}!`);
    setFeedbackNote('');
  };

  return (
    <div className="space-y-6 page-enter pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-100/95 via-indigo-50/90 to-slate-100/90 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900 border border-blue-200/90 dark:border-blue-800/40 shadow-sm dark:shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-200/80 dark:bg-blue-500/30 text-blue-900 dark:text-blue-200 border border-blue-300/80 dark:border-blue-400/30 flex items-center gap-1.5 shadow-sm">
              <Users className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300" />
              Cohort Management & Trainee Roster
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/30">
              Active Term 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Assigned Learners & Cohorts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl font-medium leading-relaxed">
            Supervise enrolled trainees across MoES scientific institutes, review practical lab submissions, evaluate competencies, and broadcast curriculum announcements.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-white/20 text-blue-900 dark:text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-blue-300/90 dark:border-white/20 shadow-sm transition-all active:scale-95"
            title="Download full trainee roster CSV"
          >
            <Download className="w-4 h-4 text-blue-700 dark:text-cyan-300" />
            <span>Export Roster (CSV)</span>
          </button>
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Top Aggregated Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {totalEnrolledCount}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+38 this month</span>
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Cohorts</span>
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {courses.length} Tracks
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
            Across 6 MoES Divisions
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Progress</span>
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {trainerAggregatedStats.avgCourseProgress}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            High completion pace
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Diagnostic</span>
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {trainerAggregatedStats.avgDiagnosticScore}%
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Top 5% Ministry benchmark
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Needs Review</span>
            <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-2">
            <span>{pendingSubmissionsCount} Pending</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Awaiting assessment grading
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>All Trainees</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
            {traineesList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'PENDING'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Pending Grading</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
            {pendingSubmissionsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('AT_RISK')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'AT_RISK'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Needs Mentorship</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
            {atRiskCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Graduated / Completed</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
            {completedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('COURSES')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ml-auto ${
            activeTab === 'COURSES'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Courses & Cohort Breakdown ({courses.length})</span>
        </button>
      </div>

      {/* If COURSES Tab is selected, display visual cards of the trainer's courses */}
      {activeTab === 'COURSES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((c) => (
            <div
              key={c.id}
              className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${c.thumbnailGradient} text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                      {c.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {c.level}
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mt-4">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Cohort: <strong className="text-slate-700 dark:text-slate-200">{c.cohortName}</strong> · Category: {c.category}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Cohort Average Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white">{c.avgCompletion}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${c.thumbnailGradient}`}
                      style={{ width: `${c.avgCompletion}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Enrolled</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{c.enrolledCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Duration</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{c.durationHours} hrs</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">To Grade</div>
                    <div className="text-sm font-black text-rose-600 dark:text-rose-400">{c.pendingSubmissions}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  {c.startDate} – {c.endDate}
                </span>
                <Link
                  to={`/trainer/courses/${c.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Manage Track</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Trainees Roster List & Controls */
        <div className="cc-card rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, employee ID, institute, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              {/* Course filter */}
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Courses ({courses.length})</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title.length > 32 ? c.title.slice(0, 32) + '...' : c.title}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ON_TRACK">On Track</option>
                <option value="AHEAD">Ahead of Schedule</option>
                <option value="NEEDS_HELP">Needs Mentorship</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Trainees Table */}
          {filteredTrainees.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                No matching trainees found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Try loosening your search terms or clearing active filters to view all assigned learners.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCourseFilter('ALL');
                  setSelectedStatusFilter('ALL');
                  setActiveTab('ALL');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="table-wrap overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Trainee & Department</th>
                    <th className="py-3.5 px-4">Course & Cohort</th>
                    <th className="py-3.5 px-4">Progress</th>
                    <th className="py-3.5 px-4">Diagnostic Score</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Active</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredTrainees.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Trainee Info */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{t.name}</span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {t.organization}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {t.email} · ID: {t.employeeId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Course & Cohort */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs line-clamp-1 max-w-[200px]" title={t.courseTitle}>
                          {t.courseTitle}
                        </div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                          {t.cohort}
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{t.progress}%</span>
                            <span className="text-slate-400">{t.modulesCompleted}/{t.totalModules} mods</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                t.progress >= 90
                                  ? 'bg-emerald-500'
                                  : t.progress >= 60
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${t.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Diagnostic Baseline */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                              t.diagnosticScore >= 85
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40'
                                : t.diagnosticScore >= 70
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/40'
                            }`}
                          >
                            {t.diagnosticScore}%
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                            {t.diagnosticLevel}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            t.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : t.status === 'AHEAD'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                              : t.status === 'ON_TRACK'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {t.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                          {t.status === 'NEEDS_HELP' && <AlertCircle className="w-3 h-3" />}
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{t.lastActive}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {t.pendingSubmission && (
                            <button
                              onClick={() => setGradingSubmission({ trainee: t, submission: t.pendingSubmission! })}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all animate-pulse"
                              title="Grade pending assignment submission"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Grade</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedTrainee(t)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL 1: Trainee Dossier & Profile Drawer ── */}
      {selectedTrainee && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cc-card w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTrainee.avatar}
                  alt={selectedTrainee.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30"
                />
                <div>
                  <h3 className="text-xl font-black text-white">{selectedTrainee.name}</h3>
                  <p className="text-xs text-blue-200">
                    {selectedTrainee.department} · {selectedTrainee.organization}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    ID: {selectedTrainee.employeeId} · {selectedTrainee.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrainee(null)}
                className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Overview Metrics */}
              <div className="grid grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Progress</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{selectedTrainee.progress}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Diagnostic</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedTrainee.diagnosticScore}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Attendance</div>
                  <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">{selectedTrainee.attendanceRate}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Modules</div>
                  <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">{selectedTrainee.modulesCompleted}/{selectedTrainee.totalModules}</div>
                </div>
              </div>

              {/* Course & Cohort Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Curriculum Track</h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{selectedTrainee.courseTitle}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{selectedTrainee.cohort} · Enrolled: {selectedTrainee.enrolledDate}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    {selectedTrainee.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Competency Mastery */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Evaluated Competencies</h4>
                <div className="space-y-3">
                  {selectedTrainee.competencies.map((c, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{c.name}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{c.score}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send Private Feedback */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Send Direct Trainer Guidance</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Write a note or recommendation to ${selectedTrainee.name}...`}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendFeedback}
                    className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTrainee(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Assignment Grading Modal ── */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cc-card w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-rose-900 to-red-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-rose-100">
                  Assessment Evaluation
                </span>
                <h3 className="text-lg font-black text-white mt-1">Grade Submission</h3>
                <p className="text-xs text-rose-200">{gradingSubmission.trainee.name} · {gradingSubmission.trainee.organization}</p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-400 font-semibold uppercase">Assignment Title</div>
                <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {gradingSubmission.submission.assignmentTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Submitted: {gradingSubmission.submission.submittedAt}
                </div>
                {gradingSubmission.submission.fileAttachment && (
                  <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{gradingSubmission.submission.fileAttachment}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{gradingSubmission.submission.fileSize}</span>
                  </div>
                )}
                {gradingSubmission.submission.studentNotes && (
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 italic bg-blue-50/50 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-200/40 dark:border-blue-800/40">
                    "{gradingSubmission.submission.studentNotes}"
                  </div>
                )}
              </div>

              {/* Grade Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Numeric Score (0 - 100%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Trainer Feedback & Recommendations
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback, praise or areas for improvement..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeSubmit}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Submit Grade & Return Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Broadcast Announcement Modal ── */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleBroadcastSend}
            className="cc-card w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="p-6 bg-gradient-to-r from-blue-800 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-blue-100">
                  Curriculum Notice
                </span>
                <h3 className="text-lg font-black text-white mt-1">Broadcast Announcement</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Recipient Cohort
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Enrolled Learners (284 Trainees)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.cohortName}>
                      {c.cohortName} ({c.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Notice Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Update: Live Doppler Clinic this Friday"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the message to be dispatched to enrolled students via notification & portal feed..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Notice</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
