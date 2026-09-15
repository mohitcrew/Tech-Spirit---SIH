import React from 'react';
import { Flame, Trophy, Star, Target, Sparkles, ChevronRight } from 'lucide-react';
import { currentUserProfile, badgesCatalog } from '../../data/capacityConnectData';

interface AchievementsSectionProps {
  onViewAllBadges: () => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  onViewAllBadges,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Your Achievements
          </h2>
          <p className="text-xs text-slate-500">
            Streaks, earned badges, and dynamic XP milestones
          </p>
        </div>
        <button
          onClick={onViewAllBadges}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>View All Badges</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Gamified Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Streak */}
        <div className="cc-card p-4 flex items-center gap-3.5 bg-gradient-to-br from-white to-amber-50/40 db-metric-card cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl cc-streak-flame flex-shrink-0">
            🔥
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Learning Streak
            </div>
            <div className="text-2xl font-black text-slate-900">
              {currentUserProfile.streakDays} Days
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Daily habit active</div>
          </div>
        </div>

        {/* Badges */}
        <div className="cc-card p-4 flex items-center gap-3.5 bg-gradient-to-br from-white to-purple-50/40 db-metric-card cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
            🏆
          </div>
          <div>
            <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              Badges Earned
            </div>
            <div className="text-2xl font-black text-slate-900">
              {currentUserProfile.badgesCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Across 4 domains</div>
          </div>
        </div>

        {/* XP */}
        <div className="cc-card p-4 flex items-center gap-3.5 bg-gradient-to-br from-white to-blue-50/40 db-metric-card cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
            ⭐
          </div>
          <div>
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Total XP
            </div>
            <div className="text-2xl font-black text-slate-900">
              {currentUserProfile.currentXp}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Level 5 Explorer</div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="cc-card p-4 flex items-center gap-3.5 bg-gradient-to-br from-white to-emerald-50/40 db-metric-card cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">
            🎯
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Weekly Goal
            </div>
            <div className="text-2xl font-black text-slate-900">
              {currentUserProfile.weeklyGoalPercent}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium">2 lessons to goal</div>
          </div>
        </div>
      </div>

      {/* Level XP Progress Bar & Badges Carousel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Level XP Card */}
        <div className="lg:col-span-6 cc-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                L5
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Curious Explorer</h4>
                <p className="text-[11px] text-slate-500">Next rank: Level 6 Master Innovator</p>
              </div>
            </div>
            <span className="text-xs font-black text-blue-600">
              {currentUserProfile.currentXp} / {currentUserProfile.nextLevelXp} XP
            </span>
          </div>

          <div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full transition-all duration-700"
                style={{
                  width: `${(currentUserProfile.currentXp / currentUserProfile.nextLevelXp) * 100}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{currentUserProfile.nextLevelXp - currentUserProfile.currentXp} XP needed for Level 6</span>
              <span className="font-semibold text-purple-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Unlocks Special Cert
              </span>
            </div>
          </div>
        </div>

        {/* Featured Badges Row */}
        <div className="lg:col-span-6 cc-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900">Recently Earned Badges</h4>
            <span className="text-[11px] text-slate-400 font-medium">Verified Credentials</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {badgesCatalog.map(b => (
              <div
                key={b.id}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200/70 transition-all flex flex-col items-center text-center group cursor-pointer"
                title={b.description}
              >
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${b.gradient} flex items-center justify-center text-lg text-white mb-2 shadow-xs group-hover:scale-110 transition-transform`}
                >
                  {b.icon}
                </div>
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{b.title}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{b.unlockedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
