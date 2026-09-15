import React from 'react';
import { ArrowDown, Check, X, Sparkles, Award, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

export const NotJustAnLms: React.FC = () => {
  const traditionalSteps = [
    'Static Catalog of Courses',
    'Mass Enrollment',
    'Passive Video Completion',
    'Multiple-Choice Assessment',
    'Isolated Certificate PDF',
  ];

  const skillSyncSteps = [
    { title: 'Target Role Profiling', sub: 'Defines real-world performance benchmarks' },
    { title: 'Competency Mapping', sub: 'Deconstructs capabilities behind professional titles' },
    { title: 'Current Skill Evaluation', sub: 'Establishes verified diagnostic baselines' },
    { title: 'Calculated Skill Gaps', sub: 'Pinpoints precise capability deficiencies' },
    { title: 'Adaptive Learning Units', sub: 'Targeted modules tailored to close gaps' },
    { title: 'Verified Domain Trainer', sub: 'Expert coaching and code/brief reviews' },
    { title: 'Performance Assessment', sub: 'Practical rubric-based evaluation' },
    { title: 'Measured Improvement', sub: 'Quantified progress in competency percentage' },
    { title: 'Organizational Capacity', sub: 'Aggregated strategic capability intelligence' },
  ];

  return (
    <section id="not-just-lms" className="py-20 bg-slate-100/50 dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Paradigm Shift
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Not Just Another LMS.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">Traditional LMS platforms track learning.</strong>{' '}
            <span className="text-cyan-600 dark:text-cyan-300 font-bold">SkillSync connects learning to capability.</span>
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Traditional LMS */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Traditional LMS Model</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-1">
                Completion-Oriented
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                Measures clicks, hours watched, and certificates issued without verifying capability.
              </p>

              <div className="space-y-3">
                {traditionalSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-400 flex items-center gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
              <span className="font-bold block mb-0.5">The Bottleneck:</span>
              High course completions often yield zero measurable increase in team capability.
            </div>
          </div>

          {/* Center Divider / Graphic arrow for desktop */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <div className="h-full w-px bg-slate-200 dark:bg-slate-800" />
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-600 dark:text-cyan-400 my-4 shadow-sm">
              VS
            </div>
            <div className="h-full w-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Right: SkillSync Intelligence Model */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-blue-50/80 via-white to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-blue-500/30 dark:border-blue-500/40 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>The SkillSync Engine</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Capability & Outcome Intelligence
              </h3>
              <p className="text-xs text-slate-600 dark:text-blue-200 mb-6">
                Connects target roles directly to competency evaluation, gap reduction, and strategic growth.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {skillSyncSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-950/70 border border-blue-200 dark:border-blue-500/30 flex items-start gap-2.5 shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {step.title}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                        {step.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-200 flex items-center justify-between">
              <span className="font-semibold">Transforming passive LMS tracking into predictive capacity readiness</span>
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
