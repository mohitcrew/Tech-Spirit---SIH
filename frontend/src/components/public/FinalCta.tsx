import React from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface FinalCtaProps {
  onExploreCourses: () => void;
  onRegister: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onExploreCourses, onRegister }) => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-100 to-slate-200/80 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-purple-600/10 dark:from-blue-600/20 dark:via-cyan-500/20 dark:to-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-xs font-bold text-cyan-700 dark:text-cyan-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Start Your Competency Journey Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Ready to Build Your Next Capability?
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Explore SkillSync today. Discover what you can learn, understand where you can improve, and build a path toward your next professional goal.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreCourses}
            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-white text-slate-950 hover:bg-slate-50 dark:hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-102 flex items-center gap-2 border border-slate-200 dark:border-transparent"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Explore Courses</span>
          </button>

          <button
            onClick={onRegister}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/30 transition-all hover:scale-102 flex items-center gap-2"
          >
            <span className="text-white">Create Free Account</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};
