'use client';

import { CATEGORIES } from '@/data/sources';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`category-button ${
            selectedCategory === category.id
              ? 'category-button-active'
              : 'category-button-inactive'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}
