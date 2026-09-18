import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { PlusCircle, ArrowLeft, BookOpen, Clock, Target, Layers } from 'lucide-react';

export function CreateCourse() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Meteorology',
    department: 'IMD Learning Centre',
    level: 'BEGINNER',
    durationHours: 1,
    learningObjectives: '',
    status: 'DRAFT',
  });

  const m = useMutation({
    mutationFn: () => unwrap<any>(api.post('/courses', {
      ...form,
      durationHours: Number(form.durationHours),
      learningObjectives: form.learningObjectives.split('\n').filter(x => x.trim()),
    })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      navigate('/trainer/courses');
    },
  });

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-0 space-y-6 animate-fadeIn">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate('/trainer/courses')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Course
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Draft a new learning programme and define curriculum milestones
          </p>
        </div>
      </div>

      {/* Centered Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <form onSubmit={e => { e.preventDefault(); m.mutate(); }} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. Advanced Radar Meteorology & Severe Weather Tracking"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium shadow-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide a thorough overview of the learning outcomes, target audience, and prerequisites..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium resize-vertical min-h-[100px] shadow-xs"
            />
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium cursor-pointer shadow-xs"
              >
                <option value="Meteorology">Meteorology</option>
                <option value="Professional Development">Professional Development</option>
                <option value="Research">Research</option>
                <option value="Technical">Technical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Level
              </label>
              <select
                value={form.level}
                onChange={e => setForm({ ...form, level: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium cursor-pointer shadow-xs"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Duration (Hours) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={form.durationHours}
              onChange={e => setForm({ ...form, durationHours: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium shadow-xs"
            />
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Learning Objectives (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="Understand radar reflectivity principles&#10;Analyze doppler velocity signatures&#10;Deploy early storm warning protocols"
              value={form.learningObjectives}
              onChange={e => setForm({ ...form, learningObjectives: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium resize-vertical min-h-[90px] shadow-xs"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium cursor-pointer shadow-xs"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={m.isPending}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{m.isPending ? 'Creating Course…' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
