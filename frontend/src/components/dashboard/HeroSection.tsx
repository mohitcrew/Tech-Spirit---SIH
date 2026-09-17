import React from 'react';
import { ArrowRight, Sparkles, Flame, Trophy, PlayCircle } from 'lucide-react';
import { currentUserProfile } from '../../data/capacityConnectData';

interface HeroSectionProps {
  onContinueLearning: () => void;
  onExploreCourses: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onContinueLearning,
  onExploreCourses,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl cc-hero-gradient p-6 sm:p-8 lg:p-10 shadow-sm border border-blue-100/80 dark:border-slate-800/80 mb-6">
      {/* Subtle Background Decorative Circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none db-ambient-orb-1" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-400/10 blur-2xl pointer-events-none db-ambient-orb-2" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Text Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-blue-200/60 dark:border-blue-700/60 shadow-xs text-xs font-bold text-blue-700 dark:text-blue-300 backdrop-blur-sm db-hero-badge-anim">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Digital Capacity Building Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            <span className="db-word-build">Build</span>{' '}
            <span className="db-word-skills">Skills.</span>{' '}
            <span className="db-word-gradient bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              Create Impact Together.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed db-hero-desc-anim">
            A smarter way to learn, grow your competencies, and share knowledge across students, educators, and organizations.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={onContinueLearning}
              className="cc-btn-primary group db-hero-btn1-anim"
            >
              <PlayCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreCourses}
              className="cc-btn-secondary db-hero-btn2-anim"
            >
              Explore Courses
            </button>
          </div>

          {/* Micro Trust & Stat row */}
          <div className="pt-3 flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Personalized Path</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Verified Badges</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Collaborative Learning</span>
            </div>
          </div>
        </div>

        {/* Right Graphic Column: Friendly Interactive Learner Visual */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Main Visual Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 bg-gradient-to-br from-blue-500 to-indigo-700 aspect-4/3 flex items-center justify-center p-4 db-hero-visual-anim">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
                alt="Students collaborating"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
              />
              <div className="relative z-10 text-center text-white p-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 text-2xl shadow-lg">
                  🎓
                </div>
                <h3 className="font-bold text-base text-white">Next: AI for Education</h3>
                <p className="text-xs text-blue-100">Module 10: Formative Assessment AI</p>
                <div className="mt-3 w-40 mx-auto bg-white/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: '90%' }} />
                </div>
              </div>
            </div>

            {/* Floating Achievement Card: Streak */}
            <div className="absolute -top-4 -left-4 bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-amber-200/80 dark:border-amber-500/40 flex items-center gap-2.5 cc-float db-float-streak-anim">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-500/40 flex items-center justify-center text-amber-500 dark:text-amber-400 text-lg cc-streak-flame">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUserProfile.streakDays} Day Streak</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Keep it glowing!</div>
              </div>
            </div>

            {/* Floating Achievement Card: XP Reward */}
            <div className="absolute -bottom-4 -right-2 bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-purple-200/80 dark:border-purple-500/40 flex items-center gap-2.5 cc-float-delayed db-float-xp-anim">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">850 Total XP</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-300 font-bold">Level 5 Explorer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
