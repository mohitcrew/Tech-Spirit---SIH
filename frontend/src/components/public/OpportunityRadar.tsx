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
    <section id="radar" className="py-20 bg-slate-950 text-white border-b border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Training Opportunity Radar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Don't Wait for the Right Opportunity. Discover It.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time matching aligns upcoming training cohorts directly against calculated skill gaps.
            </p>
          </div>

          <span className="text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start md:self-end">
            * Illustrative Prototype Recommendations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.map(opp => (
            <div
              key={opp.title}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${opp.badgeColor}`}>
                    {opp.match}% MATCH
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{opp.cohortDate}</span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {opp.title}
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium mb-4 inline-block">
                  Level: {opp.level}
                </span>

                <div className="mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Targeted Gaps Addressed:</div>
                  <div className="space-y-1.5">
                    {opp.addresses.map(skill => (
                      <div key={skill} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => onExploreCourse(opp.title)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Program</span>
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
