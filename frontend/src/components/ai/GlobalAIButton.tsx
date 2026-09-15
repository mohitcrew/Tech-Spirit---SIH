import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAIAssistant } from '../../context/AIAssistantContext';

export const GlobalAIButton: React.FC = () => {
  const { isOpen, openAI } = useAIAssistant();

  // Keep button visible or smooth fade when assistant is already open
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 global-ai-btn-anim">
      <button
        onClick={() => openAI()}
        aria-label="Open SkillSync AI Assistant"
        className="global-ai-btn-inner px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-blue-500/25 flex items-center gap-2 group active:scale-95 cursor-pointer select-none"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <span className="tracking-wide">✨ Ask SkillSync</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    </div>
  );
};
