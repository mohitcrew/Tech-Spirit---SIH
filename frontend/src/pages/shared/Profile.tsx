import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, Target,
  Award, Sparkles, CheckCircle2, AlertCircle, Save, ExternalLink,
  Code, BookOpen, Clock, Building2, Flame, Trophy, ShieldCheck
} from 'lucide-react';
import { learnerService, TraineeProfile } from '../../services/learnerService';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'education' | 'professional' | 'skills' | 'goals'>('overview');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Trainee profile data from learnerService
  const { data: profile, isLoading } = useQuery({
    queryKey: ['traineeProfile'],
    queryFn: () => learnerService.getTraineeProfile(),
  });

  const [formData, setFormData] = useState<TraineeProfile | null>(null);

  // Initialize form state when profile loads
  React.useEffect(() => {
    if (profile && !formData) {
      setFormData(profile);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (updated: TraineeProfile) => {
      learnerService.updateTraineeProfile(updated);
      return Promise.resolve(updated);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['traineeProfile'], updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  if (isLoading || !formData) {
    return (
      <div className="state-box loading-pulse p-12 text-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading Profile Details...</p>
      </div>
    );
  }

  const completion = learnerService.calculateProfileCompletion(formData);
  const xp = learnerService.getTotalXP();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={formData.photoUrl}
              alt={formData.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
              {user?.role || 'TRAINEE'}
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SkillSync Verified Citizen Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{formData.name}</h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
              {formData.professional.currentRole} • {formData.professional.currentOrganization}
            </p>
          </div>
        </div>

        {/* Profile Completion Widget */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400"
                strokeDasharray={`${completion.percent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-black text-white">{completion.percent}%</span>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Profile Readiness</div>
            <div className="text-xs text-blue-100 mt-0.5">
              {completion.missingFields.length === 0
                ? 'All sections complete!'
                : `${completion.missingFields.length} pending recommendations`}
            </div>
            <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1 mt-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>{xp.toLocaleString()} SkillSync XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Recommendations Alert if not 100% */}
      {completion.percent < 100 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-200">Recommended Steps to Reach 100% Readiness:</span>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                Add: {completion.missingFields.join(' • ')} to unlock priority career matching.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('professional')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
          >
            Complete Fields
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'overview', label: 'Personal Overview', icon: User },
          { id: 'education', label: 'Education & Academics', icon: GraduationCap },
          { id: 'professional', label: 'Experience & Role', icon: Briefcase },
          { id: 'skills', label: 'Skills & Proficiencies', icon: Code },
          { id: 'goals', label: 'Career Goal & Roadmap', icon: Target },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Card */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Personal Information</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / State</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Bengaluru, Karnataka"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Professional & Social Profiles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.externalProfiles.github || ''}
                    onChange={e => setFormData({
                      ...formData,
                      externalProfiles: { ...formData.externalProfiles, github: e.target.value }
                    })}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.externalProfiles.linkedin || ''}
                    onChange={e => setFormData({
                      ...formData,
                      externalProfiles: { ...formData.externalProfiles, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Portfolio / Personal Website</label>
                  <input
                    type="url"
                    value={formData.externalProfiles.portfolio || ''}
                    onChange={e => setFormData({
                      ...formData,
                      externalProfiles: { ...formData.externalProfiles, portfolio: e.target.value }
                    })}
                    placeholder="https://portfolio.dev"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Education */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Academic Credentials & Institution</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Highest Qualification</label>
                <select
                  value={formData.education.highestQualification}
                  onChange={e => setFormData({
                    ...formData,
                    education: { ...formData.education, highestQualification: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                >
                  <option value="Undergraduate">Undergraduate Degree (B.Tech / B.E. / B.Sc)</option>
                  <option value="Postgraduate">Postgraduate Degree (M.Tech / M.Sc / MBA)</option>
                  <option value="Doctorate">Doctorate / Ph.D.</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Higher Secondary">Higher Secondary / 12th</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree & Major</label>
                <input
                  type="text"
                  value={formData.education.degree}
                  onChange={e => setFormData({
                    ...formData,
                    education: { ...formData.education, degree: e.target.value }
                  })}
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">University / Institute</label>
                <input
                  type="text"
                  value={formData.education.institution}
                  onChange={e => setFormData({
                    ...formData,
                    education: { ...formData.education, institution: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={formData.education.graduationYear}
                  onChange={e => setFormData({
                    ...formData,
                    education: { ...formData.education, graduationYear: parseInt(e.target.value) || 2025 }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Professional Experience */}
        {activeTab === 'professional' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Current Role & Industry Domain</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Role / Designation</label>
                <input
                  type="text"
                  value={formData.professional.currentRole}
                  onChange={e => setFormData({
                    ...formData,
                    professional: { ...formData.professional, currentRole: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Organization / College</label>
                <input
                  type="text"
                  value={formData.professional.currentOrganization}
                  onChange={e => setFormData({
                    ...formData,
                    professional: { ...formData.professional, currentOrganization: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Years of Experience</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.professional.workExperienceYears}
                  onChange={e => setFormData({
                    ...formData,
                    professional: { ...formData.professional, workExperienceYears: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience Seniority Tier</label>
                <select
                  value={formData.professional.experienceLevel}
                  onChange={e => setFormData({
                    ...formData,
                    professional: { ...formData.professional, experienceLevel: e.target.value as any }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                >
                  <option value="Beginner">Beginner (0 - 1 years)</option>
                  <option value="Intermediate">Intermediate (1 - 3 years)</option>
                  <option value="Advanced">Advanced (3 - 6 years)</option>
                  <option value="Senior / Specialist">Senior / Specialist (6+ years)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Skills & Sliders */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Technical & Competency Matrix</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Adjust your self-assessed proficiency ratings. These configure your diagnostic gap analysis.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.skills.map((skill, idx) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{skill.name}</span>
                      {skill.verified && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">{skill.rating}%</span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={skill.rating}
                    onChange={e => {
                      const newSkills = [...formData.skills];
                      newSkills[idx].rating = parseInt(e.target.value);
                      newSkills[idx].level =
                        newSkills[idx].rating > 80 ? 'Expert' :
                        newSkills[idx].rating > 60 ? 'Advanced' :
                        newSkills[idx].rating > 35 ? 'Intermediate' : 'Beginner';
                      setFormData({ ...formData, skills: newSkills });
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Category: {skill.category}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{skill.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Goals & Roadmap Targets */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-600" />
              <span>Personalized Career Goal & Aspirations</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Role</label>
                <input
                  type="text"
                  value={formData.careerGoal.targetRole}
                  onChange={e => setFormData({
                    ...formData,
                    careerGoal: { ...formData.careerGoal, targetRole: e.target.value }
                  })}
                  placeholder="e.g. Data Scientist / ML Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aspirational / Dream Company</label>
                <input
                  type="text"
                  value={formData.careerGoal.dreamCompany}
                  onChange={e => setFormData({
                    ...formData,
                    careerGoal: { ...formData.careerGoal, dreamCompany: e.target.value }
                  })}
                  placeholder="e.g. Microsoft / ISRO / Google"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Timeline (Months)</label>
                <input
                  type="number"
                  value={formData.careerGoal.targetTimelineMonths}
                  onChange={e => setFormData({
                    ...formData,
                    careerGoal: { ...formData.careerGoal, targetTimelineMonths: parseInt(e.target.value) || 6 }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Dedicated Weekly Hours</label>
                <input
                  type="number"
                  value={formData.careerGoal.weeklyLearningHours}
                  onChange={e => setFormData({
                    ...formData,
                    careerGoal: { ...formData.careerGoal, weeklyLearningHours: parseInt(e.target.value) || 10 }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Personal Career Goal Statement</label>
              <textarea
                rows={3}
                value={formData.careerGoal.careerGoalStatement}
                onChange={e => setFormData({
                  ...formData,
                  careerGoal: { ...formData.careerGoal, careerGoalStatement: e.target.value }
                })}
                placeholder="Describe what you aim to achieve in this transition..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/25 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
