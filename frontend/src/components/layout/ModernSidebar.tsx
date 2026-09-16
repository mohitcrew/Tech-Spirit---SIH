import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserRole, useAuth } from '../../context/AuthContext';
import { currentUserProfile } from '../../data/capacityConnectData';
import { learnerService } from '../../services/learnerService';
import {
  ROLE_NAVIGATION_CONFIG,
  SidebarItemConfig,
} from '../../config/sidebarNavigation';

interface ModernSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeRole: string;
}

interface NavItemWithDelay extends SidebarItemConfig {
  path: string;
  animDelayMs: number;
}

const SidebarNavItem: React.FC<{
  item: NavItemWithDelay;
  onClose?: () => void;
}> = ({ item, onClose }) => {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, magX: 0, magY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0 to 1
    const py = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Cursor toward left -> rotateY(-2deg), right -> rotateY(2deg)
    const rotY = (px - 0.5) * 4;
    // Cursor toward top -> rotateX(2deg), bottom -> rotateX(-2deg)
    const rotX = -(py - 0.5) * 4;

    // Magnetic micro-offset for inner content: 1 - 2.5px
    const magX = (px - 0.5) * 3;
    const magY = (py - 0.5) * 2;

    setTilt({ rotX, rotY, magX, magY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotX: 0, rotY: 0, magX: 0, magY: 0 });
  };

  const Icon = item.icon;

  const badgeColorMap: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-700',
    primary: 'bg-blue-100 text-blue-700',
    rose: 'bg-rose-100 text-rose-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
  };

  const badgeClass = item.badgeVariant
    ? badgeColorMap[item.badgeVariant] || badgeColorMap.primary
    : badgeColorMap.primary;

  return (
    <div
      className="db-sb-nav-item-wrap db-role-item-stagger"
      style={{ animationDelay: `${item.animDelayMs}ms` }}
    >
      <NavLink
        ref={itemRef}
        to={item.path}
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(600px) rotateX(${tilt.rotX.toFixed(2)}deg) rotateY(${tilt.rotY.toFixed(2)}deg) translateZ(4px) scale(1.02) translateX(2.5px)`
            : 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1) translateX(0px)',
          transition: isHovered
            ? 'transform 60ms linear, box-shadow 200ms ease, border-color 200ms ease'
            : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, border-color 300ms ease',
        }}
        className={({ isActive }) =>
          `db-sidebar-nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all select-none cursor-pointer ${item.iconClass} ${
            isActive
              ? 'db-sidebar-nav-active'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200/80 hover:shadow-sm'
          }`
        }
      >
        {({ isActive }) => (
          <div
            className="flex items-center gap-3 w-full"
            style={{
              transform: isHovered
                ? `translate3d(${tilt.magX.toFixed(1)}px, ${tilt.magY.toFixed(1)}px, 0)`
                : 'translate3d(0, 0, 0)',
              transition: isHovered
                ? 'transform 60ms linear'
                : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="db-nav-icon">
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
            </span>
            <span className="flex-1 truncate">{item.label}</span>
            {item.label === 'Dashboard' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 db-active-dot-pulse" />
            )}
            {item.badge && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${badgeClass}`}>
                {item.badge}
              </span>
            )}
          </div>
        )}
      </NavLink>
    </div>
  );
};

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isOpen = false,
  onClose,
  activeRole,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const validatedRole: UserRole =
    activeRole === 'TRAINER' || activeRole === 'ADMIN' ? activeRole : 'TRAINEE';

  const [displayedRole, setDisplayedRole] = useState<UserRole>(validatedRole);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth role transition without abrupt replace
  useEffect(() => {
    if (validatedRole !== displayedRole) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedRole(validatedRole);
        setIsTransitioning(false);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [validatedRole, displayedRole]);

  const roleConfig = ROLE_NAVIGATION_CONFIG[displayedRole] || ROLE_NAVIGATION_CONFIG.TRAINEE;
  const rolePrefix = `/${displayedRole.toLowerCase()}`;

  const navItems: NavItemWithDelay[] = roleConfig.items.map((item, idx) => ({
    ...item,
    path: `${rolePrefix}${item.pathSuffix}`,
    animDelayMs: 40 + idx * 45,
  }));

  const { data: traineeProfile } = useQuery({
    queryKey: ['traineeProfile', user?.email],
    queryFn: () => learnerService.getTraineeProfile(),
  });

  const roleMeta: Record<UserRole, { name: string; subtitle: string }> = {
    TRAINEE: {
      name: traineeProfile?.name || user?.name || 'SkillSync Learner',
      subtitle: `Level ${currentUserProfile.level} Explorer`,
    },
    TRAINER: {
      name: user?.name || 'Prof. Vikram Rao',
      subtitle: 'Lead Instructor',
    },
    ADMIN: {
      name: user?.name || 'Dr. Rajesh Verma',
      subtitle: 'System Administrator',
    },
  };

  const currentMeta = roleMeta[displayedRole] || roleMeta.TRAINEE;

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div
            onClick={() => navigate(`${rolePrefix}/dashboard`)}
            className="flex items-center gap-3 db-sidebar-logo-anim cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/20 overflow-hidden">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                <img
                  src="https://res.cloudinary.com/djmqwehwk/image/upload/v1789454602/Skill_Sync_WB_ehnf16.png"
                  alt="SkillSync Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight text-sm leading-tight">
                Skill<span className="text-blue-600">Sync</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase mt-0.5">
                Capacity Intelligence
              </div>
            </div>
          </div>

          {/* Close for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {/* Role Section Title Header */}
          <div className="flex items-center justify-between px-3 py-1.5 mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {roleConfig.sectionTitle}
            </span>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 tracking-wider">
              {displayedRole}
            </span>
          </div>

          {/* Role Items with transition wrapper */}
          <div
            key={displayedRole}
            className={`space-y-1 ${
              isTransitioning ? 'db-role-items-exit' : 'db-role-items-enter'
            }`}
          >
            {navItems.map((item) => (
              <SidebarNavItem key={item.id} item={item} onClose={onClose} />
            ))}
          </div>
        </div>

        {/* Footer Profile Mini-card */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/60">
          <div
            onClick={() => navigate(`${rolePrefix}/profile`)}
            className="p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs mb-2 flex items-center gap-3 db-profile-card-anim cursor-pointer"
          >
            <img
              src={traineeProfile?.photoUrl || user?.profile?.photoUrl || (currentMeta.name ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentMeta.name)}&backgroundColor=0284c7,2563eb,7c3aed&textColor=ffffff` : currentUserProfile.avatarUrl)}
              alt={currentMeta.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 db-profile-avatar-anim"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-900 truncate">
                {currentMeta.name}
              </div>
              <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span className="truncate">{currentMeta.subtitle}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
