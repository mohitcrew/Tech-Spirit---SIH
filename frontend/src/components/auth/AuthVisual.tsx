import React, { useEffect, useState } from 'react';
import { Zap, Target, Compass, BarChart3, CheckCircle2 } from 'lucide-react';

interface LanguageNode {
  id: string;
  name: string;
  accent: string;
  dotColor: string;
  startPos: { x: number; y: number }; // Percentage in Left Half (0-100)
  delay: string;
}

const LANGUAGES: LanguageNode[] = [
  { id: 'c',          name: 'C',          accent: '#38BDF8', dotColor: '#38BDF8', startPos: { x: 18, y: 16 }, delay: '0.5s' },
  { id: 'cpp',        name: 'C++',        accent: '#2563EB', dotColor: '#2563EB', startPos: { x: 50, y: 12 }, delay: '0.7s' },
  { id: 'java',       name: 'Java',       accent: '#F59E0B', dotColor: '#F59E0B', startPos: { x: 82, y: 18 }, delay: '0.9s' },
  { id: 'python',     name: 'Python',     accent: '#06B6D4', dotColor: '#06B6D4', startPos: { x: 12, y: 46 }, delay: '0.6s' },
  { id: 'javascript', name: 'JavaScript', accent: '#F59E0B', dotColor: '#F59E0B', startPos: { x: 18, y: 68 }, delay: '1.1s' },
  { id: 'typescript', name: 'TypeScript', accent: '#38BDF8', dotColor: '#38BDF8', startPos: { x: 86, y: 45 }, delay: '0.8s' },
  { id: 'react',      name: 'React',      accent: '#06B6D4', dotColor: '#06B6D4', startPos: { x: 22, y: 84 }, delay: '1.3s' },
  { id: 'sql',        name: 'SQL',        accent: '#8B5CF6', dotColor: '#8B5CF6', startPos: { x: 50, y: 88 }, delay: '1.0s' },
  { id: 'html',       name: 'HTML',       accent: '#F59E0B', dotColor: '#F59E0B', startPos: { x: 78, y: 82 }, delay: '1.4s' },
  { id: 'css',        name: 'CSS',        accent: '#2563EB', dotColor: '#2563EB', startPos: { x: 84, y: 65 }, delay: '1.2s' },
];

export const AuthVisual: React.FC = () => {
  const [animationSettled, setAnimationSettled] = useState(false);

  useEffect(() => {
    // Transition to final settled state after intro animation completes (6.0s)
    const timer = setTimeout(() => {
      setAnimationSettled(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`skillsync-visual ${animationSettled ? 'is-settled' : 'is-animating'}`} aria-label="SkillSync Convergence & Vision">
      
      {/* ── STAGE 1: 10 MULTI-DIRECTIONAL PROGRAMMING LANGUAGES CONVERGENCE ── */}
      {!animationSettled && (
        <div className="skillsync-convergence-stage" aria-hidden="true">
          {/* Dynamic SVG Connecting Convergence Beams (Visible only during 2.2s - 3.8s) */}
          <svg className="ss-convergence-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {LANGUAGES.map(lang => (
              <line
                key={`beam-${lang.id}`}
                x1={lang.startPos.x}
                y1={lang.startPos.y}
                x2="50"
                y2="50"
                className={`ss-beam-line ss-beam-${lang.id}`}
              />
            ))}
          </svg>

          {/* Central Collision Hub & Energy Shockwave */}
          <div className="ss-convergence-hub">
            <div className="ss-hub-burst-ring" />
            <div className="ss-hub-glow-core" />
            <div className="ss-hub-sparks">
              <span className="ss-spark sp1" />
              <span className="ss-spark sp2" />
              <span className="ss-spark sp3" />
              <span className="ss-spark sp4" />
              <span className="ss-spark sp5" />
              <span className="ss-spark sp6" />
            </div>
          </div>

          {/* 10 Scattered Language Pills Moving Inward */}
          {LANGUAGES.map(lang => (
            <div
              key={lang.id}
              className={`ss-lang-node ss-lang-${lang.id}`}
              style={{
                '--start-x': `${lang.startPos.x}%`,
                '--start-y': `${lang.startPos.y}%`,
                '--node-accent': lang.accent,
                '--node-delay': lang.delay,
              } as React.CSSProperties}
            >
              <div className="ss-lang-pill">
                <span className="ss-lang-dot" style={{ backgroundColor: lang.dotColor }} />
                <span className="ss-lang-name">{lang.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── STAGE 2: FINAL HERO PRESENTATION (Appears seamlessly after convergence) ── */}
      <div className="skillsync-final-hero">
        
        {/* Top Wordmark / Logo */}
        <div className="skillsync-hero-brand">
          <div className="skillsync-hero-brand-inner">
            <div className="skillsync-hero-brand-icon">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <span className="skillsync-hero-brand-text">SkillSync</span>
          </div>
          <span className="skillsync-hero-kicker">WHERE SKILLS COME TOGETHER</span>
        </div>

        {/* Hero Headline */}
        <div className="skillsync-hero-headline-wrap">
          <h1 className="skillsync-hero-headline">
            Where Skills <br />
            <span className="ss-gradient-hero-text">Come Together.</span>
          </h1>
          <p className="skillsync-hero-lead">
            A unified intelligence platform connecting students, lecturers, administrators, and management to identify skill gaps, track competency, and accelerate career-ready growth.
          </p>
        </div>

        {/* 3 Compact Feature Pillars */}
        <div className="skillsync-feature-pillars">
          <div className="ss-feature-pillar p-assess">
            <div className="ss-pillar-icon">
              <Target size={15} strokeWidth={2.2} />
            </div>
            <div className="ss-pillar-content">
              <strong>ASSESS</strong>
              <small>Identify skill strengths &amp; gaps</small>
            </div>
          </div>

          <div className="ss-feature-pillar p-develop">
            <div className="ss-pillar-icon">
              <Compass size={15} strokeWidth={2.2} />
            </div>
            <div className="ss-pillar-content">
              <strong>DEVELOP</strong>
              <small>Build personalized learning paths</small>
            </div>
          </div>

          <div className="ss-feature-pillar p-track">
            <div className="ss-pillar-icon">
              <BarChart3 size={15} strokeWidth={2.2} />
            </div>
            <div className="ss-pillar-content">
              <strong>TRACK</strong>
              <small>Measure competency growth</small>
            </div>
          </div>
        </div>

        {/* Final Tagline Footer */}
        <div className="skillsync-hero-footer-bar">
          <span className="ss-tag-item">Learn</span>
          <span className="ss-tag-sep">&bull;</span>
          <span className="ss-tag-item">Develop</span>
          <span className="ss-tag-sep">&bull;</span>
          <span className="ss-tag-item">Measure</span>
          <span className="ss-tag-sep">&bull;</span>
          <span className="ss-tag-item ss-tag-grow">Grow</span>
        </div>

      </div>

    </section>
  );
};