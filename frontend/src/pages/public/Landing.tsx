import { Link } from 'react-router-dom';
import { BookOpen, Shield, Award, Users, BarChart } from 'lucide-react';

export function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand">
          <div className="brand-logo">CAP<span>ACITY</span></div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-outline">Sign In</Link>
          <Link to="/register" className="btn">Get Started</Link>
        </div>
      </nav>
      <header className="landing-hero">
        <div className="landing-hero-tag">IMD · MoES · SIH 2026</div>
        <h1>Digital Capacity Building & Learning Portal</h1>
        <p>A unified platform for continuous professional development, knowledge sharing, and competency tracking across the India Meteorological Department.</p>
        <div className="landing-hero-ctas" style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32 }}>
          <Link to="/register" className="btn" style={{ fontSize: 16, padding: '12px 24px' }}>Start Learning</Link>
        </div>
      </header>
    </div>
  );
}
