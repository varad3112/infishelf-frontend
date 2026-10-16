import { useState, useEffect } from 'react';
import { Search, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export function SearchBar({
  value,
  onChange,
  isAiMode,
  onToggleAiMode,
  placeholder = 'Search by product name, brand, or ingredients...',
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
      <div className="search-wrapper">
        <Search size={18} className="search-icon-left" />
        <input
          type="text"
          className="search-input"
          placeholder={
            isAiMode
              ? "Ask Gemini in natural language (e.g. 'sugar-free energy drinks under Rs 150')..."
              : placeholder
          }
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

      {/* AI Smart Search Toggle */}
      <button
        type="button"
        className={`ai-search-toggle ${isAiMode ? 'active' : ''}`}
        onClick={onToggleAiMode}
        title="Toggle between standard keyword search and natural language AI search"
      >
        <Sparkles size={16} className={isAiMode ? 'animate-spin' : ''} />
        <span>{isAiMode ? 'AI Search Active' : 'AI Smart Search'}</span>
      </button>
    </div>
  );
}
