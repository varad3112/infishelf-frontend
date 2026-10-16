import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function Input({
  label,
  error,
  type = 'text',
  className = '',
  id,
  required = false,
  extraLabel,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>
            {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
          </span>
          {extraLabel}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          id={inputId}
          type={effectiveType}
          className={`input-field ${error ? 'input-error' : ''}`}
          style={isPassword ? { paddingRight: '2.5rem' } : {}}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.2rem',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-white)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = '',
  id,
  required = false,
  extraLabel,
  rows = 4,
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>
            {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
          </span>
          {extraLabel}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
