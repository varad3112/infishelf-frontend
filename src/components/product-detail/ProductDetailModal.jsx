import { useState, useEffect } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  canManage,
  onEdit,
  onDelete,
}) {
  const [imgSrc, setImgSrc] = useState(product?.image_url || FALLBACK_IMAGE);

  useEffect(() => {
    if (product?.image_url) {
      setImgSrc(product.image_url);
    } else {
      setImgSrc(FALLBACK_IMAGE);
    }
  }, [product]);

  if (!product) return null;
  const formattedPrice = Number(product.price).toFixed(2);
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const createdDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`Product ID: ${product.id}`}
      maxWidth="780px"
    >
      <div className="detail-grid">
        {/* Left: Product Image */}
        <div>
          <img
            src={imgSrc}
            alt={product.name}
            className="detail-img"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
          <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Badge variant="sky">{product.category}</Badge>
            <Badge variant="yellow">{product.brand}</Badge>
          </div>
        </div>

        {/* Right: Specifications & Details */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-white)' }}>
              Rs. {formattedPrice}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', marginBottom: '0.4rem' }}>
              Description
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-white)', lineHeight: 1.6 }}>
              {product.description || 'No description provided.'}
            </p>
          </div>

          {/* AI Tags */}
          {tags.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
                AI Semantic Tags
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {tags.map((tag, idx) => (
                  <Badge key={idx} variant="ai">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Specs */}
          <div className="spec-list">
            <div className="spec-row">
              <span className="spec-label">Category Aisle</span>
              <span className="spec-val">{product.category}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Brand Owner</span>
              <span className="spec-val">{product.brand}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Catalog Added</span>
              <span className="spec-val">{createdDate}</span>
            </div>
            {product.created_by_username && (
              <div className="spec-row">
                <span className="spec-label">Added By</span>
                <span className="spec-val">{product.created_by_username}</span>
              </div>
            )}
          </div>

          {/* Action buttons if manager */}
          {canManage && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button
                variant="secondary"
                icon={Edit3}
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
              >
                Edit Product
              </Button>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => {
                  onClose();
                  onDelete(product);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
