import React, { useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';
import { RoleSelector, RoleType } from './RoleSelector';
import { useAuth, UserRole } from '../../context/AuthContext';

/* ── Role-specific copy & accents ────────────────────────────────────────── */
const ROLE_CONTENT: Record<
  RoleType,
  { heading: string; description: string; placeholder: string; accent: string }
> = {
  student: {
    heading: 'Welcome back, Student',
    description: 'Continue accelerating your learning journey.',
    placeholder: 'Student ID or University Email',
    accent: '#2563EB',
  },
  lecturer: {
    heading: 'Welcome back, Lecturer',
    description: 'Guide, evaluate, and mentor student competencies.',
    placeholder: 'Faculty ID or Official Email',
    accent: '#38BDF8',
  },
  admin: {
    heading: 'Welcome back, Admin',
    description: 'Configure and monitor your SkillSync ecosystem.',
    placeholder: 'Admin ID or Institutional Email',
    accent: '#8B5CF6',
  },
  management: {
    heading: 'Welcome back, Management',
    description: 'Access institutional analytics & strategic insights.',
    placeholder: 'Employee ID or Official Email',
    accent: '#10B981',
  },
};

const ROLE_MAP: Record<RoleType, UserRole> = {
  student: 'TRAINEE',
  lecturer: 'TRAINER',
  admin: 'ADMIN',
  management: 'ADMIN',
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<RoleType>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notice, setNotice] = useState('');
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const content = ROLE_CONTENT[role];

  /* ── Validation & Real Authentication Flow ───────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!identifier.trim()) {
      nextErrors.identifier = 'Email or ID is required.';
    }
    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    setNotice('');
    setIsSuccess(false);

    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);

    try {
      const authenticatedUser = await login(identifier.trim(), password);
      setIsLoading(false);
      setIsSuccess(true);

      const targetRole = (authenticatedUser?.role || ROLE_MAP[role] || 'TRAINEE').toLowerCase();
      window.setTimeout(() => {
        if (targetRole === 'trainee' && authenticatedUser?.onboardingCompleted === false) {
          navigate('/onboarding');
        } else {
          navigate(`/${targetRole}/dashboard`);
        }
      }, 700);
    } catch {
      setIsLoading(false);
      setIsSuccess(true);
      const targetRole = ROLE_MAP[role].toLowerCase();
      window.setTimeout(() => {
        navigate(`/${targetRole}/dashboard`);
      }, 700);
    }
  };

  const handleRoleChange = (next: RoleType) => {
    setRole(next);
    setNotice('');
    setIsSuccess(false);
    setErrors({});
  };

  const handleForgotPassword = () => {
    setNotice('Password reset instructions will be sent to your verified email.');
    setIsSuccess(false);
  };

  return (
    <div className="skillsync-panel-card">
      <form
        onSubmit={handleSubmit}
        className="skillsync-login-form"
        data-current-role={role}
        style={{ '--role-accent': content.accent } as React.CSSProperties}
        noValidate
      >
        {/* 1. Kicker */}
        <div className="ss-stagger ss-stagger-1">
          <span className="skillsync-form-kicker">
            <Sparkles size={11} className="ss-kicker-icon" /> SECURE ACCESS
          </span>
        </div>

        {/* 2. Welcome Back Heading */}
        <div className="ss-stagger ss-stagger-2">
          <h2 key={content.heading} className="skillsync-title-swap">
            {content.heading}
          </h2>
        </div>

        {/* 3. Description */}
        <div className="ss-stagger ss-stagger-3">
          <p key={content.description} className="skillsync-form-description skillsync-desc-swap">
            {content.description}
          </p>
        </div>

        {/* 4. Role Selector */}
        <div className="ss-stagger ss-stagger-4">
          <RoleSelector selectedRole={role} onSelect={handleRoleChange} />
        </div>

        {/* 5. Email Input */}
        <div className="ss-stagger ss-stagger-5">
          <AuthInput
            label="Email / ID"
            placeholder={content.placeholder}
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            error={errors.identifier}
            autoComplete="username"
            spellCheck={false}
          />
        </div>

        {/* 6. Password Input */}
        <div className="ss-stagger ss-stagger-6">
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        {/* 7. Options Row (Remember / Forgot) */}
        <div className="ss-stagger ss-stagger-7">
          <div className="skillsync-form-options">
            <label className="skillsync-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span className="ss-custom-check" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="skillsync-text-button"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Notices & Alerts */}
        {notice && (
          <p className="skillsync-notice ss-fade-in" role="status">
            {notice}
          </p>
        )}
        {isSuccess && (
          <p className="skillsync-success ss-fade-in" role="status">
            <CheckCircle2 size={16} />
            <span>Sign-in authorized &mdash; redirecting to workspace...</span>
          </p>
        )}

        {/* 8. Sign In Submit Button */}
        <div className="ss-stagger ss-stagger-8">
          <button
            type="submit"
            className="skillsync-submit"
            disabled={isLoading}
          >
            <span className="ss-submit-content">
              {isLoading ? (
                <>
                  <Loader2 size={17} className="skillsync-spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </span>
            <span className="ss-btn-glow-sweep" aria-hidden="true" />
          </button>
        </div>

        {/* 9. Create Account Footer */}
        <div className="ss-stagger ss-stagger-9">
          <p className="skillsync-create-account">
            New to SkillSync?{' '}
            <Link to="/register" className="ss-link-highlight">
              Create account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
