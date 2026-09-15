import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  id,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const inputId = id ?? 'auth-field-password';

  return (
    <div className="skillsync-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="skillsync-password-wrap">
        <input
          id={inputId}
          type={show ? 'text' : 'password'}
          className={`skillsync-input skillsync-password-input${error ? ' has-error' : ''}`}
          {...props}
        />
        <button
          type="button"
          className="skillsync-eye"
          onClick={() => setShow(v => !v)}
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && (
        <span className="skillsync-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};