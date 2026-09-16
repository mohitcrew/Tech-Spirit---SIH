import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, Award, Compass } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { learnerService } from '../../services/learnerService';
import { useAuth } from '../../context/AuthContext';
import { CourseCard } from '../courses/CourseCard';

export const RecommendedSection: React.FC = () => {
  const { user } = useAuth();
  const rolePrefix = `/${user?.role?.toLowerCase() || 'trainee'}`;

  // Get trainee profile target skills or gaps
  const profile = learnerService.getTraineeProfile();
  const targetSkills = profile?.skills?.map(s => s.name) || [
    'Python',
    'Data Analysis',
    'Machine Learning',
    'Cybersecurity',
    'Climate Modeling',
  ];

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['dashboard-recommendations', targetSkills],
    queryFn: () => courseService.getRecommendedCourses(targetSkills, { limit: 3 }),
  });

  if (isLoading) {
    return (
      <div className="mb-8 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center animate-pulse">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading personalized course recommendations...</p>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 mb-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Personalized Course Recommendation</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skill-Based Course Recommendations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real courses from the Excel catalogue matched to your target competency profile
          </p>
        </div>

        <Link
          to={`${rolePrefix}/courses`}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Browse All 2,025 Courses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recommendations.map(rec => (
          <CourseCard
            key={rec.course.id}
            course={rec.course}
            rolePrefix={rolePrefix}
            matchPercentage={rec.matchPercentage}
            recommendationReason={rec.recommendationReason}
          />
        ))}
      </div>
    </div>
  );
};
