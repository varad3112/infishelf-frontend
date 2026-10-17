import { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  Building2,
  DollarSign,
  TrendingUp,
  Tag,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export function DashboardView({ onNavigateToManage, onOpenAddProduct, onViewProduct }) {
  const cached = productService.getCachedStatistics();
  const [stats, setStats] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async (force = false) => {
    if (force) {
      setRefreshing(true);
    } else if (!stats && !productService.getCachedStatistics()) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await productService.getStatistics(force);
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      if (!stats) {
        setError('Failed to load catalog metrics. Please check connection and try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // If we don't have fresh cache, fetch in background or cold load
    fetchStats(false);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Catalog Intelligence Dashboard</h1>
            <p className="dashboard-subtitle">Loading metrics and retail analytics...</p>
          </div>
        </div>
        <div className="kpi-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="kpi-card skeleton-card" style={{ height: '110px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error-banner">
          <p>{error || 'Unable to display dashboard data.'}</p>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => fetchStats(true)}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  // Pre-calculate percentages for max visual bar width
  const maxCategoryCount = Math.max(...(stats?.category_distribution?.map((c) => c.count) || [1]), 1);

  return (
    <div className="dashboard-container">
      {/* Top Header & Actions */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Catalog Intelligence Dashboard</h1>
          <p className="dashboard-subtitle">Real-time inventory metrics, brand analytics, and retail pricing tiers.</p>
        </div>

        <div className="dashboard-header-actions">
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className={refreshing ? 'animate-spin' : ''}
            title="Refresh statistics"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={ArrowRight}
            onClick={onNavigateToManage}
          >
            Manage Catalog
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={onOpenAddProduct}
            style={{ fontWeight: 600 }}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* 01 — KEY METRICS */}
      <section className="dashboard-section">
        <div className="dashboard-section-label">01 — KEY METRICS</div>
        <div className="kpi-grid">
          {/* Total Products */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Total Products</span>
              <div className="kpi-icon-pill" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Package size={16} />
              </div>
            </div>
            <div className="kpi-value tabular-nums">{stats.total_products}</div>
            <span className="kpi-meta">Active shelf SKUs</span>
          </div>

          {/* Active Aisles */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Active Aisles</span>
              <div className="kpi-icon-pill" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Layers size={16} />
              </div>
            </div>
            <div className="kpi-value tabular-nums">{stats.total_categories}</div>
            <span className="kpi-meta">Distinct categories</span>
          </div>

          {/* FMCG Brands */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">FMCG Brands</span>
              <div className="kpi-icon-pill" style={{ background: '#ecfdf5', color: '#059669' }}>
                <Building2 size={16} />
              </div>
            </div>
            <div className="kpi-value tabular-nums">{stats.total_brands}</div>
            <span className="kpi-meta">Manufacturers listed</span>
          </div>

          {/* Average Price */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Average Price</span>
              <div className="kpi-icon-pill" style={{ background: '#fef3c7', color: '#d97706' }}>
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="kpi-value tabular-nums">
              ₹{Number(stats.average_price).toFixed(2)}
            </div>
            <span className="kpi-meta">Across all items</span>
          </div>

          {/* Catalog Valuation */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Catalog Valuation</span>
              <div className="kpi-icon-pill" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                <DollarSign size={16} />
              </div>
            </div>
            <div className="kpi-value tabular-nums" title={`₹${Number(stats.total_inventory_value).toFixed(2)}`}>
              ₹{Number(stats.total_inventory_value).toFixed(2)}
            </div>
            <span className="kpi-meta">Sum of unit prices</span>
          </div>

          {/* Price Range */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-label">Price Range</span>
              <div className="kpi-icon-pill" style={{ background: '#f1f5f9', color: '#475569' }}>
                <Tag size={16} />
              </div>
            </div>
            <div className="kpi-value tabular-nums price-range-val" title={`₹${stats.min_price}–${stats.max_price}`}>
              ₹{stats.min_price}–{stats.max_price}
            </div>
            <span className="kpi-meta">Min to max</span>
          </div>
        </div>
      </section>

      {/* 02 — ANALYTICS */}
      <section className="dashboard-section">
        <div className="dashboard-section-label">02 — ANALYTICS</div>
        <div className="dashboard-grid-2col">
          {/* Category Breakdown Visualizer */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Category Distribution</h2>
                <span className="panel-subtitle">Product allocation across retail aisles</span>
              </div>
              <Badge variant="primary">{stats.category_distribution?.length || 0} Aisles</Badge>
            </div>

            <div className="category-bars-list">
              {stats.category_distribution?.map((cat) => {
                const widthPct = Math.round((cat.count / maxCategoryCount) * 100);
                return (
                  <div key={cat.category} className="category-bar-item">
                    <div className="bar-labels">
                      <span className="bar-name">{cat.category}</span>
                      <div className="bar-meta-right">
                        <span className="bar-count tabular-nums">{cat.count} items</span>
                        <span className="bar-pct tabular-nums">({cat.percentage}%)</span>
                        <span className="bar-avg tabular-nums">Avg: ₹{cat.avg_price}</span>
                      </div>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill category-fill"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Tier Breakdown */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Price Distribution</h2>
                <span className="panel-subtitle">Catalog volume grouped by price tier</span>
              </div>
              <Badge variant="secondary">Price Tiers</Badge>
            </div>

            <div className="price-tiers-grid">
              {stats.price_ranges?.map((tier) => (
                <div key={tier.label} className="price-tier-card">
                  <span className="tier-label">{tier.label.replace(/Rs\.\s*/g, '₹')}</span>
                  <span className="tier-count tabular-nums">{tier.count}</span>
                  <span className="tier-subtext">Products</span>
                  <div className="tier-bar-track">
                    <div
                      className="tier-bar-fill"
                      style={{
                        width: `${stats.total_products > 0 ? (tier.count / stats.total_products) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Brands Visual Mini Ranking */}
            <div className="brands-ranking-section">
              <h3 className="brands-ranking-title">
                TOP BRANDS BY SKU COUNT
              </h3>
              <div className="brand-pills-wrap">
                {stats.brand_distribution?.map((b) => (
                  <div key={b.brand} className="brand-pill">
                    <span className="brand-name">{b.brand}</span>
                    <span className="brand-badge-count tabular-nums">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — RECENTLY ADDED PRODUCTS */}
      <section className="dashboard-section">
        <div className="dashboard-section-label">03 — RECENTLY ADDED PRODUCTS</div>
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Recently Added Shelf Products</h2>
              <span className="panel-subtitle">Latest items synced to the catalog</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              onClick={onNavigateToManage}
            >
              View All in Catalog
            </Button>
          </div>

          <div className="recent-products-table-wrap">
            <table className="recent-table">
              <thead>
                <tr>
                  <th style={{ width: '48px' }}>Packshot</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Unit Price</th>
                  <th>Added</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_products?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image_url || '/placeholder.png'}
                        alt={item.name}
                        className="recent-item-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <span className="recent-item-name" title={item.name}>
                        {item.name}
                      </span>
                    </td>
                    <td>
                      <span className="table-cat-badge">{item.category}</span>
                    </td>
                    <td>
                      <span className="table-brand-text">{item.brand}</span>
                    </td>
                    <td>
                      <span className="table-price-text tabular-nums">₹{Number(item.price).toFixed(2)}</span>
                    </td>
                    <td>
                      <span className="table-date-text tabular-nums">
                        <Clock size={12} style={{ marginRight: 4, display: 'inline' }} />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProduct(item)}
                      >
                        Quick View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
