import {
  ArrowRight,
  Search,
  BarChart3,
  Layers,
  Database,
  FileCode2,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { DOCS_URL } from '../../services/api';

export function LandingPageView({
  onOpenLogin,
  onOpenRegister,
}) {
  return (
    <div className="landing-container">
      {/* Background Subtle Gradient */}
      <div className="landing-ambient-glow" />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-pill-badge">
          <Layers size={14} className="hero-pill-icon" />
          <span>Product Catalog & Inventory System</span>
        </div>

        <h1 className="landing-hero-title">
          <span>Enterprise Product Catalog &</span>
          <br />
          <span className="landing-gradient-text">Category Management</span>
        </h1>

        <p className="landing-hero-desc">
          A centralized platform to manage FMCG and retail product catalogs, organize category aisles,
          execute natural-language search, generate descriptions, and monitor inventory analytics.
        </p>

        <div className="landing-hero-actions">
          <button className="hero-btn-primary" onClick={onOpenLogin}>
            <span>Sign In to Catalog</span>
            <ArrowRight size={16} />
          </button>

          <button className="hero-btn-secondary" onClick={onOpenRegister}>
            <span>Register Account</span>
          </button>

          <a
            href={DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="hero-btn-secondary"
          >
            <FileCode2 size={16} />
            <span>API Documentation</span>
          </a>
        </div>

        {/* Catalog Table Preview Card */}
        <div className="landing-preview-card">
          <div className="preview-card-header">
            <div className="preview-card-title-wrap">
              <Package size={18} style={{ color: '#2563eb' }} />
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                Catalog Overview
              </strong>
              <span className="preview-badge-status">
                <CheckCircle2 size={12} />
                Live Catalog
              </span>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenLogin}
              style={{ fontSize: '0.78rem' }}
            >
              Sign In to View All
            </button>
          </div>

          <table className="preview-table">
            <thead>
              <tr>
                <th>Product & Brand</th>
                <th>Category Aisle</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="preview-prod-name">Coca-Cola Zero Sugar Cans (Pack of 12)</div>
                  <div className="preview-prod-brand">Coca-Cola</div>
                </td>
                <td><span className="preview-aisle-badge">Beverages & Energy Drinks</span></td>
                <td><span className="preview-price">Rs. 7.99</span></td>
                <td><span className="badge badge-sky">In Stock</span></td>
              </tr>
              <tr>
                <td>
                  <div className="preview-prod-name">Chobani Greek Yogurt Mixed Berry 150g</div>
                  <div className="preview-prod-brand">Chobani</div>
                </td>
                <td><span className="preview-aisle-badge">Dairy & Breakfast</span></td>
                <td><span className="preview-price">Rs. 1.89</span></td>
                <td><span className="badge badge-sky">In Stock</span></td>
              </tr>
              <tr>
                <td>
                  <div className="preview-prod-name">Doritos Nacho Cheese Tortilla Chips 200g</div>
                  <div className="preview-prod-brand">Frito-Lay</div>
                </td>
                <td><span className="preview-aisle-badge">Snacks & Confectionery</span></td>
                <td><span className="preview-price">Rs. 3.49</span></td>
                <td><span className="badge badge-sky">In Stock</span></td>
              </tr>
              <tr>
                <td>
                  <div className="preview-prod-name">Dove Deep Moisture Hydrating Body Wash 650ml</div>
                  <div className="preview-prod-brand">Unilever</div>
                </td>
                <td><span className="preview-aisle-badge">Personal Care & Grooming</span></td>
                <td><span className="preview-price">Rs. 8.99</span></td>
                <td><span className="badge badge-sky">In Stock</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="landing-stats-bar">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-num blue">7+</span>
            <span className="stat-label">Product Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">Fast</span>
            <span className="stat-label">Search Indexing</span>
          </div>
          <div className="stat-item">
            <span className="stat-num blue">PostgreSQL</span>
            <span className="stat-label">Cloud Database</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">OpenAPI 3.0</span>
            <span className="stat-label">Documented Endpoints</span>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="landing-features-section">
        <div className="section-tag">Platform Features</div>
        <h2 className="section-title">Core Management Capabilities</h2>
        <p className="section-subtitle">
          Standardized tools designed for category managers, inventory specialists, and retail operations teams.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-circle">
              <Package size={22} />
            </div>
            <h3 className="feature-title">Product Catalog Management</h3>
            <p className="feature-description">
              Create, update, and manage product records including commercial names, brands, packaging sizes, pricing, and category aisles.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle indigo">
              <Search size={22} />
            </div>
            <h3 className="feature-title">Natural Language Search</h3>
            <p className="feature-description">
              Search the catalog using descriptive phrases like <em>"breakfast cereal"</em> or <em>"beverages under 10"</em> with automatic constraint parsing.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <BarChart3 size={22} />
            </div>
            <h3 className="feature-title">Inventory Analytics</h3>
            <p className="feature-description">
              Review category distributions, brand shares, average pricing, and total catalog valuation on an executive dashboard.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle indigo">
              <Database size={22} />
            </div>
            <h3 className="feature-title">Enterprise API Architecture</h3>
            <p className="feature-description">
              Built on Django REST Framework, PostgreSQL persistence, stateless JWT authentication, and interactive Swagger documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="landing-cta-banner">
        <h2 className="cta-banner-title">Access the Product Catalog</h2>
        <p className="cta-banner-desc">
          Sign in or create an account to view the full product directory, manage inventory items, and access analytics.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button className="hero-btn-primary" onClick={onOpenLogin}>
            <span>Sign In to Catalog</span>
            <ArrowRight size={16} />
          </button>
          <button className="hero-btn-secondary" onClick={onOpenRegister}>
            <span>Register Account</span>
          </button>
        </div>
      </section>
    </div>
  );
}
