import { api } from './api';

export const productService = {
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
    return response.data;
  },

  /**
   * Update an existing product (Requires Auth)
   */
  async updateProduct(id, data) {
    const response = await api.put(`/api/products/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a product by UUID (Requires Auth)
   */
  async deleteProduct(id) {
    const response = await api.delete(`/api/products/${id}/`);
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
  async getStatistics() {
    const response = await api.get('/api/products/statistics/');
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
};
