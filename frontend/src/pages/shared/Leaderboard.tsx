import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy, Flame, Award, Star, TrendingUp, Sparkles,
  ChevronRight, Crown, Medal
} from 'lucide-react';
import { learnerService } from '../../services/learnerService';
import { badgesCatalog } from '../../data/capacityConnectData';
import { useAuth } from '../../context/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['leaderboard', period, user?.name],
    queryFn: () => learnerService.getLeaderboard(period),
  });

  const currentUserName = (user?.name && user.name !== 'Priya Sharma')
    ? user.name
    : (learnerService.getTraineeProfile()?.name && learnerService.getTraineeProfile()?.name !== 'Priya Sharma')
    ? learnerService.getTraineeProfile()?.name
    : 'A Mohit';

  const processedUsers = users.map(u => {
    if (u.isCurrentUser || u.name.includes('Priya Sharma') || u.name.includes('(You)')) {
      return {
        ...u,
        name: `${currentUserName} (You)`,
        isCurrentUser: true,
      };
    }
    return u;
  });

  const currentUser = processedUsers.find(u => u.isCurrentUser) || processedUsers[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="page-header-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2 text-white" style={{ color: '#ffffff' }}>
            <Trophy className="w-3.5 h-3.5 text-white" />
            <span className="text-white" style={{ color: '#ffffff' }}>Capacity Leaderboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ color: '#ffffff' }}>
            Learner Rankings & Achievements
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl" style={{ color: '#fef3c7' }}>
            Celebrate active competency development, learning milestones, and quiz accomplishments across your cohort.
          </p>
        </div>

        {/* Current User Standings Pill */}
        {currentUser && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center flex-shrink-0">
            <div className="text-[10px] uppercase font-bold text-amber-100">Your Current Rank</div>
            <div className="text-3xl font-black mt-0.5">#{currentUser.rank}</div>
            <div className="text-[10px] text-amber-200 font-bold mt-1">{currentUser.xp} XP Earned</div>
          </div>
        )}
      </div>

      {/* Period Tabs */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          {(['weekly', 'monthly', 'all_time'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                period === p
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {p === 'weekly' ? 'Weekly Standings' : p === 'monthly' ? 'Monthly Sprint' : 'All-Time Champions'}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:block">
          Updated dynamically after every unit
        </span>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {processedUsers.slice(0, 3).map((u, idx) => (
          <div
            key={u.name}
            className={`p-6 rounded-3xl border flex flex-col justify-between relative overflow-hidden transition-all ${
              idx === 0
                ? 'bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900 border-amber-400/50 shadow-xl'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                  idx === 0 ? 'bg-amber-400 text-slate-950 shadow-md' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                }`}>
                  #{u.rank}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-orange-500">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>{u.streakDays}d Streak</span>
                </span>
              </div>

              <h3 className="font-black text-base text-slate-900 dark:text-white mb-0.5">
                {u.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {u.highlightText}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-black text-slate-900 dark:text-white">{u.xp} XP</span>
              <span className="text-slate-400 font-semibold">{u.badges} Badges</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          Cohort Ranking Table
        </h2>

        <div className="space-y-2">
          {processedUsers.map(u => (
            <div
              key={u.name}
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-4 border transition-all ${
                u.isCurrentUser
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700/60 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                  u.rank === 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  #{u.rank}
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{u.name}</span>
                    {u.isCurrentUser && (
                      <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">You</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">{u.highlightText}</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{u.xp} XP</span>
                <span className="text-slate-400 font-semibold">{u.badges} Badges</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Earned Capacity Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badgesCatalog.map(b => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{b.icon}</span>
                <span className="text-[10px] font-mono text-slate-400">{b.unlockedAt}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">{b.title}</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
