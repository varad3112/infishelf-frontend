import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  Upload,
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
  onOpenBulkUpload,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
}) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [minPriceInput, setMinPriceInput] = useState(filters.min_price || '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.max_price || '');
  const [previewImage, setPreviewImage] = useState(null);

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
      {/* Top Main Action Header */}
      <div className="manage-catalog-header">
        <div className="manage-header-title-wrap">
          <span className="manage-catalog-count-badge">
            <Package size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>{pagination.count ?? products.length} SKUs</span>
          </span>
        </div>

        <div className="manage-header-actions">
          {canManage && (
            <>
              <Button
                variant="secondary"
                size="md"
                icon={Upload}
                onClick={onOpenBulkUpload}
                className="btn-bulk-upload"
                title="Bulk upload products from CSV file"
              >
                Import CSV
              </Button>

              <Button
                variant="primary"
                size="md"
                icon={PlusCircle}
                onClick={onOpenAddProduct}
                className="btn-add-product"
                style={{ fontWeight: 700 }}
              >
                Add Product
              </Button>
            </>
          )}
        </div>
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
              placeholder="Search products by name, brand, SKU, or natural description..."
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
          <div className="manage-price-inputs" title="Filter by price in ₹">
            <div className="price-input-wrap">
              <span className="price-currency">₹</span>
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
              <span className="price-currency">₹</span>
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
      {parsedIntent && (
        <section className="ai-intent-banner">
          <div className="intent-header">
            <Sparkles size={18} className="intent-icon" />
            <span className="intent-title">AI Semantic Search Intent</span>
          </div>
          <div className="intent-badges">
            {parsedIntent.category && (
              <span className="intent-badge">Aisle: {parsedIntent.category}</span>
            )}
            {parsedIntent.brand && (
              <span className="intent-badge">Brand: {parsedIntent.brand}</span>
            )}
            {parsedIntent.max_price && (
              <span className="intent-badge">Under ₹{parsedIntent.max_price}</span>
            )}
            {parsedIntent.min_price && (
              <span className="intent-badge">Above ₹{parsedIntent.min_price}</span>
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
        {/* Desktop Table View (>= 768px) */}
        <div className="manage-table-responsive desktop-only-table">
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '56px', minWidth: '56px' }}>Packshot</th>
                <th style={{ minWidth: '220px' }}>Product Name & Brand</th>
                <th style={{ width: '140px', minWidth: '140px' }}>Category Aisle</th>
                <th style={{ width: '115px', minWidth: '115px', whiteSpace: 'nowrap' }}>Unit Price</th>
                <th style={{ width: '160px', minWidth: '160px' }}>Semantic Tags</th>
                <th style={{ width: '100px', minWidth: '100px', whiteSpace: 'nowrap' }}>Created</th>
                <th style={{ width: '120px', minWidth: '120px', textAlign: 'right' }}>Actions</th>
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
                        No products found
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
                      <div
                        className="table-thumb-wrap clickable-thumb"
                        onClick={() => setPreviewImage({ url: item.image_url, name: item.name })}
                        title="Click to view full packshot image"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setPreviewImage({ url: item.image_url, name: item.name });
                        }}
                      >
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
                          title={item.name}
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

                    {/* Unit Price */}
                    <td>
                      <span className="table-price-bold tabular-nums" style={{ whiteSpace: 'nowrap' }}>
                        ₹{Number(item.price).toFixed(2)}
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
                      <span className="table-date-text tabular-nums">
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

        {/* Genuine Mobile Card View (< 768px) */}
        <div className="manage-mobile-list mobile-only-list">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="manage-mobile-card skeleton-card" style={{ height: '110px' }} />
            ))
          ) : products.length === 0 ? (
            <div className="manage-empty-state" style={{ padding: '2.5rem 1rem' }}>
              <Package size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                No products found
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 auto 1rem' }}>
                Try adjusting search keywords or price bounds.
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
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            products.map((item) => (
              <div key={item.id} className="manage-mobile-card">
                <div className="mobile-card-top">
                  <div
                    className="mobile-card-thumb-wrap clickable-thumb"
                    onClick={() => setPreviewImage({ url: item.image_url, name: item.name })}
                    title="Click to view full packshot image"
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={item.image_url || '/placeholder.png'}
                      alt={item.name}
                      className="mobile-card-thumb-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80';
                      }}
                    />
                  </div>
                  <div className="mobile-card-details">
                    <button
                      type="button"
                      className="mobile-card-title-btn"
                      onClick={() => onViewProduct(item)}
                    >
                      {item.name}
                    </button>
                    <span className="mobile-card-brand">{item.brand}</span>
                    <div className="mobile-card-badge-row">
                      <span className="table-cat-badge">{item.category}</span>
                      <span className="mobile-card-price tabular-nums">₹{Number(item.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mobile-card-bottom">
                  <div className="table-tags-wrap">
                    {Array.isArray(item.tags) && item.tags.length > 0 ? (
                      item.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="table-tag-pill">
                          #{tag}
                        </span>
                      ))
                    ) : null}
                    {item.tags?.length > 2 && (
                      <span className="table-tag-more">+{item.tags.length - 2}</span>
                    )}
                  </div>

                  <div className="table-action-buttons">
                    <button
                      className="table-action-icon-btn view"
                      onClick={() => onViewProduct(item)}
                      title="View Details"
                      aria-label="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="table-action-icon-btn edit"
                      onClick={() => onEditProduct(item)}
                      title="Edit Product"
                      aria-label="Edit Product"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="table-action-icon-btn delete"
                      onClick={() => onDeleteProduct(item)}
                      title="Delete Product"
                      aria-label="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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

      {/* Packshot Image Lightbox Modal */}
      {previewImage && (
        <div
          className="image-lightbox-overlay"
          onClick={() => setPreviewImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Packshot Image Preview"
        >
          <div className="image-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="image-lightbox-header">
              <span className="image-lightbox-title" title={previewImage.name}>
                {previewImage.name}
              </span>
              <button
                type="button"
                className="image-lightbox-close"
                onClick={() => setPreviewImage(null)}
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>
            <div className="image-lightbox-body">
              <img
                src={previewImage.url || '/placeholder.png'}
                alt={previewImage.name}
                className="image-lightbox-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';
                }}
              />
            </div>
            <div className="image-lightbox-footer">
              <span className="image-lightbox-hint">Packshot Product Asset</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPreviewImage(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
