import { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, passwordConfirm } = formData;

    if (!username.trim() || !email.trim() || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password !== passwordConfirm) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      await register(username, email, password, passwordConfirm);
      success('Account created successfully! Welcome to InfiShelf.');
      onClose();
      setFormData({ username: '', email: '', password: '', passwordConfirm: '' });
    } catch (err) {
      const respData = err.response?.data;
      let msg = 'Registration failed. Please check your information.';
      if (respData) {
        if (typeof respData === 'string') {
          msg = respData;
        } else if (respData.detail) {
          msg = respData.detail;
        } else if (typeof respData === 'object') {
          const errorEntries = Object.entries(respData)
            .map(([field, errors]) => {
              const fieldName = field.replace('_', ' ');
              const errorText = Array.isArray(errors) ? errors.join(' ') : String(errors);
              return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${errorText}`;
            });
          if (errorEntries.length > 0) {
            msg = errorEntries.join(' | ');
          }
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
      title="Create InfiShelf Account"
      subtitle="Register to publish, edit, and orchestrate AI product catalogs."
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
          placeholder="e.g. janesmith"
          value={formData.username}
          onChange={handleChange}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          required
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          label="Confirm Password"
          name="passwordConfirm"
          type="password"
          required
          placeholder="Re-enter password"
          value={formData.passwordConfirm}
          onChange={handleChange}
        />

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={UserPlus}
            style={{ width: '100%', fontWeight: 700 }}
          >
            Create Account
          </Button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={{
                color: 'var(--accent-sky)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Sign in instead
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}
