import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Route, Target, CheckCircle2, ArrowRight, Award, Compass,
  Sparkles, Layers, ChevronRight, Clock, ShieldCheck
} from 'lucide-react';
import { learnerService, LearningPath, LearningPathStage } from '../../services/learnerService';

export default function LearningPaths() {
  const { data: paths = [], isLoading } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: () => learnerService.getLearningPaths(),
  });

  const [activePathId, setActivePathId] = useState<string>('lp-01');

  const currentPath = paths.find(p => p.id === activePathId) || paths[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="page-header-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2 text-white" style={{ color: '#ffffff' }}>
            <Route className="w-3.5 h-3.5 text-white" />
            <span className="text-white" style={{ color: '#ffffff' }}>Target Role Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ color: '#ffffff' }}>
            Personalized Learning Paths
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl" style={{ color: '#f3e8ff' }}>
            Structured progression roadmaps tailored to bridge your exact diagnostic skill gaps and prepare you for your target career role.
          </p>
        </div>

        {/* Target role selector pill */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-purple-200">Selected Target Goal</span>
          <select
            value={activePathId}
            onChange={e => setActivePathId(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none"
          >
            {paths.map(p => (
              <option key={p.id} value={p.id} className="text-slate-900">
                {p.targetRole}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentPath && (
        <>
          {/* Path Overview Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Roadmap Milestone Breakdown
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {currentPath.targetRole}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
                  {currentPath.description}
                </p>
              </div>

              {/* Progress metric */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-4 flex-shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Stages</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {currentPath.completedStages} of {currentPath.totalStages} Complete
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-purple-500 flex items-center justify-center font-black text-xs text-purple-600 dark:text-purple-400">
                  {currentPath.overallProgress}%
                </div>
              </div>
            </div>

            {/* Skill Gaps Addressed by this Path */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/40">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Skill Gaps Addressed by this Path:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentPath.calculatedSkillGaps.map(gap => (
                  <span
                    key={gap}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/50 text-[11px] font-semibold text-amber-800 dark:text-amber-300 shadow-xs"
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sequential Stage Timeline */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Recommended Curriculum Sequence</span>
            </h3>

            <div className="space-y-4">
              {currentPath.stages.map((stage, idx) => (
                <div
                  key={stage.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    stage.status === 'completed'
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/50'
                      : stage.status === 'in_progress'
                      ? 'bg-white dark:bg-slate-900 border-2 border-purple-500/50 shadow-xl ring-2 ring-purple-500/10'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-75'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs ${
                          stage.status === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : stage.status === 'in_progress'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {stage.status === 'completed' ? '✓' : `0${stage.order}`}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Stage {stage.order} · {stage.duration}
                        </span>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {stage.title}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold self-start md:self-auto ${
                        stage.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                          : stage.status === 'in_progress'
                          ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {stage.status === 'completed' ? 'Completed' : stage.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
                    </span>
                  </div>

                  {/* Competency Badges for this stage */}
                  <div className="mb-4">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Target Competencies:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.competencies.map(comp => (
                        <span key={comp} className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Included Courses in this Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    {stage.courses.map(course => (
                      <div
                        key={course.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{course.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{course.level} · {course.duration}</div>
                        </div>
                        {course.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : stage.status === 'in_progress' ? (
                          <button
                            onClick={() => alert(`Enrolling in "${course.title}" for stage ${stage.order}`)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex-shrink-0 shadow-sm"
                          >
                            Resume
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">Pending</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
