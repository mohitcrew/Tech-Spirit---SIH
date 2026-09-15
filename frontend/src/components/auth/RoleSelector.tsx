import React from 'react';
import { BookOpen, GraduationCap, LineChart, Shield } from 'lucide-react';

export type RoleType = 'student' | 'lecturer' | 'admin' | 'management';

interface RoleSelectorProps {
  selectedRole: RoleType;
  onSelect: (role: RoleType) => void;
}

const ROLES: {
  id: RoleType;
  title: string;
  desc: string;
  Icon: React.ElementType;
}[] = [
  {
    id:    'student',
    title: 'Student',
    desc:  'Track skills and learning journey',
    Icon:  GraduationCap,
  },
  {
    id:    'lecturer',
    title: 'Lecturer',
    desc:  'Guide and evaluate students',
    Icon:  BookOpen,
  },
  {
    id:    'admin',
    title: 'Admin',
    desc:  'Manage the SkillSync platform',
    Icon:  Shield,
  },
  {
    id:    'management',
    title: 'Management Team',
    desc:  'Monitor institutional performance',
    Icon:  LineChart,
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelect,
}) => (
  <div className="skillsync-role-grid" aria-label="Choose your role" role="group">
    {ROLES.map(({ id, title, desc, Icon }) => {
      const active = selectedRole === id;
      return (
        <button
          key={id}
          type="button"
          data-role={id}
          onClick={() => onSelect(id)}
          className={`skillsync-role-card${active ? ' is-active' : ''}`}
          aria-pressed={active}
        >
          <span className="skillsync-role-icon">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <span className="skillsync-role-copy">
            <strong>{title}</strong>
            <small>{desc}</small>
          </span>
        </button>
      );
    })}
  </div>
);