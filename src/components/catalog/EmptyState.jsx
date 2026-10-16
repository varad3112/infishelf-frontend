import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export function EmptyState({ onReset, isAiMode, search }) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">
        <SearchX size={32} />
      </div>
      <h3 className="empty-title">
        {isAiMode ? 'No matching products found with AI' : 'No products found'}
      </h3>
      <p className="empty-subtitle">
        {search ? (
          <>
            We couldn't find any items matching &ldquo;<strong>{search}</strong>&rdquo;. Try searching for different keywords, adjusting your price filters, or clearing your selections.
          </>
        ) : (
          'There are currently no products matching your selected category and brand filters.'
        )}
      </p>
      <Button
        variant="primary"
        icon={RotateCcw}
        onClick={onReset}
      >
        Reset All Filters
      </Button>
    </div>
  );
}
