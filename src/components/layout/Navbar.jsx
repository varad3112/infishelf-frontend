import { Layers, Plus, LogIn, UserPlus, LogOut, FileCode2, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export function Navbar({
  user,
  totalProducts = 0,
  onOpenLogin,
  onOpenRegister,
  onOpenAddProduct,
  onLogout,
}) {
  return (
    <header className="navbar">
      <div className="container navbar-content">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/" className="brand-logo">
            <span className="brand-dot" />
            <span>InfiShelf</span>
            <span className="brand-badge">Enterprise Catalog</span>
          </a>

          {/* Quick Counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.65rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              color: 'var(--text-subtle)',
            }}
          >
            <Layers size={12} color="var(--accent-primary)" />
            <span>
              <strong>{totalProducts}</strong> products
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Swagger Docs Link */}
          <a
            href="http://localhost:8000/api/docs/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <FileCode2 size={14} />
            <span>API Docs</span>
          </a>

          {/* User Auth Controls */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-badge">
                <span className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-white)' }}>
                  {user.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={onLogout}
                aria-label="Log out"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Button
                variant="ghost"
                size="sm"
                icon={LogIn}
                onClick={onOpenLogin}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={onOpenRegister}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
