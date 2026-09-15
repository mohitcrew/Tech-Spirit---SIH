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
    sectionTitle: 'Learning Portal',
    roleBadge: 'Student / Learner',
    items: [
      { id: 'dashboard', label: 'Dashboard', pathSuffix: '/dashboard', icon: LayoutDashboard, iconClass: 'db-icon-dash' },
      { id: 'learning', label: 'My Learning', pathSuffix: '/learning', icon: BookOpen, iconClass: 'db-icon-learning' },
      { id: 'courses', label: 'Explore Courses', pathSuffix: '/courses', icon: Compass, iconClass: 'db-icon-courses' },
      { id: 'paths', label: 'Learning Paths', pathSuffix: '/paths', icon: Route, iconClass: 'db-icon-paths' },
      { id: 'skills', label: 'Skills', pathSuffix: '/skills', icon: Target, iconClass: 'db-icon-skills' },
      { id: 'certificates', label: 'Certificates', pathSuffix: '/certificates', icon: Award, iconClass: 'db-icon-certs' },
      { id: 'knowledge', label: 'Knowledge Hub', pathSuffix: '/knowledge', icon: BookMarked, iconClass: 'db-icon-knowledge' },
      { id: 'community', label: 'Community', pathSuffix: '/community', icon: Users, iconClass: 'db-icon-community', badge: 'New', badgeVariant: 'purple' },
      { id: 'leaderboard', label: 'Leaderboard', pathSuffix: '/leaderboard', icon: Trophy, iconClass: 'db-icon-leaderboard' },
      { id: 'calendar', label: 'Calendar', pathSuffix: '/calendar', icon: Calendar, iconClass: 'db-icon-calendar' },
      { id: 'help', label: 'Help & Support', pathSuffix: '/help', icon: HelpCircle, iconClass: 'db-icon-help' },
    ],
  },
  TRAINER: {
    role: 'TRAINER',
    sectionTitle: 'Trainer Portal',
    roleBadge: 'Trainer / Educator',
    items: [
      { id: 'dashboard', label: 'Dashboard', pathSuffix: '/dashboard', icon: LayoutDashboard, iconClass: 'db-icon-dash' },
      { id: 'courses', label: 'My Courses', pathSuffix: '/courses', icon: BookOpen, iconClass: 'db-icon-learning' },
      { id: 'create-course', label: 'Create Course', pathSuffix: '/courses/create', icon: PlusCircle, iconClass: 'db-icon-create-course', badge: 'Action', badgeVariant: 'primary' },
      { id: 'learners', label: 'Manage Learners', pathSuffix: '/trainees', icon: Users, iconClass: 'db-icon-manage-learners' },
      { id: 'assignments', label: 'Assignments & Quizzes', pathSuffix: '/assessments', icon: ClipboardCheck, iconClass: 'db-icon-assignments' },
      { id: 'sessions', label: 'Live Sessions', pathSuffix: '/sessions', icon: Video, iconClass: 'db-icon-live-sessions', badge: 'Live', badgeVariant: 'rose' },
      { id: 'skills', label: 'Skills & Competencies', pathSuffix: '/skills', icon: Target, iconClass: 'db-icon-skills' },
      { id: 'certificates', label: 'Certificates', pathSuffix: '/certificates', icon: Award, iconClass: 'db-icon-certs' },
      { id: 'knowledge', label: 'Knowledge Hub', pathSuffix: '/knowledge', icon: BookMarked, iconClass: 'db-icon-knowledge' },
      { id: 'community', label: 'Community', pathSuffix: '/community', icon: Users, iconClass: 'db-icon-community' },
      { id: 'analytics', label: 'Analytics', pathSuffix: '/analytics', icon: BarChart3, iconClass: 'db-icon-analytics' },
      { id: 'calendar', label: 'Calendar', pathSuffix: '/calendar', icon: Calendar, iconClass: 'db-icon-calendar' },
      { id: 'help', label: 'Help & Support', pathSuffix: '/help', icon: HelpCircle, iconClass: 'db-icon-help' },
    ],
  },
  ADMIN: {
    role: 'ADMIN',
    sectionTitle: 'Admin Portal',
    roleBadge: 'System Admin',
    items: [
      { id: 'dashboard', label: 'Dashboard', pathSuffix: '/dashboard', icon: LayoutDashboard, iconClass: 'db-icon-dash' },
      { id: 'users', label: 'User Management', pathSuffix: '/users', icon: ShieldCheck, iconClass: 'db-icon-users-admin' },
      { id: 'trainees', label: 'Trainee Management', pathSuffix: '/trainees', icon: GraduationCap, iconClass: 'db-icon-trainees-admin' },
      { id: 'trainers', label: 'Trainer Management', pathSuffix: '/trainers', icon: Briefcase, iconClass: 'db-icon-trainers-admin' },
      { id: 'courses', label: 'Course Management', pathSuffix: '/courses', icon: Layers, iconClass: 'db-icon-courses-admin' },
      { id: 'paths', label: 'Learning Paths', pathSuffix: '/paths', icon: Route, iconClass: 'db-icon-paths' },
      { id: 'skills', label: 'Skills & Competencies', pathSuffix: '/skills', icon: Target, iconClass: 'db-icon-skills' },
      { id: 'certificates', label: 'Certificates', pathSuffix: '/certificates', icon: Award, iconClass: 'db-icon-certs' },
      { id: 'analytics', label: 'Reports & Analytics', pathSuffix: '/analytics', icon: BarChart3, iconClass: 'db-icon-analytics' },
      { id: 'settings', label: 'System Settings', pathSuffix: '/settings', icon: Settings, iconClass: 'db-icon-settings' },
      { id: 'knowledge', label: 'Knowledge Hub', pathSuffix: '/knowledge', icon: BookMarked, iconClass: 'db-icon-knowledge' },
      { id: 'help', label: 'Help & Support', pathSuffix: '/help', icon: HelpCircle, iconClass: 'db-icon-help' },
    ],
  },
};
