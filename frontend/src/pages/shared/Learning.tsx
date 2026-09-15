import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, CheckCircle2, Play, AlertCircle, BarChart3,
  Filter, Search, Calendar, ChevronRight, Award, Sparkles, BookMarked
} from 'lucide-react';
import { learnerService } from '../../services/learnerService';
import { Course } from '../../data/capacityConnectData';

export default function MyLearning() {
  const [filterStatus, setFilterStatus] = useState<'All' | 'In Progress' | 'Completed' | 'Not Started'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['myLearningCourses'],
    queryFn: () => learnerService.getMyLearningCourses(),
  });

  const filteredCourses = courses.filter(c => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const completedCount = courses.filter(c => c.status === 'Completed').length;
  const inProgressCount = courses.filter(c => c.status === 'In Progress' || c.status === 'Almost Complete').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learner Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            My Learning & Enrolled Courses
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Track active modules, complete assignments on time, and resume your learning exactly where you paused.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
          <div>
            <div className="text-[10px] text-blue-200 uppercase font-bold">Enrolled</div>
            <div className="text-xl font-black mt-0.5">{courses.length}</div>
          </div>
          <div className="border-x border-white/20 px-3">
            <div className="text-[10px] text-blue-200 uppercase font-bold">In Progress</div>
            <div className="text-xl font-black text-cyan-300 mt-0.5">{inProgressCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-blue-200 uppercase font-bold">Completed</div>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Continue Learning Spotlight (Most recent active course) */}
      {courses.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Continue Learning
              </h2>
            </div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              Module {courses[0].completedModules + 1} of {courses[0].totalModules} Ready
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${courses[0].thumbnailGradient} text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20`}>
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {courses[0].category} · Level: {courses[0].level}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {courses[0].title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Instructor: {courses[0].instructor} · {courses[0].estimatedTime}
                </p>
              </div>
            </div>

            <div className="w-full lg:w-72 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Current Progress</span>
                <span className="text-blue-600 dark:text-cyan-400">{courses[0].progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${courses[0].progress}%` }} />
              </div>
            </div>

            <button
              onClick={() => setSelectedCourse(courses[0])}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all w-full lg:w-auto flex-shrink-0 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Module</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {(['All', 'In Progress', 'Completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enrolled courses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
              <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCourses.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <BookMarked className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No courses match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switch the status filter to "All".
          </p>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Thumbnail Header */}
              <div className={`h-28 rounded-2xl bg-gradient-to-r ${course.thumbnailGradient} p-4 text-white flex flex-col justify-between relative overflow-hidden mb-4 shadow-md`}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md uppercase">
                    {course.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-sm ${
                    course.status === 'Completed' ? 'bg-emerald-500/80 text-white' : 'bg-black/30 text-white'
                  }`}>
                    {course.status}
                  </span>
                </div>

                <div className="flex items-end justify-between text-xs text-white">
                  <span className="font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.estimatedTime}
                  </span>
                  <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded">
                    {course.completedModules}/{course.totalModules} Units
                  </span>
                </div>
              </div>

              <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 mb-1.5">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {course.description}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Progress</span>
                  <span className="text-blue-600 dark:text-cyan-400">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${course.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setSelectedCourse(course)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
              >
                Course Info
              </button>
              <button
                onClick={() => setSelectedCourse(course)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-blue-600/20"
              >
                <span>{course.status === 'Completed' ? 'Review Course' : 'Continue'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase">
                  {selectedCourse.category}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Instructor: {selectedCourse.instructor} ({selectedCourse.instructorRole})
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedCourse.description}
            </p>

            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Progress</span>
                <span className="font-bold text-blue-600 dark:text-cyan-400">{selectedCourse.progress}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Modules</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedCourse.completedModules}/{selectedCourse.totalModules}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Level</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedCourse.level}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Upcoming Modules in Track:</div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span>Unit 01: Core Architecture & Setup</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span>Unit 02: Hands-On Production Practice</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Current</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between opacity-60">
                  <span>Unit 03: Final Capstone Assessment</span>
                  <span className="text-[10px] font-mono text-slate-400">Locked</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  alert(`Launching course player for "${selectedCourse.title}"`);
                  setSelectedCourse(null);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Open Player</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
