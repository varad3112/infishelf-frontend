import { RotateCcw } from 'lucide-react';

export const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest Added' },
  { value: 'created_at', label: 'Oldest Added' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: '-name', label: 'Name: Z to A' },
];

export const POPULAR_BRANDS = [
  'All Brands',
  'Coca-Cola',
  'Monster Energy',
  'Red Bull',
  'Tropicana',
  'Doritos',
  'Lay\'s',
  'Oreo',
  'Ferrero',
  'Dove',
  'Nivea',
  'Colgate',
  'Head & Shoulders',
  'Ariel',
  'Dettol',
  'Vim',
  'Nestlé',
  'Chobani',
  'Nutella',
];

export function FilterBar({
  brand,
  minPrice,
  maxPrice,
  ordering,
  onUpdateFilter,
  onResetFilters,
  totalResults,
}) {
  return (
    <div className="filter-row">
      {/* Left controls: Brand & Price */}
      <div className="filter-group-left">
        {/* Brand Selector */}
        <select
          className="select-control"
          value={brand || ''}
          onChange={(e) => onUpdateFilter('brand', e.target.value)}
          aria-label="Filter by brand"
        >
          {POPULAR_BRANDS.map((b) => (
            <option key={b} value={b === 'All Brands' ? '' : b}>
              {b}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <div className="price-inputs">
          <span>Price:</span>
          <input
            type="number"
            placeholder="Min Rs"
            min="0"
            step="10"
            value={minPrice}
            onChange={(e) => onUpdateFilter('min_price', e.target.value)}
            className="price-box"
            aria-label="Minimum price in Rs"
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max Rs"
            min="0"
            step="10"
            value={maxPrice}
            onChange={(e) => onUpdateFilter('max_price', e.target.value)}
            className="price-box"
            aria-label="Maximum price in Rs"
          />
        </div>

        {/* Reset button if any filter is active */}
        {(brand || minPrice || maxPrice || ordering !== '-created_at') && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onResetFilters}
            style={{ color: 'var(--accent-sky)' }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right controls: Results count & Sort */}
      <div className="filter-group-right">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Found <strong>{totalResults}</strong> items
        </span>

        {/* Sort Select */}
        <select
          className="select-control"
          value={ordering}
          onChange={(e) => onUpdateFilter('ordering', e.target.value)}
          aria-label="Sort products by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
