import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  const inputId = id ?? `auth-field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="skillsync-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={`skillsync-input${error ? ' has-error' : ''} ${className}`.trim()}
        {...props}
      />
      {error && (
        <span className="skillsync-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};