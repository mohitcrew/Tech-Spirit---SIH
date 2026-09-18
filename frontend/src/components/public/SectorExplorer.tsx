import React from 'react';
import { Globe, Cpu, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { sectorsData } from '../../data/skillsyncData';

export const SectorExplorer: React.FC = () => {
  return (
    <section id="sectors" className="pt-10 pb-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider bg-blue-50 dark:bg-cyan-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-cyan-500/20">
            Sector-Configurable Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            One Platform. Multiple Professional Domains.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            SkillSync's modular competency engine separates platform orchestration from domain ontologies, enabling seamless adaptation to diverse organizational sectors.
          </p>
        </div>

        {/* Sector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sectorsData.map(sec => (
            <div
              key={sec.id}
              className="p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400/80 dark:hover:border-blue-500/50 shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{sec.icon}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                      sec.status === 'Prototype Available'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {sec.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{sec.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                  {sec.description}
                </p>

                {/* Sample Roles */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-500 mb-2">Example Target Roles</div>
                  <div className="flex flex-wrap gap-1.5">
                    {sec.sampleRoles.map(r => (
                      <span
                        key={r}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold ${
                          sec.status === 'Prototype Available'
                            ? 'bg-blue-100/70 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                            : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{sec.rolesCount} Defined Roles</span>
                <span>{sec.skillsCount} Core Skills</span>
              </div>
            </div>
          ))}
        </div>

        {/* Engine Decoupling Architectural Explainer Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Configurable Domain Engine Rationale
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              SkillSync separates its core platform engine (assessments, tracking, role matching, AI guidance) from domain-specific configuration schemas. This allows organizations in Earth System Sciences, Meteorology, Maritime, and Public Services to load customized competency rubrics without altering platform code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
