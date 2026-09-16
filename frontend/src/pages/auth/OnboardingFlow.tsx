import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles, CheckCircle2, ChevronRight, ArrowLeft, ArrowRight,
  BookOpen, Code, Target, Briefcase, GraduationCap, Building2,
  Clock, ShieldCheck, Compass, Check, Trophy, Zap, Star,
  Award, Flame, Layers, Sliders, Cpu, Globe, RefreshCw,
  PlayCircle, AlertCircle, Bookmark, ExternalLink
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { learnerService, TraineeProfile } from '../../services/learnerService';
import { courseService } from '../../services/courseService';
import { RecommendedCourseMatch } from '../../types/course';

const DRAFT_STORAGE_KEY = 'skillsync_onboarding_draft';

// Skill catalogue recommendations by category
const PRESET_SKILL_CATEGORIES: Record<string, string[]> = {
  'Software & Programming': ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'Go', 'Rust', 'REST APIs', 'GraphQL'],
  'Data Science & AI': ['Machine Learning', 'Deep Learning', 'SQL', 'PostgreSQL', 'Pandas', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'NLP', 'Computer Vision'],
  'Cloud & DevOps': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Git', 'Prometheus'],
  'Security & Architecture': ['Zero-Trust Security', 'OAuth2 & IAM', 'Microservices', 'System Design', 'Cryptography', 'Network Security'],
  'Core & Methodologies': ['Agile / Scrum', 'Problem Solving', 'Data Structures', 'Algorithms', 'Statistical Modeling'],
};

// Target role suggestions
const POPULAR_TARGET_ROLES = [
  'Data Scientist',
  'Full Stack Engineer',
  'AI / Machine Learning Engineer',
  'Cloud Solutions Architect',
  'Cybersecurity Analyst',
  'DevOps & Platform Engineer',
  'Backend Systems Engineer',
  'Frontend Engineer',
];

// Target companies suggestions
const POPULAR_COMPANIES = [
  'Microsoft',
  'Google',
  'Amazon',
  'ISRO',
  'TCS Research',
  'Infosys',
  'Meta',
  'OpenAI',
  'Deloitte',
  'High-Growth Startup',
];

// Interactive assessment questions tailored for baseline competency
interface DiagnosticQuestion {
  id: number;
  domain: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    domain: 'Data Structures & Algorithms',
    question: 'What is the average-case time complexity of searching for a key in an optimized hash table versus a sorted array using binary search?',
    options: [
      'O(1) vs O(log n)',
      'O(log n) vs O(n)',
      'O(n) vs O(1)',
      'O(log n) vs O(1)'
    ],
    correctIndex: 0,
    explanation: 'Hash table lookups average O(1) through bucket hashing, whereas binary search over a sorted array requires O(log n).'
  },
  {
    id: 2,
    domain: 'Database & SQL Optimization',
    question: 'Which SQL clause is executed AFTER group aggregations to filter aggregated results (e.g. COUNT(*) > 5)?',
    options: [
      'WHERE clause',
      'HAVING clause',
      'ORDER BY clause',
      'GROUP BY clause'
    ],
    correctIndex: 1,
    explanation: 'HAVING filters aggregated groups post-GROUP BY, whereas WHERE filters individual rows prior to grouping.'
  },
  {
    id: 3,
    domain: 'System Architecture & Scaling',
    question: 'In a distributed microservice topology, what mechanism prevents cascading service failures when a downstream dependency experiences severe latency?',
    options: [
      'Single Page Application Router',
      'Circuit Breaker pattern',
      'Round-Robin DNS',
      'Long Polling'
    ],
    correctIndex: 1,
    explanation: 'The Circuit Breaker pattern trips upon repeated timeout thresholds to immediately return a fallback, preventing thread pool exhaustion.'
  },
  {
    id: 4,
    domain: 'Machine Learning & Modeling',
    question: 'When a predictive machine learning model demonstrates extremely high accuracy on training data but performs poorly on unseen test data, what is this called?',
    options: [
      'High Bias (Underfitting)',
      'High Variance (Overfitting)',
      'Optimal Regularization',
      'Feature Sparsity'
    ],
    correctIndex: 1,
    explanation: 'High variance indicates overfitting: the model has memorized training noise rather than generalizing true structural patterns.'
  },
  {
    id: 5,
    domain: 'Cloud & Zero-Trust Security',
    question: 'Under the Zero-Trust Architecture principle, what is the default assumption regarding network perimeter traffic?',
    options: [
      'Internal intranet traffic is intrinsically trusted',
      'Never trust, always verify every request regardless of origin',
      'Trust verified IP ranges without token validation',
      'Allow unrestricted inter-pod communications'
    ],
    correctIndex: 1,
    explanation: 'Zero-Trust dictates "Never trust, always verify"—all transactions must be authenticated, authorized, and encrypted continuously.'
  }
];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, completeOnboarding: authCompleteOnboarding } = useAuth();

  // Load existing profile baseline
  const { data: initialProfile } = useQuery({
    queryKey: ['traineeProfile'],
    queryFn: () => learnerService.getTraineeProfile(),
  });

  // Main step state: 1 through 8
  const [step, setStep] = useState<number>(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.step && parsed.step >= 1 && parsed.step <= 8) return parsed.step;
      } catch {}
    }
    return 1;
  });

  // User Persona selection
  const [persona, setPersona] = useState<string>('student');

  // Core Onboarding Data state
  const [onboardingData, setOnboardingData] = useState<Partial<TraineeProfile>>(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.data) return parsed.data;
      } catch {}
    }
    return {
      name: user?.name || 'Priya Sharma',
      location: 'Bengaluru, Karnataka',
      education: {
        id: 'edu-1',
        highestQualification: 'Undergraduate',
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'National Institute of Technology Karnataka (NITK)',
        graduationYear: 2025,
      },
      professional: {
        currentRole: 'Student / Aspiring Engineer',
        experienceLevel: 'Beginner',
        workExperienceYears: 0,
        currentOrganization: 'NITK / SIH Innovation Cell',
        sector: 'Technology & Digital Infrastructure',
        domain: 'Data Science & Machine Learning',
      },
      skills: [
        { name: 'Python', level: 'Intermediate', rating: 65, verified: true, category: 'Software & Programming' },
        { name: 'SQL', level: 'Intermediate', rating: 55, verified: true, category: 'Data Science & AI' },
        { name: 'Git', level: 'Intermediate', rating: 60, verified: false, category: 'Cloud & DevOps' },
      ],
      interests: [
        'Artificial Intelligence & Machine Learning',
        'Data Science & Predictive Analytics',
        'Cloud Architecture & DevOps',
      ],
      careerGoal: {
        targetRole: 'Data Scientist',
        dreamCompany: 'Microsoft',
        targetSector: 'Artificial Intelligence & Cloud Computing',
        targetDomain: 'Decision Science & Predictive Modeling',
        targetTimelineMonths: 6,
        careerGoalStatement: 'Transition into an enterprise Data Science role at Microsoft within 6 months.',
        shortTermGoal: 'Master supervised algorithms and high-throughput SQL pipelines.',
        longTermGoal: 'Architect large-scale generative AI and predictive intelligence systems.',
        weeklyLearningHours: 12,
        preferredPace: 'Cohort-Based',
        preferredTrainingMode: 'Hybrid',
      },
      learningPreferences: {
        level: 'Intermediate',
        format: 'Hands-on Projects & Labs',
        weeklyHours: 12,
        trainingMode: 'Hybrid with Mentor Sprints',
      },
    };
  });

  // Custom skill input state
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('Software & Programming');

  // Assessment State
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number>(0);

  // Recommended courses for WOW moment
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourseMatch[]>([]);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);

  // Persist draft on changes
  useEffect(() => {
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        step,
        persona,
        data: onboardingData,
        assessmentAnswers,
        assessmentSubmitted,
        assessmentScore,
      })
    );
  }, [step, persona, onboardingData, assessmentAnswers, assessmentSubmitted, assessmentScore]);

  // Fetch live recommended courses when reaching step 7 or 8 based on user's target role & skills
  useEffect(() => {
    if (step >= 7) {
      const skillsToQuery = [
        onboardingData.careerGoal?.targetRole || 'Data Scientist',
        ...(onboardingData.skills || []).map(s => s.name),
        ...(onboardingData.interests || []),
      ];
      courseService
        .getRecommendedCourses(skillsToQuery, { limit: 3 })
        .then(res => setRecommendedCourses(res))
        .catch(err => console.warn('Could not load course matches:', err));
    }
  }, [step, onboardingData.careerGoal?.targetRole, onboardingData.skills, onboardingData.interests]);

  // Complete Onboarding Mutation
  const completeMutation = useMutation({
    mutationFn: async () => {
      // 1. Synthesize Roadmap via learnerService
      const roadmap = learnerService.generatePersonalizedRoadmapFromOnboarding({
        ...onboardingData,
        persona,
        assessmentScore,
      });

      // 2. Call AuthContext completeOnboarding to update local & remote user status
      await authCompleteOnboarding();

      // 3. Clear draft
      localStorage.removeItem(DRAFT_STORAGE_KEY);

      return roadmap;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traineeProfile'] });
      queryClient.invalidateQueries({ queryKey: ['careerRoadmap'] });
      navigate('/trainee/dashboard');
    },
  });

  // Handle step transitions
  const handleNext = () => {
    if (step === 7 && !assessmentSubmitted) {
      // Calculate assessment score
      let correct = 0;
      DIAGNOSTIC_QUESTIONS.forEach(q => {
        if (assessmentAnswers[q.id] === q.correctIndex) correct++;
      });
      const scorePct = Math.round((correct / DIAGNOSTIC_QUESTIONS.length) * 100);
      setAssessmentScore(scorePct);
      setAssessmentSubmitted(true);

      // Trigger roadmap generation simulation
      setIsGeneratingRoadmap(true);
      setTimeout(() => {
        const synthesized = learnerService.generatePersonalizedRoadmapFromOnboarding({
          ...onboardingData,
          persona,
          assessmentScore: scorePct,
        });
        setGeneratedRoadmap(synthesized);
        setIsGeneratingRoadmap(false);
        setStep(8);
      }, 1200);
      return;
    }

    if (step < 8) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      completeMutation.mutate();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Skill management helpers
  const handleToggleSkill = (skillName: string, category: string) => {
    const existing = onboardingData.skills || [];
    const found = existing.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (found) {
      setOnboardingData({
        ...onboardingData,
        skills: existing.filter(s => s.name.toLowerCase() !== skillName.toLowerCase()),
      });
    } else {
      setOnboardingData({
        ...onboardingData,
        skills: [
          ...existing,
          { name: skillName, level: 'Intermediate', rating: 60, verified: false, category },
        ],
      });
    }
  };

  const handleUpdateSkillLevel = (skillName: string, level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') => {
    const ratingMap = { Beginner: 35, Intermediate: 60, Advanced: 80, Expert: 95 };
    const updated = (onboardingData.skills || []).map(s => {
      if (s.name.toLowerCase() === skillName.toLowerCase()) {
        return { ...s, level, rating: ratingMap[level] };
      }
      return s;
    });
    setOnboardingData({ ...onboardingData, skills: updated });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    const existing = onboardingData.skills || [];
    if (!existing.some(s => s.name.toLowerCase() === customSkillInput.trim().toLowerCase())) {
      setOnboardingData({
        ...onboardingData,
        skills: [
          ...existing,
          {
            name: customSkillInput.trim(),
            level: 'Intermediate',
            rating: 60,
            verified: false,
            category: activeSkillCategory,
          },
        ],
      });
    }
    setCustomSkillInput('');
  };

  // Step Title / Subtitle descriptor
  const stepMeta = [
    { title: 'Welcome & Persona', desc: 'Define your starting journey' },
    { title: 'Education & Background', desc: 'Academic and professional context' },
    { title: 'Skills & Proficiency', desc: 'Identify your current baseline' },
    { title: 'Domain Interests', desc: 'Pick fields that excite you' },
    { title: 'Dream Goal & Company', desc: 'Where do you want to work?' },
    { title: 'Learning Preferences', desc: 'Format, velocity & style' },
    { title: 'Diagnostic Assessment', desc: '5-minute capability calibration' },
    { title: 'Roadmap Reveal', desc: 'Your personalized curriculum' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white relative overflow-hidden font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">SkillSync</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                First-Login Onboarding
              </span>
            </div>
            <p className="text-[11px] text-slate-400">National Competency & Career Diagnostic Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>+150 XP Reward on Finish</span>
          </div>

          <button
            type="button"
            onClick={() => {
              // Save draft and return to home or login
              alert('Your onboarding progress has been saved to this device. You can resume anytime!');
              navigate('/');
            }}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition"
          >
            Save & Exit
          </button>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col justify-center z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300">
          {/* Top Progress & Stepper */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider">
                  Step {step} of 8 — {stepMeta[step - 1].title}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {stepMeta[step - 1].desc}
                </h1>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-cyan-400">
                  {Math.round((step / 8) * 100)}%
                </span>
                <span className="text-xs text-slate-500 block">Completed</span>
              </div>
            </div>

            {/* Stepper progress bar with glow */}
            <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 shadow-md shadow-cyan-500/50"
                style={{ width: `${(step / 8) * 100}%` }}
              />
            </div>

            {/* Step icons bar (desktop) */}
            <div className="hidden sm:grid grid-cols-8 gap-1 pt-1 text-[10px] text-slate-400 font-semibold text-center">
              {stepMeta.map((m, idx) => {
                const isCurrent = step === idx + 1;
                const isDone = step > idx + 1;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      isCurrent
                        ? 'text-cyan-300 scale-105 font-bold'
                        : isDone
                        ? 'text-slate-300'
                        : 'text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : isCurrent
                          ? 'bg-cyan-500 text-slate-950 font-black ring-4 ring-cyan-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <span className="truncate max-w-[70px]">{m.title.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ════════ STEP 1: Welcome & Persona ════════ */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Welcome to SkillSync
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Let’s Build a Learning Journey Designed Around YOU
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Select your current learner persona so we can calibrate your baseline milestones, project complexity, and target industry expectations.
                </p>
              </div>

              {/* Persona Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    id: 'student',
                    title: 'Undergraduate Student',
                    desc: 'College learner preparing for campus placements, hackathons, and technical internships.',
                    icon: GraduationCap,
                    badge: 'Placement Track',
                  },
                  {
                    id: 'graduate',
                    title: 'Recent Graduate',
                    desc: 'Actively preparing to land a high-impact first role in technology, data, or product.',
                    icon: Briefcase,
                    badge: 'Job Ready',
                  },
                  {
                    id: 'professional',
                    title: 'Working Professional',
                    desc: 'Industry developer or analyst upskilling into advanced architecture and specialized roles.',
                    icon: Layers,
                    badge: 'Career Growth',
                  },
                  {
                    id: 'switcher',
                    title: 'Career Switcher',
                    desc: 'Transitioning from non-tech or another domain into modern high-demand software systems.',
                    icon: RefreshCw,
                    badge: 'Foundations First',
                  },
                ].map(p => {
                  const Icon = p.icon;
                  const isSelected = persona === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPersona(p.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-300 group-hover:text-cyan-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {p.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white mb-1">{p.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={onboardingData.name || ''}
                    onChange={e => setOnboardingData({ ...onboardingData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={onboardingData.location || ''}
                    onChange={e => setOnboardingData({ ...onboardingData, location: e.target.value })}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════════ STEP 2: Education & Background ════════ */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-white">Academic & Professional Background</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Tell us about your educational degrees and work experience to calibrate your foundational starting point.
                </p>
              </div>

              <div className="space-y-4">
                {/* Degree / Qualification */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Current Degree / Highest Qualification
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    {[
                      'B.Tech / B.E',
                      'BCA / B.Sc CS',
                      'M.Tech / M.E',
                      'MCA / M.Sc',
                      'MBA / Management',
                      'Diploma / Poly',
                      'High School / 12th',
                      'Other / Specialized',
                    ].map(deg => {
                      const isSelected = onboardingData.education?.degree?.includes(deg);
                      return (
                        <button
                          key={deg}
                          type="button"
                          onClick={() =>
                            setOnboardingData({
                              ...onboardingData,
                              education: { ...onboardingData.education!, degree: deg },
                            })
                          }
                          className={`p-2 rounded-xl text-xs font-semibold border text-center transition ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-slate-800/50 border-slate-700/70 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {deg}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={onboardingData.education?.degree || ''}
                    onChange={e =>
                      setOnboardingData({
                        ...onboardingData,
                        education: { ...onboardingData.education!, degree: e.target.value },
                      })
                    }
                    placeholder="Specific degree / branch (e.g. B.Tech in Computer Science & Engineering)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Institution / College */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    University / College / Institute
                  </label>
                  <input
                    type="text"
                    value={onboardingData.education?.institution || ''}
                    onChange={e =>
                      setOnboardingData({
                        ...onboardingData,
                        education: { ...onboardingData.education!, institution: e.target.value },
                      })
                    }
                    placeholder="e.g. National Institute of Technology Karnataka (NITK)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Graduation Year (or Expected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[2023, 2024, 2025, 2026, 2027, 2028].map(year => {
                      const isSelected = onboardingData.education?.graduationYear === year;
                      return (
                        <button
                          key={year}
                          type="button"
                          onClick={() =>
                            setOnboardingData({
                              ...onboardingData,
                              education: { ...onboardingData.education!, graduationYear: year },
                            })
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prior Professional Experience */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Total Technical Experience
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Fresher / Student', years: 0 },
                      { label: '1 – 2 Years', years: 1 },
                      { label: '3 – 5 Years', years: 3 },
                      { label: '5+ Years', years: 5 },
                    ].map(exp => {
                      const isSelected = onboardingData.professional?.workExperienceYears === exp.years;
                      return (
                        <button
                          key={exp.label}
                          type="button"
                          onClick={() =>
                            setOnboardingData({
                              ...onboardingData,
                              professional: {
                                ...onboardingData.professional!,
                                workExperienceYears: exp.years,
                                experienceLevel:
                                  exp.years === 0
                                    ? 'Beginner'
                                    : exp.years <= 2
                                    ? 'Intermediate'
                                    : exp.years <= 4
                                    ? 'Advanced'
                                    : 'Senior / Specialist',
                              },
                            })
                          }
                          className={`p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {exp.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ STEP 3: Skills & Proficiency ════════ */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Your Technical Skills & Proficiency</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select the technologies you have experience with, and specify your current proficiency level.
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {(onboardingData.skills || []).length} Skills Added
                  </span>
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-800/60 rounded-xl border border-slate-700/60">
                {Object.keys(PRESET_SKILL_CATEGORIES).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveSkillCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeSkillCategory === cat
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skill chips in active category */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {PRESET_SKILL_CATEGORIES[activeSkillCategory].map(skill => {
                  const isSelected = (onboardingData.skills || []).some(
                    s => s.name.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleToggleSkill(skill, activeSkillCategory)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <span>{skill}</span>
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <span className="opacity-40">+</span>}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill form */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                  placeholder="Can't find your skill? Type here (e.g. Redis, PyTorch, Flutter)..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!customSkillInput.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 disabled:opacity-40"
                >
                  + Add Custom Skill
                </button>
              </form>

              {/* Selected Skills with interactive level selector */}
              {(onboardingData.skills || []).length > 0 && (
                <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Adjust Your Proficiency Level
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {(onboardingData.skills || []).map(s => (
                      <div
                        key={s.name}
                        className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-xs text-white block">{s.name}</span>
                          <span className="text-[10px] text-slate-400">{s.category}</span>
                        </div>
                        <div className="flex gap-1">
                          {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map(lvl => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleUpdateSkillLevel(s.name, lvl)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                                s.level === lvl
                                  ? 'bg-cyan-500 text-slate-950 font-black'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {lvl[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════ STEP 4: Domain Interests ════════ */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-white">Domain & Sector Interests</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select the domains that inspire you. We will recommend relevant electives, capstone projects, and specialized roadmaps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: 'Artificial Intelligence & Machine Learning',
                    desc: 'Supervised models, neural nets, predictive analytics & mathematical algorithms.',
                    icon: Cpu,
                    badge: 'High Demand',
                  },
                  {
                    name: 'Generative AI & LLM Systems',
                    desc: 'Prompt engineering, RAG pipelines, fine-tuning, embeddings & vector databases.',
                    icon: Sparkles,
                    badge: 'Trending',
                  },
                  {
                    name: 'Full-Stack & Cloud Applications',
                    desc: 'Modern web systems, high-throughput microservices, React 19, and cloud APIs.',
                    icon: Globe,
                    badge: 'Core Industry',
                  },
                  {
                    name: 'Cloud Architecture & DevOps',
                    desc: 'Docker containers, Kubernetes cluster ops, Terraform IAC & CI/CD delivery.',
                    icon: Layers,
                    badge: 'Enterprise',
                  },
                  {
                    name: 'Cybersecurity & Zero-Trust',
                    desc: 'Vulnerability mitigation, OAuth2 IAM, penetration defense & cryptographic proofs.',
                    icon: ShieldCheck,
                    badge: 'Critical Need',
                  },
                  {
                    name: 'Earth Sciences & Climate Informatics',
                    desc: 'Remote sensing, GIS spatial modeling, meteorological telemetry & ocean data.',
                    icon: Compass,
                    badge: 'National Lab',
                  },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = (onboardingData.interests || []).includes(item.name);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        const current = onboardingData.interests || [];
                        if (isSelected) {
                          setOnboardingData({
                            ...onboardingData,
                            interests: current.filter(i => i !== item.name),
                          });
                        } else {
                          setOnboardingData({
                            ...onboardingData,
                            interests: [...current, item.name],
                          });
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-900/40 to-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30'
                          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-300 group-hover:text-cyan-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs text-white mb-0.5">{item.name}</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════ STEP 5: Dream Career Goal & Target Company ════════ */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-white">Target Career Goal & Dream Company</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Specify the exact job title and dream organization you are striving toward. Your roadmap and skill gaps will be benchmarked against this standard.
                </p>
              </div>

              <div className="space-y-4">
                {/* Target Role selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Target Professional Role
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {POPULAR_TARGET_ROLES.map(r => {
                      const isSelected = onboardingData.careerGoal?.targetRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() =>
                            setOnboardingData({
                              ...onboardingData,
                              careerGoal: { ...onboardingData.careerGoal!, targetRole: r },
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md shadow-cyan-500/20'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={onboardingData.careerGoal?.targetRole || ''}
                    onChange={e =>
                      setOnboardingData({
                        ...onboardingData,
                        careerGoal: { ...onboardingData.careerGoal!, targetRole: e.target.value },
                      })
                    }
                    placeholder="Or enter a custom target title..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Dream Company selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Dream / Target Organization
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {POPULAR_COMPANIES.map(c => {
                      const isSelected = onboardingData.careerGoal?.dreamCompany === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() =>
                            setOnboardingData({
                              ...onboardingData,
                              careerGoal: { ...onboardingData.careerGoal!, dreamCompany: c },
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-400 font-black shadow-md shadow-indigo-600/30'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={onboardingData.careerGoal?.dreamCompany || ''}
                    onChange={e =>
                      setOnboardingData({
                        ...onboardingData,
                        careerGoal: { ...onboardingData.careerGoal!, dreamCompany: e.target.value },
                      })
                    }
                    placeholder="Or specify another company..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Target Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Target Completion Timeline
                    </label>
                    <select
                      value={onboardingData.careerGoal?.targetTimelineMonths || 6}
                      onChange={e =>
                        setOnboardingData({
                          ...onboardingData,
                          careerGoal: {
                            ...onboardingData.careerGoal!,
                            targetTimelineMonths: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value={3}>3 Months (Intensive Bootcamp Sprint)</option>
                      <option value={6}>6 Months (Recommended Standard)</option>
                      <option value={12}>12 Months (Comprehensive Mastery)</option>
                      <option value={24}>24 Months (Deep Architectural Specialization)</option>
                    </select>
                  </div>

                  {/* Weekly Hours */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        Dedicated Weekly Hours
                      </label>
                      <span className="text-xs font-bold text-cyan-400">
                        {onboardingData.careerGoal?.weeklyLearningHours || 12} hrs / week
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={30}
                      step={2}
                      value={onboardingData.careerGoal?.weeklyLearningHours || 12}
                      onChange={e =>
                        setOnboardingData({
                          ...onboardingData,
                          careerGoal: {
                            ...onboardingData.careerGoal!,
                            weeklyLearningHours: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>4 hrs (Casual)</span>
                      <span>12 hrs (Balanced)</span>
                      <span>30 hrs (Full-time)</span>
                    </div>
                  </div>
                </div>

                {/* Pitch Preview statement */}
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300">
                  <span className="text-slate-500 font-bold block mb-1">Your Career Statement Pitch:</span>
                  <span className="font-semibold text-cyan-300">
                    "Prepare to transition into an Enterprise {onboardingData.careerGoal?.targetRole || 'Data Scientist'} at {onboardingData.careerGoal?.dreamCompany || 'Microsoft'} in {onboardingData.careerGoal?.targetTimelineMonths || 6} months."
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ════════ STEP 6: Learning Preferences ════════ */}
          {step === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-white">Learning Preferences & Style</h2>
                <p className="text-xs text-slate-400 mt-1">
                  How do you learn best? We adapt course delivery, practical coding tasks, and project milestones to your learning style.
                </p>
              </div>

              <div className="space-y-4">
                {/* Learning Format */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Primary Learning Format
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        title: 'Hands-on Coding & Labs',
                        desc: 'Interactive code notebooks, sandbox exercises, and terminal debugging.',
                        icon: Code,
                      },
                      {
                        title: 'Interactive Video & Lectures',
                        desc: 'Bite-sized visual walkthroughs with checkpoint quizzes and slides.',
                        icon: PlayCircle,
                      },
                      {
                        title: 'Architectural Deep Reads',
                        desc: 'Engineering whitepapers, RFC specifications, and system design case studies.',
                        icon: BookOpen,
                      },
                      {
                        title: 'Live Sprints & Mentorship',
                        desc: 'Live group reviews, peer discussion forums, and rubric evaluations.',
                        icon: Trophy,
                      },
                    ].map(f => {
                      const isSelected = onboardingData.learningPreferences?.format === f.title;
                      const Icon = f.icon;
                      return (
                        <button
                          key={f.title}
                          type="button"
                          onClick={() =>
                            setOnboardingData({
                              ...onboardingData,
                              learningPreferences: {
                                ...onboardingData.learningPreferences!,
                                format: f.title,
                              },
                            })
                          }
                          className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-white shadow'
                              : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
                          <div>
                            <span className="font-bold text-xs block">{f.title}</span>
                            <span className="text-[11px] text-slate-400">{f.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Pace */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Curriculum Pacing Baseline
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { title: 'Gentle / Foundations', desc: 'Focus on core syntax & basic concepts first' },
                      { title: 'Standard / Balanced', desc: 'Industry-standard pace with real-world mini-tasks' },
                      { title: 'Intensive / Fast', desc: 'Steep challenge curve with full-scale architectures' },
                    ].map(p => {
                      const isSelected = onboardingData.learningPreferences?.level?.includes(p.title.split(' ')[0]);
                      return (
                        <button
                          key={p.title}
                          type="button"
                          onClick={() =>
                            setOnboardingData({
                              ...onboardingData,
                              learningPreferences: {
                                ...onboardingData.learningPreferences!,
                                level: p.title.split(' ')[0] as any,
                              },
                            })
                          }
                          className={`p-3 rounded-xl border text-center transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md font-bold'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <span className="text-xs font-bold block mb-1">{p.title}</span>
                          <span className="text-[10px] text-slate-400">{p.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ STEP 7: Skill Assessment & Snapshot ════════ */}
          {step === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white">Baseline Skill Diagnostic</h2>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    5 Quick Questions
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Answer these 5 technical diagnostic questions to generate your instant Skill Snapshot and calculate verified gaps.
                </p>
              </div>

              {/* Questions List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {DIAGNOSTIC_QUESTIONS.map((q, qIndex) => {
                  const selectedOption = assessmentAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/70 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-cyan-400">
                          Q{qIndex + 1}. {q.domain}
                        </span>
                        <span className="text-[10px] text-slate-400">1 Mark</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200">{q.question}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = selectedOption === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() =>
                                setAssessmentAnswers({
                                  ...assessmentAnswers,
                                  [q.id]: optIdx,
                                })
                              }
                              className={`p-2.5 rounded-xl text-left text-xs font-medium border transition flex items-center gap-2 ${
                                isPicked
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                                  isPicked
                                    ? 'bg-cyan-500 text-slate-950 border-cyan-500 font-black'
                                    : 'border-slate-500'
                                }`}
                              >
                                {isPicked ? '✓' : String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submission status or loader */}
              {isGeneratingRoadmap && (
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-2 animate-pulse">
                  <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-cyan-300">
                    Calibrating your diagnostic profile & synthesizing customized 6-stage roadmap...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ════════ STEP 8: WOW MOMENT — Roadmap Reveal Screen ════════ */}
          {step === 8 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Confetti celebration header */}
              <div className="text-center space-y-2 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Personalized Roadmap Generated Successfully</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Your Learning Journey is Ready!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  Based on your diagnostic score and target role of{' '}
                  <span className="font-bold text-cyan-300">
                    {onboardingData.careerGoal?.targetRole}
                  </span>{' '}
                  at{' '}
                  <span className="font-bold text-cyan-300">
                    {onboardingData.careerGoal?.dreamCompany}
                  </span>
                  , SkillSync has created a 6-stage verified roadmap.
                </p>
              </div>

              {/* Milestone & XP Award Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
                      Welcome Bonus
                    </span>
                    <span className="font-black text-white text-base">+150 XP Earned</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-300 font-extrabold uppercase tracking-wider block">
                      Diagnostic Baseline
                    </span>
                    <span className="font-black text-white text-base">
                      {assessmentScore > 0 ? `${assessmentScore}% Score` : 'Calibrated'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 text-white font-black flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-wider block">
                      Roadmap Scale
                    </span>
                    <span className="font-black text-white text-base">
                      6 Verified Stages
                    </span>
                  </div>
                </div>
              </div>

              {/* 6-Stage Roadmap Timeline Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Your 6-Stage Roadmap Timeline</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Target Timeline: {onboardingData.careerGoal?.targetTimelineMonths || 6} Months
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(generatedRoadmap?.stages || [
                    { order: 1, title: 'Stage 1: Foundational Programming & OOP', pointsAvailable: 150, status: 'in_progress', skills: ['Python / TS', 'Algorithms'] },
                    { order: 2, title: 'Stage 2: High-Performance Tabular Queries & SQL', pointsAvailable: 200, status: 'locked', skills: ['SQL', 'Pandas'] },
                    { order: 3, title: 'Stage 3: Statistical Modeling & Inference', pointsAvailable: 250, status: 'locked', skills: ['A/B Testing', 'Probability'] },
                    { order: 4, title: 'Stage 4: Supervised & Unsupervised Machine Learning', pointsAvailable: 300, status: 'locked', skills: ['Scikit-Learn', 'Ensembles'] },
                    { order: 5, title: 'Stage 5: Production Containerization & MLOps', pointsAvailable: 350, status: 'locked', skills: ['Docker', 'FastAPI'] },
                    { order: 6, title: 'Stage 6: Generative AI, RAG & Capstone Defense', pointsAvailable: 500, status: 'locked', skills: ['PyTorch', 'Vector DBs'] },
                  ]).map((st: any) => (
                    <div
                      key={st.order}
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        st.order === 1
                          ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-cyan-500/80 shadow-md'
                          : 'bg-slate-800/40 border-slate-700/50 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                            st.order === 1
                              ? 'bg-cyan-500 text-slate-950 shadow-sm'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {st.order}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white block leading-tight truncate max-w-[200px]">
                            {st.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            +{st.pointsAvailable} XP • {st.skills ? st.skills.slice(0, 2).join(', ') : 'Core Skills'}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          st.order === 1
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {st.order === 1 ? 'Current' : 'Locked'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Courses from Real Excel Catalogue */}
              {recommendedCourses.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Recommended Real Catalogue Courses (Ingested from Excel)</span>
                    </h3>
                    <span className="text-[10px] text-cyan-400 font-semibold">
                      Verified Curriculum
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {recommendedCourses.map((match, idx) => (
                      <div
                        key={match.course.id || idx}
                        className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex flex-col justify-between hover:border-cyan-500/60 transition group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                            <span className="truncate max-w-[120px] font-semibold text-cyan-400">
                              {match.course.sector || 'General'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                              {match.matchPercentage}% Match
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 line-clamp-2 leading-snug">
                            {match.course.name || match.course.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                            {match.course.description || match.recommendationReason}
                          </p>
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{match.course.duration || 'Self-Paced'}</span>
                          <span className="font-bold text-slate-300">{match.course.level || 'Intermediate'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 mt-8 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1 || completeMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 transition disabled:opacity-20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={completeMutation.isPending || isGeneratingRoadmap}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>
                {step === 7
                  ? 'Submit Assessment & Reveal Roadmap'
                  : step === 8
                  ? completeMutation.isPending
                    ? 'Launching Dashboard...'
                    : 'Start My Learning Journey →'
                  : 'Continue'}
              </span>
              {step < 8 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>

      {/* Footer credits */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-4 text-center text-slate-500 text-[11px] z-10">
        SkillSync National Learning & Competency Architecture • Smart India Hackathon 2026
      </footer>
    </div>
  );
}
