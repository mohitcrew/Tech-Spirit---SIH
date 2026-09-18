import React, { useState } from 'react';
import {
  BookOpen, Clock, CheckCircle2, Award, PlayCircle, ArrowRight
} from 'lucide-react';
import { Course } from '../../data/capacityConnectData';

interface MyLearningJourneyProps {
  courses: Course[];
  onOpenCourse: (course: Course) => void;
}

export const MyLearningJourney: React.FC<MyLearningJourneyProps> = ({
  courses,
  onOpenCourse,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'In Progress' | 'Almost Complete' | 'Completed'>('All');

  const filtered = courses.filter(c => {
    if (activeTab === 'All') return true;
    return c.status === activeTab;
  });

  const getStatusBadge = (status: Course['status']) => {
    switch (status) {
      case 'Completed':
        return <span className="cc-pill cc-pill-green">Completed</span>;
      case 'Almost Complete':
        return <span className="cc-pill cc-pill-purple">Almost Complete</span>;
      case 'In Progress':
        return <span className="cc-pill cc-pill-blue">In Progress</span>;
      case 'Not Started':
        return <span className="cc-pill bg-slate-100 text-slate-600">Not Started</span>;
    }
  };

  return (
    <div className="mb-8">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            My Learning Journey
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track module progression, estimated completion, and interactive credentials
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-x-auto no-scrollbar">
          {(['All', 'In Progress', 'Almost Complete', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(course => {
          // Calculate circle stroke offset for SVG circular indicator
          const radius = 13;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (course.progress / 100) * circumference;

          return (
            <div
              key={course.id}
              className="cc-card p-5 flex flex-col justify-between group cursor-pointer db-course-card"
              onClick={() => onOpenCourse(course)}
            >
              <div>
                {/* Card Top: Gradient Banner Thumbnail & Category */}
                <div
                  className={`course-gradient-thumb h-24 rounded-2xl bg-gradient-to-r ${course.thumbnailGradient} p-3.5 text-white flex flex-col justify-between relative overflow-hidden mb-4 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="course-thumb-category px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/25 border border-white/35 backdrop-blur-md text-white shadow-xs"
                      style={{ color: '#ffffff' }}
                    >
                      {course.category}
                    </span>
                    <span
                      className="course-thumb-level text-xs bg-black/35 border border-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm font-bold text-white shadow-xs"
                      style={{ color: '#ffffff' }}
                    >
                      {course.level}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <span
                      className="course-thumb-rating text-[11px] text-white font-semibold flex items-center gap-1 drop-shadow-xs"
                      style={{ color: '#ffffff' }}
                    >
                      <span className="text-amber-300">★</span> {course.rating} Rating
                    </span>
                    <div className="w-7 h-7 rounded-xl bg-white/25 border border-white/30 backdrop-blur-md flex items-center justify-center text-white">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Status Badge & Title */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  {getStatusBadge(course.status)}
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.estimatedTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mb-4">
                  Instructor: <span className="font-medium text-slate-700">{course.instructor}</span>
                </p>
              </div>

              {/* Progress Footer */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* Animated Circular Progress Icon */}
                    <svg className="w-8 h-8 cc-circular-progress" viewBox="0 0 32 32">
                      <circle
                        className="cc-circular-progress-bg"
                        strokeWidth="2.5"
                        fill="transparent"
                        stroke="rgba(148, 163, 184, 0.25)"
                        r={radius}
                        cx="16"
                        cy="16"
                        style={{ stroke: 'rgba(148, 163, 184, 0.25)' }}
                      />
                      <circle
                        className="cc-circular-progress-val"
                        stroke={course.accentColor}
                        strokeWidth="2.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx="16"
                        cy="16"
                        style={{
                          stroke: course.accentColor,
                          strokeDasharray: circumference,
                          strokeDashoffset,
                          transition: 'stroke-dashoffset 0.8s ease',
                        }}
                      />
                    </svg>
                    <div>
                      <div className="text-xs font-black text-slate-900">{course.progress}%</div>
                      <div className="text-[10px] text-slate-400">
                        {course.completedModules}/{course.totalModules} modules
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCourse(course);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      course.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {course.status === 'Completed' ? (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </>
                    ) : course.status === 'Not Started' ? (
                      <>
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Continue</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: course.accentColor,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
