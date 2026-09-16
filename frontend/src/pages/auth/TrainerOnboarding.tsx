import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api, unwrap } from '../../services/api';

export function TrainerOnboarding() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [sector, setSector] = useState('IT');
  const [domain, setDomain] = useState('Cloud & DevOps');
  const [experience, setExperience] = useState('8');
  const [skills, setSkills] = useState('Kubernetes, Docker, Cloud Architecture, CI/CD, Terraform');
  const [bio, setBio] = useState(
    'Passionate technical educator with a focus on enterprise-scale distributed systems, high-availability infrastructure, and hands-on laboratory mastery.',
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.patch('/users/me/onboarding', {
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        profile: {
          designation,
          department,
          sector,
          domain,
          experience: parseInt(experience, 10) || 5,
          skills,
          bio,
        },
      });

      navigate('/trainer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to complete trainer onboarding.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            SkillSync Faculty & Trainer Onboarding
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome to the Instructor Network
          </h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Configure your teaching profile, institutional affiliations, and domain specializations to mentor national capacity cohorts.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Designation & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Academic / Professional Designation:
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g., Lead Cloud Architect"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Department / Institution:
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Computer Science & Engineering"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Sector & Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Sector:
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="IT">Information Technology (IT)</option>
                  <option value="MoES">MoES & Earth Sciences</option>
                  <option value="Healthcare">Healthcare & Life Sciences</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Primary Domain Specialization:
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity & Defense</option>
                  <option value="Full-Stack Web">Full-Stack Development</option>
                  <option value="Data Engineering">Data Engineering & Analytics</option>
                </select>
              </div>
            </div>

            {/* Experience & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Experience (Years):
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Core Instructional Skills:
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Comma-separated skills"
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Teaching Bio */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Instructional Philosophy & Bio:
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {submitting ? (
                'Finalizing Instructor Profile...'
              ) : (
                <>
                  Complete Faculty Onboarding & Launch Dashboard
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
