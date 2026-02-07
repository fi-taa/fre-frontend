import { RECORD_CATEGORIES, CATEGORY_LABELS } from '@/types';
import type { RecordCategory } from '@/types';

interface TabNavigationProps {
  selectedCategory: RecordCategory | null;
  onCategoryChange: (category: RecordCategory | null) => void;
}

export function TabNavigation({
  selectedCategory,
  onCategoryChange,
}: TabNavigationProps) {
  return (
    <div className="flex w-full bg-card border-b border-border/30">
      {RECORD_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(isSelected ? null : category)}
            className={`flex-1 min-h-[44px] py-3 px-3 text-sm font-semibold transition-colors duration-200 relative ${
              isSelected
                ? 'bg-accent text-text-light'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-beige-light'
            }`}
          >
            <span className="relative z-10">{CATEGORY_LABELS[category]}</span>
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
