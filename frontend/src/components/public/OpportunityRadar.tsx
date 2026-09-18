import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Compass } from 'lucide-react';

interface OpportunityRadarProps {
  onExploreCourse: (title: string) => void;
}

export const OpportunityRadar: React.FC<OpportunityRadarProps> = ({ onExploreCourse }) => {
  const opportunities = [
    {
      match: 92,
      title: 'Machine Learning Foundations & Predictive Analytics',
      level: 'Intermediate',
      addresses: ['Python', 'Machine Learning', 'Data Pipelines'],
      cohortDate: 'Starts Oct 24',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      match: 84,
      title: 'Cloud Engineering Bootcamp & Kubernetes CI/CD',
      level: 'Advanced',
      addresses: ['Cloud Computing', 'DevOps', 'Docker'],
      cohortDate: 'Starts Nov 02',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      match: 89,
      title: 'Zero-Trust Protocol Analysis & Cyber Defense',
      level: 'Advanced',
      addresses: ['Zero-Trust IAM', 'Threat Forensics'],
      cohortDate: 'Starts Oct 28',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <section id="radar" className="py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 text-xs font-bold text-blue-700 dark:text-cyan-400 mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Training Opportunity Radar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Don't Wait for the Right Opportunity. Discover It.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Real-time matching aligns upcoming training cohorts directly against calculated skill gaps.
            </p>
          </div>

          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl self-start md:self-end">
            * Illustrative Prototype Recommendations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.map(opp => (
            <div
              key={opp.title}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${opp.badgeColor}`}>
                    {opp.match}% MATCH
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{opp.cohortDate}</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors mb-2">
                  {opp.title}
                </h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium mb-4 inline-block border border-slate-200 dark:border-transparent">
                  Level: {opp.level}
                </span>

                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-2">Targeted Gaps Addressed:</div>
                  <div className="space-y-1.5">
                    {opp.addresses.map(skill => (
                      <div key={skill} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onExploreCourse(opp.title)}
                  className="opportunity-btn w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200/80 hover:border-transparent dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white dark:border-slate-700/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent shadow-xs cursor-pointer"
                >
                  <span className="font-bold">Explore Program</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
