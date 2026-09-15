import React from 'react';
import { X, CheckCircle, BookOpen, Target, Sparkles, ArrowRight } from 'lucide-react';
import { SkillCompetency } from '../../data/capacityConnectData';

interface SkillDetailDrawerProps {
  skill: SkillCompetency | null;
  onClose: () => void;
}

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({ skill, onClose }) => {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div
            className="p-6 text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${skill.categoryColor} 0%, #0F172A 100%)`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/20 backdrop-blur-md">
                Competency Breakdown
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-2xl font-black mb-1">{skill.name}</h3>
            <p className="text-xs text-white/80 leading-relaxed">{skill.description}</p>

            {/* Score pill */}
            <div className="mt-4 flex items-center gap-3">
              <div className="text-3xl font-black">{skill.score}%</div>
              <div className="text-xs bg-white/20 px-2.5 py-1 rounded-lg font-semibold">
                Status: {skill.level}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/20 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${skill.score}%` }}
              />
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Next Milestone */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Next Milestone</h4>
                <p className="text-sm font-semibold text-amber-800 mt-0.5">{skill.nextMilestone}</p>
                <p className="text-xs text-amber-700 mt-1">Complete recommended courses to unlock the next certificate.</p>
              </div>
            </div>

            {/* Completed Courses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Completed Courses ({skill.completedCourses.length})</span>
                </h4>
              </div>
              <div className="space-y-2">
                {skill.completedCourses.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-700"
                  >
                    <span className="font-semibold text-slate-800">{c}</span>
                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      100%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Courses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Recommended for Growth</span>
                </h4>
              </div>
              <div className="space-y-2.5">
                {skill.recommendedCourses.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{rec}</div>
                        <div className="text-[11px] text-slate-500">Curated by Capacity Connect</div>
                      </div>
                    </div>
                    <button className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1">
                      <span>Enroll</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-700 hover:bg-slate-100"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
