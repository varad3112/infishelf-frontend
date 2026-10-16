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
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setFormError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      await login(username, password);
      success(`Welcome back, ${username}!`);
      onClose();
      setUsername('');
      setPassword('');
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Invalid username or password. Please try again.';
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
          label="Username"
          name="username"
          required
          autoFocus
          placeholder="e.g. alex_cpg"
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

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
