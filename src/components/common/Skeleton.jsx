export function SkeletonCard() {
  return (
    <div className="product-card" style={{ opacity: 0.85 }}>
      <div className="card-image-wrap skeleton-shimmer" style={{ height: '200px' }} />
      <div className="card-body">
        <div
          className="skeleton-shimmer"
          style={{ width: '40%', height: '14px', marginBottom: '8px' }}
        />
        <div
          className="skeleton-shimmer"
          style={{ width: '85%', height: '20px', marginBottom: '6px' }}
        />
        <div
          className="skeleton-shimmer"
          style={{ width: '65%', height: '20px', marginBottom: '12px' }}
        />
        <div
          className="skeleton-shimmer"
          style={{ width: '100%', height: '14px', marginBottom: '6px' }}
        />
        <div
          className="skeleton-shimmer"
          style={{ width: '90%', height: '14px', marginBottom: '14px' }}
        />
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <div
            className="skeleton-shimmer"
            style={{ width: '50px', height: '20px', borderRadius: '999px' }}
          />
          <div
            className="skeleton-shimmer"
            style={{ width: '60px', height: '20px', borderRadius: '999px' }}
          />
        </div>
        <div className="card-footer" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div
            className="skeleton-shimmer"
            style={{ width: '70px', height: '24px' }}
          />
          <div
            className="skeleton-shimmer"
            style={{ width: '90px', height: '32px', borderRadius: '6px' }}
          />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}
