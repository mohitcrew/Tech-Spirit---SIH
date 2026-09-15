import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  GraduationCap,
  Layers,
  Target,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

export const Login: React.FC = () => {
  return <AuthUnified defaultTab="login" />;
};

export const Register: React.FC = () => {
  return <AuthUnified defaultTab="register" />;
};

interface AuthUnifiedProps {
  defaultTab?: 'login' | 'register';
}

const AuthUnified: React.FC<AuthUnifiedProps> = ({ defaultTab = 'login' }) => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // URL parameters for context preservation
  const urlTab = searchParams.get('tab') === 'register' ? 'register' : (defaultTab || 'login');
  const roleParam = searchParams.get('role')?.toUpperCase() as UserRole | undefined;
  const redirectParam = searchParams.get('redirect');
  const intentParam = searchParams.get('intent');

  const [tab, setTab] = useState<'login' | 'register'>(urlTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>(roleParam || 'TRAINEE');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-fill demo credentials if role param passed
  useEffect(() => {
    if (roleParam === 'ADMIN') {
      setEmail('admin@skillsync.demo');
      setPassword('Demo@12345');
      setSelectedRole('ADMIN');
    } else if (roleParam === 'TRAINER') {
      setEmail('trainer@skillsync.demo');
      setPassword('Demo@12345');
      setSelectedRole('TRAINER');
    } else if (roleParam === 'TRAINEE') {
      setEmail('priya.sharma@skillsync.demo');
      setPassword('Demo@12345');
      setSelectedRole('TRAINEE');
    }
  }, [roleParam]);

  const handleSuccessfulAuth = (authenticatedRole: UserRole) => {
    if (redirectParam) {
      navigate(redirectParam);
    } else {
      navigate(`/${authenticatedRole.toLowerCase()}/dashboard`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const targetEmail = email.trim() || `${selectedRole.toLowerCase()}@skillsync.demo`;
      const targetPassword = password || 'Demo@12345';
      const u = await login(targetEmail, targetPassword);
      handleSuccessfulAuth(u.role);
    } catch {
      setError('Unable to authenticate. Please check your credentials or use 1-Click Demo Login below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setError('');
    setLoading(true);
    const demoEmails: Record<UserRole, string> = {
      TRAINEE: 'priya.sharma@skillsync.demo',
      TRAINER: 'vikram.rao@skillsync.demo',
      ADMIN: 'rajesh.verma@skillsync.demo',
    };
    try {
      const u = await login(demoEmails[role], 'Demo@12345');
      handleSuccessfulAuth(u.role);
    } catch {
      setError('Error logging into demo persona.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Ambience & Glow Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* ── LEFT COLUMN: Brand Identity & Value Props (Desktop) ────────── */}
      <div className="lg:w-5/12 xl:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl relative z-10">
        <div>
          {/* Top Brand Link */}
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="https://res.cloudinary.com/djmqwehwk/image/upload/v1789454602/Skill_Sync_WB_ehnf16.png"
                    alt="SkillSync Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <div className="font-black text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                  <span>Skill</span>
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Sync
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    SIH 2026
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
                  Capacity Intelligence
                </p>
              </div>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </Link>
          </div>

          {/* Hero Pitch */}
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>From Learning Management to Capacity Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Build Skills. <br />
              Grow Competencies. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Shape Your Future.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              SkillSync connects roles, skills, competencies, learning opportunities, trainers, assessments, and outcomes into one unified intelligence ecosystem.
            </p>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 sm:mt-10">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <Target className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-white">Competency-Driven</div>
              <p className="text-xs text-slate-400 mt-1">
                Beyond static course completion: measure observable applied capability.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-white">Continuous Gap Analysis</div>
              <p className="text-xs text-slate-400 mt-1">
                Targeted AI diagnostics to pinpoint and close workforce readiness gaps.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-white">Extensible Engine</div>
              <p className="text-xs text-slate-400 mt-1">
                Demonstrated on IT systems; decoupled for Meteorology, Ocean, & Polar Science.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-white">Verifiable Outcomes</div>
              <p className="text-xs text-slate-400 mt-1">
                Objective assessments, accredited badges, and trainer endorsement.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Smart India Hackathon 2026 Evaluation Prototype</span>
          </div>
          <span>v2.4 Production-Ready</span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Single Unified Auth Card ────────────────────── */}
      <div className="lg:w-7/12 xl:w-1/2 p-6 sm:p-10 lg:p-14 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-6">

          {/* Context Intent Banner (if user came from an action like "Enroll" or "Analyze Gap") */}
          {intentParam && (
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-white">Action Reserved</div>
                <div className="text-slate-300 mt-0.5">
                  Sign in or create an account to <span className="font-semibold text-cyan-300">{intentParam}</span>.
                </div>
              </div>
            </div>
          )}

          {/* Role Access Banner (if user came from [Go to Portal (Trainee)]) */}
          {roleParam && !intentParam && (
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3 animate-fadeIn">
              <GraduationCap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white">Portal Access: </span>
                <span className="text-indigo-200">
                  {roleParam === 'TRAINEE' ? 'Trainee / Learner Workspace' : roleParam === 'TRAINER' ? 'Trainer / Educator Workspace' : 'Organization Admin Workspace'}
                </span>
              </div>
            </div>
          )}

          {/* Main Auth Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Top Tab Switcher */}
            <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tab === 'login'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tab === 'register'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Free Account
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {tab === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {tab === 'login'
                  ? 'Enter your credentials or select a 1-click demo persona below'
                  : 'Join SkillSync to start mapping and building your competencies'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Your Primary Role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { r: 'TRAINEE' as UserRole, label: 'Learner', icon: GraduationCap },
                        { r: 'TRAINER' as UserRole, label: 'Trainer', icon: Briefcase },
                        { r: 'ADMIN' as UserRole, label: 'Org Admin', icon: Building2 },
                      ].map(({ r, label, icon: Icon }) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSelectedRole(r)}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            selectedRole === r
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Institution / Organization
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Digital Learning Institute"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tab === 'login' ? 'priya.sharma@skillsync.demo' : 'your.email@organization.edu'}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Password
                  </label>
                  {tab === 'login' && (
                    <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 select-none cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{tab === 'login' ? 'Sign In to Portal' : 'Create Free Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* ── SIH 2026 QUICK DEMO ACCESS (1-CLICK PERSONAS) ────────── */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Hackathon Personas</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-bold">Instant Login</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Trainee Demo */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('TRAINEE')}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/80 hover:bg-blue-950/20 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-blue-400">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Trainee</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">Priya Sharma</div>
                  <div className="text-[9px] text-blue-400/80 mt-1 font-semibold flex items-center gap-0.5">
                    <span>Enter</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </button>

                {/* Trainer Demo */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('TRAINER')}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/80 hover:bg-indigo-950/20 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-indigo-400">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Trainer</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">Prof. Vikram Rao</div>
                  <div className="text-[9px] text-indigo-400/80 mt-1 font-semibold flex items-center gap-0.5">
                    <span>Enter</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </button>

                {/* Admin Demo */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('ADMIN')}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/80 hover:bg-cyan-950/20 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-cyan-400">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Admin</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">Dr. Rajesh Verma</div>
                  <div className="text-[9px] text-cyan-400/80 mt-1 font-semibold flex items-center gap-0.5">
                    <span>Enter</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Toggle Note */}
            <div className="mt-6 text-center text-xs text-slate-400">
              {tab === 'login' ? (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="font-bold text-blue-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
                  >
                    Create Free Account
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="font-bold text-blue-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};