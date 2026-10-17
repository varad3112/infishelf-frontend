import { useState } from 'react';
import { LogOut } from 'lucide-react';

export function Navbar({
  user,
  totalProducts = 0,
  onOpenLogin,
  onOpenRegister,
  onOpenAddProduct,
  onLogout,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="wrap nav">
      {/* Brand Logo */}
      <a className="brand" href="#home" aria-label="InfiShelf home">
        <span className="brand-mark">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M5 8h22M5 16h22M5 24h22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M7 16c0-6 7-7 9 0s9 6 9 0-7-7-9 0-9 6-9 0Z" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </span>
        <span>InfiShelf</span>
      </a>

      {/* Nav Links */}
      <nav className={`navlinks ${isMenuOpen ? 'open' : ''}`} id="navlinks">
        <a href="#platform" onClick={() => setIsMenuOpen(false)}>The platform</a>
        <a href="#features" onClick={() => setIsMenuOpen(false)}>What you can do</a>
        {!user && (
          <div className="mobile-auth-links" style={{ display: 'none', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
            <button className="btn" onClick={() => { setIsMenuOpen(false); onOpenLogin(); }}>
              Sign In
            </button>
            <button className="btn primary" onClick={() => { setIsMenuOpen(false); onOpenRegister(); }}>
              Get Started ↗
            </button>
          </div>
        )}
      </nav>

      {/* Right Actions */}
      <div className="nav-actions">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="user-avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--blue-soft)', color: 'var(--blue)', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                {user.username.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {user.username}
              </span>
            </div>
            <button className="btn" onClick={onLogout} aria-label="Log out" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <>
            <button className="btn" onClick={onOpenLogin}>
              Sign In
            </button>
            <button className="btn primary" onClick={onOpenRegister}>
              Get Started <span aria-hidden="true">↗</span>
            </button>
            <button
              className="menu-toggle"
              id="menuToggle"
              aria-label="Open navigation"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              ☰
            </button>
          </>
        )}
      </div>
    </header>
  );
}
