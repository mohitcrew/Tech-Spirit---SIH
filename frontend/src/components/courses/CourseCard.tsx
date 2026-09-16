import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Award, Globe, Compass, ArrowRight, Layers } from 'lucide-react';
import { NormalizedCourse } from '../../types/course';
import { resolveCourseImage, getCourseFallbackImage } from '../../utils/courseImageHelper';

interface CourseCardProps {
  course: NormalizedCourse;
  rolePrefix?: string; // e.g. '/trainee', '/trainer', '/admin'
  matchPercentage?: number;
  recommendationReason?: string;
  onViewCourse?: (course: NormalizedCourse) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  rolePrefix = '/trainee',
  matchPercentage,
  recommendationReason,
  onViewCourse,
}) => {
  const levelClass =
    course.level.toLowerCase() === 'easy'
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
      : course.level.toLowerCase() === 'advanced'
      ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';

  const catalogueBadgeClass =
    course.catalogue === 'earth_sciences'
      ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20'
      : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20';

  const detailsUrl = `${rolePrefix}/courses/${course.id}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getCourseFallbackImage(course.sector);
  };

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Course Thumbnail */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={resolveCourseImage(course)}
            alt={course.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border backdrop-blur-md bg-white/90 dark:bg-slate-900/90 ${catalogueBadgeClass}`}
            >
              {course.catalogue === 'earth_sciences' ? 'Earth Sciences' : 'General'}
            </span>

            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-900/80 text-white backdrop-blur-md">
              {course.courseId}
            </span>
          </div>

          {/* Bottom image overlay: Match percentage if provided */}
          {matchPercentage !== undefined && (
            <div className="absolute bottom-2.5 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-sm">
                <Award className="w-3 h-3" />
                <span>{matchPercentage}% Skill Match</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Category / Sector & Level tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className={`px-2 py-0.5 rounded-md font-bold border ${levelClass}`}>
              {course.level}
            </span>
            <span
              className="px-2 py-0.5 rounded-md font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[170px]"
              title={course.sector}
            >
              {course.sector}
            </span>
            {course.trainingMode && (
              <span className="px-2 py-0.5 rounded-md font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px]">
                {course.trainingMode}
              </span>
            )}
          </div>

          {/* Course Name */}
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            <Link to={detailsUrl} onClick={() => onViewCourse?.(course)}>
              {course.name}
            </Link>
          </h3>

          {/* Recommendation Reason if available */}
          {recommendationReason && (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 font-medium">
              💡 {recommendationReason}
            </p>
          )}

          {/* Short Description */}
          {course.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Domain line */}
          {course.domain && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Compass className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{course.domain}</span>
            </div>
          )}

          {/* Skills Pill list */}
          {course.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1">
              {course.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
              {course.skills.length > 3 && (
                <span className="text-[10px] text-slate-400 font-semibold">
                  +{course.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-3">
          <div className="flex items-center gap-1" title="Duration">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.duration || 'Flexible'}</span>
          </div>

          <div className="flex items-center gap-1 truncate max-w-[130px]" title={course.trainer}>
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{course.trainer || 'Faculty'}</span>
          </div>
        </div>

        <Link
          to={detailsUrl}
          onClick={() => onViewCourse?.(course)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 hover:text-white dark:text-slate-200 dark:hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all group-hover:bg-blue-600 group-hover:text-white shadow-xs"
        >
          <span>View Course</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
