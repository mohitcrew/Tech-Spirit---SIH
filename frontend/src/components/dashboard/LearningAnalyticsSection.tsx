import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { BookCheck, Clock, Award, CheckCircle, TrendingUp } from 'lucide-react';
import { weeklyAnalyticsData } from '../../data/capacityConnectData';

export const LearningAnalyticsSection: React.FC = () => {
  const stats = [
    { label: 'Courses Completed', value: '4', sub: '+1 this week', icon: BookCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Learning Hours', value: '38.5h', sub: 'Goal: 40h', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Skills Developed', value: '6', sub: 'Across 4 tracks', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Certificates', value: '3', sub: 'Verified IMD/CBC', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg Quiz Score', value: '94%', sub: 'Top 5% percentile', icon: CheckCircle, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Learning Insights
          </h2>
          <p className="text-xs text-slate-500">
            Real-time analytics on study hours, quiz performance, and retention
          </p>
        </div>
      </div>

      {/* 5 Quick Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="cc-card p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{s.value}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Weekly Hours Chart */}
      <div className="cc-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Weekly Engagement Activity</h3>
            <p className="text-xs text-slate-400">Total time spent completing interactive modules</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Hours Spent
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Modules Completed
            </span>
          </div>
        </div>

        <div className="w-full h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorModules" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} stroke="#E2E8F0" />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} stroke="#E2E8F0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                name="Learning Hours"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorHours)"
              />
              <Area
                type="monotone"
                dataKey="modules"
                name="Modules Finished"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorModules)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
