import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { PlusCircle } from 'lucide-react';

export function CreateCourse() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: '', description: '', category: 'Meteorology', department: 'IMD Learning Centre',
    level: 'BEGINNER', durationHours: 1, learningObjectives: '', status: 'DRAFT'
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
    <>
      <div className="page-title">
        <div className="page-title-text">
          <h1>Create Course</h1>
          <p>Draft a new learning programme</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={e => { e.preventDefault(); m.mutate(); }}>
          <div className="form-group">
            <label>Title</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="Meteorology">Meteorology</option>
                <option value="Professional Development">Professional Development</option>
                <option value="Research">Research</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Level</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Duration (Hours)</label>
            <input type="number" min="1" required value={form.durationHours} onChange={e => setForm({ ...form, durationHours: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Learning Objectives (one per line)</label>
            <textarea value={form.learningObjectives} onChange={e => setForm({ ...form, learningObjectives: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <button className="btn" type="submit" disabled={m.isPending}><PlusCircle size={16} /> {m.isPending ? 'Creating…' : 'Create Course'}</button>
        </form>
      </div>
    </>
  );
}
