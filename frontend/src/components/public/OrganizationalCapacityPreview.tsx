import React from 'react';
import { BarChart3, AlertCircle, Users, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';

export const OrganizationalCapacityPreview: React.FC = () => {
  const benchmarks = [
    { domain: 'Data Analytics & Modeling', percent: 72, color: 'bg-emerald-500' },
    { domain: 'Cloud & Infrastructure', percent: 67, color: 'bg-blue-500' },
    { domain: 'Artificial Intelligence & ML', percent: 54, color: 'bg-indigo-500' },
    { domain: 'Cybersecurity & Zero-Trust', percent: 48, color: 'bg-rose-500' },
  ];

  return (
    <section id="organizational" className="py-20 bg-slate-100/70 dark:bg-slate-900/60 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider bg-blue-50 dark:bg-cyan-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-cyan-500/20">
              Enterprise & Organizational Readiness
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
              From Individual Learning to Organizational Capacity
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Aggregate individual skill diagnostic reports to reveal institutional readiness and forecast training demand.
            </p>
          </div>

          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-200 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 px-3 py-1.5 rounded-xl self-start md:self-end shadow-sm">
            * Illustrative Prototype Data
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Interactive Progress Chart */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span>Institutional Competency Capacity Distribution</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">1,420 Active Staff</span>
              </div>

              <div className="space-y-5">
                {benchmarks.map(b => (
                  <div key={b.domain}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700 dark:text-slate-300">{b.domain}</span>
                      <span className="text-slate-900 dark:text-white font-mono">{b.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${b.color}`}
                        style={{ width: `${b.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Goal: 80% baseline across all four core domains by Q4</span>
              <span className="text-blue-700 dark:text-cyan-400 font-bold">Automated Audit Active</span>
            </div>
          </div>

          {/* Right: Detected Capacity Gap Alert Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-50/70 via-white to-white dark:from-slate-900 dark:to-slate-950 border border-amber-500/30 shadow-2xl relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>Capacity Gap Detected</span>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                Cybersecurity & Cloud Deficit
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Automated analytics identified a readiness bottleneck in Zero-Trust and Cloud Container Security.
              </p>

              <div className="space-y-3 text-xs mb-6">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Learners requiring development:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">46 Learners</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Relevant trainers available:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">3 Faculty</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Targeted learning programs:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">4 Curricula</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="font-bold text-amber-700 dark:text-amber-300 mb-1">Recommended Organizational Intervention:</div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Deploy 2 targeted cohorts for *Zero-Trust Protocol Analysis* starting October 28 to close gap by 22%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
