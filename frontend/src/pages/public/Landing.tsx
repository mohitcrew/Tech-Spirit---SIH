import React, { useState } from 'react';
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
import { SkillSyncChatbot } from '../../components/ai/SkillSyncChatbot';
import { PublicCourse, PublicCompetency, PublicTrainer } from '../../data/skillsyncData';

export function Landing() {
  const navigate = useNavigate();

  // Chatbot state
  const [chatbotOpen, setChatbotOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Sticky Premium Navbar */}
      <SkillSyncNavbar
        onOpenAuthModal={(intent) => navigateToLoginWithIntent(intent || 'create your free account')}
        onOpenAi={() => setChatbotOpen(true)}
      />

      {/* 1. Hero with Connected Intelligence Loop */}
      <HeroIntelligenceLoop
        onExploreClick={() => {
          const el = document.getElementById('courses');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onRegisterClick={() => navigateToLoginWithIntent('create your free SkillSync account')}
        onOpenAi={() => setChatbotOpen(true)}
      />

      {/* 2. Lightweight Social Proof Strip */}
      <SocialProofStrip />

      {/* 3. "Not Just an LMS" Interactive Comparison */}
      <NotJustAnLms />

      {/* 4. 6-Card Discovery Grid */}
      <ExploreGrid />

      {/* 5. Course Discovery Explorer */}
      <CourseExplorer
        onEnrollCourse={handleEnrollCourse}
      />

      {/* 6. Skill Explorer (Interactive Chips) */}
      <SkillExplorer />

      {/* 7. Competency Explorer with Gap Trigger */}
      <CompetencyExplorer
        onAnalyzeGap={handleAnalyzeGap}
      />

      {/* 8. Trainer Directory */}
      <TrainerExplorer
        onConnectTrainer={handleConnectTrainer}
      />

      {/* 9. Configurable Sector Explorer */}
      <SectorExplorer />

      {/* 10. My Capacity Journey Preview */}
      <CapacityJourneyPreview
        onBuildJourney={() => navigateToLoginWithIntent('build your personalized capacity roadmap')}
      />

      {/* 11. Training Opportunity Radar */}
      <OpportunityRadar
        onExploreCourse={(title) => {
          const el = document.getElementById('courses');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 12. Organizational Capacity Analytics Preview */}
      <OrganizationalCapacityPreview />

      {/* 13. Knowledge Hub Resources */}
      <KnowledgeHubPreview />

      {/* 14. Why SkillSync & Dual Experiences */}
      <WhySkillSync
        onExploreSkills={() => {
          const el = document.getElementById('skills');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onRegisterTrainer={() => navigateToLoginWithIntent('apply as a verified SkillSync trainer', '/trainer/dashboard')}
      />

      {/* 15. Final Call to Action */}
      <FinalCta
        onExploreCourses={() => {
          const el = document.getElementById('courses');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onRegister={() => navigateToLoginWithIntent('create your free SkillSync account')}
      />

      {/* Footer */}
      <SkillSyncFooter />

      {/* Floating SkillSync AI Assistant */}
      <SkillSyncChatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        onOpenAuthModal={(intent) => navigateToLoginWithIntent(intent || 'access personalized AI')}
      />
    </div>
  );
}
