'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Film, Tv, Clock, TrendingUp } from 'lucide-react';
import { MovieCard, MovieCardSkeleton } from '@/components/movie/movie-card';
import { cn, debounce } from '@/lib/utils';
import api from '@/services/api';

const RECENT_SEARCHES_KEY = 'tldr-recent-searches';
const MAX_RECENT_SEARCHES = 8;

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save search to recent
  const saveToRecent = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase());
      const updated = [searchTerm, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // Debounced search
  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
      if (value.trim()) {
        router.replace(`/search?q=${encodeURIComponent(value)}`);
        saveToRecent(value);
      } else {
        router.replace('/search');
      }
    }, 400),
    [router, saveToRecent]
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    debouncedSetQuery(value);
  };

  const handleSearchSelect = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    router.replace(`/search?q=${encodeURIComponent(term)}`);
    saveToRecent(term);
  };

  // Fetch search results
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => api.search(debouncedQuery, 48),
    enabled: debouncedQuery.length >= 2,
  });

  // Fetch trending for empty state
  const { data: trendingData } = useQuery({
    queryKey: ['trending-search'],
    queryFn: () => api.getTrending(12),
    enabled: !debouncedQuery,
  });

  const movies = data?.items.filter((item) => item.type === 'movie') || [];
  const shows = data?.items.filter((item) => item.type === 'show') || [];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Search</h1>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search for movies, TV shows, actors..."
              autoFocus
              className={cn(
                'w-full bg-card border border-border rounded-2xl',
                'pl-14 pr-12 py-4 text-lg',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
                'placeholder:text-muted-foreground'
              )}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setDebouncedQuery('');
                  router.replace('/search');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-card-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results or Empty State */}
        <AnimatePresence mode="wait">
          {debouncedQuery.length >= 2 ? (
            // Search Results
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <MovieCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-accent mb-2">Search failed</p>
                  <p className="text-muted-foreground text-sm">Please try again</p>
                </div>
              ) : data?.items.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    No matches for &quot;{debouncedQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Results Summary */}
                  <p className="text-muted-foreground">
                    Found {data?.total.toLocaleString()} results for &quot;{debouncedQuery}&quot;
                  </p>

                  {/* Movies Section */}
                  {movies.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Film className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-semibold">Movies</h2>
                        <span className="text-muted-foreground text-sm">({movies.length})</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {movies.map((content, index) => (
                          <motion.div
                            key={content._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                          >
                            <MovieCard content={content} />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* TV Shows Section */}
                  {shows.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <Tv className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-semibold">TV Shows</h2>
                        <span className="text-muted-foreground text-sm">({shows.length})</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {shows.map((content, index) => (
                          <motion.div
                            key={content._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                          >
                            <MovieCard content={content} />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            // Empty State - Recent & Trending
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <h2 className="text-xl font-semibold">Recent Searches</h2>
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearchSelect(term)}
                        className="px-4 py-2 bg-card rounded-full text-sm hover:bg-card-hover transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Trending */}
              {trendingData?.items && trendingData.items.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <h2 className="text-xl font-semibold">Trending Now</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {trendingData.items.map((content, index) => (
                      <motion.div
                        key={content._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <MovieCard content={content} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <div className="h-12 w-32 mx-auto bg-card rounded skeleton mb-8" />
            <div className="h-16 bg-card rounded-2xl skeleton" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
