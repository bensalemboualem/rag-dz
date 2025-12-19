'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
      <input
        type="text"
        placeholder="Rechercher dans les articles..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input pl-12"
      />
    </div>
  );
}
