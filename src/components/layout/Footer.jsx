import { Sparkles, ShieldCheck, Database, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-white)' }}>InfiShelf</span>
          <span>•</span>
          <span>Enterprise Product & Category Management Platform</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={14} color="var(--accent-primary)" />
            <span>PostgreSQL & Django REST</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={14} color="#6366f1" />
            <span>Natural Language Search</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>JWT Authentication</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
