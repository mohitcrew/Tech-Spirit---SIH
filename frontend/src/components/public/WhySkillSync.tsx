import React from 'react';
import {
  Award, Target, Users, Bot, BarChart3, Globe, Sparkles, CheckCircle2, ArrowRight, BookOpen
} from 'lucide-react';

interface WhySkillSyncProps {
  onRegisterTrainer: () => void;
  onExploreSkills: () => void;
}

export const WhySkillSync: React.FC<WhySkillSyncProps> = ({
  onRegisterTrainer,
  onExploreSkills,
}) => {
  const features = [
    {
      title: 'Competency Intelligence',
      desc: 'Understand capability instead of only tracking completion, evaluating observable, multi-dimensional execution.',
      icon: Award,
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Personalized Learning Paths',
      desc: 'Dynamic roadmaps built directly from diagnostic gap analysis rather than arbitrary static catalogs.',
      icon: Target,
      color: 'text-indigo-400 bg-indigo-500/10',
    },
    {
      title: 'Trainer Matching',
      desc: 'Connect with verified domain specialists and schedule structured peer review workshops and 1-on-1 mentorship.',
      icon: Users,
      color: 'text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-500/10',
    },
    {
      title: 'Integrated AI Assistant',
      desc: 'Interact naturally with the SkillSync ontology to uncover prerequisites, explore roles, and draft study plans.',
      icon: Bot,
      color: 'text-purple-400 bg-purple-500/10',
    },
    {
      title: 'Capacity Intelligence',
      desc: 'Empower administrators to visualize aggregate institutional bottlenecks and deploy targeted training interventions.',
      icon: BarChart3,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'Sector Configurable',
      desc: 'Decoupled domain architecture adapts effortlessly from IT & Digital to Meteorology, Ocean Science, and beyond.',
      icon: Globe,
      color: 'text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider bg-blue-50 dark:bg-cyan-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-cyan-500/20">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Why SkillSync
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Built from the ground up to solve the real-world gap between learning activities and organizational readiness.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dual Panels: Student-Friendly & Trainer-Friendly */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student-Friendly Block */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 border border-blue-200 dark:border-blue-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <span className="role-pill-student px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-blue-200 dark:border-blue-800">
                For Students & Early-Career Learners
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Turn Your Interests Into Proven Capabilities.
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Not sure what to learn next? Let's identify your next skill, calculate your roadmap, and celebrate verified milestones without getting overwhelmed.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                  <span>Discover exact skills demanded by high-growth roles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                  <span>Receive adaptive recommendations that skip what you already know</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
                  <span>Earn verified competency credentials for career portfolios</span>
                </div>
              </div>
            </div>

            <button
              onClick={onExploreSkills}
              className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <span>Find My Next Skill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trainer-Friendly Block */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50/80 via-white to-white dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 border border-purple-200 dark:border-purple-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <span className="role-pill-trainer px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-purple-200 dark:border-purple-800">
                For Educators, Mentors & Trainers
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Share Your Expertise. Build Stronger Learners.
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Host live cohort coaching, create rubrics, evaluate diagnostic submissions, and mentor squads hungry for practical industry experience.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                  <span>Reach committed learners across structured competency paths</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                  <span>Assess practical projects with transparent, objective rubrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                  <span>Build verified faculty standing recognized in national hackathons</span>
                </div>
              </div>
            </div>

            <button
              onClick={onRegisterTrainer}
              className="py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Join as Verified Trainer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
