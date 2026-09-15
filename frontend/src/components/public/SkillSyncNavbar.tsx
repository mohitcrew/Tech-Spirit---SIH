import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles, ChevronDown, Menu, X, BookOpen, Target, Users, Globe, BookMarked, Layers, ArrowRight, ShieldCheck, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface SkillSyncNavbarProps {
  onOpenAuthModal?: (intent?: string) => void;
  onOpenAi?: () => void;
}

export const SkillSyncNavbar: React.FC<SkillSyncNavbarProps> = ({
  onOpenAuthModal,
  onOpenAi,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const exploreLinks = [
    { label: 'Courses', path: '/courses', icon: BookOpen, desc: 'Structured learning modules' },
    { label: 'Skills', path: '/skills', icon: Layers, desc: 'Technical & domain skill chips' },
    { label: 'Competencies', path: '/competencies', icon: Target, desc: 'Observable professional capabilities' },
    { label: 'Trainers', path: '/trainers', icon: Users, desc: 'Verified educators & coaches' },
    { label: 'Sectors', path: '/sectors', icon: Globe, desc: 'Configurable professional domains' },
    { label: 'Knowledge Hub', path: '/knowledge', icon: BookMarked, desc: 'Lectures, guides & research' },
  ];

  const handleAuthClick = (type: 'login' | 'register' | 'trainee', intent?: string) => {
    if (type === 'trainee') {
      navigate('/login?role=trainee&redirect=/trainee/dashboard');
    } else if (type === 'register') {
      navigate(intent ? `/register?intent=${encodeURIComponent(intent)}` : '/register');
    } else {
      navigate(intent ? `/login?intent=${encodeURIComponent(intent)}` : '/login');
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xl py-2.5'
          : 'bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 py-4 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Image at SS Position */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden p-1">
              <img
                src="https://res.cloudinary.com/djmqwehwk/image/upload/v1789454602/Skill_Sync_WB_ehnf16.png"
                alt="SkillSync Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div>
            <div className="font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
              <span>Skill</span>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                Sync
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase mt-0.5 hidden sm:block">
              Capacity Intelligence
            </p>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              location.pathname === '/' ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            Home
          </Link>

          {/* Explore Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
              onMouseEnter={() => setExploreDropdownOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <span>Explore</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${exploreDropdownOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''}`} />
            </button>

            {exploreDropdownOpen && (
              <div
                onMouseLeave={() => setExploreDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2.5 shadow-2xl z-50 animate-fadeIn"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1 mb-1">
                  Discovery Matrix
                </div>
                {exploreLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setExploreDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <a
            href="/#how-it-works"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            How It Works
          </a>

          <a
            href="/#features"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Features
          </a>

          <a
            href="/#about"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            About
          </a>

          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-200 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>AI Assistant</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-90"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300" />
            )}
          </button>

          {/* Go to Portal (Trainee) - ALWAYS redirects to login page per specification */}
          <Link
            to="/login?role=trainee&redirect=/trainee/dashboard"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 active:scale-95"
            title="Access the Trainee learning portal through the SkillSync login gateway"
          >
            <span>Go to Portal (Trainee)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                to={`/${user.role.toLowerCase()}/dashboard`}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 hover:border-slate-600 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Dashboard ({user.role})</span>
              </Link>
              <button
                onClick={logout}
                className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                title="Sign out of current portal session"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleAuthClick('login')}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={() => handleAuthClick('register')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1 active:scale-95"
              >
                <span>Register</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:text-white"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-slate-800">
            {exploreLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2"
              >
                <item.icon className="w-4 h-4 text-blue-400" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-slate-300 py-1.5"
            >
              How It Works
            </a>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-slate-300 py-1.5"
            >
              Features
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAi) onOpenAi();
              }}
              className="text-left text-xs font-bold text-cyan-300 py-1.5 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask SkillSync AI</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/login?role=trainee&redirect=/trainee/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <span>Go to Portal (Trainee)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAuthClick('login');
                }}
                className="w-full py-2 rounded-xl border border-slate-800 bg-slate-900 text-white font-bold text-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAuthClick('register');
                }}
                className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Register
              </button>
            </div>
            {user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-1.5 text-xs text-rose-400 text-center font-medium"
              >
                Sign Out ({user.name})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
