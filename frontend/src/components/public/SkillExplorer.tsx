import React, { useState } from 'react';
import { Layers, ArrowRight, Sparkles, BookOpen, UserCheck, Award } from 'lucide-react';
import { publicSkills, PublicSkill } from '../../data/skillsyncData';

export const SkillExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSkill, setActiveSkill] = useState<PublicSkill>(publicSkills[2]); // Default Python

  const categories = ['All', 'Programming', 'Data', 'Cloud & DevOps', 'Cybersecurity', 'Leadership'];

  const filteredSkills = selectedCategory === 'All'
    ? publicSkills
    : publicSkills.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20 bg-slate-900/40 text-white border-b border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Granular Skill Dictionary
          </span>
          <h2 className="text-3xl font-black text-white">
            Explore Skills Required Across Roles
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Click any skill chip to reveal related professional roles, underlying competencies, and recommended learning pathways.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Skill Chips Grid */}
          <div className="lg:col-span-7 flex flex-wrap gap-2.5 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
            {filteredSkills.map(skill => (
              <button
                key={skill.id}
                onClick={() => setActiveSkill(skill)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                  activeSkill?.id === skill.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 scale-105'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <span>{skill.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {skill.learnersCount}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Active Skill Insight Card */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-750 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
                {activeSkill.category} Domain
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {activeSkill.learnersCount} active learners
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{activeSkill.name}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              Essential skill benchmarked across modern capacity frameworks and verified by trainer evaluations.
            </p>

            <div className="space-y-4 text-xs">
              {/* Related Roles */}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Target Roles Requiring {activeSkill.name}:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeSkill.relatedRoles.map(role => (
                    <span key={role} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold text-[11px]">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Competencies */}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Associated Competencies:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeSkill.relatedCompetencies.map(comp => (
                    <span key={comp} className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-semibold text-[11px]">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Course */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Curated Learning Program</div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{activeSkill.recommendedCourse}</div>
                  </div>
                </div>
                <a
                  href="/courses"
                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex-shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
