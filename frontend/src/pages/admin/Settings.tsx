import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Lock, Bell, Palette, User } from 'lucide-react';
import { api, unwrap } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageTitle, Alert } from '../../components/ui';

export default function Settings() {
  const { user } = useAuth();

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const [notifPrefs, setNotifPrefs] = useState({
    courseUpdates: true,
    assessmentResults: true,
    announcements: true,
    systemAlerts: false,
  });

  const [theme, setTheme] = useState<'light' | 'system'>('system');

  const changePwMutation = useMutation({
    mutationFn: () =>
      unwrap<any>(
        api.patch('/users/me/password', {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        })
      ),
    onSuccess: () => {
      setPwSuccess('Password changed successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwError('');
      setTimeout(() => setPwSuccess(''), 3000);
    },
    onError: (e: any) => setPwError(e?.response?.data?.message ?? 'Password change failed.'),
  });

  const handlePwSubmit = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwError('');
    changePwMutation.mutate();
  };

  return (
    <>
      <PageTitle title="Settings" subtitle="Manage your account and preferences." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Account Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <User size={18} color="#1677a8" />
            <h3 style={{ margin: 0, fontWeight: 600 }}>Account Information</h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}
          >
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Role', value: user?.role },
              { label: 'Status', value: user?.status },
              { label: 'Department', value: user?.profile?.department ?? '—' },
              { label: 'Employee ID', value: user?.profile?.employeeId ?? '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Lock size={18} color="#1677a8" />
            <h3 style={{ margin: 0, fontWeight: 600 }}>Change Password</h3>
          </div>

          {pwSuccess && <Alert type="success">{pwSuccess}</Alert>}
          {pwError && <Alert type="error">{pwError}</Alert>}

          <div className="form-grid-2" style={{ maxWidth: 480 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Current Password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                placeholder="Min. 8 characters"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPassword: e.target.value })
                }
                placeholder="Repeat new password"
              />
            </div>
          </div>

          <button
            className="btn"
            onClick={handlePwSubmit}
            disabled={changePwMutation.isPending || !passwords.currentPassword || !passwords.newPassword}
          >
            {changePwMutation.isPending ? 'Updating…' : 'Update Password'}
          </button>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Bell size={18} color="#1677a8" />
            <h3 style={{ margin: 0, fontWeight: 600 }}>Notification Preferences</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(
              [
                ['courseUpdates', 'Course updates and new content'],
                ['assessmentResults', 'Assessment results and grading'],
                ['announcements', 'Platform announcements'],
                ['systemAlerts', 'System alerts and maintenance'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={notifPrefs[key]}
                  onChange={(e) =>
                    setNotifPrefs({ ...notifPrefs, [key]: e.target.checked })
                  }
                  style={{ width: 16, height: 16 }}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <button className="btn" style={{ marginTop: 16 }}>
            Save Preferences
          </button>
        </div>

        {/* Theme */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Palette size={18} color="#1677a8" />
            <h3 style={{ margin: 0, fontWeight: 600 }}>Theme Preference</h3>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {(['light', 'system'] as const).map((t) => (
              <button
                key={t}
                className={`btn btn-sm ${theme === t ? '' : 'btn-outline'}`}
                onClick={() => setTheme(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>
            Currently: <strong>{theme === 'system' ? 'System default' : 'Light mode'}</strong>
          </p>
        </div>
      </div>
    </>
  );
}
