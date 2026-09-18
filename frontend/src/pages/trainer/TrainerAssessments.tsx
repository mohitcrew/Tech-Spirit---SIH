import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Award,
  Users,
  PlusCircle,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  X,
  Send,
  Eye,
  Sparkles,
  HelpCircle,
  Layers,
  GraduationCap
} from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { trainerCourses, assignedTrainees } from '../../data/trainerData';

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  weightage: number;
}

export interface AssessmentItem {
  id: string;
  title: string;
  courseTitle: string;
  cohortName: string;
  type: 'DIAGNOSTIC' | 'PRACTICAL' | 'FINAL_EXAM' | 'MODULE_QUIZ';
  passingScore: number;
  totalQuestions: number;
  durationMinutes: number;
  status: 'PUBLISHED' | 'DRAFT';
  submissionsCount: number;
  totalEnrolled: number;
  averageScore: number;
  pendingToGradeCount: number;
  questions: AssessmentQuestion[];
  rubricCriteria?: string[];
}

const initialAssessments: AssessmentItem[] = [
  {
    id: 'asm-rad-101',
    title: 'Dual-Polarization Doppler Radar Reflectivity & Telemetry Lab',
    courseTitle: 'Doppler Radar & Severe Weather Telemetry Analytics',
    cohortName: 'Batch 2026-B',
    type: 'PRACTICAL',
    passingScore: 80,
    totalQuestions: 4,
    durationMinutes: 90,
    status: 'PUBLISHED',
    submissionsCount: 78,
    totalEnrolled: 78,
    averageScore: 89.2,
    pendingToGradeCount: 4,
    rubricCriteria: [
      'Radar Calibration: Accuracy of ZDR and KDP bias coefficients (30%)',
      'Telemetry Pipeline: NetCDF4 format validation and metadata integrity (30%)',
      'Severe Hail Detection: Algorithm threshold accuracy (40%)',
    ],
    questions: [
      {
        id: 'q1',
        question: 'Which dual-polarization radar product is best suited to distinguish between heavy rain and severe hail in storm cores?',
        options: ['Reflectivity factor (Z) alone', 'Differential Reflectivity (ZDR) combined with Correlation Coefficient (CC)', 'Radial Doppler Velocity (V) only', 'Spectrum Width (W)'],
        correctIndex: 1,
        explanation: 'ZDR drops near zero with low CC (< 0.90) in the presence of tumbling hailstones compared to pure raindrops.',
        weightage: 25,
      },
      {
        id: 'q2',
        question: 'What is the primary operational cause of velocity de-aliasing errors in Doppler radar sweeps?',
        options: ['Radar beam ground clutter', 'Pulse Repetition Frequency (PRF) Nyquist interval truncation', 'Antenna pedestal rotation friction', 'Solar flare interference'],
        correctIndex: 1,
        explanation: 'When wind velocities exceed the Nyquist velocity defined by PRF and wavelength, phase wrapping causes aliased velocity signatures.',
        weightage: 25,
      },
    ],
  },
  {
    id: 'asm-ai-201',
    title: 'Generative AI Prompt Architecture & RAG Retrieval Benchmark',
    courseTitle: 'Generative AI Systems & Prompt Engineering for Workflows',
    cohortName: 'Batch 2026-A',
    type: 'FINAL_EXAM',
    passingScore: 85,
    totalQuestions: 20,
    durationMinutes: 60,
    status: 'PUBLISHED',
    submissionsCount: 96,
    totalEnrolled: 96,
    averageScore: 92.4,
    pendingToGradeCount: 6,
    questions: [
      {
        id: 'q1',
        question: 'When implementing a deterministic JSON Schema output from an LLM API, what sampling temperature parameter is recommended?',
        options: ['1.0', '0.7 to 0.9', '0.0 to 0.2', '1.5'],
        correctIndex: 2,
        explanation: 'Low temperatures near zero minimize generative token entropy, maximizing fidelity to the strict JSON Schema guardrails.',
        weightage: 5,
      },
      {
        id: 'q2',
        question: 'In Retrieval Augmented Generation (RAG), what metric is prioritized to ensure the language model does not hallucinate facts?',
        options: ['Context Recall and Context Precision over Cosine Similarity', 'Batch processing speed', 'Vocabulary token length', 'Maximum prompt character limit'],
        correctIndex: 0,
        explanation: 'Context precision measures how relevant retrieved chunks are, preventing ungrounded generations.',
        weightage: 5,
      },
    ],
  },
  {
    id: 'asm-hpc-301',
    title: 'Slurm Multi-Node MPI Climate Simulation Cluster Optimization',
    courseTitle: 'Cloud Infrastructure & High Performance Climate Clusters',
    cohortName: 'Batch 2026-C',
    type: 'PRACTICAL',
    passingScore: 75,
    totalQuestions: 5,
    durationMinutes: 120,
    status: 'PUBLISHED',
    submissionsCount: 62,
    totalEnrolled: 62,
    averageScore: 82.1,
    pendingToGradeCount: 3,
    questions: [
      {
        id: 'q1',
        question: 'In a Slurm multi-node MPI job script, which directive correctly reserves 4 compute nodes with 32 tasks per node?',
        options: ['#SBATCH --nodes=4 --ntasks-per-node=32', '#SBATCH --cpus=128', '#SBATCH --mpi-threads=4', '#SBATCH --cluster-instances=4'],
        correctIndex: 0,
        explanation: '#SBATCH --nodes=4 --ntasks-per-node=32 allocates 128 total MPI ranks across 4 physical nodes.',
        weightage: 20,
      },
    ],
  },
  {
    id: 'asm-gis-401',
    title: 'Geospatial Spatial Heatmap & Vector Analysis with Python QGIS',
    courseTitle: 'Geospatial Data Visualization with Python & QGIS',
    cohortName: 'Batch 2026-D',
    type: 'MODULE_QUIZ',
    passingScore: 80,
    totalQuestions: 15,
    durationMinutes: 45,
    status: 'PUBLISHED',
    submissionsCount: 48,
    totalEnrolled: 48,
    averageScore: 94.6,
    pendingToGradeCount: 1,
    questions: [
      {
        id: 'q1',
        question: 'Which coordinate reference system (CRS) is the international standard for GPS-derived geospatial points?',
        options: ['EPSG:4326 (WGS 84)', 'EPSG:3857 (Web Mercator)', 'EPSG:32643 (UTM Zone 43N)', 'EPSG:7755'],
        correctIndex: 0,
        explanation: 'EPSG:4326 defines latitude and longitude coordinates based on the WGS 84 ellipsoidal datum.',
        weightage: 10,
      },
    ],
  },
  {
    id: 'asm-diag-501',
    title: 'MoES Diagnostic Baseline: Atmospheric & Numerical Modeling Foundations',
    courseTitle: 'Doppler Radar & Severe Weather Telemetry Analytics',
    cohortName: 'Batch 2026-B',
    type: 'DIAGNOSTIC',
    passingScore: 70,
    totalQuestions: 25,
    durationMinutes: 50,
    status: 'PUBLISHED',
    submissionsCount: 78,
    totalEnrolled: 78,
    averageScore: 78.4,
    pendingToGradeCount: 0,
    questions: [
      {
        id: 'q1',
        question: 'What atmospheric lapse rate defines neutral stability in dry air conditions?',
        options: ['9.8°C per km (Dry Adiabatic Lapse Rate)', '6.5°C per km (Environmental Lapse Rate)', '4.0°C per km', '0.0°C per km'],
        correctIndex: 0,
        explanation: 'The Dry Adiabatic Lapse Rate (DALR) is approximately 9.8°C/km.',
        weightage: 4,
      },
    ],
  },
  {
    id: 'asm-ai-601',
    title: 'Curriculum Guardrails & AI Safety Evaluation Sandbox',
    courseTitle: 'Generative AI Systems & Prompt Engineering for Workflows',
    cohortName: 'Batch 2026-A',
    type: 'MODULE_QUIZ',
    passingScore: 85,
    totalQuestions: 12,
    durationMinutes: 30,
    status: 'PUBLISHED',
    submissionsCount: 96,
    totalEnrolled: 96,
    averageScore: 91.0,
    pendingToGradeCount: 0,
    questions: [
      {
        id: 'q1',
        question: 'What is the purpose of a system-prompt guardrail injection filter?',
        options: ['To prevent jailbreaking and unauthorized data leakage', 'To speed up network bandwidth', 'To decrease GPU RAM usage', 'To translate text to speech'],
        correctIndex: 0,
        explanation: 'Guardrail filters sanitize user inputs to prevent prompt injection and policy violations.',
        weightage: 10,
      },
    ],
  },
];

export default function TrainerAssessments() {
  const { user } = useAuth();

  const [assessments, setAssessments] = useState<AssessmentItem[]>(initialAssessments);
  const [activeTab, setActiveTab] = useState<'ALL' | 'DIAGNOSTIC' | 'PRACTICAL' | 'FINAL_EXAM' | 'QUEUE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');

  // Modals state
  const [previewItem, setPreviewItem] = useState<AssessmentItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGradingTrainee, setSelectedGradingTrainee] = useState<any | null>(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New assessment form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState(trainerCourses[0]?.title || 'Generative AI Systems');
  const [newType, setNewType] = useState<AssessmentItem['type']>('PRACTICAL');
  const [newPassingScore, setNewPassingScore] = useState(80);
  const [newTotalQ, setNewTotalQ] = useState(10);
  const [newDuration, setNewDuration] = useState(60);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Trainees with pending submissions
  const pendingSubmissions = useMemo(() => {
    return assignedTrainees.filter((t) => !!t.pendingSubmission);
  }, []);

  // Filtered assessments list
  const filtered = useMemo(() => {
    return assessments.filter((a) => {
      if (activeTab !== 'ALL' && activeTab !== 'QUEUE' && a.type !== activeTab) return false;
      if (selectedCourseFilter !== 'ALL' && a.courseTitle !== selectedCourseFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchCourse = a.courseTitle.toLowerCase().includes(q);
        const matchCohort = a.cohortName.toLowerCase().includes(q);
        return matchTitle || matchCourse || matchCohort;
      }
      return true;
    });
  }, [assessments, activeTab, selectedCourseFilter, searchTerm]);

  // Aggregated metrics
  const totalSubmissions = assessments.reduce((acc, a) => acc + a.submissionsCount, 0);
  const totalPendingToGrade = pendingSubmissions.length;
  const avgCohortPassingRate = Math.round(
    assessments.reduce((acc, a) => acc + a.averageScore, 0) / assessments.length
  );

  // Export Gradebook CSV
  const handleExportGradebook = () => {
    const headers = ['Assessment ID', 'Title', 'Course Track', 'Cohort', 'Type', 'Passing Score', 'Questions', 'Completed Submissions', 'Average Score %'];
    const rows = assessments.map((a) => [
      a.id,
      `"${a.title}"`,
      `"${a.courseTitle}"`,
      a.cohortName,
      a.type,
      `${a.passingScore}%`,
      a.totalQuestions,
      a.submissionsCount,
      `${a.averageScore}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MoES_Curriculum_Gradebook_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Assessment gradebook exported successfully as CSV!');
  };

  // Create new assessment handler
  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAssessment: AssessmentItem = {
      id: 'asm-' + Date.now(),
      title: newTitle.trim(),
      courseTitle: newCourse,
      cohortName: 'Batch 2026-Live',
      type: newType,
      passingScore: newPassingScore,
      totalQuestions: newTotalQ,
      durationMinutes: newDuration,
      status: 'PUBLISHED',
      submissionsCount: 0,
      totalEnrolled: 80,
      averageScore: 0,
      pendingToGradeCount: 0,
      questions: [
        {
          id: 'q1',
          question: `Sample baseline diagnostic question for ${newTitle.trim()}?`,
          options: ['Standard protocol parameter', 'Alternative baseline heuristic', 'Diagnostic reference threshold', 'Experimental telemetry vector'],
          correctIndex: 0,
          explanation: 'Standard protocol parameter provides the certified benchmark.',
          weightage: 10,
        },
      ],
    };

    setAssessments((prev) => [newAssessment, ...prev]);
    showToast(`Assessment "${newTitle}" published successfully!`);
    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  // Submit Grade handler
  const handleGradeTrainee = () => {
    if (!selectedGradingTrainee) return;
    showToast(`Grade ${gradeScore}% & feedback submitted for ${selectedGradingTrainee.name}!`);
    setSelectedGradingTrainee(null);
    setGradeFeedback('');
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
              <ClipboardCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300" />
              Evaluation & Rubric Command Center
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/30">
              MoES Standard 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Assessments & Grading Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl font-medium leading-relaxed">
            Design competency evaluations, supervise automated diagnostic quizzes, review telemetry practical lab scripts, and publish official grades.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportGradebook}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-white/20 text-blue-900 dark:text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-blue-300/90 dark:border-white/20 shadow-sm transition-all active:scale-95"
            title="Download full gradebook CSV"
          >
            <Download className="w-4 h-4 text-blue-700 dark:text-cyan-300" />
            <span>Export Gradebook (CSV)</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Assessment</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Tests</span>
            <ClipboardCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {assessments.length} Tests
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Across 4 Cohort Tracks
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Attempts</span>
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {totalSubmissions}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
            98.6% on-time submission rate
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cohort Avg Score</span>
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {avgCohortPassingRate}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Top 5% Ministry benchmark
          </div>
        </div>

        <div className="cc-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">To Grade</span>
            <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-2">
            <span>{totalPendingToGrade} Pending</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Practical lab submissions
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Tests</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{assessments.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('PRACTICAL')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'PRACTICAL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lab Practicals</span>
          </button>

          <button
            onClick={() => setActiveTab('FINAL_EXAM')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'FINAL_EXAM'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Final Exams</span>
          </button>

          <button
            onClick={() => setActiveTab('DIAGNOSTIC')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'DIAGNOSTIC'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Baseline Diagnostics</span>
          </button>

          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'QUEUE'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Grading Queue ({totalPendingToGrade})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assessments or tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* View 1: Grading Queue Tab */}
      {activeTab === 'QUEUE' ? (
        <div className="cc-card rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Submissions Awaiting Evaluation ({pendingSubmissions.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grade student telemetry scripts, notebooks, and assignment attachments.
              </p>
            </div>
            <Link
              to="/trainer/trainees"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Open Trainee Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingSubmissions.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {t.organization}
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                        {t.cohort}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-200 font-semibold mt-0.5">
                      {t.pendingSubmission?.assignmentTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{t.pendingSubmission?.submittedAt}</span>
                      <span>·</span>
                      <FileText className="w-3 h-3 text-blue-500" />
                      <span>{t.pendingSubmission?.fileAttachment} ({t.pendingSubmission?.fileSize})</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGradingTrainee(t)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all self-end sm:self-center"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Review & Grade</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* View 2: Assessment Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((asm) => (
            <div
              key={asm.id}
              className="cc-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Header: Type Pill & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      asm.type === 'PRACTICAL'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300/40'
                        : asm.type === 'FINAL_EXAM'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300/40'
                        : asm.type === 'DIAGNOSTIC'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/40'
                    }`}
                  >
                    {asm.type.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {asm.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mt-3.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {asm.title}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Track: <strong className="text-slate-700 dark:text-slate-200">{asm.courseTitle}</strong> · {asm.cohortName}
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Passing</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{asm.passingScore}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Questions / Tasks</div>
                    <div className="text-sm font-black text-blue-600 dark:text-blue-400">{asm.totalQuestions} ({asm.durationMinutes}m)</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Cohort Avg</div>
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{asm.averageScore}%</div>
                  </div>
                </div>

                {/* Progress bar of submissions */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Submission Completion</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {asm.submissionsCount}/{asm.totalEnrolled} Trainees ({Math.round((asm.submissionsCount / asm.totalEnrolled) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: `${(asm.submissionsCount / asm.totalEnrolled) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2.5 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setPreviewItem(asm)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>Preview Test ({asm.questions.length} Qs)</span>
                </button>

                {asm.pendingToGradeCount > 0 ? (
                  <button
                    onClick={() => setActiveTab('QUEUE')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>{asm.pendingToGradeCount} to Grade</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">
                    All Graded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL 1: Preview Question Bank Modal ── */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cc-card w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-blue-100">
                  Question Bank Preview
                </span>
                <h3 className="text-lg font-black text-white mt-1">{previewItem.title}</h3>
                <p className="text-xs text-blue-200">{previewItem.courseTitle} · Passing: {previewItem.passingScore}%</p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {previewItem.rubricCriteria && (
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-2">
                    Grading Rubric Breakdown:
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {previewItem.rubricCriteria.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample Questions:</div>
                {previewItem.questions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {qIndex + 1}. {q.question}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex-shrink-0">
                        {q.weightage} pts
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-2">
                      {q.options.map((opt, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
                            optIndex === q.correctIndex
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + optIndex)}. {opt}</span>
                          {optIndex === q.correctIndex && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 italic bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-200/40 dark:border-blue-900/40">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Create Assessment Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAssessment}
            className="cc-card w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-blue-100">
                  Assessment Creator
                </span>
                <h3 className="text-lg font-black text-white mt-1">Draft New Evaluation</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Assessment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyclone Telemetry & Eye Dynamics Lab Evaluation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Associated Curriculum Track
                </label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {trainerCourses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title} ({c.cohortName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Evaluation Format
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="PRACTICAL">Hands-on Lab Practical</option>
                    <option value="FINAL_EXAM">Final Certification Exam</option>
                    <option value="MODULE_QUIZ">Module Checkpoint Quiz</option>
                    <option value="DIAGNOSTIC">Pre-Course Diagnostic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Passing Threshold (%)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={newPassingScore}
                    onChange={(e) => setNewPassingScore(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Total Questions / Tasks
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newTotalQ}
                    onChange={(e) => setNewTotalQ(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Duration Limit (Mins)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish Assessment</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL 3: Grading Review Modal ── */}
      {selectedGradingTrainee && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cc-card w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-rose-900 to-red-950 text-white flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20 text-rose-100">
                  Manual Grading Desk
                </span>
                <h3 className="text-lg font-black text-white mt-1">Grade Submission</h3>
                <p className="text-xs text-rose-200">{selectedGradingTrainee.name} · {selectedGradingTrainee.organization}</p>
              </div>
              <button
                onClick={() => setSelectedGradingTrainee(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-400 font-semibold uppercase">Assignment</div>
                <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {selectedGradingTrainee.pendingSubmission?.assignmentTitle}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Submitted: {selectedGradingTrainee.pendingSubmission?.submittedAt}
                </div>
                {selectedGradingTrainee.pendingSubmission?.studentNotes && (
                  <div className="mt-2 text-xs italic text-slate-600 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/30 p-2.5 rounded-xl">
                    "{selectedGradingTrainee.pendingSubmission.studentNotes}"
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Awarded Score (0 - 100%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Feedback Notes to Trainee
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide recommendations on calibration, code structure, or formulas..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedGradingTrainee(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeTrainee}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Record Grade & Notify Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
