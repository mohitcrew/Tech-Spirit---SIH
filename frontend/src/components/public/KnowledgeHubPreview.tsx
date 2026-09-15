import React from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Download, ArrowRight, FileText, Video, Sparkles } from 'lucide-react';
import { knowledgeResources } from '../../data/skillsyncData';

export const KnowledgeHubPreview: React.FC = () => {
  return (
    <section id="knowledge" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Institutional Library
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
              Learning Should Become Knowledge
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Publicly access masterclasses, architecture briefs, study guides, and peer-reviewed research.
            </p>
          </div>

          <Link
            to="/knowledge"
            className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-all flex items-center gap-1.5 self-start md:self-end shadow-sm"
          >
            <span>Explore Knowledge Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {knowledgeResources.map(res => (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-2xl">{res.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-transparent">
                    {res.type}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  By {res.author} · {res.readTime}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[10px]">{res.downloadsCount} accesses</span>
                <button
                  onClick={() => alert(`Accessing "${res.title}" from the Knowledge Hub`)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-white text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-transparent"
                  title="Download / View Resource"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
