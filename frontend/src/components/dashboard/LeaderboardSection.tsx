import React from 'react';
import { Trophy, Award, Flame, Sparkles, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { leaderboardUsers } from '../../data/capacityConnectData';
import { useAuth } from '../../context/AuthContext';
import { learnerService } from '../../services/learnerService';

export const LeaderboardSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentUserName = (user?.name && user.name !== 'Priya Sharma')
    ? user.name
    : (learnerService.getTraineeProfile()?.name && learnerService.getTraineeProfile()?.name !== 'Priya Sharma')
    ? learnerService.getTraineeProfile()?.name
    : 'A Mohit';

  const displayUsers = leaderboardUsers.map(u => {
    if (u.isCurrentUser || u.name.includes('Priya Sharma') || u.name.includes('(You)')) {
      return {
        ...u,
        name: `${currentUserName} (You)`,
        isCurrentUser: true,
      };
    }
    return u;
  });

  const getPrizeBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          tag: '1st Prize Reward',
          prize: '₹2,500 Grant + Gold Honors',
          className: 'leaderboard-prize-rank-1',
        };
      case 2:
        return {
          tag: '2nd Prize Reward',
          prize: '₹1,500 Grant + Silver Honors',
          className: 'leaderboard-prize-rank-2',
        };
      case 3:
        return {
          tag: '3rd Prize Reward',
          prize: '₹1,000 Grant + Bronze Honors',
          className: 'leaderboard-prize-rank-3',
        };
      default:
        return {
          tag: 'Cohort Reward',
          prize: '250 Bonus XP + Honor Roll',
          className: 'leaderboard-prize-default',
        };
    }
  };

  return (
    <div className="mb-8">
      {/* Header with Prize Pool Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Learn Together · Celebrate Progress</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Top Learners This Week
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-900/40 border border-amber-300/80 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 text-[11px] font-black shadow-2xs">
              <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>₹5,000 Weekly Prize Pool</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Celebrating consistent habits, knowledge sharing, and peer teamwork
          </p>
        </div>

        <button
          onClick={() => navigate('/trainee/leaderboard')}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition group cursor-pointer shadow-2xs"
        >
          <span>Full Leaderboard</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Grid of Top Learners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayUsers.map(userItem => {
          const medal =
            userItem.rank === 1 ? '🥇' : userItem.rank === 2 ? '🥈' : userItem.rank === 3 ? '🥉' : '⭐';
          const cleanName = userItem.name.replace(/\s*\(You\)$/i, '').trim();
          const initials = cleanName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || cleanName.slice(0, 2).toUpperCase();
          const prizeInfo = getPrizeBadge(userItem.rank);

          return (
            <div
              key={userItem.rank}
              className={`cc-card p-4.5 flex flex-col justify-between relative overflow-hidden transition-all rounded-3xl ${
                userItem.isCurrentUser
                  ? 'border-blue-300 dark:border-blue-700 bg-gradient-to-b from-blue-50/40 via-white to-white dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900 shadow-md ring-2 ring-blue-500/20'
                  : ''
              }`}
            >
              {userItem.isCurrentUser && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                  You
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="relative">
                    <div
                      className={`w-11 h-11 rounded-2xl ${userItem.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-sm`}
                    >
                      {initials}
                    </div>
                    <span className="absolute -bottom-1.5 -right-1.5 text-base drop-shadow-xs">{medal}</span>
                  </div>

                  <div className="min-w-0 flex-1 pr-7">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight truncate">
                      {userItem.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 font-semibold">Rank #{userItem.rank}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mb-2.5">
                  {userItem.highlightText}
                </p>

                {/* Prize Reward Banner */}
                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-bold mb-3 shadow-2xs ${prizeInfo.className}`}>
                  <Gift className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="prize-tag text-[9px] font-black uppercase tracking-wider block opacity-90 leading-none">
                      {prizeInfo.tag}
                    </span>
                    <span className="prize-name text-[11px] font-black truncate block mt-0.5 leading-tight">
                      {userItem.prize || prizeInfo.prize}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats badges: High-visibility 3-column micro-grid */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {/* XP */}
                  <div className="px-1 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-900/40 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 text-[11px] font-black text-blue-700 dark:text-blue-300">
                      <Trophy className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span>{userItem.xp}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-300 uppercase tracking-tight">XP</span>
                  </div>

                  {/* Badges */}
                  <div className="px-1 py-1.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100/80 dark:border-purple-900/40 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 text-[11px] font-black text-purple-700 dark:text-purple-300">
                      <Award className="w-3 h-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span>{userItem.badges}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-300 uppercase tracking-tight">Badges</span>
                  </div>

                  {/* Streak */}
                  <div className="px-1 py-1.5 rounded-xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-100/80 dark:border-orange-900/40 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 text-[11px] font-black text-orange-700 dark:text-orange-400">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500 flex-shrink-0" />
                      <span>{userItem.streakDays}d</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-300 uppercase tracking-tight">Streak</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
