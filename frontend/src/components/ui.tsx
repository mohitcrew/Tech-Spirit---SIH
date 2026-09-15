export const Button = ({ children, className = '', variant = 'primary', size = 'md', ...props }: any) => {
  const cls = `btn ${variant === 'outline' ? 'btn-outline' : variant === 'danger' ? 'btn-danger' : variant === 'success' ? 'btn-success' : ''} ${size === 'sm' ? 'btn-sm' : ''} ${className}`;
  return <button className={cls} {...props}>{children}</button>;
};

export const Card = ({ children, className = '' }: any) => (
  <div className={`card ${className}`}>{children}</div>
);

export const Badge = ({ children, variant = 'blue' }: any) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

export const Loading = ({ text = 'Loading data…' }: any) => (
  <div className="state-box loading-pulse">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/>
    </svg>
    <p>{text}</p>
  </div>
);

export const Empty = ({ children = 'No records found.', icon }: any) => (
  <div className="state-box">
    {icon || (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
      </svg>
    )}
    <p>{children}</p>
  </div>
);

export const ErrorState = ({ message = 'Something went wrong.' }: any) => (
  <div className="state-box">
    <p style={{ color: '#dc2626' }}>{message}</p>
  </div>
);

export const PageTitle = ({ title, subtitle, action }: any) => (
  <div className="page-title">
    <div className="page-title-text">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const TextLink = ({ to, children, className = '' }: any) => {
  const { Link } = require('react-router-dom');
  return <Link className={`link ${className}`} to={to}>{children}</Link>;
};

export const ProgressBar = ({ value, color = 'teal' }: any) => (
  <div className="progress-bar">
    <div className={`progress-fill${color === 'blue' ? ' progress-fill-blue' : ''}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

export const Alert = ({ type = 'info', children }: any) => (
  <div className={`alert alert-${type}`}>{children}</div>
);

export const StatCard = ({ label, value, sub, icon }: any) => (
  <div className="stat-card">
    {icon && <div className="stat-icon">{icon}</div>}
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);
