import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Target, TrendingUp, AlertCircle, CheckCircle2, Award,
  Sparkles, BarChart3, ArrowRight, ShieldAlert, Cpu, BookOpen, Compass
} from 'lucide-react';
import { learnerService, SkillGapItem } from '../../services/learnerService';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { CourseCard } from '../../components/courses/CourseCard';

export default function Skills() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || 'trainee';
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['skillProfile'],
    queryFn: () => learnerService.getSkillProfile(),
  });

  const [filterGap, setFilterGap] = useState<'All' | 'Critical' | 'Moderate' | 'Target Met'>('All');

  const { competencies = [], skillGaps = [], overallReadiness = 0, targetRole = 'Target Role' } = data || {};

  // Extract skills from skill gaps for targeted recommendation
  const gapSkillKeywords = useMemo(() => {
    return skillGaps.map(g => g.name);
  }, [skillGaps]);

  // Load real courses matching identified skill gaps
  const { data: recommendedCourses = [], isLoading: isRecsLoading } = useQuery({
    queryKey: ['skills-page-recommendations', gapSkillKeywords],
    queryFn: () => courseService.getRecommendedCourses(gapSkillKeywords, { limit: 4 }),
    enabled: gapSkillKeywords.length > 0,
  });

  if (isLoading || !data) {
    return <div className="state-box loading-pulse"><p>Analyzing competency diagnostics...</p></div>;
  }

  const radarData = competencies.map(c => ({
    subject: c.name,
    A: c.score,
    fullMark: c.fullMark,
  }));

  const filteredGaps = skillGaps.filter(g => filterGap === 'All' || g.status === filterGap);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Capability Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Skills Profile & Gap Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Compare your verified diagnostic proficiency against benchmarks required for {targetRole}.
          </p>
        </div>

        {/* Readiness Dial */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 flex-shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Overall Target Readiness</span>
            <span className="text-2xl font-black">{overallReadiness}%</span>
            <span className="text-[11px] text-emerald-200 block mt-0.5">+14% over past 30 days</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-300 flex items-center justify-center font-black text-xs text-white">
            READY
          </div>
        </div>
      </div>

      {/* Radar Chart & Competency Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Recharts Radar Map */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Multi-Axis Competency Radar</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Baseline 100</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                  <Radar name="My Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Highest Proficiency: <strong>Digital Literacy (91%)</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Diagnostic Verified</span>
          </div>
        </div>

        {/* Right: Competency breakdown cards */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Evaluated Competencies
            </h2>
            <span className="text-xs text-slate-400 font-medium">6 Evaluated Dimensions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {competencies.map(comp => (
              <div
                key={comp.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{comp.name}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{comp.score}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${comp.score}%`, backgroundColor: comp.categoryColor }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Level: {comp.level}</span>
                  <span className="truncate max-w-[140px] text-slate-500">{comp.nextMilestone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="font-black text-lg text-slate-900 dark:text-white">
                Calculated Skill Gap Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identifies the delta between your verified score and the target role benchmark.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['All', 'Critical', 'Moderate', 'Target Met'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterGap(f)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterGap === f
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Gap Table / Cards */}
        <div className="space-y-3">
          {filteredGaps.map(gap => (
            <div
              key={gap.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    gap.status === 'Critical'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : gap.status === 'Moderate'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {gap.status}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {gap.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Category: {gap.category} · Priority Gap: <strong className="text-slate-700 dark:text-slate-300">{gap.name}</strong>
                </p>
              </div>

              {/* Progress and Action */}
              <div className="flex items-center gap-6 self-end md:self-auto">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {gap.currentScore}% <span className="text-slate-400 font-normal">/ {gap.targetScore}%</span>
                  </div>
                  <div className="text-[10px] text-rose-500 font-semibold">
                    {gap.gap > 0 ? `-${gap.gap}% deficit` : 'Benchmark satisfied'}
                  </div>
                </div>

                <Link
                  to={`/${role}/courses?search=${encodeURIComponent(gap.name)}`}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                >
                  <span>Find Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Courses Section (Mapped to Excel Catalogue) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 mb-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Skill-Based Course Recommendation</span>
            </div>
            <h2 className="font-black text-lg text-slate-900 dark:text-white">
              Curriculum Recommended to Close Your Skill Gaps
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identified directly from our 2,025 master Excel courses by transparently matching your deficit skills.
            </p>
          </div>

          <Link
            to={`/${role}/courses`}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isRecsLoading && (
          <div className="p-8 text-center animate-pulse">
            <p className="text-xs text-slate-400">Matching courses against your deficit skills...</p>
          </div>
        )}

        {!isRecsLoading && recommendedCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedCourses.map(rec => (
              <CourseCard
                key={rec.course.id}
                course={rec.course}
                rolePrefix={`/${role}`}
                matchPercentage={rec.matchPercentage}
                recommendationReason={rec.recommendationReason}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
