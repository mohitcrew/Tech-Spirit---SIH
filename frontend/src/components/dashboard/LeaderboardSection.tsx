import React from 'react';
import { Trophy, Award, Flame, Users, Sparkles } from 'lucide-react';
import { leaderboardUsers } from '../../data/capacityConnectData';

export const LeaderboardSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Learn Together · Celebrate Progress</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Top Learners This Week
          </h2>
          <p className="text-xs text-slate-500">
            Celebrating consistent habits, knowledge sharing, and peer teamwork
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaderboardUsers.map(user => {
          const medal =
            user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : '⭐';

          return (
            <div
              key={user.rank}
              className={`cc-card p-4.5 flex flex-col justify-between relative overflow-hidden transition-all ${
                user.isCurrentUser
                  ? 'border-blue-300 bg-gradient-to-b from-blue-50/40 via-white to-white shadow-md'
                  : ''
              }`}
            >
              {user.isCurrentUser && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                  You
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div
                      className={`w-11 h-11 rounded-2xl ${user.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-sm`}
                    >
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-sm">{medal}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {user.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">Rank #{user.rank}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium line-clamp-1 mb-3">
                  {user.highlightText}
                </p>
              </div>

              {/* Stats badges */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1 text-blue-600">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>{user.xp} XP</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <Award className="w-3.5 h-3.5" />
                  <span>{user.badges} Badges</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-600">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{user.streakDays}d</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
