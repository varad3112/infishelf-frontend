export const CATEGORIES = [
  'All Categories',
  'Beverages & Energy Drinks',
  'Snacks & Confectionery',
  'Personal Care & Grooming',
  'Home & Fabric Care',
  'Dairy & Breakfast',
];

export function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="category-pills" role="tablist" aria-label="Product Categories">
      {CATEGORIES.map((cat) => {
        const isSelected =
          cat === 'All Categories' ? !activeCategory : activeCategory === cat;

        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isSelected}
            className={`pill-item ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat === 'All Categories' ? '' : cat)}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
