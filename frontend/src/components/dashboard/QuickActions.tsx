import React from 'react';
import {
  Compass, Video, HelpCircle, MessageCircle, Share2, Award, ChevronRight
} from 'lucide-react';

interface QuickActionsProps {
  onBrowseCourses: () => void;
  onJoinTraining: () => void;
  onTakeQuiz: () => void;
  onAskMentor: () => void;
  onShareKnowledge: () => void;
  onEarnCertificate: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onBrowseCourses,
  onJoinTraining,
  onTakeQuiz,
  onAskMentor,
  onShareKnowledge,
  onEarnCertificate,
}) => {
  const actions = [
    {
      label: 'Browse Courses',
      description: 'Explore verified modules',
      icon: Compass,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100/70',
      borderHover: 'hover:border-blue-300',
      animClass: 'db-qa-card-1',
      iconClass: 'db-qa-icon-browse',
      onClick: onBrowseCourses,
    },
    {
      label: 'Join Training',
      description: 'Live interactive sessions',
      icon: Video,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/70',
      borderHover: 'hover:border-emerald-300',
      animClass: 'db-qa-card-2',
      iconClass: 'db-qa-icon-video',
      onClick: onJoinTraining,
    },
    {
      label: 'Take a Quiz',
      description: 'Earn +50 XP and streak',
      icon: HelpCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100/70',
      borderHover: 'hover:border-purple-300',
      animClass: 'db-qa-card-3',
      iconClass: 'db-qa-icon-quiz',
      onClick: onTakeQuiz,
    },
    {
      label: 'Ask a Mentor',
      description: '1-on-1 expert guidance',
      icon: MessageCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 hover:bg-amber-100/70',
      borderHover: 'hover:border-amber-300',
      animClass: 'db-qa-card-4',
      iconClass: 'db-qa-icon-mentor',
      onClick: onAskMentor,
    },
    {
      label: 'Share Knowledge',
      description: 'Post tips to community',
      icon: Share2,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100/70',
      borderHover: 'hover:border-cyan-300',
      animClass: 'db-qa-card-5',
      iconClass: 'db-qa-icon-share',
      onClick: onShareKnowledge,
    },
    {
      label: 'Earn Certificate',
      description: 'Download verified credentials',
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100/70',
      borderHover: 'hover:border-indigo-300',
      animClass: 'db-qa-card-6',
      iconClass: 'db-qa-icon-cert',
      onClick: onEarnCertificate,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 db-qa-heading-anim">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Quick Actions</h2>
          <p className="text-xs text-slate-500">Fast pathways to learning, sharing, and assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              onClick={act.onClick}
              className={`p-4 rounded-2xl border border-slate-200/80 bg-white flex flex-col items-start text-left group hover:shadow-md ${act.borderHover} ${act.animClass} db-qa-card cursor-pointer`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 transition-colors ${act.bgColor} ${act.iconClass}`}
              >
                <Icon className={`w-5 h-5 ${act.color} transition-transform duration-200`} />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {act.label}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {act.description}
              </p>
              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-blue-600">
                <span>Start</span>
                <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
