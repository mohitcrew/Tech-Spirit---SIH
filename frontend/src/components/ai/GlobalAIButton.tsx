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
        aria-label="Open SkillSync AI Assistant - Ask Doubts"
        title="Ask SkillSync - AI Doubt Solver"
        className="global-ai-btn-inner group h-12 flex items-center rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 p-3 hover:pr-4.5 transition-all duration-300 ease-out active:scale-95 cursor-pointer select-none relative"
      >
        {/* AI Sparkle Symbol */}
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        {/* Green Online Pulse Dot (Visible when collapsed in icon state) */}
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white/90 group-hover:hidden animate-pulse pointer-events-none" />

        {/* Expandable Label on Cursor Hover */}
        <div className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2.5 flex items-center gap-2 transition-all duration-300 ease-out">
          <span className="tracking-wide font-extrabold text-xs text-white">
            Ask SkillSync
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-bold text-cyan-100 tracking-tight">
            Doubts
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        </div>
      </button>
    </div>
  );
};
