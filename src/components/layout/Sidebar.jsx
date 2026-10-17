import {
  LayoutDashboard,
  Package,
  Store,
  PlusCircle,
  Plus,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export function Sidebar({
  activeView,
  onSelectView,
  user,
  onOpenAddProduct,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'KPIs',
    },
    {
      id: 'manage',
      label: 'Product Catalog',
      icon: Package,
      badge: 'List',
    },
  ];

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* Desktop Sticky Left Sidebar (>= 768px) */}
      <aside
        className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}
        aria-label="Admin Navigation Sidebar"
      >
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo-icon" style={{ background: 'transparent', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="/logo.png"
                alt="InfiShelf Logo"
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-xs)',
                }}
              />
            </div>
            {!isCollapsed && (
              <div className="brand-info">
                <span className="brand-title">InfiShelf</span>
                <span className="brand-badge">ADMIN</span>
              </div>
            )}
          </div>

          <button
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="sidebar-action-wrap">
          <button
            className="sidebar-add-btn"
            onClick={onOpenAddProduct}
            title="Add New Product"
          >
            <PlusCircle size={18} />
            {!isCollapsed && <span>Add Product</span>}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">
            {!isCollapsed && <span>MAIN NAVIGATION</span>}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectView(item.id)}
                title={item.label}
              >
                <Icon size={19} className="nav-icon" />
                {!isCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer Card */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar" title={user?.username || 'User'}>
              {userInitial}
            </div>

            {!isCollapsed && (
              <div className="user-details">
                <span className="user-name">
                  {user?.username || 'Administrator'}
                  <ShieldCheck size={13} style={{ color: 'var(--accent-primary)', marginLeft: 4 }} />
                </span>
                <span className="user-email" title={user?.email}>
                  {user?.email || 'admin@infishelf.com'}
                </span>
              </div>
            )}

            <button
              className="sidebar-logout-btn"
              onClick={onLogout}
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {/* Dashboard Tab */}
        <button
          type="button"
          className={`mobile-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSelectView('dashboard')}
          aria-label="Dashboard"
        >
          <div className="mobile-nav-icon-wrap">
            <LayoutDashboard size={20} />
          </div>
          <span className="mobile-nav-label">Dashboard</span>
        </button>

        {/* Product Catalog Tab */}
        <button
          type="button"
          className={`mobile-nav-item ${activeView === 'manage' ? 'active' : ''}`}
          onClick={() => onSelectView('manage')}
          aria-label="Product Catalog"
        >
          <div className="mobile-nav-icon-wrap">
            <Package size={20} />
          </div>
          <span className="mobile-nav-label">Catalog</span>
        </button>

        {/* Center Action: Floating Elevated Add SKU Button */}
        <div className="mobile-nav-fab-wrap">
          <button
            type="button"
            className="mobile-nav-fab-btn"
            onClick={onOpenAddProduct}
            title="Add New SKU"
            aria-label="Add Product SKU"
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>
          <span className="mobile-nav-fab-label">Add SKU</span>
        </div>



        {/* User / Sign Out Tab */}
        <button
          type="button"
          className="mobile-nav-item mobile-nav-logout"
          onClick={onLogout}
          aria-label={`Log out ${user?.username || 'user'}`}
          title="Sign Out"
        >
          <div className="mobile-nav-icon-wrap">
            <LogOut size={20} />
          </div>
          <span className="mobile-nav-label">Logout</span>
        </button>
      </nav>
    </>
  );
}
