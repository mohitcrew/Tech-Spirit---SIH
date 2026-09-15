import React, { useEffect } from 'react';
import { AuthBackground } from '../../components/auth/AuthBackground';
import { AuthVisual }     from '../../components/auth/AuthVisual';
import { LoginForm }      from '../../components/auth/LoginForm';
import { Zap }            from 'lucide-react';
import '../../styles/auth.css';

/* ── /login ──────────────────────────────────────────────────────────────── */
export function Login() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="skillsync-auth">
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
