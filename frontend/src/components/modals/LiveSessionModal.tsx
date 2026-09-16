import React, { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Hand, MessageSquare, Users, Send, Radio } from 'lucide-react';
import { LiveSession } from '../../data/capacityConnectData';
import { useAuth } from '../../context/AuthContext';

interface LiveSessionModalProps {
  session: LiveSession | null;
  onClose: () => void;
}

export const LiveSessionModal: React.FC<LiveSessionModalProps> = ({ session, onClose }) => {
  const { user } = useAuth();
  const userName = user?.name || 'SkillSync Learner';
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Meera Nair (Trainer)', text: 'Welcome everyone! We will review persuasive executive narratives today.', time: '11:02' },
    { sender: 'Arjun Mehta', text: 'Good morning ma’am! Audio is crystal clear.', time: '11:03' },
    { sender: `${userName} (You)`, text: 'Looking forward to the team pitching breakdown!', time: '11:04' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!session) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: `${userName} (You)`, text: inputMsg.trim(), time: 'Just now' }
    ]);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-700 flex flex-col h-[85vh]">
        {/* Top Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              LIVE CLASSROOM
            </span>
            <div className="hidden sm:block">
              <h3 className="text-sm font-bold text-white leading-none">{session.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Instructor: {session.trainer} · {session.sessionType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{session.participants + 1} attending</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Grid: Stage & Chat */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden bg-slate-950">
          {/* Main Stage */}
          <div className="md:col-span-2 p-4 flex flex-col justify-between relative bg-gradient-to-b from-slate-900 to-slate-950">
            {/* Main Speaker Screen */}
            <div className="flex-1 rounded-2xl bg-slate-800/80 border border-slate-700/60 overflow-hidden relative flex flex-col items-center justify-center p-6 text-center shadow-inner">
              <div className="relative mb-4">
                <img
                  src={session.trainerAvatar}
                  alt={session.trainer}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-500 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-xl">
                  <Radio className="w-4 h-4" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">{session.trainer}</h4>
              <p className="text-xs text-blue-400 font-medium mt-1">{session.trainerRole}</p>
              <div className="mt-3 px-3 py-1 rounded-full bg-slate-700/70 text-slate-300 text-xs font-mono">
                Screen sharing: "Strategic Presentation Framework.pdf"
              </div>

              {/* Floating Self Camera Pill */}
              <div className="absolute bottom-4 right-4 w-28 h-20 rounded-xl bg-slate-900/90 border border-slate-700 flex flex-col items-center justify-center text-[10px] text-slate-400 shadow-lg">
                <span className="font-bold text-white">You</span>
                <span>{videoOn ? 'Camera On' : 'Camera Off'}</span>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="mt-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-center gap-3">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  micOn ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={micOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  videoOn ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  handRaised ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={handRaised ? 'Lower Hand' : 'Raise Hand'}
              >
                <Hand className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-slate-800 mx-2" />

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30"
              >
                Leave Session
              </button>
            </div>
          </div>

          {/* Live Chat Panel */}
          <div className="border-l border-slate-800 bg-slate-900/50 flex flex-col h-full">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                Live Chat & Questions
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                Public
              </span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400">{msg.sender}</span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl text-slate-200 leading-relaxed border border-slate-750">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
