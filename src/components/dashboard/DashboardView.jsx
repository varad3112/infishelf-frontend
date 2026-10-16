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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getStatistics();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('Failed to load catalog metrics. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
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

  if (error || !stats) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error-banner">
          <p>{error || 'Unable to display dashboard data.'}</p>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchStats}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  // Pre-calculate percentages for max visual bar width
  const maxCategoryCount = Math.max(...(stats.category_distribution?.map((c) => c.count) || [1]), 1);
  const maxBrandCount = Math.max(...(stats.brand_distribution?.map((b) => b.count) || [1]), 1);

  return (
    <div className="dashboard-container">
      {/* Top Header & Actions */}
      <div className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="dashboard-title">Catalog Intelligence Dashboard</h1>
            <span className="live-pulse-badge">Live System</span>
          </div>
          <p className="dashboard-subtitle">
            Real-time analytics, aisle distributions, pricing tiers, and inventory valuations.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={fetchStats}
            title="Refresh statistics"
          >
            Refresh
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
            style={{ fontWeight: 700 }}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Total Products */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Package size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Products</span>
            <span className="kpi-value">{stats.total_products}</span>
            <span className="kpi-meta">Active shelf SKUs</span>
          </div>
        </div>

        {/* Categories */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <Layers size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Active Aisles</span>
            <span className="kpi-value">{stats.total_categories}</span>
            <span className="kpi-meta">Distinct categories</span>
          </div>
        </div>

        {/* Brands */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Building2 size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">FMCG Brands</span>
            <span className="kpi-value">{stats.total_brands}</span>
            <span className="kpi-meta">Manufacturers listed</span>
          </div>
        </div>

        {/* Average Price */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Average Price</span>
            <span className="kpi-value">Rs. {Number(stats.average_price).toFixed(2)}</span>
            <span className="kpi-meta">Across all items</span>
          </div>
        </div>

        {/* Total Inventory Value */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
            <DollarSign size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Catalog Valuation</span>
            <span className="kpi-value">Rs. {Number(stats.total_inventory_value).toFixed(2)}</span>
            <span className="kpi-meta">Sum of unit prices</span>
          </div>
        </div>

        {/* Price Range */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: '#f1f5f9', color: '#475569' }}>
            <Tag size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Price Range</span>
            <span className="kpi-value" style={{ fontSize: '1.25rem' }}>
              Rs. {stats.min_price} – {stats.max_price}
            </span>
            <span className="kpi-meta">Min to Max unit cost</span>
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
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
                      <span className="bar-count">{cat.count} items</span>
                      <span className="bar-pct">({cat.percentage}%)</span>
                      <span className="bar-avg">Avg: Rs. {cat.avg_price}</span>
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
              <h2 className="panel-title">Price Tier Segments</h2>
              <span className="panel-subtitle">Catalog volume grouped by price range</span>
            </div>
            <Badge variant="secondary">Price Tiers</Badge>
          </div>

          <div className="price-tiers-grid">
            {stats.price_ranges?.map((tier) => (
              <div key={tier.label} className="price-tier-card">
                <span className="tier-label">{tier.label}</span>
                <span className="tier-count">{tier.count}</span>
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
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
              TOP BRANDS BY SKU COUNT
            </h3>
            <div className="brand-pills-wrap">
              {stats.brand_distribution?.map((b) => (
                <div key={b.brand} className="brand-pill">
                  <span className="brand-name">{b.brand}</span>
                  <span className="brand-badge-count">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Catalog Additions */}
      <div className="dashboard-panel" style={{ marginTop: '1.5rem' }}>
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
                    <div className="recent-item-info">
                      <img
                        src={item.image_url || '/placeholder.png'}
                        alt={item.name}
                        className="recent-item-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';
                        }}
                      />
                      <span className="recent-item-name" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="table-cat-badge">{item.category}</span>
                  </td>
                  <td>
                    <span className="table-brand-text">{item.brand}</span>
                  </td>
                  <td>
                    <span className="table-price-text">Rs. {Number(item.price).toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="table-date-text">
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
    </div>
  );
}
