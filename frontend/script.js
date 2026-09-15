const fs = require('fs');
let code = import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, unwrap } from '../../services/api';
import { BookOpen, Shield, Users, CheckCircle, Award, BarChart } from 'lucide-react';

function FormField({ label, type = 'text', value, onChange, required }: any) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} />
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('trainee@capacityconnect.demo');
  const [password, setPassword] = useState('Demo@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate('/' + user.role.toLowerCase() + '/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <div className="auth-hero-tag">CAPACITY CONNECT - SIH 2026</div>
        <h1>Build Skills. Share Knowledge. Strengthen Capacity.</h1>
        <p>India Meteorological Department's digital learning ecosystem for professional excellence and capacity development.</p>
        <div className="auth-hero-features">
          {[
            [BookOpen, 'Structured learning programmes'],
            [Award, 'Trusted digital certifications'],
            [BarChart, 'Data-driven competency tracking'],
            [Shield, 'Secure, government-grade platform'],
          ].map(([Icon, text]: any) => (
            <div key={text} className="auth-hero-feature" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <Icon size={16} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-panel" style={{ padding: 40, width: '100%', maxWidth: 480, margin: '0 auto' }}>
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p style={{ marginBottom: 20 }}>Sign in to continue your learning journey</p>
          <form onSubmit={handleSubmit}>
            <FormField label="Email address" type="email" value={email} onChange={setEmail} required />
            <FormField label="Password" type="password" value={password} onChange={setPassword} required />
            {error && <div className="form-error" style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
            <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="auth-footer-link" style={{ marginTop: 20, textAlign: 'center' }}>
            New to the platform? <Link to="/register" className="link">Create account</Link>
          </div>
          <div style={{ marginTop: 24, padding: '14px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e3e9ef', fontSize: 12, color: '#64748b' }}>
            <strong style={{ display: 'block', color: '#183044', marginBottom: 6 }}>Demo credentials</strong>
            {[
              ['Admin', 'admin@capacityconnect.demo'],
              ['Trainer', 'trainer@capacityconnect.demo'],
              ['Trainee', 'trainee@capacityconnect.demo'],
            ].map(([role, em]) => (
              <div key={role} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>{role}:</span>
                <button type="button" style={{ background: 'none', border: 0, color: '#1677a8', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                  onClick={() => { setEmail(em); setPassword('Demo@12345'); }}>
                  {em}
                </button>
              </div>
            ))}
            <div style={{ marginTop: 4 }}>Password: <strong>Demo@12345</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'TRAINEE', department: '', designation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await unwrap(api.post('/auth/register', form));
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <div className="auth-hero-tag">CAPACITY CONNECT - SIH 2026</div>
        <h1>Join the IMD Learning Ecosystem</h1>
        <p>Create your professional learning profile and access structured courses, assessments, and certifications.</p>
        <div className="auth-hero-features">
          {[
            [Users, 'Role-based access: Trainee or Trainer'],
            [BookOpen, 'Access published courses immediately'],
            [CheckCircle, 'Track your learning progress'],
            [Award, 'Earn certificates on completion'],
          ].map(([Icon, text]: any) => (
            <div key={text} className="auth-hero-feature" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <Icon size={16} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-panel" style={{ padding: 40, width: '100%', maxWidth: 480, margin: '0 auto' }}>
        <div className="auth-card">
          <h2>Create your account</h2>
          <p style={{ marginBottom: 20 }}>Fill in the details below to get started</p>
          <form onSubmit={handleSubmit}>
            <FormField label="Full name" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} required />
            <FormField label="Email address" type="email" value={form.email} onChange={(v: string) => setForm({ ...form, email: v })} required />
            <FormField label="Password" type="password" value={form.password} onChange={(v: string) => setForm({ ...form, password: v })} required />
            <div className="form-group" style={{ marginBottom: 15 }}>
              <label>Register as</label>
              <select style={{ width: '100%', padding: 8 }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="TRAINEE">Trainee (Learner)</option>
                <option value="TRAINER">Trainer (Instructor)</option>
              </select>
            </div>
            {error && <div className="form-error" style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
            <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <div className="auth-footer-link" style={{ marginTop: 20, textAlign: 'center' }}>
            Already have an account? <Link to="/login" className="link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
fs.writeFileSync('src/pages/auth/AuthPages.tsx', code, 'utf8');
