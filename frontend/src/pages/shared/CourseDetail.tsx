import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  User,
  Award,
  Layers,
  Calendar,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Briefcase,
  Share2,
  Bookmark,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import { resolveCourseImage, getCourseFallbackImage } from '../../utils/courseImageHelper';
import { CourseCard } from '../../components/courses/CourseCard';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || 'trainee';

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  // Load course by composite ID or course ID
  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['excel-course-detail', id],
    queryFn: () => (id ? courseService.getCourseById(id) : Promise.resolve(undefined)),
    enabled: Boolean(id),
  });

  // Load related courses from the same sector
  const { data: relatedCourses = [] } = useQuery({
    queryKey: ['excel-related-courses', course?.sector, course?.id],
    queryFn: async () => {
      if (!course) return [];
      const sectorCourses = await courseService.getCoursesBySector(course.sector);
      return sectorCourses.filter(c => c.id !== course.id).slice(0, 3);
    },
    enabled: Boolean(course),
  });

  const isEnrolled = course ? courseService.isEnrolled(course.id) || enrollSuccess : false;

  const handleEnroll = () => {
    if (!course) return;
    courseService.enrollInCourse(course.id);
    setEnrollSuccess(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (course) {
      e.currentTarget.src = getCourseFallbackImage(course.sector);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Loading course details...</h3>
        <p className="text-xs text-slate-500">Retrieving curriculum specifications from master catalogue.</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-black text-xl text-slate-900 dark:text-white">Course Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The course identifier "{id}" does not match any entry in the active course catalogues.
        </p>
        <Link
          to={`/${role}/courses`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  const levelClass =
    course.level.toLowerCase() === 'easy'
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
      : course.level.toLowerCase() === 'advanced'
      ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <Link
          to={`/${role}/courses`}
          className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalogue</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(b => !b)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark this course'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card with Course Thumbnail */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Course Information */}
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-4">
            {/* Top tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                {course.catalogueName}
              </span>
              <span className="px-2.5 py-1 rounded-full font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Course ID: {course.courseId}
              </span>
              <span className={`px-2.5 py-1 rounded-full font-bold border ${levelClass}`}>
                Level: {course.level}
              </span>
            </div>

            {/* Course Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {course.name}
            </h1>

            {/* Sector & Domain Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{course.sector}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-blue-500" />
                <span>{course.domain}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {course.description}
            </p>

            {/* Enrollment / Action Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              {isEnrolled ? (
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-600/20">
                  <CheckCircle className="w-4 h-4" />
                  <span>Enrolled · Access Learning Materials</span>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Enroll in Course</span>
                </button>
              )}

              <Link
                to={`/${role}/learning`}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Go to My Learning
              </Link>
            </div>
          </div>

          {/* Right: Course Visual / Key Highlights */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950/60 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-inner bg-slate-200 dark:bg-slate-800">
              <img
                src={resolveCourseImage(course)}
                alt={course.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] uppercase font-bold text-slate-200 block">Training Mode</span>
                <span className="text-xs font-black">{course.trainingMode || 'Instructor-led'}</span>
              </div>
            </div>

            {/* Quick Spec List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duration</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{course.duration || 'Flexible'}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Trainer / Faculty</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]" title={course.trainer}>
                  {course.trainer || 'Institutional Faculty'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Dates</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]" title={course.dates}>
                  {course.dates || 'Self-paced / Rolling batches'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detailed Specs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skills & Competencies */}
        <div className="lg:col-span-8 space-y-6">
          {/* Skills Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Skills Developed in This Course</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">{course.skills.length} Targeted Skills</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completing this curriculum qualifies learners across the following verified granular skills:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {course.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Competencies Framework */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Organizational Competencies</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">{course.competencies.length} Benchmark Competencies</span>
            </div>

            <div className="space-y-2 pt-1">
              {course.competencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black text-xs flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{comp}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Verified alignment to institutional capacity standards
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility & Prerequisites */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Eligibility & Prerequisites</span>
            </h2>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
              {course.eligibility || 'Open to all staff and learners with general foundational background.'}
            </div>
          </div>
        </div>

        {/* Right Column: Key Details & Related Courses */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Course Specification
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Catalogue Source</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{course.catalogueName}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Original Course ID</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{course.courseId}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Institutional Sector</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{course.sector}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Domain Focus</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{course.domain}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheduled Timeline</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{course.dates || 'Rolling Admission'}</span>
              </div>
            </div>
          </div>

          {/* Related Courses */}
          {relatedCourses.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white px-1">
                More in {course.sector}
              </h3>

              <div className="space-y-3">
                {relatedCourses.map(rel => (
                  <Link
                    key={rel.id}
                    to={`/${role}/courses/${rel.id}`}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 shadow-xs flex items-center gap-3 group transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      <img
                        src={resolveCourseImage(rel)}
                        alt={rel.name}
                        onError={e => {
                          e.currentTarget.src = getCourseFallbackImage(rel.sector);
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {rel.duration || '4 hours'} · {rel.level}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
