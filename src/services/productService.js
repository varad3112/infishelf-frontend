import { api } from './api';

let _cachedStatistics = null;
let _cachedStatsTimestamp = 0;
const STATS_CACHE_TTL_MS = 60000; // 60 seconds client cache

export const productService = {
  /**
   * Returns current cached statistics synchronously if still fresh, or null
   */
  getCachedStatistics() {
    if (_cachedStatistics && Date.now() - _cachedStatsTimestamp < STATS_CACHE_TTL_MS) {
      return _cachedStatistics;
    }
    return null;
  },

  /**
   * Clears the cached statistics so next request fetches fresh data
   */
  invalidateStatisticsCache() {
    _cachedStatistics = null;
    _cachedStatsTimestamp = 0;
  },

  /**
   * Fetch paginated list of products with optional search and filters
   * params: { search, category, brand, min_price, max_price, ordering, page, page_size }
   */
  async getProducts(params = {}) {
    // Filter out undefined or empty strings
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      const val = params[key];
      if (val !== undefined && val !== null && val !== '') {
        cleanParams[key] = val;
      }
    });

    const response = await api.get('/api/products/', { params: cleanParams });
    return response.data;
  },

  /**
   * Retrieve single product by UUID
   */
  async getProductById(id) {
    const response = await api.get(`/api/products/${id}/`);
    return response.data;
  },

  /**
   * Create a new product (Requires Auth)
   */
  async createProduct(data) {
    const response = await api.post('/api/products/', data);
    this.invalidateStatisticsCache();
    return response.data;
  },

  /**
   * Update an existing product (Requires Auth)
   */
  async updateProduct(id, data) {
    const response = await api.put(`/api/products/${id}/`, data);
    this.invalidateStatisticsCache();
    return response.data;
  },

  /**
   * Delete a product by UUID (Requires Auth)
   */
  async deleteProduct(id) {
    const response = await api.delete(`/api/products/${id}/`);
    this.invalidateStatisticsCache();
    return response.data;
  },

  /**
   * Generate an engaging product description using Google Gemini GenAI
   * input: { name, brand, category }
   */
  async generateAiDescription({ name, brand, category }) {
    const response = await api.post('/api/products/ai/generate-description/', {
      name,
      brand,
      category,
    });
    return response.data;
  },

  /**
   * Upload a local packshot image file (Requires Auth)
   * returns: { success, image_url, relative_url }
   */
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/api/products/upload-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetch catalog statistics, KPIs and distributions for the dashboard
   */
  async getStatistics(forceRefresh = false) {
    if (!forceRefresh && _cachedStatistics && Date.now() - _cachedStatsTimestamp < STATS_CACHE_TTL_MS) {
      return _cachedStatistics;
    }
    const response = await api.get('/api/products/statistics/');
    _cachedStatistics = response.data;
    _cachedStatsTimestamp = Date.now();
    return response.data;
  },

  /**
   * Natural Language Smart Search
   * input: { query }
   */
  async smartSearch(query, page = 1) {
    const response = await api.post('/api/products/ai/smart-search/', {
      query,
      page,
    });
    return response.data;
  },

  /**
   * Conversational Analytics Copilot ("Chat with Your Catalog")
   * input: { query, history }
   */
  async askCopilot(query, history = []) {
    const response = await api.post('/api/products/ai/copilot/', {
      query,
      history,
    });
    return response.data;
  },

  /**
   * Bulk upload products from CSV file (Requires Auth)
   * returns: { success, created_count, failed_count, errors, message }
   */
  async bulkUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/products/bulk-upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    this.invalidateStatisticsCache();
    return response.data;
  },

  /**
   * Download sample CSV template for bulk product upload
   */
  async downloadBulkTemplate() {
    const response = await api.get('/api/products/bulk-template/', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'infishelf_sample_products.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
