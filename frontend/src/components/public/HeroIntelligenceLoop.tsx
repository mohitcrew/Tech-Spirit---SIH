import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, TrendingUp, Target, Layers, Users, Award, RefreshCw
} from 'lucide-react';

interface HeroIntelligenceLoopProps {
  onExploreClick: () => void;
  onRegisterClick: () => void;
  onOpenAi: () => void;
}

const HEADING_WORDS = [
  { text: 'Build', isGradient: false, dirClass: 'word-dir-topleft' },
  { text: 'Skills.', isGradient: false, dirClass: 'word-dir-top' },
  { text: 'Grow', isGradient: true, dirClass: 'word-dir-topright' },
  { text: 'Competencies.', isGradient: true, dirClass: 'word-dir-left' },
  { text: 'Shape', isGradient: false, dirClass: 'word-dir-right' },
  { text: 'Your', isGradient: false, dirClass: 'word-dir-bottomright' },
  { text: 'Future.', isGradient: false, dirClass: 'word-dir-bottom' },
];

export const HeroIntelligenceLoop: React.FC<HeroIntelligenceLoopProps> = ({
  onExploreClick,
  onRegisterClick,
  onOpenAi,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // 1. Scroll-triggered entrance for Intelligence Loop (runs once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. Passive scroll tracking for subtle Hero cinematic response
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY <= 700) {
            setScrollY(window.scrollY);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loopNodes = [
    { label: 'Role', sub: 'Target Capability', icon: Target, animClass: 'card-anim-role-bottom', hoverClass: 'hover-role', iconClass: '' },
    { label: 'Competencies', sub: 'Behavior & Output', icon: Award, animClass: 'card-anim-comp-left', hoverClass: 'hover-comp', iconClass: 'icon-comp icon-trans' },
    { label: 'Skills', sub: 'Tools & Methods', icon: Layers, animClass: 'card-anim-skills-bottomright', hoverClass: 'hover-skills', iconClass: 'icon-skills icon-trans' },
    { label: 'Skill Gap', sub: 'Calculated Variance', icon: RefreshCw, animClass: 'card-anim-gap-right', hoverClass: 'hover-gap', iconClass: '' },
    { label: 'Learning Path', sub: 'Targeted Curricula', icon: TrendingUp, animClass: 'card-anim-path-scale', hoverClass: 'hover-path', iconClass: 'icon-path icon-trans' },
    { label: 'Trainer', sub: 'Domain Mentors', icon: Users, animClass: 'card-anim-trainer-rotate', hoverClass: 'hover-trainer', iconClass: 'icon-trainer icon-trans' },
    { label: 'Assessment', sub: 'Verified Evaluation', icon: CheckCircle2, animClass: 'card-anim-assess-up', hoverClass: 'hover-assess', iconClass: 'icon-assess icon-trans' },
    { label: 'Improvement', sub: 'Capacity Metric', icon: Sparkles, animClass: 'card-anim-improve-blur', hoverClass: 'hover-improve', iconClass: 'icon-improve icon-trans' },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-24 border-b border-slate-850">
      {/* Background Subtle Living Atmospheric Glows */}
      <div
        style={{
          transform: `translate(calc(-50% + ${scrollY * 0.04}px), -${scrollY * 0.06}px)`,
        }}
        className="absolute top-1/4 left-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none ambient-orb-1"
      />
      <div
        style={{
          transform: `translate(-${scrollY * 0.05}px, ${scrollY * 0.04}px)`,
        }}
        className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none ambient-orb-2"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Hero Text */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          {/* 1. Hero Badge with subtle scale & fade entrance + soft scroll drift */}
          <div
            style={{
              transform: `translateY(-${Math.min(scrollY * 0.05, 12)}px)`,
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-750 text-xs font-bold text-cyan-300 shadow-sm backdrop-blur-md hero-badge-anim"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>✦ Intelligent Learning & Capacity Platform</span>
          </div>

          {/* 2. Hero Heading Controlled 3-Line Symmetrical Assembly */}
          <h1
            style={{
              opacity: Math.max(1 - (scrollY / 850) * 0.25, 0.75),
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.18] text-center mx-auto select-none"
          >
            {/* Line 1: Build Skills. Grow */}
            <span className="block mb-1 sm:mb-1.5">
              <span className="hero-word-build-skills mr-2 sm:mr-3 text-slate-900 dark:text-white">
                Build Skills.
              </span>
              <span className="hero-word-grow">
                <span className="hero-gradient-text-anim">Grow</span>
              </span>
            </span>

            {/* Line 2: Competencies. Shape Your */}
            <span className="block mb-1 sm:mb-1.5">
              <span className="hero-word-competencies mr-2 sm:mr-3">
                <span className="hero-gradient-text-anim">Competencies.</span>
              </span>
              <span className="hero-word-shape-your text-slate-900 dark:text-white">
                Shape Your
              </span>
            </span>

            {/* Line 3: Future. */}
            <span className="block">
              <span className="hero-word-future text-slate-900 dark:text-white">
                Future.
              </span>
            </span>
          </h1>

          {/* 4. Hero Description Slide Up with soft scroll fade */}
          <p
            style={{
              opacity: Math.max(1 - (scrollY / 850) * 0.3, 0.7),
            }}
            className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto hero-desc-anim"
          >
            SkillSync connects your goals, skills, competencies, learning opportunities, trainers, and progress into one intelligent capacity-building experience.
          </p>

          {/* 5. Action CTAs */}
          <div
            style={{
              opacity: Math.max(1 - (scrollY / 850) * 0.35, 0.65),
            }}
            className="pt-3 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 group hero-btn-explore-anim cursor-pointer"
            >
              <span>Explore SkillSync</span>
              <ArrowRight className="w-4 h-4 btn-arrow-explore" />
            </button>

            <button
              onClick={onRegisterClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 hero-btn-create-anim cursor-pointer"
            >
              <span>Create Free Account</span>
            </button>
          </div>

          {/* Micro Link: Try AI Assistant */}
          <div className="pt-2 hero-link-ai-anim">
            <button
              onClick={onOpenAi}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 group cursor-pointer"
            >
              <span>Try AI Assistant</span>
              <ArrowRight className="w-3 h-3 ai-link-arrow-pulse" />
            </button>
          </div>
        </div>

        {/* Hero Visual — SkillSync Intelligence Loop */}
        <div ref={sectionRef} className="relative max-w-5xl mx-auto pt-6">
          {/* Main Visual Frame */}
<<<<<<< HEAD
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-750 backdrop-blur-xl shadow-2xl relative">
            <div className="text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                The SkillSync Intelligence Loop
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2">
=======
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-750 backdrop-blur-xl shadow-2xl relative">
            {/* Step 1 & Step 2: Badge and Heading reveals */}
            <div className="text-center mb-8">
              <span className={`inline-block text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 ${
                isSectionVisible ? 'loop-badge-anim' : 'opacity-0'
              }`}>
                The SkillSync Intelligence Loop
              </span>
              <h3 className={`text-lg sm:text-xl font-black text-white mt-2 ${
                isSectionVisible ? 'loop-heading-anim' : 'opacity-0'
              }`}>
>>>>>>> 6189b3c (feat: ultra premium 3D dashboard experience + role-based sidebar + animation system)
                Continuous Competency Feedback Architecture
              </h3>
            </div>

            {/* Step 3: Connected Nodes Matrix (8 Distinct Sequential Card Entrances & Hovers) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10">
              {loopNodes.map((node, i) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.label}
<<<<<<< HEAD
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-slate-700 transition-all text-center flex flex-col items-center justify-between group hover:shadow-lg hover:-translate-y-1 relative shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-750 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
=======
                    style={{ animationDelay: `${i * 90}ms` }}
                    className={`p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-center flex flex-col items-center justify-between group relative loop-node-card ${node.hoverClass} ${
                      isSectionVisible ? node.animClass : 'opacity-0'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center mb-2">
                      <Icon className={`w-4 h-4 text-cyan-400 ${node.iconClass}`} />
>>>>>>> 6189b3c (feat: ultra premium 3D dashboard experience + role-based sidebar + animation system)
                    </div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                      {node.label}
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {node.sub}
                    </div>

                    {/* Step indicator */}
                    <div className="mt-2 text-[9px] font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      0{i + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connecting Subtle Pipeline Bar */}
            <div className="hidden lg:block w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 my-8 opacity-40 rounded-full" />

            {/* 4 Floating Illustrative Prototype Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
<<<<<<< HEAD
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  92%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Skill Match</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Data Science Role</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Skill Gaps</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Remediation Ready</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Path Active</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Cloud Architect Track</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  +18%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Capability Growth</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Cohort Average</div>
                </div>
              </div>
=======
              {[
                { val: '92%', label: 'Skill Match', sub: 'Data Science Role', color: 'blue' },
                { val: '3', label: 'Skill Gaps', sub: 'Remediation Ready', color: 'amber' },
                { val: '✓', label: 'Path Active', sub: 'Cloud Architect Track', color: 'indigo' },
                { val: '+18%', label: 'Capability Growth', sub: 'Cohort Average', color: 'emerald' },
              ].map((metric, j) => (
                <div
                  key={metric.label}
                  style={{ animationDelay: `${(loopNodes.length + j) * 80}ms` }}
                  className={`p-3 rounded-2xl bg-${metric.color}-500/10 border border-${metric.color}-500/25 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-1 ${
                    isSectionVisible ? 'card-anim-role-bottom' : 'opacity-0'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl bg-${metric.color}-500/20 text-${metric.color}-400 flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                    {metric.val}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{metric.label}</div>
                    <div className="text-[10px] text-slate-400">{metric.sub}</div>
                  </div>
                </div>
              ))}
>>>>>>> 6189b3c (feat: ultra premium 3D dashboard experience + role-based sidebar + animation system)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

