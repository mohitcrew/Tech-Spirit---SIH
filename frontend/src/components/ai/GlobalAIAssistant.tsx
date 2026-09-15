import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, X, Send, RotateCcw, Bot, User, ArrowRight
} from 'lucide-react';
import { useAIAssistant } from '../../context/AIAssistantContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export const GlobalAIAssistant: React.FC = () => {
  const {
    isOpen,
    closeAI,
    messages,
    loading,
    sendMessage,
    resetChat,
    quickPrompts,
  } = useAIAssistant();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto focus input on open for quick keyboard usage
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="SkillSync AI Assistant Panel"
      className="fixed bottom-[86px] right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[540px] max-h-[82vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl border ai-panel-open-anim"
      style={{
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.96)' : 'rgba(255, 255, 255, 0.98)',
        borderColor: isDark ? '#1E293B' : '#E2E8F0',
        boxShadow: isDark
          ? '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 25px rgba(37, 99, 235, 0.15)'
          : '0 20px 50px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div
        className="p-3.5 px-4 flex items-center justify-between border-b select-none transition-colors"
        style={{
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          borderColor: isDark ? '#1E293B' : '#E2E8F0',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-xs" style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>
              <span>✨ SkillSync AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px]" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
              Your intelligent learning assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={resetChat}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            style={{
              color: isDark ? '#94A3B8' : '#64748B',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? '#1E293B' : '#E2E8F0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            title="Reset Conversation"
            aria-label="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={closeAI}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            style={{
              color: isDark ? '#94A3B8' : '#64748B',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? '#1E293B' : '#E2E8F0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            title="Close Assistant"
            aria-label="Close SkillSync AI Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Message Feed ──────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs transition-colors"
        style={{
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(248, 250, 252, 0.6)',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/25">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[84%] p-3 rounded-2xl leading-relaxed whitespace-pre-line transition-colors ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-500/20'
                  : isDark
                  ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-xs shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs shadow-xs'
              }`}
            >
              <p>{msg.text}</p>

              {/* Personal Auth Gate Card if applicable */}
              {msg.isPersonalGate && (
                <div
                  className="mt-3 pt-3 border-t flex flex-col gap-2"
                  style={{ borderColor: isDark ? '#1E293B' : '#E2E8F0' }}
                >
                  <p className="text-[11px] font-semibold text-amber-500">
                    Sign in to unlock personalized competency calculations:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        closeAI();
                        navigate('/register');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>Create Account</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        closeAI();
                        navigate('/login');
                      }}
                      className="px-3 py-1.5 rounded-xl border font-bold text-[10px] cursor-pointer"
                      style={{
                        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        borderColor: isDark ? '#334155' : '#CBD5E1',
                        color: isDark ? '#F8FAFC' : '#0F172A',
                      }}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}

              <span
                className="text-[9px] block text-right mt-1.5 font-medium"
                style={{
                  color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.75)' : isDark ? '#64748B' : '#94A3B8',
                }}
              >
                {msg.time}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div
            className="flex items-center gap-2 text-xs italic pl-9"
            style={{ color: isDark ? '#94A3B8' : '#64748B' }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>SkillSync AI is researching competencies...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Prompts Suggestion Chips ─────────────────────────────────── */}
      <div
        className="p-2 border-t overflow-x-auto flex gap-1.5 no-scrollbar transition-colors"
        style={{
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? '#1E293B' : '#E2E8F0',
        }}
      >
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            className="px-2.5 py-1 rounded-xl text-[10px] font-semibold whitespace-nowrap transition-all border cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600"
            style={{
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              borderColor: isDark ? '#334155' : '#E2E8F0',
              color: isDark ? '#E2E8F0' : '#334155',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* ── Input Form ────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t flex items-center gap-2 transition-colors"
        style={{
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderColor: isDark ? '#1E293B' : '#E2E8F0',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask SkillSync anything..."
          className="flex-1 rounded-xl px-3.5 py-2 text-xs transition-colors border focus:outline-none focus:border-blue-500"
          style={{
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            borderColor: isDark ? '#334155' : '#E2E8F0',
            color: isDark ? '#F8FAFC' : '#0F172A',
          }}
          aria-label="Ask SkillSync anything"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message to SkillSync AI"
          className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 disabled:opacity-40 text-white flex items-center justify-center transition-opacity flex-shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
