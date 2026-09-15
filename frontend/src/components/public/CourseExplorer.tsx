import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Clock, Star, Users, BookOpen, ArrowRight, CheckCircle, ChevronDown
} from 'lucide-react';
import { publicCourses, PublicCourse } from '../../data/skillsyncData';

interface CourseExplorerProps {
  onEnrollCourse: (course: PublicCourse) => void;
  showAllInitially?: boolean;
}

export const CourseExplorer: React.FC<CourseExplorerProps> = ({
  onEnrollCourse,
  showAllInitially = false,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedCompetency, setSelectedCompetency] = useState('All');
  const [previewCourse, setPreviewCourse] = useState<PublicCourse | null>(null);

  const filteredCourses = useMemo(() => {
    return publicCourses.filter(c => {
      const matchSearch =
        search === '' ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.techStack.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        c.competencies.some(comp => comp.toLowerCase().includes(search.toLowerCase()));

      const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
      const matchMode = selectedMode === 'All' || c.learningMode === selectedMode;
      const matchComp = selectedCompetency === 'All' || c.competencies.includes(selectedCompetency);

      return matchSearch && matchLevel && matchMode && matchComp;
    });
  }, [search, selectedLevel, selectedMode, selectedCompetency]);

  const displayedCourses = showAllInitially ? filteredCourses : filteredCourses.slice(0, 6);

  return (
    <section id="courses" className="py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Course Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
              Learn Something That Moves You Forward
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Curated, competency-benchmarked curricula delivered by seasoned industry specialists.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, skills (e.g. Python, Docker) or competencies..."
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mr-2 font-bold">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Level */}
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-cyan-500 shadow-sm"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Mode */}
            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-cyan-500 shadow-sm"
            >
              <option value="All">All Learning Modes</option>
              <option value="Cohort-Based">Cohort-Based</option>
              <option value="Hybrid Workshop">Hybrid Workshop</option>
              <option value="Self-Paced">Self-Paced</option>
            </select>

            {/* Reset */}
            {(selectedLevel !== 'All' || selectedMode !== 'All' || search !== '') && (
              <button
                onClick={() => { setSelectedLevel('All'); setSelectedMode('All'); setSearch(''); }}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map(course => (
            <div
              key={course.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-md"
            >
              <div>
                {/* Banner Thumbnail */}
                <div
                  className={`h-28 rounded-2xl bg-gradient-to-r ${course.gradient} p-4 text-white flex flex-col justify-between relative overflow-hidden mb-4 shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">
                      {course.category}
                    </span>
                    <span className="text-[11px] bg-black/30 px-2 py-0.5 rounded-md font-semibold backdrop-blur-sm text-white">
                      {course.level}
                    </span>
                  </div>

                  <div className="flex items-end justify-between text-xs text-white">
                    <span className="text-white font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-white" />
                      {course.duration}
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded font-mono text-[10px] text-white">
                      {course.learningMode}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                  {course.description}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.techStack.map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-transparent">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Competencies Badges */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Competencies</div>
                  <div className="flex flex-wrap gap-1">
                    {course.competencies.map(comp => (
                      <span key={comp} className="text-[10px] text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/60 px-2 py-0.5 rounded-md font-semibold">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Trainer & Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={course.trainerAvatar}
                      alt={course.trainerName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{course.trainerName}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setPreviewCourse(course)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center border border-slate-200 dark:border-transparent"
                  >
                    View Syllabus
                  </button>
                  <button
                    onClick={() => onEnrollCourse(course)}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all text-center shadow-md shadow-blue-600/30 flex items-center justify-center gap-1"
                  >
                    <span className="text-white">Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Syllabus Preview Modal */}
        {previewCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 border border-slate-750 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Course Syllabus Preview
                </span>
                <button
                  onClick={() => setPreviewCourse(null)}
                  className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-xl font-black mb-2">{previewCourse.title}</h3>
              <p className="text-xs text-slate-400 mb-6">{previewCourse.description}</p>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                {previewCourse.syllabus.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-xs text-cyan-300 mb-1">{s.module}</div>
                    <ul className="space-y-1 text-[11px] text-slate-400">
                      {s.topics.map((top, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>{top}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewCourse(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-750"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const c = previewCourse;
                    setPreviewCourse(null);
                    onEnrollCourse(c);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
