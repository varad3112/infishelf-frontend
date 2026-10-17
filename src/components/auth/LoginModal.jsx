import { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setFormError('Please enter your username or email address and password.');
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      await login(username.trim(), password, rememberMe);
      success('Signed in successfully.');
      onClose();
      setUsername('');
      setPassword('');
      setRememberMe(false);
    } catch (err) {
      const respData = err.response?.data;
      let msg = 'Invalid username/email or password. Please try again.';
      if (respData) {
        if (typeof respData === 'string' && !respData.trim().startsWith('<')) {
          msg = respData;
        } else if (respData.message && typeof respData.message === 'string') {
          msg = respData.message;
        } else if (respData.detail && typeof respData.detail === 'string') {
          msg = respData.detail;
        } else if (respData.error && typeof respData.error === 'string') {
          msg = respData.error;
        }
      }
      setFormError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign in to InfiShelf"
      subtitle="Access full catalog management, AI generation, and CRUD tools."
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <img
          src="/logo.png"
          alt="InfiShelf Logo"
          style={{ width: '44px', height: '44px', objectFit: 'contain' }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {formError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--color-danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-danger)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <Input
          label="Username or Email Address"
          name="username"
          required
          autoFocus
          placeholder="username or user@example.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem' }}>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: 'var(--text-white)',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: 'var(--accent-primary)',
                cursor: 'pointer',
              }}
            />
            <span>Remember me (keep me logged in on this browser)</span>
          </label>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={LogIn}
            style={{ width: '100%', fontWeight: 700 }}
          >
            Sign In
          </Button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{
                color: 'var(--accent-sky)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Create one now
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}
