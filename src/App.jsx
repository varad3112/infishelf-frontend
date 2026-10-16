import { useState } from 'react';
import { FileCode2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { useProducts } from './hooks/useProducts';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Button } from './components/common/Button';

import { DashboardView } from './components/dashboard/DashboardView';
import { ManageCatalogView } from './components/catalog/ManageCatalogView';
import { LandingPageView } from './components/landing/LandingPageView';

import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { ProductDetailModal } from './components/product-detail/ProductDetailModal';
import { ProductFormModal } from './components/product-form/ProductFormModal';
import { DeleteConfirmModal } from './components/product-form/DeleteConfirmModal';

export default function App() {
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

  // Active view in authenticated workspace: 'dashboard' | 'manage'
  const [activeView, setActiveView] = useState('manage');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    setActiveView('manage');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isAuthenticated ? (
        /* Authenticated Workspace with Left Sidebar */
        <div className="authenticated-layout">
          <Sidebar
            activeView={activeView}
            onSelectView={setActiveView}
            user={user}
            onOpenAddProduct={handleOpenAddProduct}
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />

          <div className={`main-workspace ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Topbar Navigation Header */}
            <header className="workspace-topbar">
              <div className="topbar-left">
                <span className="topbar-crumb-app">InfiShelf</span>
                <span className="topbar-crumb-sep">/</span>
                <span className="topbar-crumb-view">
                  {activeView === 'dashboard' && 'Dashboard & Shelf Analytics'}
                  {activeView === 'manage' && 'Product Catalog'}
                </span>
              </div>

              <div className="topbar-right">
                <a
                  href="http://localhost:8000/api/docs/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  title="View Swagger / OpenAPI Documentation"
                >
                  <FileCode2 size={14} />
                  <span>API Docs</span>
                </a>
              </div>
            </header>

            {/* View Content */}
            <main className="workspace-content">
              {activeView === 'dashboard' && (
                <DashboardView
                  onNavigateToManage={() => setActiveView('manage')}
                  onOpenAddProduct={handleOpenAddProduct}
                  onViewProduct={(p) => setDetailProduct(p)}
                />
              )}

              {activeView === 'manage' && (
                <ManageCatalogView
                  products={products}
                  pagination={pagination}
                  loading={loading}
                  error={error}
                  refetch={refetch}
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={resetFilters}
                  setPage={setPage}
                  isAiMode={isAiMode}
                  toggleAiMode={toggleAiMode}
                  parsedIntent={parsedIntent}
                  canManage={true}
                  onOpenAddProduct={handleOpenAddProduct}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onViewProduct={(p) => setDetailProduct(p)}
                />
              )}
            </main>
          </div>
        </div>
      ) : (
        /* Public Visitor Layout with Animated Landing Page */
        <>
          <Navbar
            user={user}
            totalProducts={pagination.count}
            onOpenLogin={() => setLoginOpen(true)}
            onOpenRegister={() => setRegisterOpen(true)}
            onOpenAddProduct={handleOpenAddProduct}
            onLogout={handleLogout}
          />

          <main style={{ flex: 1, minHeight: 'calc(100vh - 140px)' }}>
            <LandingPageView
              onOpenLogin={() => setLoginOpen(true)}
              onOpenRegister={() => setRegisterOpen(true)}
            />
          </main>

          <Footer />
        </>
      )}

      {/* Global Modals */}
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
        productToEdit={formProduct}
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
