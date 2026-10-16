import { useState, useEffect, useRef } from 'react';
import { Sparkles, Save, Upload, Link as LinkIcon, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { CATEGORIES } from '../catalog/CategoryFilter';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

export function ProductFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) {
  const isEditing = Boolean(initialData?.id);
  const { success, error: toastError } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Beverages & Energy Drinks',
    price: '',
    image_url: '',
    description: '',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [errors, setErrors] = useState({});

  // Image upload state
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [localPreview, setLocalPreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        brand: initialData.brand || '',
        category: initialData.category || 'Beverages & Energy Drinks',
        price: initialData.price ? String(initialData.price) : '',
        image_url: initialData.image_url || '',
        description: initialData.description || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      });
      setLocalPreview(initialData.image_url || '');
      setImageMode(initialData.image_url?.startsWith('http') || initialData.image_url?.startsWith('/') ? 'url' : 'upload');
    } else {
      setFormData({
        name: '',
        brand: '',
        category: 'Beverages & Energy Drinks',
        price: '',
        image_url: '',
        description: '',
        tags: '',
      });
      setLocalPreview('');
      setImageMode('upload');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastError('Image file size must be less than 5MB.');
      return;
    }

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    setUploadingImage(true);
    try {
      const res = await productService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: res.image_url }));
      success('Image uploaded successfully!');
    } catch (err) {
      console.error('Image upload failed:', err);
      toastError(err.response?.data?.error || 'Failed to upload image. Please try again or provide an image link.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required.';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required.';
    if (!formData.category.trim()) newErrors.category = 'Category is required.';
    if (!formData.price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number greater than 0.';
    }

    if (formData.image_url && !formData.image_url.startsWith('http') && !formData.image_url.startsWith('/')) {
      newErrors.image_url = 'Please provide a valid URL or path (e.g. /products/... or https://...)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // GenAI Description Generator
  const handleGenerateAiDescription = async () => {
    if (!formData.name.trim() || !formData.brand.trim()) {
      toastError('Please fill in Product Name and Brand first to generate AI description.');
      setErrors((prev) => ({
        ...prev,
        name: !formData.name.trim() ? 'Name required for AI generation' : '',
        brand: !formData.brand.trim() ? 'Brand required for AI generation' : '',
      }));
      return;
    }

    setAiGenerating(true);
    try {
      const res = await productService.generateAiDescription({
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
      });

      if (res.data) {
        setFormData((prev) => {
          let updatedTags = prev.tags;
          if (Array.isArray(res.data.tags) && res.data.tags.length > 0) {
            const existingTags = prev.tags
              ? prev.tags.split(',').map((t) => t.trim().toLowerCase())
              : [];
            const newTags = res.data.tags.filter(
              (t) => !existingTags.includes(t.toLowerCase())
            );
            updatedTags = existingTags.concat(newTags).filter(Boolean).join(', ');
          }

          return {
            ...prev,
            description: res.data.description || prev.description,
            tags: updatedTags,
          };
        });
        success('✨ AI product description and tags generated!');
      }
    } catch (err) {
      console.error('AI generation error:', err);
      toastError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          'Failed to generate description. You can still type one manually.'
      );
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category,
      price: Number(formData.price).toFixed(2),
      image_url: formData.image_url.trim() || undefined,
      description: formData.description.trim(),
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    try {
      if (isEditing) {
        await productService.updateProduct(initialData.id, payload);
        success(`"${payload.name}" updated successfully!`);
      } else {
        await productService.createProduct(payload);
        success(`"${payload.name}" added to catalog!`);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save product error:', err);
      const resp = err.response?.data;
      let msg = 'Failed to save product. Please check input fields.';
      if (resp && typeof resp === 'object') {
        const firstKey = Object.keys(resp)[0];
        if (Array.isArray(resp[firstKey])) {
          msg = `${firstKey}: ${resp[firstKey].join(' ')}`;
        } else if (typeof resp[firstKey] === 'string') {
          msg = resp[firstKey];
        }
      }
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      subtitle={
        isEditing
          ? `Updating product ID: ${initialData.id}`
          : 'Create a new CPG product record with optional AI description generation.'
      }
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Product Name"
            name="name"
            required
            placeholder="e.g. Coca-Cola Zero Sugar 500ml"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            label="Brand"
            name="brand"
            required
            placeholder="e.g. Coca-Cola, Doritos, Dove"
            value={formData.brand}
            onChange={handleChange}
            error={errors.brand}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              Category Aisle <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <select
              name="category"
              className="input-field select-control"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Price (Rs.)"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="e.g. 199.00"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
          />
        </div>

        {/* Image Upload / URL Selector Section */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Product Packshot Image
            </label>

            <div className="image-mode-tabs">
              <button
                type="button"
                className={`image-mode-btn ${imageMode === 'upload' ? 'active' : ''}`}
                onClick={() => setImageMode('upload')}
              >
                <Upload size={13} style={{ marginRight: 4 }} />
                Upload Local File
              </button>
              <button
                type="button"
                className={`image-mode-btn ${imageMode === 'url' ? 'active' : ''}`}
                onClick={() => setImageMode('url')}
              >
                <LinkIcon size={13} style={{ marginRight: 4 }} />
                Image URL
              </button>
            </div>
          </div>

          {imageMode === 'upload' ? (
            <div className="local-upload-container">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />

              <div
                className={`dropzone-box ${uploadingImage ? 'uploading' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {localPreview || formData.image_url ? (
                  <div className="dropzone-preview">
                    <img
                      src={localPreview || formData.image_url}
                      alt="Product preview"
                      className="dropzone-img"
                    />
                    <div className="dropzone-overlay">
                      <Upload size={20} />
                      <span>{uploadingImage ? 'Uploading image...' : 'Click to Change Image'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="dropzone-placeholder">
                    <div className="dropzone-icon-circle">
                      <Upload size={24} style={{ color: 'var(--accent-sky)' }} />
                    </div>
                    <span className="dropzone-title">
                      {uploadingImage ? 'Uploading image...' : 'Click or Drag & Drop local packshot image'}
                    </span>
                    <span className="dropzone-hint">PNG, JPG, WEBP up to 5MB</span>
                  </div>
                )}
              </div>

              {formData.image_url && (
                <div className="image-status-row">
                  <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                  <span className="image-status-text">
                    Packshot linked: <code className="image-url-code">{formData.image_url.substring(0, 45)}...</code>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Input
              name="image_url"
              type="text"
              placeholder="e.g. /products/coca-cola-zero.jpg or https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={handleChange}
              error={errors.image_url}
            />
          )}
        </div>

        {/* Description Field with GenAI Button */}
        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Description
            </label>

            {/* AI Generator Button */}
            <Button
              variant="ai"
              size="sm"
              icon={Sparkles}
              loading={aiGenerating}
              onClick={handleGenerateAiDescription}
              title="Auto-generate e-commerce description and tags using Gemini GenAI"
            >
              {aiGenerating ? 'Generating with AI...' : '✨ Generate with AI'}
            </Button>
          </div>

          <textarea
            name="description"
            rows={4}
            className="input-field"
            placeholder="Detailed product overview, ingredients, and shelf attributes..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Semantic Tags"
          name="tags"
          placeholder="Comma-separated: organic, gluten-free, zero-sugar"
          value={formData.tags}
          onChange={handleChange}
        />

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={Save}
            style={{ fontWeight: 700 }}
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
