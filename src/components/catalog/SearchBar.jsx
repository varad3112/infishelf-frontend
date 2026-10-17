import { useState, useEffect } from 'react';
import { Search, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search products by name, brand, category, or natural description...',
}) {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedTerm = useDebounce(searchTerm, 350);

  // Sync internal search input with parent prop
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Notify parent on debounced value change
  useEffect(() => {
    if (debouncedTerm !== value) {
      onChange(debouncedTerm);
    }
  }, [debouncedTerm, onChange, value]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className="search-row">
      <div className="search-wrapper" style={{ width: '100%' }}>
        <Search size={18} className="search-icon-left" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
