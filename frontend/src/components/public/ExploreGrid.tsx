import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Target, Users, Globe, BookMarked, ArrowRight } from 'lucide-react';

export const ExploreGrid: React.FC = () => {
  const cards = [
    {
      title: 'Courses',
      desc: 'Discover structured, outcome-driven learning programs curated by domain leaders.',
      icon: BookOpen,
      path: '/courses',
      badge: 'Interactive Tracks',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Skills',
      desc: 'Explore granular programming, cloud, data, and leadership competencies.',
      icon: Layers,
      path: '/skills',
      badge: '40+ Technologies',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      title: 'Competencies',
      desc: 'Understand the multi-dimensional capability frameworks behind professional roles.',
      icon: Target,
      path: '/competencies',
      badge: 'Diagnostic Rubrics',
      color: 'from-purple-600 to-pink-600',
    },
    {
      title: 'Trainers',
      desc: 'Find verified domain specialists and schedule cohort assessments or mentorship.',
      icon: Users,
      path: '/trainers',
      badge: 'Verified Faculty',
      color: 'from-emerald-600 to-teal-600',
    },
    {
      title: 'Sectors',
      desc: 'Explore configurable professional domains from IT to Meteorology and Ocean Science.',
      icon: Globe,
      path: '/sectors',
      badge: 'Decoupled Engine',
      color: 'from-cyan-600 to-blue-600',
    },
    {
      title: 'Knowledge Hub',
      desc: 'Access recorded masterclasses, research whitepapers, architecture briefs, and guides.',
      icon: BookMarked,
      path: '/knowledge',
      badge: 'Open Repository',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Discovery Matrix
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Explore the SkillSync Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Publicly browse all components of our capacity intelligence platform without barriers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.title}
                to={c.path}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-transparent">
                      {c.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors mb-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-300">
                  <span>Explore {c.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
