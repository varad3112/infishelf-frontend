import { Sparkles, ShieldCheck, Database, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-white)' }}>InfiShelf</span>
          <span>•</span>
          <span>CPG & Retail Shelf Intelligence Platform</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={14} color="var(--accent-sky)" />
            <span>PostgreSQL & Django 5</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={14} color="#a855f7" />
            <span>Google Gemini GenAI</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>JWT Stateless Auth</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
