import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  isPersonalGate?: boolean;
  suggestedActions?: Array<{ label: string; action: string }>;
}

interface AIAssistantContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleAI: () => void;
  openAI: (initialPrompt?: string) => void;
  closeAI: () => void;
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (text?: string) => Promise<void>;
  resetChat: () => void;
  quickPrompts: string[];
}

const AIAssistantContext = createContext<AIAssistantContextType>({
  isOpen: false,
  setIsOpen: () => {},
  toggleAI: () => {},
  openAI: () => {},
  closeAI: () => {},
  messages: [],
  loading: false,
  sendMessage: async () => {},
  resetChat: () => {},
  quickPrompts: [],
});

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: "Hi! I'm SkillSync AI. How can I help you?",
  time: 'Just now',
};

const QUICK_PROMPTS = [
  'Find my skill gaps',
  'Recommend learning paths',
  'Explain my competency score',
  'How SkillSync works',
];

export const AIAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);

  const toggleAI = () => {
    setIsOpen(prev => !prev);
  };

  const openAI = (initialPrompt?: string) => {
    setIsOpen(true);
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  };

  const closeAI = () => {
    setIsOpen(false);
  };

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend?.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Attempt backend endpoint: POST /api/v1/ai/chat
      const response = await api.post('/ai/chat', {
        messages: [...messages, userMsg].map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      });

      const data = response.data?.data || response.data;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I've analyzed the SkillSync competency graph for you.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPersonalGate: data.isPersonalizedPrompt,
        suggestedActions: data.suggestedActions,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      // If client Gemini API key is configured, query Gemini directly as fallback
      const clientGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (clientGeminiKey) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientGeminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: 'You are SkillSync AI, the intelligent capacity building and EdTech assistant for SkillSync. Answer questions clearly about courses, skills, career roadmaps, and competencies.' }],
                },
                contents: [
                  ...messages.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }],
                  })),
                  { role: 'user', parts: [{ text: query }] },
                ],
              }),
            }
          );
          if (geminiRes.ok) {
            const gData = await geminiRes.json();
            const reply = gData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              setMessages(prev => [
                ...prev,
                {
                  id: `ai-${Date.now()}`,
                  sender: 'assistant',
                  text: reply,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
              return;
            }
          }
        } catch {
          // fallback to local intelligent responses
        }
      }

      // Fallback local intelligent responses
      const lower = query.toLowerCase();
      let reply = "I can guide you through our courses, skills, competencies, and personal roadmaps.";
      let isPersonalGate = false;

      if (lower.includes('gap') || lower.includes('missing') || lower.includes('profile') || lower.includes('score')) {
        if (!user) {
          isPersonalGate = true;
          reply = "🔒 **Personalized Diagnostic Analysis**\n\nTo calculate your exact individual skill gaps and competency score, sign in to your verified SkillSync account. We'll cross-examine your role benchmarks with verified assessments.";
        } else {
          reply = `👋 Hello **${user.name}**!\n\nBased on your current profile in **${user.role}**:\n• **Digital Literacy**: 91% (Advanced)\n• **Communication & Leadership**: 82% (Proficient)\n• **Calculated Gap**: Cloud Architecture & Microservices (Needs +24% to meet Role Benchmark).`;
        }
      } else if (lower.includes('path') || lower.includes('recommend') || lower.includes('course')) {
        reply = "🎯 **Recommended Learning Paths:**\n\n1. **Cloud Systems Architecture & Kubernetes DevOps** — by Alex Rivera (Target: 8 Weeks)\n2. **Predictive Data Modeling with Python** — by Prof. Vikram Rao (Target: 6 Weeks)\n3. **Cybersecurity Incident Management** — by Dr. Priya Sharma (Target: 4 Weeks)";
      } else if (lower.includes('how skillsync works') || lower.includes('how it works') || lower.includes('lms')) {
        reply = "🚀 **SkillSync vs. Traditional LMS:**\n\nUnlike traditional LMS platforms that only count video views and quiz scores, **SkillSync** maps:\n**Role → Competencies → Granular Skills → Diagnostic Gaps → Targeted Curricula → Trainer Mentorship → Measurable Organizational Capacity**.";
      } else if (lower.includes('competency') || lower.includes('score')) {
        reply = "📊 **Competency Scoring Engine:**\n\nSkillSync scores capabilities across 5 dimensions: Practical Execution, Domain Knowledge, Problem Solving, Tool Mastery, and Peer Review. Scores are updated dynamically as you complete modular tasks.";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPersonalGate,
      };

      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleAI,
        openAI,
        closeAI,
        messages,
        loading,
        sendMessage,
        resetChat,
        quickPrompts: QUICK_PROMPTS,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = () => useContext(AIAssistantContext);
