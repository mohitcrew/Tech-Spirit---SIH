import React from 'react';
import { BookOpen, Award, Users, Sparkles, Share2, BarChart3 } from 'lucide-react';

export const SocialProofStrip: React.FC = () => {
  const items = [
    { label: 'Competency Intelligence', icon: Award },
    { label: 'Skill Gap Analysis', icon: Sparkles },
    { label: 'Trainer Matching', icon: Users },
    { label: 'Adaptive Learning Paths', icon: BookOpen },
    { label: 'Knowledge Sharing', icon: Share2 },
    { label: 'Capacity Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center md:text-left">
          Designed for learners, trainers, and organizations
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.label} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>{it.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
