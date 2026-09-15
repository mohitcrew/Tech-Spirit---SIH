import React from 'react';
import { Target, ArrowRight, Sparkles, Award, Users, CheckCircle2 } from 'lucide-react';
import { publicCompetencies, PublicCompetency } from '../../data/skillsyncData';

interface CompetencyExplorerProps {
  onAnalyzeGap: (competency: PublicCompetency) => void;
}

export const CompetencyExplorer: React.FC<CompetencyExplorerProps> = ({ onAnalyzeGap }) => {
  return (
    <section id="competencies" className="py-20 bg-slate-950 text-white border-b border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Competency Architecture
          </span>
          <h2 className="text-3xl font-black text-white">
            Understand Capabilities Behind Professional Roles
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Competencies combine multiple skills into verified capabilities. Select a competency to inspect benchmarks or calculate your gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicCompetencies.map(comp => (
            <div
              key={comp.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Level: {comp.level}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {comp.growthPill}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {comp.description}
                </p>

                {/* Related Skills */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Underlying Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {comp.relatedSkills.map(sk => (
                      <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Roles */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Targeted Roles</div>
                  <div className="flex flex-wrap gap-1">
                    {comp.relatedRoles.map(role => (
                      <span key={role} className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-[10px] text-indigo-300 font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                <a
                  href="/courses"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all text-center"
                >
                  Explore Courses
                </a>
                <button
                  onClick={() => onAnalyzeGap(comp)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white text-xs font-bold transition-all text-center shadow-md shadow-blue-600/20 flex items-center justify-center gap-1"
                >
                  <span>Analyze My Gap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
