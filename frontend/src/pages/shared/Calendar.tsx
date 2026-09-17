import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon, Clock, Video, AlertCircle, CheckCircle2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, MapPin, Users,
  Lock, Sparkles, X, Info
} from 'lucide-react';
import { learnerService, CalendarEventItem } from '../../services/learnerService';

export default function CalendarView() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Reference for "today"
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Current calendar view date (year & month)
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: () => learnerService.getCalendarEvents(),
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0 to 11
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handlePrevYear = () => {
    setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(currentYear + 1, currentMonth, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(todayStr);
    setToastMessage(null);
  };

  // Month calculation
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  // Previous month trailing padding
  const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
    const dayNum = prevMonthTotalDays - firstDayOfWeek + 1 + i;
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return { dayNum, dateStr, isCurrentMonth: false };
  });

  // Current month days
  const currentMonthDays = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;
    return { dayNum, dateStr, dayEvents, isCurrentMonth: true, isPast, isToday };
  });

  // Next month leading padding to complete grid
  const totalFilled = prevMonthDays.length + currentMonthDays.length;
  const nextMonthSlots = (7 - (totalFilled % 7)) % 7;
  const nextMonthDays = Array.from({ length: nextMonthSlots }, (_, i) => {
    const dayNum = i + 1;
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return { dayNum, dateStr, isCurrentMonth: false };
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('default', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDateClick = (dateStr: string, isPast: boolean) => {
    setSelectedDate(dateStr);
    if (isPast) {
      setToastMessage(`Notice: ${formatDate(dateStr)} is already completed. Past activities and sessions cannot be opened.`);
    } else {
      setToastMessage(null);
    }
  };

  const selectedEvents = events.filter(e => e.date === selectedDate);
  const isSelectedDatePast = selectedDate < todayStr;
  const isSelectedDateToday = selectedDate === todayStr;

  // For Week View: get 7 days of the week containing selectedDate
  const getWeekDays = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const sel = new Date(y, m - 1, d);
    const dayOfWeek = sel.getDay();
    const startOfWeek = new Date(sel);
    startOfWeek.setDate(sel.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const dt = new Date(startOfWeek);
      dt.setDate(startOfWeek.getDate() + i);
      const str = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
      const dayEvts = events.filter(e => e.date === str);
      const isPast = str < todayStr;
      const isToday = str === todayStr;
      return {
        dateStr: str,
        dayNum: dt.getDate(),
        dayName: dt.toLocaleDateString('default', { weekday: 'short' }),
        dayEvents: dayEvts,
        isPast,
        isToday,
      };
    });
  };

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

      {/* Dynamic Notification Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-center justify-between gap-3 text-xs font-semibold animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-amber-500/20 rounded-lg text-amber-700 dark:text-amber-300 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Main Calendar Body */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          
          {/* Header Controls: Month & Year Navigator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                {monthName} {currentYear}
              </h2>
              {currentYear === today.getFullYear() && currentMonth === today.getMonth() && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Current Month
                </span>
              )}
            </div>

            {/* Navigation Buttons: Year & Month Arrows */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {/* Year Backward */}
              <button
                onClick={handlePrevYear}
                title="Previous Year (Backward)"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition flex items-center justify-center group"
              >
                <ChevronsLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Month Backward */}
              <button
                onClick={handlePrevMonth}
                title="Previous Month (Backward)"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition flex items-center justify-center group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Today jump */}
              <button
                onClick={handleToday}
                title="Jump to Today"
                className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs rounded-xl transition"
              >
                Today
              </button>

              {/* Month Forward */}
              <button
                onClick={handleNextMonth}
                title="Next Month (Forward)"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition flex items-center justify-center group"
              >
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Year Forward */}
              <button
                onClick={handleNextYear}
                title="Next Year (Forward)"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition flex items-center justify-center group"
              >
                <ChevronsRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Month View Grid */}
          {viewMode === 'month' && (
            <>
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
                {/* Previous month padding */}
                {prevMonthDays.map(({ dayNum, dateStr }) => (
                  <div
                    key={`prev-${dateStr}`}
                    className="h-16 sm:h-20 p-2 rounded-2xl bg-slate-50/40 dark:bg-slate-950/20 border border-transparent text-slate-300 dark:text-slate-700 flex flex-col justify-start select-none"
                  >
                    <span className="text-xs font-medium">{dayNum}</span>
                  </div>
                ))}

                {/* Current month days */}
                {currentMonthDays.map(({ dayNum, dateStr, dayEvents, isPast, isToday }) => {
                  const isSelected = selectedDate === dateStr;
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDateClick(dateStr, isPast)}
                      className={`h-16 sm:h-20 p-2 rounded-2xl flex flex-col justify-between text-left transition-all border relative overflow-hidden ${
                        isSelected
                          ? isPast
                            ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/30'
                            : 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                          : isPast
                          ? 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60 opacity-80 hover:opacity-100 hover:border-amber-300/50'
                          : isToday
                          ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 font-semibold'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold ${
                          isSelected
                            ? isPast
                              ? 'text-amber-600 dark:text-amber-400 font-black'
                              : 'text-blue-600 dark:text-cyan-400 font-black'
                            : isToday
                            ? 'text-blue-600 dark:text-blue-400 font-black'
                            : isPast
                            ? 'text-slate-400 dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {dayNum}
                        </span>

                        {isToday && (
                          <span className="text-[9px] font-extrabold px-1 rounded bg-blue-600 text-white">
                            Today
                          </span>
                        )}

                        {isPast && !isToday && (
                          <span className="text-[8px] font-bold px-1 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            Completed
                          </span>
                        )}
                      </div>

                      {hasEvents && (
                        <div className="w-full space-y-1 mt-1">
                          {dayEvents.slice(0, 2).map(evt => {
                            const isEventDone = isPast || evt.status === 'completed';
                            return (
                              <div
                                key={evt.id}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                                  isEventDone
                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 line-through decoration-slate-400/60'
                                    : evt.type === 'live_session'
                                    ? 'bg-blue-500 text-white'
                                    : evt.type === 'assessment_deadline'
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-amber-500 text-white'
                                }`}
                              >
                                {evt.title}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Next month padding */}
                {nextMonthDays.map(({ dayNum, dateStr }) => (
                  <div
                    key={`next-${dateStr}`}
                    className="h-16 sm:h-20 p-2 rounded-2xl bg-slate-50/40 dark:bg-slate-950/20 border border-transparent text-slate-300 dark:text-slate-700 flex flex-col justify-start select-none"
                  >
                    <span className="text-xs font-medium">{dayNum}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Week View */}
          {viewMode === 'week' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                {getWeekDays().map(w => {
                  const isSelected = selectedDate === w.dateStr;
                  return (
                    <button
                      key={w.dateStr}
                      onClick={() => handleDateClick(w.dateStr, w.isPast)}
                      className={`p-3 rounded-2xl border flex flex-col justify-between text-left transition-all min-h-[140px] ${
                        isSelected
                          ? w.isPast
                            ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/30'
                            : 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20'
                          : w.isPast
                          ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-75'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">{w.dayName}</span>
                          {w.isPast && (
                            <span className="text-[8px] font-bold px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
                              Done
                            </span>
                          )}
                        </div>
                        <div className={`text-lg font-black mt-1 ${
                          w.isToday ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {w.dayNum}
                        </div>
                      </div>

                      <div className="w-full space-y-1 mt-2">
                        {w.dayEvents.map(evt => (
                          <div
                            key={evt.id}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                              w.isPast
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 line-through'
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            {evt.title}
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {formatDate(selectedDate)}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isSelectedDatePast ? 'Completed Day' : isSelectedDateToday ? "Today's Schedule" : 'Upcoming Schedule'}
                  </span>
                </div>
                {isSelectedDatePast ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Already Completed</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    Active
                  </span>
                )}
              </div>

              {/* Hourly breakdown */}
              <div className="space-y-3">
                {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map(timeSlot => {
                  const matchingEvents = selectedEvents.filter(e => e.time.includes(timeSlot.split(' ')[0]));
                  return (
                    <div key={timeSlot} className="flex gap-4 items-start text-xs">
                      <span className="w-20 font-mono text-slate-400 font-semibold pt-1">{timeSlot}</span>
                      <div className="flex-1 min-h-[44px] p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        {matchingEvents.length > 0 ? (
                          matchingEvents.map(e => (
                            <div key={e.id} className="font-bold text-slate-900 dark:text-white">
                              {e.title}
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">No scheduled activities</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right: Selected Day Events Agenda */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Agenda: {selectedDate}
              </h3>
              <p className="text-[11px] text-slate-400">
                {formatDate(selectedDate)}
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {selectedEvents.length} {selectedEvents.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {/* If the date is already completed, display the locked message notice */}
          {isSelectedDatePast && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider">Date Already Completed</h4>
                <p className="text-xs mt-0.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                  This date has already completed. Past activities, live sessions, and assignment links are locked and cannot be opened.
                </p>
              </div>
            </div>
          )}

          {/* Agenda Event Cards */}
          {selectedEvents.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              {isSelectedDatePast ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    This date is already completed.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    No active sessions or deadlines for this day.
                  </p>
                </>
              ) : (
                <>
                  <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">No scheduled sessions or deadlines on this date.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map(evt => {
                const isEventDone = isSelectedDatePast || evt.status === 'completed';

                return (
                  <div
                    key={evt.id}
                    className={`p-4 rounded-2xl border space-y-3 transition-all ${
                      isEventDone
                        ? 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        isEventDone
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          : evt.type === 'live_session'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : evt.type === 'assessment_deadline'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {isEventDone ? 'Completed' : evt.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{evt.time}</span>
                    </div>

                    <h4 className={`font-bold text-sm ${
                      isEventDone
                        ? 'text-slate-600 dark:text-slate-400 line-through decoration-slate-400/60'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {evt.title}
                    </h4>

                    {evt.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {evt.description}
                      </p>
                    )}

                    {/* Action button: If event is already completed, lock and prevent opening */}
                    {isEventDone ? (
                      <div className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200 dark:border-slate-700/60 select-none">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Session Concluded · Cannot Be Opened</span>
                      </div>
                    ) : evt.meetingUrl ? (
                      <a
                        href={evt.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Live Video Room</span>
                      </a>
                    ) : (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Submission Window Open</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Upcoming Milestones */}
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
