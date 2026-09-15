import React from 'react';
import { Calendar, Clock, Users, Video, ArrowRight } from 'lucide-react';
import { upcomingSessions, LiveSession } from '../../data/capacityConnectData';

interface UpcomingSessionsSectionProps {
  onJoinSession: (session: LiveSession) => void;
}

export const UpcomingSessionsSection: React.FC<UpcomingSessionsSectionProps> = ({
  onJoinSession,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Upcoming Sessions
          </h2>
          <p className="text-xs text-slate-500">
            Attend live interactive webinars, expert workshops, and peer feedback circles
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {upcomingSessions.map(session => (
          <div
            key={session.id}
            className={`cc-card p-5 flex flex-col justify-between relative overflow-hidden transition-all ${
              session.isLive ? 'border-red-200 bg-gradient-to-b from-white to-red-50/20 shadow-md' : ''
            }`}
          >
            {session.isLive && (
              <div className="absolute top-0 right-0 left-0 h-1 bg-red-500" />
            )}

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                {session.isLive ? (
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    <span className="cc-live-pulse" />
                    LIVE NOW
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {session.date}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-medium">{session.sessionType}</span>
              </div>

              {/* Title & Timing */}
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-2 mb-2">
                {session.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-4">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{session.time}</span>
              </div>
            </div>

            {/* Trainer Profile & Join CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={session.trainerAvatar}
                  alt={session.trainer}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">{session.trainer}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" />
                    <span>{session.participants} joined</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onJoinSession(session)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  session.isLive
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{session.isLive ? 'Join Live' : 'Register'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
