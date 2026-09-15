import React from 'react';
import { Globe, Cpu, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { sectorsData } from '../../data/skillsyncData';

export const SectorExplorer: React.FC = () => {
  return (
    <section id="sectors" className="py-20 bg-slate-950 text-white border-b border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Sector-Configurable Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            One Platform. Multiple Professional Domains.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            SkillSync's modular competency engine separates platform orchestration from domain ontologies, enabling seamless adaptation to diverse organizational sectors.
          </p>
        </div>

        {/* Sector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sectorsData.map(sec => (
            <div
              key={sec.id}
              className={`p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                sec.status === 'Prototype Available'
                  ? 'bg-gradient-to-b from-blue-950/60 to-slate-900 border-2 border-blue-500/40 shadow-2xl'
                  : 'bg-slate-900 border border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{sec.icon}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                      sec.status === 'Prototype Available'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {sec.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white mb-2">{sec.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  {sec.description}
                </p>

                {/* Sample Roles */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Example Target Roles</div>
                  <div className="flex flex-wrap gap-1.5">
                    {sec.sampleRoles.map(r => (
                      <span
                        key={r}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold ${
                          sec.status === 'Prototype Available'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{sec.rolesCount} Defined Roles</span>
                <span>{sec.skillsCount} Core Skills</span>
              </div>
            </div>
          ))}
        </div>

        {/* Engine Decoupling Architectural Explainer Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-white">
              Configurable Domain Engine Rationale
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              SkillSync separates its core platform engine (assessments, tracking, role matching, AI guidance) from domain-specific configuration schemas. This allows organizations in Earth System Sciences, Meteorology, Maritime, and Public Services to load customized competency rubrics without altering platform code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
