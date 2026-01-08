'use client';

import Link from 'next/link';
import { Heart, LogIn } from 'lucide-react';

export default function WatchlistPage() {
  // TODO: Implement Firebase auth check

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Watchlist</h1>
          <p className="text-muted-foreground">
            Keep track of movies and shows you want to watch
          </p>
        </div>

        {/* Not Logged In State */}
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-card flex items-center justify-center">
            <Heart className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Sign in to save your watchlist</h2>
          <p className="text-muted-foreground mb-6">
            Create an account to save movies and shows to your watchlist and access them from any device.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
