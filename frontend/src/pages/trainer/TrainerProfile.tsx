import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageTitle, Alert } from '../../components/ui';

export default function TrainerProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState<any>(user?.profile ?? {});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => unwrap<any>(api.patch('/users/me', { profile: form })),
    onSuccess: (updated) => {
      setUser({ ...user!, profile: updated.profile ?? updated });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Update failed.'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fields: { key: string; label: string; type?: string }[] = [
    { key: 'phone', label: 'Phone Number' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'experience', label: 'Years of Experience', type: 'number' },
  ];

  return (
    <>
      <PageTitle title="My Profile" subtitle="Update your trainer profile information." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
        {/* Avatar card */}
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#1677a8,#00a6a6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
              margin: '0 auto 16px',
            }}
          >
            {user?.name
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
          <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>{user?.email}</div>
          <span className="badge badge-amber">TRAINER</span>
          {user?.profile?.department && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#64748b' }}>
              {user.profile.department}
            </div>
          )}
        </div>

        {/* Form card */}
        <div className="card">
          <h3 style={{ marginBottom: 20, fontWeight: 600 }}>Profile Information</h3>
          {success && <Alert type="success">Profile updated successfully.</Alert>}
          {error && <Alert type="error">{error}</Alert>}

          <div className="form-grid-2">
            {fields.map(({ key, label, type }) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <input
                  name={key}
                  type={type ?? 'text'}
                  value={form[key] ?? ''}
                  onChange={handleChange}
                  placeholder={label}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input
              name="skills"
              value={Array.isArray(form.skills) ? form.skills.join(', ') : (form.skills ?? '')}
              onChange={(e) =>
                setForm({
                  ...form,
                  skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="e.g. NWP, Data Analysis, Python"
            />
          </div>

          <div className="form-group">
            <label>Interests (comma-separated)</label>
            <input
              name="interests"
              value={Array.isArray(form.interests) ? form.interests.join(', ') : (form.interests ?? '')}
              onChange={(e) =>
                setForm({
                  ...form,
                  interests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="e.g. Climate Science, Remote Sensing"
            />
          </div>

          <button
            className="btn"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>
    </>
  );
}
