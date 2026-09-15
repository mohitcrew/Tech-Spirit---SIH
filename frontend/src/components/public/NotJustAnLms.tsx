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
    <section id="not-just-lms" className="py-20 bg-slate-950 text-white border-b border-slate-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Paradigm Shift
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Not Just Another LMS.
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            <strong className="text-white">Traditional LMS platforms track learning.</strong>{' '}
            <span className="text-cyan-300 font-bold">SkillSync connects learning to capability.</span>
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Traditional LMS */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Traditional LMS Model</span>
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-1">
                Completion-Oriented
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Measures clicks, hours watched, and certificates issued without verifying capability.
              </p>

              <div className="space-y-3">
                {traditionalSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-slate-400 flex items-center gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              <span className="font-bold block mb-0.5">The Bottleneck:</span>
              High course completions often yield zero measurable increase in team capability.
            </div>
          </div>

          {/* Center Divider / Graphic arrow for desktop */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center text-slate-600">
            <div className="h-full w-px bg-slate-800" />
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 my-4 shadow-sm">
              VS
            </div>
            <div className="h-full w-px bg-slate-800" />
          </div>

          {/* Right: SkillSync Intelligence Model */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500/40 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>The SkillSync Engine</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Capability & Outcome Intelligence
              </h3>
              <p className="text-xs text-blue-200 mb-6">
                Directly maps individual learning interventions to observable organizational capacity.
              </p>

              <div className="space-y-2.5">
                {skillSyncSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950/90 border border-slate-750 hover:border-cyan-400/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center text-xs font-black flex-shrink-0 group-hover:scale-105 transition-transform">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {step.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {step.sub}
                        </div>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between">
              <div>
                <span className="font-black text-white block">The Outcome:</span>
                Learners understand what to build, and organizations know who is ready to deliver.
              </div>
              <Award className="w-6 h-6 text-amber-300 flex-shrink-0 ml-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
