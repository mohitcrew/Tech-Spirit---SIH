import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Route,
  Target,
  Award,
  BookMarked,
  Users,
  Trophy,
  Calendar,
  HelpCircle,
  PlusCircle,
  ClipboardCheck,
  Video,
  BarChart3,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Layers,
  Settings,
  Mail,
} from 'lucide-react';
import { UserRole } from '../context/AuthContext';

export interface SidebarItemConfig {
  id: string;
  label: string;
  pathSuffix: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  badge?: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'purple' | 'rose';
}

export interface RoleNavigationConfig {
  role: UserRole;
  sectionTitle: string;
  roleBadge: string;
  items: SidebarItemConfig[];
}

export const ROLE_NAVIGATION_CONFIG: Record<UserRole, RoleNavigationConfig> = {
  TRAINEE: {
    role: 'TRAINEE',
    sectionTitle: 'Learning & Career Portal',
    roleBadge: 'Trainee / Learner',
    items: [
      { id: 'dashboard', label: 'Dashboard', pathSuffix: '/dashboard', icon: LayoutDashboard, iconClass: 'db-icon-dash' },
      { id: 'learning', label: 'My Learning', pathSuffix: '/learning', icon: BookOpen, iconClass: 'db-icon-learning' },
      { id: 'paths', label: 'Learning Paths', pathSuffix: '/paths', icon: Route, iconClass: 'db-icon-paths' },
      { id: 'skills', label: 'Skills', pathSuffix: '/skills', icon: Target, iconClass: 'db-icon-skills' },
      { id: 'roadmap', label: 'Career Roadmap', pathSuffix: '/roadmap', icon: Route, iconClass: 'db-icon-paths', badge: 'AI', badgeVariant: 'primary' },
      { id: 'certificates', label: 'Certificates', pathSuffix: '/certificates', icon: Award, iconClass: 'db-icon-certs' },
      { id: 'knowledge', label: 'Knowledge Hub', pathSuffix: '/knowledge', icon: BookMarked, iconClass: 'db-icon-knowledge' },
      { id: 'community', label: 'Community', pathSuffix: '/community', icon: Users, iconClass: 'db-icon-community', badge: 'Active', badgeVariant: 'purple' },
      { id: 'leaderboard', label: 'Leaderboard', pathSuffix: '/leaderboard', icon: Trophy, iconClass: 'db-icon-leaderboard' },
      { id: 'calendar', label: 'Calendar', pathSuffix: '/calendar', icon: Calendar, iconClass: 'db-icon-calendar' },
      { id: 'profile', label: 'My Profile', pathSuffix: '/profile', icon: GraduationCap, iconClass: 'db-icon-trainees-admin' },
      { id: 'help', label: 'Help & Support', pathSuffix: '/help', icon: HelpCircle, iconClass: 'db-icon-help' },
    ],
  },
  TRAINER: {
    role: 'TRAINER',
    sectionTitle: 'Trainer & Educator Portal',
    roleBadge: 'Trainer / Educator',
    items: [
      { id: 'dashboard', label: 'Trainer Dashboard', pathSuffix: '/dashboard', icon: LayoutDashboard, iconClass: 'db-icon-dash' },
      { id: 'courses', label: 'My Courses', pathSuffix: '/courses', icon: BookOpen, iconClass: 'db-icon-learning' },
      { id: 'create-course', label: 'Create Course', pathSuffix: '/courses/create', icon: PlusCircle, iconClass: 'db-icon-create-course', badge: 'Action', badgeVariant: 'primary' },
      { id: 'learners', label: 'Assigned Learners', pathSuffix: '/trainees', icon: Users, iconClass: 'db-icon-manage-learners' },
      { id: 'sessions', label: 'Training Sessions', pathSuffix: '/sessions', icon: Video, iconClass: 'db-icon-live-sessions', badge: 'Live', badgeVariant: 'rose' },
      { id: 'assignments', label: 'Assessments', pathSuffix: '/assessments', icon: ClipboardCheck, iconClass: 'db-icon-assignments' },
      { id: 'competencies', label: 'Competencies', pathSuffix: '/skills', icon: Target, iconClass: 'db-icon-skills' },
      { id: 'knowledge', label: 'Knowledge Hub', pathSuffix: '/knowledge', icon: BookMarked, iconClass: 'db-icon-knowledge' },
      { id: 'community', label: 'Community', pathSuffix: '/community', icon: Users, iconClass: 'db-icon-community' },
      { id: 'calendar', label: 'Calendar', pathSuffix: '/calendar', icon: Calendar, iconClass: 'db-icon-calendar' },
      { id: 'profile', label: 'My Profile', pathSuffix: '/profile', icon: Briefcase, iconClass: 'db-icon-trainers-admin' },
      { id: 'help', label: 'Help & Support', pathSuffix: '/help', icon: HelpCircle, iconClass: 'db-icon-help' },
    ],
  },
  ADMIN: {
    role: 'ADMIN',
    sectionTitle: 'Administration & Governance',
    roleBadge: 'Platform Admin',
    items: [
      { id: 'dashboard', label: 'Admin Dashboard', pathSuffix: '/dashboard', icon: LayoutDashboard, iconClass: 'db-icon-dash' },
      { id: 'users', label: 'User Management', pathSuffix: '/users', icon: ShieldCheck, iconClass: 'db-icon-users-admin' },
      { id: 'email-center', label: 'Email Command Center', pathSuffix: '/email-center', icon: Mail, iconClass: 'db-icon-mail', badge: 'Live', badgeVariant: 'primary' },
      { id: 'courses', label: 'Course Catalog', pathSuffix: '/courses', icon: Layers, iconClass: 'db-icon-courses-admin' },
      { id: 'trainees', label: 'Learners Directory', pathSuffix: '/trainees', icon: GraduationCap, iconClass: 'db-icon-trainees-admin' },
      { id: 'skills', label: 'Skills & Competencies', pathSuffix: '/skills', icon: Target, iconClass: 'db-icon-skills' },
      { id: 'paths', label: 'Learning Paths', pathSuffix: '/paths', icon: Route, iconClass: 'db-icon-paths' },
      { id: 'certificates', label: 'Certificates Authority', pathSuffix: '/certificates', icon: Award, iconClass: 'db-icon-certs' },
      { id: 'analytics', label: 'Reports & Analytics', pathSuffix: '/analytics', icon: BarChart3, iconClass: 'db-icon-analytics' },
      { id: 'knowledge', label: 'Knowledge Hub', pathSuffix: '/knowledge', icon: BookMarked, iconClass: 'db-icon-knowledge' },
      { id: 'community', label: 'Community', pathSuffix: '/community', icon: Users, iconClass: 'db-icon-community' },
      { id: 'audit-logs', label: 'Audit Logs', pathSuffix: '/audit-logs', icon: ShieldCheck, iconClass: 'db-icon-users-admin' },
      { id: 'settings', label: 'System Settings', pathSuffix: '/settings', icon: Settings, iconClass: 'db-icon-settings' },
      { id: 'profile', label: 'Admin Profile', pathSuffix: '/profile', icon: Briefcase, iconClass: 'db-icon-trainers-admin' },
      { id: 'help', label: 'Help & Support', pathSuffix: '/help', icon: HelpCircle, iconClass: 'db-icon-help' },
    ],
  },
};
