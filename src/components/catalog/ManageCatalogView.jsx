import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  Package,
  Layers,
  X,
  DollarSign,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CATEGORIES } from './CategoryFilter';

export function ManageCatalogView({
  products = [],
  pagination = {},
  loading = false,
  error = null,
  refetch,
  filters = {},
  updateFilter,
  resetFilters,
  setPage,
  isAiMode = false,
  toggleAiMode,
  parsedIntent = null,
  canManage = true,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
}) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [minPriceInput, setMinPriceInput] = useState(filters.min_price || '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.max_price || '');

  // Keep local inputs synchronized when external filters change (e.g. on reset)
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    setMinPriceInput(filters.min_price || '');
  }, [filters.min_price]);

  useEffect(() => {
    setMaxPriceInput(filters.max_price || '');
  }, [filters.max_price]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateFilter('search', '');
  };

  const handlePriceApply = () => {
    updateFilter('min_price', minPriceInput);
    updateFilter('max_price', maxPriceInput);
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePriceApply();
    }
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.category && filters.category !== 'All Categories') ||
    filters.min_price ||
    filters.max_price ||
    (filters.ordering && filters.ordering !== '-created_at')
  );

  return (
    <div className="manage-catalog-container">
      {/* Page Title & Main Action Header */}
      <div className="manage-catalog-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 className="manage-title">Product Catalog</h1>
            <Badge variant="primary">{pagination.count || products.length} SKUs Listed</Badge>
          </div>
          <p className="manage-subtitle">
            Manage product inventory, category allocations, SKU pricing, and smart natural language search.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={onOpenAddProduct}
          style={{ fontWeight: 700 }}
        >
          Add Product
        </Button>
      </div>

      {/* Primary Toolbar: Search + AI Toggle + Filters */}
      <div className="manage-toolbar">
        {/* Search Bar with AI Smart Search Toggle */}
        <form onSubmit={handleSearchSubmit} className="manage-search-form">
          <div className="manage-search-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="manage-search-input"
              placeholder={
                isAiMode
                  ? "Natural language query (e.g. 'cold beverages under 50', 'healthy snacks')..."
                  : "Search products by name, brand, or SKU..."
              }
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={handleClearSearch}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>

          {/* AI Mode Toggle Button */}
          {toggleAiMode && (
            <button
              type="button"
              className={`manage-ai-toggle-btn ${isAiMode ? 'active' : ''}`}
              onClick={toggleAiMode}
              title={isAiMode ? 'Smart search active (click for standard search)' : 'Switch to natural language smart search'}
              aria-label="Toggle Natural Language Search"
            >
              <Sparkles size={14} />
              <span>{isAiMode ? 'Smart Active' : 'Smart Search'}</span>
            </button>
          )}
        </form>

        {/* Filter Controls: Category + Price Bounds + Sorter */}
        <div className="manage-filter-group">
          {/* Category Aisle Selector */}
          <div className="filter-select-wrap">
            <Filter size={15} className="select-icon" />
            <select
              className="manage-select"
              value={filters.category || 'All Categories'}
              onChange={(e) => updateFilter('category', e.target.value)}
              aria-label="Filter by Category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter Inputs */}
          <div className="manage-price-inputs" title="Filter by price in Rs.">
            <div className="price-input-wrap">
              <span className="price-currency">Rs.</span>
              <input
                type="number"
                placeholder="Min"
                className="price-mini-field"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                onBlur={handlePriceApply}
                onKeyDown={handlePriceKeyDown}
                min="0"
                step="0.5"
                aria-label="Minimum Price"
              />
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>–</span>
            <div className="price-input-wrap">
              <span className="price-currency">Rs.</span>
              <input
                type="number"
                placeholder="Max"
                className="price-mini-field"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                onBlur={handlePriceApply}
                onKeyDown={handlePriceKeyDown}
                min="0"
                step="0.5"
                aria-label="Maximum Price"
              />
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div className="filter-select-wrap">
            <ArrowUpDown size={15} className="select-icon" />
            <select
              className="manage-select"
              value={filters.ordering || '-created_at'}
              onChange={(e) => updateFilter('ordering', e.target.value)}
              aria-label="Sort Products"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="-name">Name: Z to A</option>
            </select>
          </div>

          {/* Reset Filters CTA */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput('');
                setMinPriceInput('');
                setMaxPriceInput('');
                resetFilters();
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* AI Smart Search Intent Banner */}
      {isAiMode && parsedIntent && (
        <section className="ai-intent-banner">
          <div className="intent-header">
            <Sparkles size={18} className="intent-icon" />
            <span className="intent-title">Parsed Query Intent</span>
          </div>
          <div className="intent-badges">
            {parsedIntent.category && (
              <span className="intent-badge">Aisle: {parsedIntent.category}</span>
            )}
            {parsedIntent.brand && (
              <span className="intent-badge">Brand: {parsedIntent.brand}</span>
            )}
            {parsedIntent.max_price && (
              <span className="intent-badge">Under Rs. {parsedIntent.max_price}</span>
            )}
            {parsedIntent.min_price && (
              <span className="intent-badge">Above Rs. {parsedIntent.min_price}</span>
            )}
            {parsedIntent.keywords && parsedIntent.keywords.length > 0 && (
              <span className="intent-badge">Keywords: {parsedIntent.keywords.join(', ')}</span>
            )}
          </div>
          {parsedIntent.summary && (
            <div className="intent-summary-text">
              <span>💡</span> {parsedIntent.summary}
            </div>
          )}
        </section>
      )}

      {/* Error Banner with Retry */}
      {error && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'var(--color-danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-danger)' }}>
            <AlertCircle size={20} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Error loading catalog</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{error}</span>
            </div>
          </div>
          {refetch && (
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={refetch}>
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Product List Table */}
      <div className="manage-table-card">
        <div className="manage-table-responsive">
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '64px' }}>Packshot</th>
                <th>Product Name & Brand</th>
                <th>Category Aisle</th>
                <th>Price (Rs.)</th>
                <th>Semantic Tags</th>
                <th>Created</th>
                <th style={{ textAlign: 'right', minWidth: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="manage-table-row">
                    <td>
                      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 6 }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '70%', height: 16, marginBottom: 6 }} />
                      <div className="skeleton" style={{ width: '40%', height: 12 }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: 110, height: 22, borderRadius: 12 }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: 64, height: 16 }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: 120, height: 20, borderRadius: 12 }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: 75, height: 14 }} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="skeleton" style={{ width: 95, height: 30, marginLeft: 'auto' }} />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <div className="manage-empty-state">
                      <Package size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.65rem' }} />
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                        {isAiMode ? 'No products matched AI search' : 'No products found'}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1rem' }}>
                        {filters.search
                          ? `No items found matching "${filters.search}". Try clearing search or adjusting category/price bounds.`
                          : 'No products currently match your active filters.'}
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSearchInput('');
                            setMinPriceInput('');
                            setMaxPriceInput('');
                            resetFilters();
                          }}
                        >
                          Reset All Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="manage-table-row">
                    {/* Thumbnail Packshot */}
                    <td>
                      <div className="table-thumb-wrap">
                        <img
                          src={item.image_url || '/placeholder.png'}
                          alt={item.name}
                          className="table-thumb-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';
                          }}
                        />
                      </div>
                    </td>

                    {/* Product Name & Brand */}
                    <td>
                      <div className="table-product-cell">
                        <button
                          type="button"
                          className="table-product-name-btn"
                          onClick={() => onViewProduct(item)}
                          title="Click to view full product details"
                        >
                          {item.name}
                        </button>
                        <span className="table-product-brand">{item.brand}</span>
                      </div>
                    </td>

                    {/* Category Aisle */}
                    <td>
                      <span className="table-cat-badge">{item.category}</span>
                    </td>

                    {/* Price */}
                    <td>
                      <span className="table-price-bold">
                        Rs. {Number(item.price).toFixed(2)}
                      </span>
                    </td>

                    {/* Tags */}
                    <td>
                      <div className="table-tags-wrap">
                        {Array.isArray(item.tags) && item.tags.length > 0 ? (
                          item.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="table-tag-pill">
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                        )}
                        {item.tags?.length > 2 && (
                          <span className="table-tag-more">+{item.tags.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Created Date */}
                    <td>
                      <span className="table-date-text">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-action-buttons">
                        <button
                          className="table-action-icon-btn view"
                          onClick={() => onViewProduct(item)}
                          title="View Details"
                          aria-label="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="table-action-icon-btn edit"
                          onClick={() => onEditProduct(item)}
                          title="Edit Product"
                          aria-label="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="table-action-icon-btn delete"
                          onClick={() => onDeleteProduct(item)}
                          title="Delete Product"
                          aria-label="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        {pagination && pagination.total_pages > 1 && (
          <div className="manage-table-footer">
            <span className="table-footer-meta">
              Showing page <strong>{pagination.current_page}</strong> of{' '}
              <strong>{pagination.total_pages}</strong> ({pagination.count} products)
            </span>

            <div className="table-pagination-nav">
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.current_page <= 1}
                onClick={() => setPage(pagination.current_page - 1)}
              >
                Previous
              </Button>

              <div className="page-numbers-list">
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === pagination.total_pages ||
                      Math.abs(p - pagination.current_page) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    return (
                      <span key={p} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        {prev && p - prev > 1 && (
                          <span style={{ padding: '0 4px', color: 'var(--text-muted)' }}>...</span>
                        )}
                        <button
                          className={`page-pill-btn ${p === pagination.current_page ? 'active' : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.current_page >= pagination.total_pages}
                onClick={() => setPage(pagination.current_page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
