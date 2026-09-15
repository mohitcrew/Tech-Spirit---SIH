import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Award, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { quizQuestions } from '../../data/capacityConnectData';
import { fireConfetti } from '../../utils/confetti';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnXp?: (xp: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onEarnXp }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      fireConfetti(3000, 90);
      if (onEarnXp) {
        onEarnXp(50);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 transform transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Daily Knowledge Sprint</h3>
              <p className="text-xs text-blue-100">Test your skills & earn +50 XP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isFinished ? (
            <div>
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
                <span className="text-blue-600 font-bold">{Math.round(((currentIdx + 1) / quizQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h4 className="text-base font-bold text-slate-900 mb-4 leading-relaxed">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {currentQ.options.map((opt, i) => {
                  let optStyle = 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-slate-700';
                  let icon = null;

                  if (isAnswered) {
                    if (i === currentQ.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-sm';
                      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
                    } else if (i === selectedOption) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                      icon = <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
                    } else {
                      optStyle = 'opacity-50 border-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-sm ${optStyle}`}
                    >
                      <span className="flex-1">{opt}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when answered */}
              {isAnswered && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 text-xs text-slate-600 animate-fadeIn">
                  <span className="font-bold text-slate-800">Key takeaway: </span>
                  {currentQ.explanation}
                </div>
              )}

              {/* Action */}
              <div className="flex justify-end">
                {isAnswered && (
                  <button
                    onClick={handleNext}
                    className="cc-btn-primary text-sm flex items-center gap-2"
                  >
                    <span>{currentIdx + 1 < quizQuestions.length ? 'Next Question' : 'Complete Quiz'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200 animate-bounce">
                <Award className="w-8 h-8" />
              </div>

              <h4 className="text-2xl font-black text-slate-900 mb-1">
                {score === quizQuestions.length ? 'Perfect Score! 🌟' : 'Awesome Effort! 🎉'}
              </h4>
              <p className="text-sm text-slate-500 mb-6">
                You scored <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold text-slate-800">{quizQuestions.length}</span>
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <span className="text-xs text-blue-600 font-semibold block mb-1">Experience Gained</span>
                  <span className="text-2xl font-black text-blue-700">+50 XP</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xs text-emerald-600 font-semibold block mb-1">Daily Streak</span>
                  <span className="text-2xl font-black text-emerald-700">7 Days 🔥</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRestart}
                  className="cc-btn-secondary flex-1 text-sm flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="cc-btn-primary flex-1 text-sm"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
