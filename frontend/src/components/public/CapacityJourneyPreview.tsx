import React from 'react';
import { Target, Award, CheckCircle2, TrendingUp, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

interface CapacityJourneyPreviewProps {
  onBuildJourney: () => void;
}

export const CapacityJourneyPreview: React.FC<CapacityJourneyPreviewProps> = ({ onBuildJourney }) => {
  const steps = [
    { title: 'Target Role', desc: 'Data Scientist (Fellow)', icon: UserCheck, color: 'text-blue-400 bg-blue-500/10' },
    { title: 'Required Competencies', desc: 'Machine Learning, Predictive Analytics', icon: Award, color: 'text-indigo-400 bg-indigo-500/10' },
    { title: 'Current Capability', desc: 'Diagnostic Baseline: 64%', icon: CheckCircle2, color: 'text-cyan-400 bg-cyan-500/10' },
    { title: 'Calculated Skill Gaps', desc: 'Model Serialization, Vector DBs', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10' },
    { title: 'Recommended Learning', desc: 'Full Stack ML & Generative AI', icon: Target, color: 'text-purple-400 bg-purple-500/10' },
    { title: 'Practical Assessment', desc: 'Peer-reviewed project milestone', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10' },
    { title: 'Competency Growth', desc: '+18% Verified capability increase', icon: TrendingUp, color: 'text-emerald-300 bg-emerald-500/20' },
  ];

  return (
    <section className="py-20 bg-slate-900/40 text-white border-b border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Learner Experience Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Your Learning Journey Should Show More Than Completion
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Track tangible capability gains and step-by-step milestone progression toward your target role.
          </p>
        </div>

        {/* 7-Step Progression Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-10">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between group hover:border-cyan-400/40 transition-all text-center md:text-left"
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3 mx-auto md:mx-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">Step 0{idx + 1}</div>
                  <h3 className="font-extrabold text-xs text-white mt-1 group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h3>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <button
            onClick={onBuildJourney}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <span>Build My Capacity Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
