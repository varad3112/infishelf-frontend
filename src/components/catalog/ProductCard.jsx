import { useState, useEffect } from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

export function ProductCard({
  product,
  canManage,
  onViewDetails,
  onEdit,
  onDelete,
}) {
  const [imgSrc, setImgSrc] = useState(product.image_url || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(product.image_url || FALLBACK_IMAGE);
  }, [product.image_url]);

  const formattedPrice = Number(product.price).toFixed(2);
  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <article className="product-card">
      {/* Thumbnail */}
      <div className="card-image-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          className="card-img"
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div className="card-category-overlay">
          <Badge variant="sky">{product.category}</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <span className="card-brand">{product.brand}</span>
        <h3 className="card-title" title={product.name}>
          {product.name}
        </h3>
        <p className="card-description">{product.description}</p>

        {/* AI Tags */}
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                  padding: '0.15rem',
                }}
              >
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer with Price and CTAs */}
        <div className="card-footer">
          <span className="card-price tabular-nums" style={{ whiteSpace: 'nowrap' }}>₹{formattedPrice}</span>

          <div className="card-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.4rem 0.65rem' }}
              onClick={() => onViewDetails(product)}
              title="View Product Details"
              aria-label={`View ${product.name}`}
            >
              <Eye size={15} />
            </button>

            {canManage && (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.4rem 0.65rem' }}
                  onClick={() => onEdit(product)}
                  title="Edit Product"
                  aria-label={`Edit ${product.name}`}
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.4rem 0.65rem' }}
                  onClick={() => onDelete(product)}
                  title="Delete Product"
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
