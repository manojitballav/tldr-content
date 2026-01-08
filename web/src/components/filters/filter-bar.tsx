'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import api from '@/services/api';
import type { ContentFilters } from '@/types';

interface FilterBarProps {
  filters: ContentFilters;
  onFilterChange: (filters: ContentFilters) => void;
  showSearch?: boolean;
}

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'release_date', label: 'Release Date' },
  { value: 'title', label: 'Title' },
];

const TYPE_OPTIONS = [
  { value: 'movie', label: 'Movies' },
  { value: 'show', label: 'TV Shows' },
];

const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: String(year), label: String(year) };
});

const RATING_OPTIONS = [
  { value: '9', label: '9+ Exceptional' },
  { value: '8', label: '8+ Great' },
  { value: '7', label: '7+ Good' },
  { value: '6', label: '6+ Above Average' },
  { value: '5', label: '5+ Average' },
];

export function FilterBar({ filters, onFilterChange, showSearch = true }: FilterBarProps) {
  // Fetch genres from API
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: api.getGenres,
  });

  // Fetch languages from API
  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: api.getLanguages,
  });

  const genreOptions = genres?.map((g) => ({ value: g, label: g })) || [];
  const languageOptions = languages?.map((l) => ({ value: l, label: l })) || [];

  const updateFilter = useCallback(
    (key: keyof ContentFilters, value: string | number | undefined) => {
      const newFilters = { ...filters };
      if (value === '' || value === undefined) {
        delete newFilters[key];
      } else {
        (newFilters as Record<string, unknown>)[key] = value;
      }
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => key !== 'sort' && key !== 'order' && key !== 'page' && key !== 'limit'
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies and shows..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className={cn(
              'w-full bg-card border border-border rounded-lg',
              'pl-12 pr-4 py-3 text-base',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
              'placeholder:text-muted-foreground'
            )}
          />
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        {/* Type Filter */}
        <Select
          value={filters.type || ''}
          onChange={(value) => updateFilter('type', value)}
          options={TYPE_OPTIONS}
          placeholder="All Types"
          className="w-32"
        />

        {/* Genre Filter */}
        <Select
          value={filters.genre || ''}
          onChange={(value) => updateFilter('genre', value)}
          options={genreOptions}
          placeholder="Genre"
          className="w-40"
        />

        {/* Language Filter */}
        <Select
          value={filters.language || ''}
          onChange={(value) => updateFilter('language', value)}
          options={languageOptions}
          placeholder="Language"
          className="w-40"
        />

        {/* Year Filter */}
        <Select
          value={filters.year?.toString() || ''}
          onChange={(value) => updateFilter('year', value ? parseInt(value) : undefined)}
          options={YEAR_OPTIONS}
          placeholder="Year"
          className="w-32"
        />

        {/* Rating Filter */}
        <Select
          value={filters.min_rating?.toString() || ''}
          onChange={(value) => updateFilter('min_rating', value ? parseInt(value) : undefined)}
          options={RATING_OPTIONS}
          placeholder="Min Rating"
          className="w-40"
        />

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select
            value={filters.sort || 'popularity'}
            onChange={(value) => updateFilter('sort', value)}
            options={SORT_OPTIONS}
            className="w-36"
          />
          <button
            onClick={() => updateFilter('order', filters.order === 'asc' ? 'desc' : 'asc')}
            className={cn(
              'p-2.5 bg-card border border-border rounded-lg',
              'hover:bg-card-hover transition-colors'
            )}
            title={filters.order === 'asc' ? 'Ascending' : 'Descending'}
          >
            {filters.order === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-sm',
              'bg-accent/10 text-accent rounded-lg',
              'hover:bg-accent/20 transition-colors'
            )}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// Active filter pills display
export function ActiveFilters({ filters, onRemove }: { filters: ContentFilters; onRemove: (key: keyof ContentFilters) => void }) {
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value && !['sort', 'order', 'page', 'limit'].includes(key)
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map(([key, value]) => (
        <span
          key={key}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-full text-sm"
        >
          <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
          <span>{String(value)}</span>
          <button
            onClick={() => onRemove(key as keyof ContentFilters)}
            className="ml-1 text-muted-foreground hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
