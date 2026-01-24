import type { RecordCategory } from '@/types';

interface TabNavigationProps {
  selectedCategory: RecordCategory | null;
  onCategoryChange: (category: RecordCategory | null) => void;
}

const categories: RecordCategory[] = ['ሰራተኛ', 'ወጣት', 'አዳጊ', 'ህጻናት'];

export function TabNavigation({
  selectedCategory,
  onCategoryChange,
}: TabNavigationProps) {
  return (
    <div className="flex w-full bg-card border-b border-border/30">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(isSelected ? null : category)}
            className={`flex-1 py-2.5 px-2 text-xs font-semibold transition-colors duration-200 relative ${
              isSelected
                ? 'bg-accent text-text-light'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-beige-light'
            }`}
          >
            <span className="relative z-10">{category}</span>
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
