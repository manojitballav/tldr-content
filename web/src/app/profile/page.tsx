'use client';

import { User, LogIn, Mail } from 'lucide-react';

export default function ProfilePage() {
  // TODO: Implement Firebase auth

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center py-20">
          {/* Profile Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card flex items-center justify-center">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>

          <h1 className="text-2xl font-semibold mb-3">Sign in to TLDR Content</h1>
          <p className="text-muted-foreground mb-8">
            Create an account to save your watchlist, rate movies, and get personalized recommendations.
          </p>

          {/* Sign In Buttons */}
          <div className="space-y-3">
            <button
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              onClick={() => {
                // TODO: Implement Google sign in
                alert('Google Sign In - Coming Soon');
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-card border border-border rounded-lg font-semibold hover:bg-card-hover transition-colors"
              onClick={() => {
                // TODO: Implement email sign in
                alert('Email Sign In - Coming Soon');
              }}
            >
              <Mail className="w-5 h-5" />
              Continue with Email
            </button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
