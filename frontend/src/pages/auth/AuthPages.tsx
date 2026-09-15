import React, { useEffect } from 'react';
import { AuthBackground } from '../../components/auth/AuthBackground';
import { AuthVisual }     from '../../components/auth/AuthVisual';
import { LoginForm }      from '../../components/auth/LoginForm';
import { Zap, Sun, Moon } from 'lucide-react';
import { useTheme }       from '../../context/ThemeContext';
import '../../styles/auth.css';

/* ── /login ──────────────────────────────────────────────────────────────── */
export function Login() {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="skillsync-auth">
      {/* Global Theme Toggle for Auth View */}
      <button
        type="button"
        onClick={toggleTheme}
        className="skillsync-auth-theme-toggle"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Moon size={18} className="skillsync-theme-icon-moon" />
        ) : (
          <Sun size={18} className="skillsync-theme-icon-sun" />
        )}
      </button>

      {/* Full-page atmospheric background */}
      <AuthBackground />

      <div className="skillsync-login">
        {/* Left — visual identity (hidden on mobile) */}
        <AuthVisual />

        {/* Right — authentication panel */}
        <section
          className="skillsync-panel"
          aria-label="SkillSync sign in"
        >
          {/* Mobile-only brand header */}
          <div className="skillsync-mobile-brand">
            <div className="skillsync-mobile-brand-icon">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <span className="skillsync-mobile-brand-text">SkillSync</span>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  );
}

/* ── /register ───────────────────────────────────────────────────────────── */
export function Register() {
  return <Login />;
}

