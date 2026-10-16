import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

export function DeleteConfirmModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  if (!product) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await productService.deleteProduct(product.id);
      success(`"${product.name}" has been permanently deleted.`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Delete error:', err);
      toastError(
        err.response?.data?.detail ||
          'Failed to delete product. Please verify permissions.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Product"
      maxWidth="460px"
    >
      <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-white)' }}>
          Are you sure you want to delete this product?
        </h4>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          This will permanently remove &ldquo;<strong>{product.name}</strong>&rdquo; ({product.brand}) from the catalog. This action cannot be undone.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={loading}
            icon={Trash2}
            onClick={handleDelete}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
