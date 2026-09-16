import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Route, Target, CheckCircle2, Circle, Lock, Award, Sparkles,
  Layers, ChevronRight, Clock, ShieldCheck, PlayCircle, Trophy,
  AlertTriangle, BookOpen, ExternalLink, ArrowRight, RefreshCw,
  Compass, Zap
} from 'lucide-react';
import { learnerService, CareerRoadmap, CareerRoadmapStage } from '../../services/learnerService';
import { useNavigate } from 'react-router-dom';

export default function CareerRoadmapView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedStageId, setSelectedStageId] = useState<string>('stg-3');
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'gaps'>('timeline');

  // Load personalized roadmap
  const { data: roadmap, isLoading } = useQuery({
    queryKey: ['careerRoadmap'],
    queryFn: () => learnerService.getPersonalizedRoadmap(),
  });

  // Load skill gap analysis
  const skillGaps = learnerService.getSkillGapAnalysis();

  // Mutation to toggle task or complete stage
  const completeStageMutation = useMutation({
    mutationFn: (stageId: string) => {
      learnerService.updateRoadmapStage(stageId, 'completed');
      const stage = roadmap?.stages.find(s => s.id === stageId);
      if (stage) {
        learnerService.issueStageCertificate(stage);
      }
      return Promise.resolve(stageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerRoadmap'] });
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['pointTransactions'] });
    },
  });

  if (isLoading || !roadmap) {
    return (
      <div className="state-box loading-pulse p-12 text-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Synthesizing Career Roadmap...</p>
      </div>
    );
  }

  const selectedStage = roadmap.stages.find(s => s.id === selectedStageId) || roadmap.stages[0];
  const completedStagesCount = roadmap.stages.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedStagesCount / roadmap.stages.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Synthesized Career Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Personalized Career Roadmap: {roadmap.targetRole}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
            Targeting {roadmap.targetRole} at {roadmap.dreamCompany} • {roadmap.targetTimeline} structured curriculum
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/20 text-[11px] text-purple-200">
            <span>Overall Path Progress:</span>
            <span className="font-black text-amber-300">{progressPercent}%</span>
            <span>({completedStagesCount} of {roadmap.stages.length} Stages Certified)</span>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-xs text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Advisory Notice</span>
          </div>
          <p className="text-[11px] text-purple-100/90 leading-relaxed">
            {roadmap.disclaimer}
          </p>
        </div>
      </div>

      {/* View Switcher: Roadmap Timeline vs Diagnostic Skill Gap */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'timeline'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Route className="w-4 h-4" />
          <span>Curriculum Timeline ({roadmap.stages.length} Stages)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gaps')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'gaps'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Diagnostic Skill Gap Analysis</span>
        </button>
      </div>

      {/* Sub-Tab 1: Career Timeline View */}
      {activeSubTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Timeline Stepper */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Curriculum Milestone Stages
            </div>

            <div className="space-y-3">
              {roadmap.stages.map((stg, index) => {
                const isSelected = stg.id === selectedStageId;
                const isCompleted = stg.status === 'completed';
                const isInProgress = stg.status === 'in_progress';
                const isLocked = stg.status === 'locked';

                return (
                  <div
                    key={stg.id}
                    onClick={() => setSelectedStageId(stg.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500 dark:bg-purple-950/30 dark:border-purple-400 shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Stage status indicator icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isInProgress ? (
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold animate-pulse">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                      ) : isLocked ? (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                          <Circle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          Stage {stg.order} • {stg.estimatedDuration}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          +{stg.pointsAvailable} XP
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                        {stg.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {stg.objective}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 self-center flex-shrink-0 transition ${
                      isSelected ? 'text-purple-600 dark:text-purple-400 translate-x-0.5' : 'text-slate-300 dark:text-slate-600'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Stage Deep-Dive Card */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-black">
                      Stage {selectedStage.order}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                      selectedStage.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                      selectedStage.status === 'in_progress' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' :
                      selectedStage.status === 'locked' ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' :
                      'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}>
                      {selectedStage.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2">
                    {selectedStage.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {selectedStage.objective}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Reward Upon Completion</div>
                  <div className="text-base font-black text-amber-500 flex items-center justify-end gap-1 mt-0.5">
                    <Trophy className="w-4 h-4" />
                    <span>+{selectedStage.pointsAvailable} XP</span>
                  </div>
                </div>
              </div>

              {/* Skills Built in this Stage */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Competencies Acquired
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStage.skills.map(s => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Stage Tasks */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Milestone Deliverables & Assessments
                </h4>
                <div className="space-y-2">
                  {selectedStage.tasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                        )}
                        <span className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-500 px-2 py-0.5 rounded-md bg-amber-500/10">
                        +{task.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Mark Complete & View Certificate */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                {selectedStage.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Stage Verified & Stage Certificate Issued!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => completeStageMutation.mutate(selectedStage.id)}
                    disabled={completeStageMutation.isPending || selectedStage.status === 'locked'}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-md shadow-purple-500/25 disabled:opacity-40"
                  >
                    {completeStageMutation.isPending ? 'Verifying...' : 'Mark Stage Complete & Claim XP'}
                  </button>
                )}

                <button
                  onClick={() => navigate('/trainee/certificates')}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 transition"
                >
                  <Award className="w-4 h-4" />
                  <span>View in Certificates Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Diagnostic Skill Gap Analysis */}
      {activeSubTab === 'gaps' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Diagnostic Skill Gap Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparison between your current competency ratings and the baseline requirements for {skillGaps.targetRole} roles.
              </p>
            </div>

            <div className="space-y-4">
              {skillGaps.skills.map(gap => (
                <div
                  key={gap.name}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {gap.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          gap.priority === 'High Priority' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' :
                          gap.priority === 'Medium Priority' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                          'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {gap.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {gap.whyItMatters}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                        {gap.gap > 0 ? `-${gap.gap}% Gap` : 'At Target'}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        Current: {gap.current}% • Target: {gap.target}%
                      </div>
                    </div>
                  </div>

                  {/* Visual Comparison Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                      {/* Target marker indicator */}
                      <div
                        className="absolute top-0 bottom-0 border-r-2 border-dashed border-amber-400 z-10"
                        style={{ left: `${gap.target}%` }}
                        title={`Target: ${gap.target}%`}
                      />
                      {/* Current skill bar */}
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${gap.current}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommendation snippet */}
                  <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-blue-900 dark:text-blue-300">What to master: </span>
                      <span className="text-blue-800/80 dark:text-blue-200/80">{gap.whatToLearn}</span>
                    </div>
                    <button
                      onClick={() => navigate('/trainee/courses')}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex-shrink-0"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
