import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { skillCompetencies, SkillCompetency } from '../../data/capacityConnectData';

interface SkillMapSectionProps {
  onSelectSkill: (skill: SkillCompetency) => void;
}

export const SkillMapSection: React.FC<SkillMapSectionProps> = ({ onSelectSkill }) => {
  // Format data for Recharts Radar
  const radarData = skillCompetencies.map(s => ({
    subject: s.name,
    score: s.score,
    fullMark: s.fullMark,
  }));

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Skill Competency Map
          </h2>
          <p className="text-xs text-slate-500">
            Interactive multi-dimensional capability assessment · Click any skill for drill-down
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="cc-pill cc-pill-blue">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>AI Verified</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Radar Spider Chart */}
        <div className="lg:col-span-5 cc-card p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[340px]">
          <div className="absolute top-4 left-4 text-xs font-bold text-slate-700">
            Competency Radar
          </div>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#0F172A', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" tick={false} />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#2563EB"
                  fill="#3B82F6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 font-medium text-center mt-1">
            Holistic score: <span className="text-blue-600 font-bold">78.2% Average</span>
          </div>
        </div>

        {/* Right: Interactive Skill Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {skillCompetencies.map(skill => (
            <div
              key={skill.name}
              onClick={() => onSelectSkill(skill)}
              className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between db-skill-card"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600">
                    {skill.score}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-1 mb-3">
                  {skill.description}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${skill.score}%`,
                      backgroundColor: skill.categoryColor,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-600">{skill.level}</span>
                  <span className="group-hover:text-blue-600 font-semibold flex items-center gap-0.5">
                    <span>View Courses</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
