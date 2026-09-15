import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight, Heart } from 'lucide-react';

export const SkillSyncFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-850 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="https://res.cloudinary.com/djmqwehwk/image/upload/v1789454602/Skill_Sync_WB_ehnf16.png"
                    alt="SkillSync Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <div className="font-black text-lg text-white">SkillSync</div>
                <p className="text-[10px] text-blue-400 font-semibold">
                  From Learning Management to Capacity Intelligence
                </p>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              SkillSync connects roles, skills, competencies, learning opportunities, trainers, assessments, and outcomes to create a smarter capacity-building experience.
            </p>

            <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Smart India Hackathon 2026 Prototype Demonstration</span>
            </div>
          </div>

          {/* Col 1: Explore */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Explore</h4>
            <ul className="space-y-2.5">
              <li><Link to="/courses" className="hover:text-cyan-400 transition-colors">Courses</Link></li>
              <li><Link to="/skills" className="hover:text-cyan-400 transition-colors">Skills</Link></li>
              <li><Link to="/competencies" className="hover:text-cyan-400 transition-colors">Competencies</Link></li>
              <li><Link to="/trainers" className="hover:text-cyan-400 transition-colors">Trainers</Link></li>
              <li><Link to="/sectors" className="hover:text-cyan-400 transition-colors">Sectors</Link></li>
              <li><Link to="/knowledge" className="hover:text-cyan-400 transition-colors">Knowledge Hub</Link></li>
            </ul>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li><a href="/#not-just-lms" className="hover:text-cyan-400 transition-colors">Competency Intelligence</a></li>
              <li><a href="/#loop" className="hover:text-cyan-400 transition-colors">Intelligence Loop</a></li>
              <li><a href="/#radar" className="hover:text-cyan-400 transition-colors">Opportunity Radar</a></li>
              <li><a href="/#organizational" className="hover:text-cyan-400 transition-colors">Capacity Analytics</a></li>
              <li><a href="/#trainer-experience" className="hover:text-cyan-400 transition-colors">Trainer Studio</a></li>
              <li><Link to="/ai" className="hover:text-cyan-400 transition-colors flex items-center gap-1"><span>SkillSync AI</span> <Sparkles className="w-3 h-3 text-cyan-400" /></Link></li>
            </ul>
          </div>

          {/* Col 3: Account & About */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Account & Connect</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-cyan-400 transition-colors">Create Free Account</Link></li>
              <li><Link to="/register?role=trainer" className="hover:text-cyan-400 transition-colors">Trainer Registration</Link></li>
              <li><a href="/#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
              <li><a href="/#features" className="hover:text-cyan-400 transition-colors">Key Features</a></li>
              <li><a href="/#about" className="hover:text-cyan-400 transition-colors">About SkillSync</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © 2026 SkillSync Platform. Sector datasets and organizational mock benchmarks are illustrative prototype demonstration data for SIH 2026.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for continuous capacity growth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
