import React from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, TrendingUp, Target, Layers, Users, Award, RefreshCw
} from 'lucide-react';

interface HeroIntelligenceLoopProps {
  onExploreClick: () => void;
  onRegisterClick: () => void;
  onOpenAi: () => void;
}

export const HeroIntelligenceLoop: React.FC<HeroIntelligenceLoopProps> = ({
  onExploreClick,
  onRegisterClick,
  onOpenAi,
}) => {
  const loopNodes = [
    { label: 'Role', sub: 'Target Capability', icon: Target, color: 'border-blue-500 text-blue-400' },
    { label: 'Competencies', sub: 'Behavior & Output', icon: Award, color: 'border-indigo-500 text-indigo-400' },
    { label: 'Skills', sub: 'Tools & Methods', icon: Layers, color: 'border-purple-500 text-purple-400' },
    { label: 'Skill Gap', sub: 'Calculated Variance', icon: RefreshCw, color: 'border-amber-500 text-amber-400' },
    { label: 'Learning Path', sub: 'Targeted Curricula', icon: TrendingUp, color: 'border-emerald-500 text-emerald-400' },
    { label: 'Trainer', sub: 'Domain Mentors', icon: Users, color: 'border-cyan-500 text-cyan-400' },
    { label: 'Assessment', sub: 'Verified Evaluation', icon: CheckCircle2, color: 'border-blue-400 text-blue-300' },
    { label: 'Improvement', sub: 'Capacity Metric', icon: Sparkles, color: 'border-emerald-400 text-emerald-300' },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-24 border-b border-slate-850">
      {/* Background Neon Glowing Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Hero Text */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-750 text-xs font-bold text-cyan-300 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>✦ Intelligent Learning & Capacity Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Build Skills.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Grow Competencies.
            </span>{' '}
            Shape Your Future.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            SkillSync connects your goals, skills, competencies, learning opportunities, trainers, and progress into one intelligent capacity-building experience.
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-102 flex items-center gap-2"
            >
              <span>Explore SkillSync</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRegisterClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/30 transition-all hover:scale-102 flex items-center gap-2"
            >
              <span>Create Free Account</span>
            </button>
          </div>

          {/* Micro Link: Try AI Assistant */}
          <div className="pt-2">
            <button
              onClick={onOpenAi}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 group"
            >
              <span>Try AI Assistant</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Hero Visual — SkillSync Intelligence Loop */}
        <div className="relative max-w-5xl mx-auto pt-6">
          {/* Main Visual Frame */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-750 backdrop-blur-xl shadow-2xl relative">
            <div className="text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                The SkillSync Intelligence Loop
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-2">
                Continuous Competency Feedback Architecture
              </h3>
            </div>

            {/* Connected Nodes Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10">
              {loopNodes.map((node, i) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.label}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all text-center flex flex-col items-center justify-between group hover:shadow-lg hover:-translate-y-1 relative"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="font-extrabold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      {node.label}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">
                      {node.sub}
                    </div>

                    {/* Step indicator */}
                    <div className="mt-2 text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                      0{i + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connecting Subtle Pipeline Bar */}
            <div className="hidden lg:block w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 my-8 opacity-40 rounded-full" />

            {/* 4 Floating Illustrative Prototype Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  92%
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Skill Match</div>
                  <div className="text-[10px] text-slate-400">Data Science Role</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Skill Gaps</div>
                  <div className="text-[10px] text-slate-400">Remediation Ready</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Path Active</div>
                  <div className="text-[10px] text-slate-400">Cloud Architect Track</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  +18%
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Capability Growth</div>
                  <div className="text-[10px] text-slate-400">Cohort Average</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
