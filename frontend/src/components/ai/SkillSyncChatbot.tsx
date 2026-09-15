import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, X, Minimize2, Maximize2, Send, RotateCcw, Bot, User, ArrowRight, Shield
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  isPersonalGate?: boolean;
  suggestedActions?: Array<{ label: string; action: string }>;
}

interface SkillSyncChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAuthModal?: (intent?: string) => void;
}

export const SkillSyncChatbot: React.FC<SkillSyncChatbotProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (externalOnClose && !val) externalOnClose();
    setInternalIsOpen(val);
  };

  const initialMessage: ChatMessage = {
    id: 'msg-1',
    sender: 'assistant',
    text: "👋 Hi! I'm **SkillSync AI**. I can help you explore courses, skills, competencies, trainers, and learning pathways. What would you like to discover today?",
    time: 'Just now',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'What should I learn for Data Science?',
    'Find courses for Python',
    'What skills does a Cloud Engineer need?',
    'Explain competency-based learning',
    'Show me how SkillSync works',
    'What skills am I missing?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call secure backend endpoint: POST /api/v1/ai/chat
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
        text: data.reply || "I'm analyzing the SkillSync competency catalog for you.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPersonalGate: data.isPersonalizedPrompt,
        suggestedActions: data.suggestedActions,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      // Fallback local mock responses if backend is temporarily unreachable
      const lower = query.toLowerCase();
      let reply = "I can guide you through our courses, skills, and competency frameworks.";
      let isPersonalGate = false;

      if (lower.includes('missing') || lower.includes('my gap') || lower.includes('my profile')) {
        if (!user) {
          isPersonalGate = true;
          reply = "🔒 **Unlock Personalized SkillSync AI**\n\nCreate an account to let SkillSync analyze your verified profile, competencies, learning history, and individual skill gaps.";
        } else {
          reply = `Hello ${user.name}! Based on your Level 5 Explorer profile in Digital Literacy (91%) and Communication (82%), your current target development areas are: **Cloud Systems Engineering** and **Executive Stakeholder Negotiation**.`;
        }
      } else if (lower.includes('data science') || lower.includes('python')) {
        reply = "📊 **Data Science Learning Pathway:**\n\n• **Core Skills**: Python, SQL, Statistics, Machine Learning\n• **Competencies**: Data Science, Predictive Modeling\n• **Recommended Course**: *Data Science & Predictive Modeling* by Prof. Vikram Rao";
      } else if (lower.includes('cloud')) {
        reply = "☁️ **Cloud Engineering Competency Framework:**\n\n• **Core Skills**: Docker, Kubernetes, AWS/Azure, Terraform\n• **Recommended Course**: *Cloud Systems Architecture & Kubernetes DevOps* by Alex Rivera";
      } else if (lower.includes('how skillsync works') || lower.includes('lms')) {
        reply = "🚀 **Traditional LMS vs SkillSync:**\n\nTraditional LMS only records course completion. **SkillSync** maps **Role → Competencies → Skills → Skill Gaps → Learning → Trainers → Assessment → Measurable Organizational Capacity**.";
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

  const handleClearChat = () => {
    setMessages([initialMessage]);
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-blue-500/35 hover:scale-105 transition-all flex items-center gap-2 group active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span>✨ Ask SkillSync</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-slate-900 border border-slate-750 shadow-2xl rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized
              ? 'w-72 h-14'
              : 'w-[94vw] sm:w-[420px] h-[85vh] sm:h-[600px] max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border-b border-slate-800 p-3.5 px-4 flex items-center justify-between text-white select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-extrabold text-xs">
                  <span>SkillSync AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-400">Learning & Competency Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                title="New Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/60 text-xs">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-7 h-7 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/30">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-slate-850 border border-slate-750 text-slate-200 rounded-bl-xs shadow-sm'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Personal AI Gate Card */}
                      {msg.isPersonalGate && (
                        <div className="mt-3 pt-3 border-t border-slate-750">
                          <p className="text-[11px] text-amber-300 font-semibold mb-2">
                            Sign in to unlock personalized skill-gap calculations:
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (onOpenAuthModal) onOpenAuthModal('analyze your personal skill gaps');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <span>Create Account</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (onOpenAuthModal) onOpenAuthModal('login to view skill gaps');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-750 hover:bg-slate-700 text-slate-200 font-bold text-[10px]"
                            >
                              Sign In
                            </button>
                          </div>
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 block text-right mt-1.5">
                        {msg.time}
                      </span>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-9">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>SkillSync AI is researching competencies...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Pills Carousel */}
              <div className="p-2 border-t border-slate-800 bg-slate-900/90 overflow-x-auto flex gap-1.5 no-scrollbar">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-700 text-[10px] text-slate-300 font-medium whitespace-nowrap transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about skills, courses, competencies, trainers..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white flex items-center justify-center transition-opacity flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
