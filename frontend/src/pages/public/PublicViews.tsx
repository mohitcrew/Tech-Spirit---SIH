import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillSyncNavbar } from '../../components/public/SkillSyncNavbar';
import { SkillSyncFooter } from '../../components/public/SkillSyncFooter';
import { CourseExplorer } from '../../components/public/CourseExplorer';
import { SkillExplorer } from '../../components/public/SkillExplorer';
import { CompetencyExplorer } from '../../components/public/CompetencyExplorer';
import { TrainerExplorer } from '../../components/public/TrainerExplorer';
import { SectorExplorer } from '../../components/public/SectorExplorer';
import { KnowledgeHubPreview } from '../../components/public/KnowledgeHubPreview';
import { NotJustAnLms } from '../../components/public/NotJustAnLms';
import { WhySkillSync } from '../../components/public/WhySkillSync';
import { useAIAssistant } from '../../context/AIAssistantContext';
import { PublicCourse, PublicCompetency, PublicTrainer } from '../../data/skillsyncData';
import { Sparkles, Bot, Shield, CheckCircle2 } from 'lucide-react';

function PageShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const navigate = useNavigate();
  const { openAI } = useAIAssistant();

  const navigateToLogin = (intent?: string) => {
    const params = new URLSearchParams();
    if (intent) params.set('intent', intent);
    navigate(`/login?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <SkillSyncNavbar
        onOpenAuthModal={(intent) => navigateToLogin(intent || 'create your free account')}
        onOpenAi={() => openAI()}
      />

      <header className="py-12 bg-slate-900 border-b border-slate-800 text-center px-4">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Public Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{title}</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">{subtitle}</p>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <SkillSyncFooter />
    </div>
  );
}


export function CoursesView() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Courses & Learning Tracks"
      subtitle="Explore all outcome-based curriculum tracks designed for real-world competencies."
    >
      <CourseExplorer
        showAllInitially={true}
        onEnrollCourse={(c) => {
          navigate(`/login?intent=${encodeURIComponent(`enroll in "${c.title}"`)}&redirect=/trainee/courses/${c.id}`);
        }}
      />
    </PageShell>
  );
}

export function SkillsView() {
  return (
    <PageShell
      title="Granular Skill Catalog"
      subtitle="Explore programming, cloud, data, cybersecurity, and leadership tools benchmarked across industry roles."
    >
      <SkillExplorer />
    </PageShell>
  );
}

export function CompetenciesView() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Competency Frameworks"
      subtitle="Understand the multi-dimensional capability frameworks that drive professional execution."
    >
      <CompetencyExplorer
        onAnalyzeGap={(comp) => {
          navigate(`/login?intent=${encodeURIComponent(`run diagnostic gap analysis on "${comp.title}"`)}&redirect=/trainee/learning`);
        }}
      />
    </PageShell>
  );
}

export function TrainersView() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Trainer & Faculty Directory"
      subtitle="Meet verified technical leaders, researchers, and coaches available for structured cohort mentorship."
    >
      <TrainerExplorer
        onConnectTrainer={(tr) => {
          navigate(`/login?intent=${encodeURIComponent(`connect with trainer ${tr.name}`)}&redirect=/trainee/dashboard`);
        }}
      />
    </PageShell>
  );
}

export function SectorsView() {
  return (
    <PageShell
      title="Configurable Professional Sectors"
      subtitle="Learn how SkillSync separates its platform engine to support Earth Sciences, Meteorology, and beyond."
    >
      <SectorExplorer />
    </PageShell>
  );
}

export function KnowledgeView() {
  return (
    <PageShell
      title="Knowledge Hub & Open Repository"
      subtitle="Public repository of lectures, architecture whitepapers, presentations, and study guides."
    >
      <KnowledgeHubPreview />
    </PageShell>
  );
}

export function HowItWorksView() {
  return (
    <PageShell
      title="How SkillSync Works"
      subtitle="The difference between traditional course tracking and continuous capacity intelligence."
    >
      <NotJustAnLms />
    </PageShell>
  );
}

export function FeaturesView() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Platform Features & Capabilities"
      subtitle="From granular skill tracking to enterprise-level capacity readiness dashboards."
    >
      <WhySkillSync
        onExploreSkills={() => navigate('/skills')}
        onRegisterTrainer={() => navigate('/login?tab=register&role=trainer')}
      />
    </PageShell>
  );
}

export function AboutView() {
  return (
    <PageShell
      title="About SkillSync"
      subtitle="A digital capacity building and learning intelligence platform designed for Smart India Hackathon 2026."
    >
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xl font-black text-white">Our Vision</h3>
          <p>
            SkillSync was conceived to bridge the gap between traditional learning management systems and organizational capability readiness. Conventional platforms record video views and quiz scores; SkillSync evaluates whether individuals and squads possess the verified capabilities required to perform critical professional functions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="font-bold text-white mb-1">Sector Configurable</div>
              <p className="text-xs text-slate-400">Decoupled ontology engine adapting to IT, Meteorology, Ocean Science, and Public Service domains.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="font-bold text-white mb-1">Competency-Driven</div>
              <p className="text-xs text-slate-400">Multi-dimensional capability scoring based on practical project rubrics and verified trainer evaluation.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="font-bold text-white mb-1">AI Augmented</div>
              <p className="text-xs text-slate-400">Privacy-preserving conversational assistant providing contextual discovery and gap mapping.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export function AiView() {
  const { openAI } = useAIAssistant();

  return (
    <PageShell
      title="SkillSync AI Assistant"
      subtitle="Interactive conversational guidance for courses, skills, competencies, and personal roadmaps."
    >
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-xl shadow-cyan-500/20">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white">The SkillSync AI Engine</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            SkillSync AI communicates securely with our NestJS API (`POST /api/v1/ai/chat`) to parse competency inquiries, recommend learning pathways, and guide learners.
          </p>
          <div className="flex justify-center pt-2">
            <button
              onClick={() => openAI('How does SkillSync calculate skill gaps?')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch Interactive AI Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

