import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageTitle, Loading, Alert } from '../../components/ui';

interface UserFull {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: {
    phone?: string;
    employeeId?: string;
    department?: string;
    designation?: string;
    qualification?: string;
    experience?: number;
    skills?: string[];
    interests?: string[];
  };
}

export default function TraineeProfile() {
  const { setUser } = useAuth();
  const qc = useQueryClient();

  const { data: me, isLoading } = useQuery<UserFull>({
    queryKey: ['me'],
    queryFn: () => unwrap<UserFull>(api.get('/users/me')),
  });

  const [form, setForm] = useState({
    name: '',
    phone: '',
    employeeId: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    skills: '',
    interests: '',
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (me) {
      setForm({
        name: me.name ?? '',
        phone: me.profile?.phone ?? '',
        employeeId: me.profile?.employeeId ?? '',
        department: me.profile?.department ?? '',
        designation: me.profile?.designation ?? '',
        qualification: me.profile?.qualification ?? '',
        experience: String(me.profile?.experience ?? ''),
        skills: (me.profile?.skills ?? []).join(', '),
        interests: (me.profile?.interests ?? []).join(', '),
      });
    }
  }, [me]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus('idle');
    try {
      const payload = {
        name: form.name,
        profile: {
          phone: form.phone,
          employeeId: form.employeeId,
          department: form.department,
          designation: form.designation,
          qualification: form.qualification,
          experience: form.experience ? Number(form.experience) : undefined,
          skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
          interests: form.interests ? form.interests.split(',').map((s) => s.trim()).filter(Boolean) : [],
        },
      };
      const updated = await unwrap<UserFull>(api.patch('/users/me', payload));
      setUser(updated as any);
      await qc.invalidateQueries({ queryKey: ['me'] });
      setStatus('success');
    } catch (err: any) {
      setErrMsg(err?.response?.data?.message ?? 'Failed to save. Please try again.');
      setStatus('error');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <Loading />;

  return (
    <>
      <PageTitle
        title="My Profile"
        subtitle="Update your personal and professional information."
      />

      {status === 'success' && (
        <Alert type="success">Profile updated successfully!</Alert>
      )}
      {status === 'error' && (
        <Alert type="error">{errMsg}</Alert>
      )}

      <form onSubmit={handleSave}>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>Personal Information</h2>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input value={me?.email ?? ''} readOnly style={{ background: '#f9fafb', cursor: 'not-allowed' }} />
              <span className="form-hint">Email cannot be changed.</span>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
            </div>
            <div className="form-group">
              <label>Employee ID</label>
              <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP-001" />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '1.25rem' }}>
          <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>Professional Details</h2>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Department</label>
              <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Software Engineer" />
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. B.Tech" />
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                name="experience"
                type="number"
                min="0"
                value={form.experience}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label>Skills <span className="form-hint">(comma-separated)</span></label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, SQL"
            />
          </div>
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label>Interests <span className="form-hint">(comma-separated)</span></label>
            <input
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="e.g. AI/ML, Cloud Computing"
            />
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn" disabled={saving}>
            <Save size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
            {saving ? 'Savingâ€¦' : 'Save Changes'}
          </button>
        </div>
      </form>
    </>
  );
}
