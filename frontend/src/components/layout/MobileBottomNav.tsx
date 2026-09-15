import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Target, Users, UserRound } from 'lucide-react';

interface MobileBottomNavProps {
  activeRole: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeRole }) => {
  const rolePrefix = `/${activeRole.toLowerCase()}`;

  const tabs = [
    { label: 'Learn', path: `${rolePrefix}/dashboard`, icon: LayoutDashboard },
    { label: 'Explore', path: `${rolePrefix}/courses`, icon: Compass },
    { label: 'Skills', path: `${rolePrefix}/skills`, icon: Target },
    { label: 'Community', path: `${rolePrefix}/community`, icon: Users },
    { label: 'Profile', path: `${rolePrefix}/profile`, icon: UserRound },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.label}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-[10px] mt-0.5">{tab.label}</span>
                {isActive && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
