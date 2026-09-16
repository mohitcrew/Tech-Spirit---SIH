import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles, CheckCircle2, ChevronRight, ArrowLeft, ArrowRight,
  BookOpen, Code, Target, Briefcase, GraduationCap, Building2,
  Clock, ShieldCheck, Compass, Check, Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { learnerService, TraineeProfile } from '../../services/learnerService';

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);

  // Load trainee profile baseline
  const { data: initialProfile } = useQuery({
    queryKey: ['traineeProfile'],
    queryFn: () => learnerService.getTraineeProfile(),
  });

  const [onboardingData, setOnboardingData] = useState<Partial<TraineeProfile>>({
    name: 'Priya Sharma',
    education: {
      id: 'edu-1',
      highestQualification: 'Undergraduate',
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'National Institute of Technology Karnataka (NITK)',
      graduationYear: 2025,
    },
    professional: {
      currentRole: 'Junior Data Analyst',
      experienceLevel: 'Beginner',
      workExperienceYears: 1,
      currentOrganization: 'Civic Analytics Lab',
      sector: 'Technology & Digital Infrastructure',
      domain: 'Data Science & Machine Learning',
    },
    skills: [
      { name: 'Python Programming', level: 'Intermediate', rating: 78, verified: true, category: 'Technical' },
      { name: 'SQL & Database Design', level: 'Intermediate', rating: 48, verified: true, category: 'Technical' },
      { name: 'Machine Learning', level: 'Beginner', rating: 28, verified: false, category: 'Technical' },
      { name: 'Statistics & Math', level: 'Beginner', rating: 35, verified: false, category: 'Foundational' },
    ],
    interests: ['Artificial Intelligence', 'Natural Language Processing', 'Data Pipelines', 'Deep Learning'],
    careerGoal: {
      targetRole: 'Data Scientist',
      dreamCompany: 'Microsoft',
      targetSector: 'Artificial Intelligence & Cloud',
      targetDomain: 'Decision Science & Predictive Modeling',
      targetTimelineMonths: 6,
      careerGoalStatement: 'Transition into enterprise Data Science building machine learning and NLP solutions.',
      shortTermGoal: 'Master ML algorithms and SQL optimization in 3 months.',
      longTermGoal: 'Lead AI innovation in public tech within 2 years.',
      weeklyLearningHours: 12,
      preferredPace: 'Self-Paced',
      preferredTrainingMode: 'Hybrid',
    },
  });

  // Save mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: (data: Partial<TraineeProfile>) => {
      const current = learnerService.getTraineeProfile();
      const updated: TraineeProfile = {
        ...current,
        ...data,
        onboardingCompleted: true,
      } as TraineeProfile;
      learnerService.updateTraineeProfile(updated);
      learnerService.awardPoints('Completed Citizen Onboarding & Career Diagnostic Profile', 150);
      return Promise.resolve(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traineeProfile'] });
      queryClient.invalidateQueries({ queryKey: ['careerRoadmap'] });
      navigate('/trainee/roadmap');
    },
  });

  const handleNext = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      completeOnboardingMutation.mutate(onboardingData);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 animate-fadeIn">
      {/* Container Box */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
        {/* Progress Bar & Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Step {step} of 8</span>
            <span className="text-purple-600 dark:text-purple-400 font-extrabold">{Math.round((step / 8) * 100)}% Completed</span>
          </div>

          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Welcome Screen */}
        {step === 1 && (
          <div className="text-center space-y-5 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Welcome to SkillSync
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                Let’s create your personalized learning roadmap. In 8 quick steps, our competency engine will diagnose your profile and map your journey.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-left text-xs space-y-2">
              <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Onboarding Reward: Earn 150 SkillSync XP upon completion!</span>
              </div>
              <p className="text-purple-800/80 dark:text-purple-300/80 text-[11px]">
                XP counts directly towards unlocking your Final SkillSync Competency Certification.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: About You */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Basic Information</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Confirm your citizen profile identity details.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={onboardingData.name || ''}
                  onChange={e => setOnboardingData({ ...onboardingData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / State</label>
                <input
                  type="text"
                  value={onboardingData.location || 'Bengaluru, Karnataka'}
                  onChange={e => setOnboardingData({ ...onboardingData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Education & Experience */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Academic & Professional Background</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your prior educational experience calibrates foundational milestones.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Academic Degree</label>
                <input
                  type="text"
                  value={onboardingData.education?.degree || ''}
                  onChange={e => setOnboardingData({
                    ...onboardingData,
                    education: { ...onboardingData.education!, degree: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">University / Institute</label>
                <input
                  type="text"
                  value={onboardingData.education?.institution || ''}
                  onChange={e => setOnboardingData({
                    ...onboardingData,
                    education: { ...onboardingData.education!, institution: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Skills Self-Assessment */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Current Technical Skills</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select which competencies you have foundational familiarity with.</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {['Python', 'SQL', 'Machine Learning', 'Statistics', 'Cloud / Docker', 'React / TypeScript', 'Deep Learning', 'Tableau'].map(s => {
                const hasSkill = onboardingData.skills?.some(item => item.name.includes(s));
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      const current = onboardingData.skills || [];
                      if (hasSkill) {
                        setOnboardingData({
                          ...onboardingData,
                          skills: current.filter(x => !x.name.includes(s))
                        });
                      } else {
                        setOnboardingData({
                          ...onboardingData,
                          skills: [...current, { name: s, level: 'Intermediate', rating: 60, verified: false, category: 'Technical' }]
                        });
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                      hasSkill
                        ? 'bg-purple-600 text-white border-purple-600 shadow'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span>{s}</span>
                    {hasSkill && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Learning Interests */}
        {step === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Domain & Sector Interests</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose the domains that excite you most.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Artificial Intelligence', 'Natural Language Processing', 'Data Pipelines', 'Deep Learning', 'DevOps & MLOps', 'Computer Vision', 'Generative AI'].map(interest => {
                const selected = onboardingData.interests?.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      const current = onboardingData.interests || [];
                      setOnboardingData({
                        ...onboardingData,
                        interests: selected ? current.filter(i => i !== interest) : [...current, interest]
                      });
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      selected
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Target Role & Career Goal */}
        {step === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Target Role & Goal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">What specific role are you preparing to achieve?</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Professional Role</label>
                <input
                  type="text"
                  value={onboardingData.careerGoal?.targetRole || ''}
                  onChange={e => setOnboardingData({
                    ...onboardingData,
                    careerGoal: { ...onboardingData.careerGoal!, targetRole: e.target.value }
                  })}
                  placeholder="e.g. Data Scientist / ML Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Timeline</label>
                <select
                  value={onboardingData.careerGoal?.targetTimelineMonths || 6}
                  onChange={e => setOnboardingData({
                    ...onboardingData,
                    careerGoal: { ...onboardingData.careerGoal!, targetTimelineMonths: parseInt(e.target.value) }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                >
                  <option value={3}>3 Months (Intensive)</option>
                  <option value={6}>6 Months (Recommended)</option>
                  <option value={12}>12 Months (Comprehensive)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Dream Company & Availability */}
        {step === 7 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Dream Company & Weekly Commitment</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tailors curriculum pace and milestone project types.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aspirational Target Organization</label>
                <input
                  type="text"
                  value={onboardingData.careerGoal?.dreamCompany || ''}
                  onChange={e => setOnboardingData({
                    ...onboardingData,
                    careerGoal: { ...onboardingData.careerGoal!, dreamCompany: e.target.value }
                  })}
                  placeholder="e.g. Microsoft, Google, ISRO"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Dedicated Hours / Week</label>
                <input
                  type="number"
                  value={onboardingData.careerGoal?.weeklyLearningHours || 12}
                  onChange={e => setOnboardingData({
                    ...onboardingData,
                    careerGoal: { ...onboardingData.careerGoal!, weeklyLearningHours: parseInt(e.target.value) || 10 }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Generate Personalized Roadmap Confirmation */}
        {step === 8 && (
          <div className="text-center space-y-5 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Diagnostics Ready!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Click below to synthesize your customized 7-stage Career Roadmap for {onboardingData.careerGoal?.targetRole} at {onboardingData.careerGoal?.dreamCompany}.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-bold text-slate-900 dark:text-white">{onboardingData.careerGoal?.targetRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Organization:</span>
                <span className="font-bold text-slate-900 dark:text-white">{onboardingData.careerGoal?.dreamCompany}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pace:</span>
                <span className="font-bold text-slate-900 dark:text-white">{onboardingData.careerGoal?.weeklyLearningHours} hours / week</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={completeOnboardingMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-lg shadow-purple-500/25"
          >
            <span>{step === 8 ? 'Generate My Career Roadmap' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
