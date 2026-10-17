import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 1,
    current_page: 1,
    page_size: 12,
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    min_price: '',
    max_price: '',
    ordering: '-created_at',
    page: 1,
  });

  // AI Smart Search State
  const [isAiMode, setIsAiMode] = useState(false);
  const [parsedIntent, setParsedIntent] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getProducts(filters);
      setProducts(data.results || []);
      setPagination({
        count: data.count || 0,
        total_pages: data.total_pages || 1,
        current_page: data.current_page || 1,
        page_size: data.page_size || 12,
        next: data.next,
        previous: data.previous,
      });
      // If backend fell back to internal LLM search, it returns parsed_intent
      setParsedIntent(data.parsed_intent || null);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch catalog.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 whenever any filter other than page changes
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      min_price: '',
      max_price: '',
      ordering: '-created_at',
      page: 1,
    });
    setIsAiMode(false);
    setParsedIntent(null);
  }, []);

  const setPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }, []);

  const toggleAiMode = useCallback(() => {
    setIsAiMode((prev) => !prev);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
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
    refetch: fetchProducts,
  };
}
