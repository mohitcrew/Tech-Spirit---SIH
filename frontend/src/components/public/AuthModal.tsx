import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  intent?: string; // e.g. "enroll in Full Stack Development", "analyze your competency gaps"
  redirectTarget?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  intent = 'enroll in courses and track your capacity growth',
  redirectTarget,
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(
        email || (tab === 'register' ? 'learner@skillsync.demo' : 'trainee@capacityconnect.demo'),
        password || 'Demo@12345'
      );
      onClose();
      if (redirectTarget) {
        navigate(redirectTarget);
      } else {
        navigate(`/${user.role.toLowerCase()}/dashboard`);
      }
    } catch {
      setError('Invalid credentials. In prototype mode, any demo email will grant access.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    const user = await login('mohit199189@gmail.com', 'Mohit@2006.');
    onClose();
    if (redirectTarget) {
      navigate(redirectTarget);
    } else {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-white relative">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              SkillSync Gateway
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="font-extrabold text-lg text-white">
            {tab === 'register' ? 'Create Your Free Account' : 'Welcome Back to SkillSync'}
          </h3>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Create an account to <span className="font-bold text-white underline decoration-cyan-400">{intent}</span>.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-950">
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-xs font-bold transition-all text-center border-b-2 ${
              tab === 'register'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-xs font-bold transition-all text-center border-b-2 ${
              tab === 'login'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. A Mohit"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{tab === 'register' ? 'Join SkillSync & Continue' : 'Sign In & Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick 1-Click Prototype Demo Sign-in */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant SIH 2026 Evaluator Demo Access</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
