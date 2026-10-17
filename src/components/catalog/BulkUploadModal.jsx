import { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

export function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const { success, error: toastError } = useToast();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [totalRowsDetected, setTotalRowsDetected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const resetState = () => {
    setFile(null);
    setPreviewRows([]);
    setPreviewHeaders([]);
    setTotalRowsDetected(0);
    setLoading(false);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const parseCsvPreview = (fileObj) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text
          .split(/\r\n|\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        if (lines.length > 0) {
          // Parse header
          const rawHeaders = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
          setPreviewHeaders(rawHeaders);

          // Parse first 4 preview rows
          const sampleRows = [];
          for (let i = 1; i < Math.min(lines.length, 5); i++) {
            const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
            sampleRows.push(cols);
          }
          setPreviewRows(sampleRows);
          setTotalRowsDetected(lines.length - 1);
        }
      } catch (err) {
        console.error('Failed to preview CSV:', err);
      }
    };
    reader.readAsText(fileObj);
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      toastError('Please select a valid CSV (.csv) file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toastError('File size exceeds the 10MB limit.');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
    parseCsvPreview(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      await productService.downloadBulkTemplate();
      success('Sample CSV template downloaded.');
    } catch {
      toastError('Failed to download template. Please try again.');
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toastError('Please choose or drop a CSV file first.');
      return;
    }

    setLoading(true);
    try {
      const res = await productService.bulkUpload(file);
      setUploadResult(res);
      if (res.created_count > 0) {
        success(res.message || `Successfully created ${res.created_count} products.`);
        if (onSuccess) onSuccess();
      } else {
        toastError(res.message || 'Bulk upload failed. Check the errors below.');
      }
    } catch (err) {
      const respData = err.response?.data;
      const msg = respData?.error || respData?.message || 'Bulk upload failed. Please verify CSV format.';
      setUploadResult({
        success: false,
        created_count: 0,
        failed_count: totalRowsDetected || 1,
        errors: respData?.errors || [{ row: 'File', error: msg }],
        message: msg,
      });
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Upload Products via CSV"
      subtitle="Import new product SKUs in bulk. All items are validated before creation."
      maxWidth="720px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Template Download Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileSpreadsheet size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-white)' }}>
                Need the standard format?
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Download our sample template containing required columns (name, brand, category, price, tags).
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleDownloadTemplate}
            loading={downloadingTemplate}
          >
            Download Template
          </Button>
        </div>

        {/* Upload Form */}
        {!uploadResult?.success && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
              }}
            />

            {/* Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                background: dragActive ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-surface)',
                borderRadius: 'var(--radius-card)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                }}
              >
                <Upload size={24} />
              </div>

              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-white)', fontSize: '0.95rem' }}>
                  Click to choose CSV file
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> or drag and drop here</span>
              </div>

              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Supports standard comma-separated .csv up to 10MB
              </span>
            </div>

            {/* Selected File Badge & Preview */}
            {file && (
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-white)' }}>
                      {file.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({(file.size / 1024).toFixed(1)} KB &bull; ~{totalRowsDetected} rows detected)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetState();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Table Preview (first 4 rows) */}
                {previewHeaders.length > 0 && (
                  <div style={{ overflowX: 'auto', maxHeight: '180px' }}>
                    <table
                      style={{
                        width: '100%',
                        fontSize: '0.75rem',
                        borderCollapse: 'collapse',
                        textAlign: 'left',
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          {previewHeaders.map((h, idx) => (
                            <th key={idx} style={{ padding: '4px 8px', fontWeight: 600 }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                style={{
                                  padding: '4px 8px',
                                  color: 'var(--text-subtle)',
                                  maxWidth: '140px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="button" variant="ghost" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={!file}
                icon={Upload}
                style={{ fontWeight: 700 }}
              >
                Upload & Import Products
              </Button>
            </div>
          </form>
        )}

        {/* Upload Success or Partial Error Results */}
        {uploadResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                background: uploadResult.created_count > 0 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${
                  uploadResult.created_count > 0 ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)'
                }`,
              }}
            >
              {uploadResult.created_count > 0 ? (
                <CheckCircle2 size={22} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={22} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-white)', fontWeight: 600 }}>
                  {uploadResult.message}
                </h4>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Total Imported: <strong>{uploadResult.created_count}</strong> &bull; Total Failed:{' '}
                  <strong>{uploadResult.failed_count}</strong>
                </p>
              </div>
            </div>

            {/* Validation Errors List if any */}
            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  maxHeight: '220px',
                  overflowY: 'auto',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#f59e0b',
                    marginBottom: '0.65rem',
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>Row Validation Errors ({uploadResult.errors.length}):</span>
                </div>

                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                  {uploadResult.errors.map((errItem, idx) => (
                    <li key={idx} style={{ marginBottom: '0.35rem' }}>
                      <strong>Row {errItem.row}</strong> ({errItem.name || 'Item'}):{' '}
                      {typeof errItem.errors === 'object'
                        ? Object.entries(errItem.errors)
                            .map(([field, errList]) => `${field}: ${Array.isArray(errList) ? errList.join(', ') : errList}`)
                            .join(' | ')
                        : errItem.error || JSON.stringify(errItem.errors)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  resetState();
                }}
              >
                Upload Another File
              </Button>
              <Button type="button" variant="primary" onClick={handleClose} style={{ fontWeight: 700 }}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
