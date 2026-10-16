import { useState } from 'react';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { useProducts } from './hooks/useProducts';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchBar } from './components/catalog/SearchBar';
import { CategoryFilter } from './components/catalog/CategoryFilter';
import { FilterBar } from './components/catalog/FilterBar';
import { ProductCard } from './components/catalog/ProductCard';
import { EmptyState } from './components/catalog/EmptyState';
import { Pagination } from './components/catalog/Pagination';
import { SkeletonGrid } from './components/common/Skeleton';
import { Button } from './components/common/Button';

import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { ProductDetailModal } from './components/product-detail/ProductDetailModal';
import { ProductFormModal } from './components/product-form/ProductFormModal';
import { DeleteConfirmModal } from './components/product-form/DeleteConfirmModal';

export function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { success } = useToast();

  const {
    products,
    pagination,
    loading,
    error,
    filters,
    isAiMode,
    parsedIntent,
    updateFilter,
    resetFilters,
    setPage,
    toggleAiMode,
    refetch,
  } = useProducts();

  // Modals state
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [formProduct, setFormProduct] = useState(null); // null = Add, object = Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const handleOpenAddProduct = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    setFormProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (prod) => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    setFormProduct(prod);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (prod) => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    setDeleteProduct(prod);
  };

  const handleLogout = () => {
    logout();
    success('Logged out successfully.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        user={user}
        totalProducts={pagination.count}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
        onOpenAddProduct={handleOpenAddProduct}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        {/* Hero Section */}
        <section className="hero-banner">
          <h1 className="hero-title">
            <span>Intelligent Retail &</span>
            <span className="gradient-text">Shelf AI Platform</span>
          </h1>
          <p className="hero-subtitle">
            Manage fast-moving consumer goods (CPG/FMCG) with natural-language discovery,
            automated GenAI product copy generation, and dynamic inventory intelligence.
          </p>
        </section>

        {/* Search & Discovery Toolbar */}
        <section className="toolbar-section">
          {/* Real-time Search + AI Mode Toggle */}
          <SearchBar
            value={filters.search}
            onChange={(val) => updateFilter('search', val)}
            isAiMode={isAiMode}
            onToggleAiMode={toggleAiMode}
          />

          {/* Category Aisle Pills */}
          <CategoryFilter
            activeCategory={filters.category}
            onSelectCategory={(cat) => updateFilter('category', cat)}
          />

          {/* Filter Bar: Brands, Price Range, Sort, Reset */}
          <FilterBar
            brand={filters.brand}
            minPrice={filters.min_price}
            maxPrice={filters.max_price}
            ordering={filters.ordering}
            onUpdateFilter={updateFilter}
            onResetFilters={resetFilters}
            totalResults={pagination.count}
          />
        </section>

        {/* AI Intent Interpretation Banner (if present) */}
        {parsedIntent && (
          <div className="intent-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={18} color="#c084fc" />
              <span>
                <strong>Gemini AI Query Understanding:</strong>{' '}
                {parsedIntent.category && (
                  <span style={{ color: 'var(--accent-sky)', marginRight: '8px' }}>
                    Category: {parsedIntent.category}
                  </span>
                )}
                {parsedIntent.brand && (
                  <span style={{ color: 'var(--accent-yellow)', marginRight: '8px' }}>
                    Brand: {parsedIntent.brand}
                  </span>
                )}
                {parsedIntent.max_price && (
                  <span style={{ color: 'var(--color-success)', marginRight: '8px' }}>
                    Max Price: Rs. {parsedIntent.max_price}
                  </span>
                )}
                {parsedIntent.keywords?.length > 0 && (
                  <span>Keywords: {parsedIntent.keywords.join(', ')}</span>
                )}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={resetFilters}
              style={{ color: 'var(--text-subtle)' }}
            >
              Clear AI Query
            </button>
          </div>
        )}

        {/* Error State with Retry Button */}
        {error && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--color-danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-lg)',
              margin: '2rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-danger)' }}>
              <AlertCircle size={22} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Failed to load catalog</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>{error}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={refetch}>
              Retry
            </Button>
          </div>
        )}

        {/* Product Catalog Grid / Loading / Empty States */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : products.length === 0 ? (
          <EmptyState
            onReset={resetFilters}
            isAiMode={isAiMode}
            search={filters.search}
          />
        ) : (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  canManage={isAuthenticated}
                  onViewDetails={(p) => setDetailProduct(p)}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalItems={pagination.count}
              pageSize={pagination.page_size}
              onPageChange={setPage}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />

      <ProductDetailModal
        product={detailProduct}
        isOpen={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
        canManage={isAuthenticated}
        onEdit={(p) => {
          setDetailProduct(null);
          handleEditProduct(p);
        }}
        onDelete={(p) => {
          setDetailProduct(null);
          handleDeleteProduct(p);
        }}
      />

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={formProduct}
        onSuccess={refetch}
      />

      <DeleteConfirmModal
        product={deleteProduct}
        isOpen={Boolean(deleteProduct)}
        onClose={() => setDeleteProduct(null)}
        onSuccess={refetch}
      />
    </div>
  );
}

export default App;
