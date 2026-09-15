import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon, Clock, Video, AlertCircle, CheckCircle2,
  ChevronLeft, ChevronRight, Plus, MapPin, Users
} from 'lucide-react';
import { learnerService, CalendarEventItem } from '../../services/learnerService';

export default function CalendarView() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-18');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: () => learnerService.getCalendarEvents(),
  });

  // Calendar dates representation for September 2026
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    return { dayNum, dateStr, dayEvents };
  });

  const selectedEvents = events.filter(e => e.date === selectedDate);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-teal-700 to-emerald-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Activity Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Training Calendar & Deadlines
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Stay on top of live workshops, peer review deadlines, and timed competency diagnostic windows.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
          {(['month', 'week', 'day'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                viewMode === mode
                  ? 'bg-white text-blue-800 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Monthly Grid */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-lg text-slate-900 dark:text-white">
              September 2026
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 py-2 border-b border-slate-100 dark:border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month day tiles */}
          <div className="grid grid-cols-7 gap-2">
            {/* September 2026 starts on Tuesday (offset 2 empty cells) */}
            <div className="h-16 sm:h-20 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20" />
            <div className="h-16 sm:h-20 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20" />

            {daysInMonth.map(({ dayNum, dateStr, dayEvents }) => {
              const isSelected = selectedDate === dateStr;
              const hasEvents = dayEvents.length > 0;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-16 sm:h-20 p-2 rounded-2xl flex flex-col justify-between text-left transition-all border ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-bold ${
                    isSelected ? 'text-blue-600 dark:text-cyan-400 font-black' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {dayNum}
                  </span>

                  {hasEvents && (
                    <div className="w-full space-y-1">
                      {dayEvents.map(evt => (
                        <div
                          key={evt.id}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                            evt.type === 'live_session'
                              ? 'bg-blue-500 text-white'
                              : evt.type === 'assessment_deadline'
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Events Agenda */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Agenda: {selectedDate}
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {selectedEvents.length} Items
            </span>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No scheduled sessions or deadlines on this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      evt.type === 'live_session'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : evt.type === 'assessment_deadline'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {evt.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{evt.time}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {evt.title}
                  </h4>

                  {evt.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {evt.description}
                    </p>
                  )}

                  {evt.meetingUrl && (
                    <a
                      href={evt.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Video Room</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Global Reminders */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Upcoming Milestones:</div>
            <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>AI Ethics Prompt Deadline</span>
                <span className="font-mono text-[10px] text-amber-500">Sep 20</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Container Security Diagnostic</span>
                <span className="font-mono text-[10px] text-rose-500">Sep 24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
