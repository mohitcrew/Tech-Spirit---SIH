import { Injectable } from '@nestjs/common';
import { AiProvider, ChatMessage, ChatResponse } from './ai-provider.interface';

@Injectable()
export class MockAiProvider implements AiProvider {
  async chat(messages: ChatMessage[], userContext?: any): Promise<ChatResponse> {
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

    // Check for personal questions when unauthenticated
    const personalKeywords = [
      'my gap',
      'my skills',
      'what am i missing',
      'my learning',
      'my competencies',
      'my progress',
      'my profile',
      'analyze me',
    ];

    const isPersonalQuery = personalKeywords.some((k) => lastMsg.includes(k));

    if (isPersonalQuery && !userContext) {
      return {
        reply:
          "✨ **Unlock Personalized SkillSync AI**\n\nTo analyze your individual profile, current competencies, verified assessment results, and specific skill gaps, please create a free account or sign in.",
        isPersonalizedPrompt: true,
        suggestedActions: [
          { label: 'Create Free Account', action: 'register' },
          { label: 'Sign In', action: 'login' },
        ],
      };
    }

    // Knowledge-driven public responses
    if (lastMsg.includes('data science') || lastMsg.includes('python')) {
      return {
        reply:
          "📊 **Data Science Learning Pathway on SkillSync:**\n\n1. **Core Skills**: Python, SQL, Statistics, Exploratory Data Analysis, Machine Learning.\n2. **Related Competencies**: Statistical Modeling, Predictive Analysis, Data Engineering.\n3. **Recommended Courses**: *Full Stack Machine Learning* by Prof. Vikram Rao and *Data Visualization with Python*.\n4. **Target Roles**: Data Analyst, Junior Data Scientist, Machine Learning Fellow.",
        suggestedActions: [
          { label: 'Explore Data Science Courses', action: 'explore_courses' },
          { label: 'View Related Competencies', action: 'explore_competencies' },
        ],
      };
    }

    if (lastMsg.includes('cloud') || lastMsg.includes('devops')) {
      return {
        reply:
          "☁️ **Cloud Engineering Competency Framework:**\n\n• **Foundational Skills**: Linux, Networking, Docker, Containerization.\n• **Advanced Skills**: Kubernetes, AWS/Azure Architecture, Terraform, CI/CD pipelines.\n• **Outcome**: Prepares you for Cloud Systems Engineer and SRE roles with hands-on labs and mentor reviews.",
        suggestedActions: [
          { label: 'Browse Cloud Courses', action: 'explore_courses' },
          { label: 'Find Cloud Trainers', action: 'explore_trainers' },
        ],
      };
    }

    if (lastMsg.includes('how skillsync works') || lastMsg.includes('not just an lms') || lastMsg.includes('traditional lms')) {
      return {
        reply:
          "🚀 **How SkillSync Differs From Traditional LMS Platforms:**\n\n• **Traditional LMS**: Tracks course completion, quizzes, and attendance.\n• **SkillSync**: Maps **Roles → Competencies → Current Skills → Skill Gaps → Targeted Learning → Expert Trainers → Performance Assessments → Measurable Organizational Capacity**.\n\nSkillSync connects learning directly to career readiness and organizational capability.",
        suggestedActions: [
          { label: 'View Intelligence Loop', action: 'view_loop' },
          { label: 'Explore Sectors', action: 'explore_sectors' },
        ],
      };
    }

    if (lastMsg.includes('competency') || lastMsg.includes('competencies')) {
      return {
        reply:
          "🎯 **Competency-Based Capacity Building:**\n\nA competency represents the observable, measurable ability to perform a professional role successfully. Unlike a static course certificate, SkillSync evaluates multidimensional competencies across practical project assessments and verified trainer evaluations.",
        suggestedActions: [
          { label: 'Explore All Competencies', action: 'explore_competencies' },
        ],
      };
    }

    if (lastMsg.includes('trainer') || lastMsg.includes('mentor')) {
      return {
        reply:
          "👨‍🏫 **SkillSync Trainer Ecosystem:**\n\nOur platform connects learners with verified domain specialists like Dr. Arun Verma (Emerging Tech), Sarah Jenkins (Organizational Psychology), and Meera Nair (Communications). You can review trainer ratings, past courses, and book 1-on-1 mentorship after creating an account.",
        suggestedActions: [
          { label: 'Browse Trainer Directory', action: 'explore_trainers' },
        ],
      };
    }

    // Default friendly conversational response
    return {
      reply:
        "👋 **Hello! I'm SkillSync AI.**\n\nI can help you explore public courses, competencies, skills, trainers, and sector learning pathways across IT & digital domains. What career or skill goal are you looking to develop today?",
      suggestedActions: [
        { label: 'What should I learn for Data Science?', action: 'query_ds' },
        { label: 'What skills does a Cloud Engineer need?', action: 'query_cloud' },
        { label: 'How does SkillSync work?', action: 'query_how' },
      ],
    };
  }
}
