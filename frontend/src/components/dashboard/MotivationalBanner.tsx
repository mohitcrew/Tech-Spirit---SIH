import React from 'react';
import { Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { currentUserProfile } from '../../data/capacityConnectData';

interface MotivationalBannerProps {
  onContinue: () => void;
}

export const MotivationalBanner: React.FC<MotivationalBannerProps> = ({ onContinue }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-blue-500/15 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 db-progress-banner-anim">
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 db-rocket-anim">
          <Rocket className="w-6 h-6 text-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-white">
              You’re {currentUserProfile.lessonsLeftThisWeek} lessons away from completing your weekly goal! 🚀
            </h3>
          </div>
          <p className="text-xs text-blue-100 mt-0.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Weekly progress is at {currentUserProfile.weeklyGoalPercent}%. Finish strong before Sunday!</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-[11px] text-blue-100 font-semibold">{currentUserProfile.weeklyGoalPercent}% Completed</span>
          <div className="w-24 bg-white/25 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-amber-300 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${currentUserProfile.weeklyGoalPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all flex-shrink-0 cursor-pointer db-prog-btn"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};
