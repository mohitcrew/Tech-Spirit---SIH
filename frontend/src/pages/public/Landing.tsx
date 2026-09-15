import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillSyncNavbar } from '../../components/public/SkillSyncNavbar';
import { HeroIntelligenceLoop } from '../../components/public/HeroIntelligenceLoop';
import { SocialProofStrip } from '../../components/public/SocialProofStrip';
import { NotJustAnLms } from '../../components/public/NotJustAnLms';
import { ExploreGrid } from '../../components/public/ExploreGrid';
import { CourseExplorer } from '../../components/public/CourseExplorer';
import { SkillExplorer } from '../../components/public/SkillExplorer';
import { CompetencyExplorer } from '../../components/public/CompetencyExplorer';
import { TrainerExplorer } from '../../components/public/TrainerExplorer';
import { SectorExplorer } from '../../components/public/SectorExplorer';
import { CapacityJourneyPreview } from '../../components/public/CapacityJourneyPreview';
import { OpportunityRadar } from '../../components/public/OpportunityRadar';
import { OrganizationalCapacityPreview } from '../../components/public/OrganizationalCapacityPreview';
import { KnowledgeHubPreview } from '../../components/public/KnowledgeHubPreview';
import { WhySkillSync } from '../../components/public/WhySkillSync';
import { FinalCta } from '../../components/public/FinalCta';
import { SkillSyncFooter } from '../../components/public/SkillSyncFooter';
import { useAIAssistant } from '../../context/AIAssistantContext';
import { PublicCourse, PublicCompetency, PublicTrainer } from '../../data/skillsyncData';

export function Landing() {
  const navigate = useNavigate();
  const { openAI } = useAIAssistant();

  // Unified Scroll-Triggered Page Animations (Entire Homepage)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const navigateToLoginWithIntent = (intentText: string, target?: string) => {
    const params = new URLSearchParams();
    if (intentText) params.set('intent', intentText);
    if (target) params.set('redirect', target);
    navigate(`/login?${params.toString()}`);
  };

  const handleEnrollCourse = (course: PublicCourse) => {
    navigateToLoginWithIntent(`enroll in "${course.title}" and access the course room`, `/trainee/courses`);
  };

  const handleAnalyzeGap = (competency: PublicCompetency) => {
    navigateToLoginWithIntent(`run a personalized diagnostic on "${competency.title}"`, `/trainee/learning`);
  };

  const handleConnectTrainer = (trainer: PublicTrainer) => {
    navigateToLoginWithIntent(`schedule 1-on-1 mentorship with ${trainer.name}`, `/trainee/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Sticky Premium Navbar */}
      <SkillSyncNavbar
        onOpenAuthModal={(intent) => navigateToLoginWithIntent(intent || 'create your free account')}
        onOpenAi={() => openAI()}
      />

      {/* 1. Hero with Connected Intelligence Loop */}
      <HeroIntelligenceLoop
        onExploreClick={() => {
          const el = document.getElementById('courses');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onRegisterClick={() => navigateToLoginWithIntent('create your free SkillSync account')}
        onOpenAi={() => openAI()}
      />

      {/* 2. Lightweight Social Proof Strip */}
      <div className="reveal-on-scroll reveal-fade-up">
        <SocialProofStrip />
      </div>

      {/* 3. "Not Just an LMS" Interactive Comparison */}
      <div className="reveal-on-scroll reveal-slide-left">
        <NotJustAnLms />
      </div>

      {/* 4. 6-Card Discovery Grid */}
      <div className="reveal-on-scroll reveal-scale">
        <ExploreGrid />
      </div>

      {/* 5. Course Discovery Explorer */}
      <div className="reveal-on-scroll reveal-fade-up">
        <CourseExplorer
          onEnrollCourse={handleEnrollCourse}
        />
      </div>

      {/* 6. Skill Explorer (Interactive Chips) */}
      <div className="reveal-on-scroll reveal-blur">
        <SkillExplorer />
      </div>

      {/* 7. Competency Explorer with Gap Trigger */}
      <div className="reveal-on-scroll reveal-slide-right">
        <CompetencyExplorer
          onAnalyzeGap={handleAnalyzeGap}
        />
      </div>

      {/* 8. Trainer Directory */}
      <div className="reveal-on-scroll reveal-scale">
        <TrainerExplorer
          onConnectTrainer={handleConnectTrainer}
        />
      </div>

      {/* 9. Configurable Sector Explorer */}
      <div className="reveal-on-scroll reveal-slide-left">
        <SectorExplorer />
      </div>

      {/* 10. My Capacity Journey Preview */}
      <div className="reveal-on-scroll reveal-fade-up">
        <CapacityJourneyPreview
          onBuildJourney={() => navigateToLoginWithIntent('build your personalized capacity roadmap')}
        />
      </div>

      {/* 11. Training Opportunity Radar */}
      <div className="reveal-on-scroll reveal-scale">
        <OpportunityRadar
          onExploreCourse={() => {
            const el = document.getElementById('courses');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* 12. Organizational Capacity Analytics Preview */}
      <div className="reveal-on-scroll reveal-slide-right">
        <OrganizationalCapacityPreview />
      </div>

      {/* 13. Knowledge Hub Resources */}
      <div className="reveal-on-scroll reveal-blur">
        <KnowledgeHubPreview />
      </div>

      {/* 14. Why SkillSync & Dual Experiences */}
      <div className="reveal-on-scroll reveal-fade-up">
        <WhySkillSync
          onExploreSkills={() => {
            const el = document.getElementById('skills');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onRegisterTrainer={() => navigateToLoginWithIntent('apply as a verified SkillSync trainer', '/trainer/dashboard')}
        />
      </div>

      {/* 15. Final Call to Action */}
      <div className="reveal-on-scroll reveal-expand">
        <FinalCta
          onExploreCourses={() => {
            const el = document.getElementById('courses');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onRegister={() => navigateToLoginWithIntent('create your free SkillSync account')}
        />
      </div>

      {/* Footer */}
      <div className="reveal-on-scroll reveal-fade-up">
        <SkillSyncFooter />
      </div>
    </div>
  );
}


