export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-inner">
          <div>
            <a className="brand" href="#home" style={{ color: '#fff' }}>
              <span className="brand-mark">
                <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M5 8h22M5 16h22M5 24h22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M7 16c0-6 7-7 9 0s9 6 9 0-7-7-9 0-9 6-9 0Z" stroke="#818cf8" strokeWidth="2.5" />
                </svg>
              </span>
              <span>InfiShelf</span>
            </a>
            <p style={{ marginTop: '14px', lineHeight: 1.55 }}>
              A clearer way to bring products together, keep details organized, and find what matters.
            </p>
          </div>

          <div className="footer-links">
            <a href="#platform">The platform</a>
            <a href="#features">Features</a>
          </div>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} InfiShelf. Made for better product discovery.
        </div>
      </div>
    </footer>
  );
}
