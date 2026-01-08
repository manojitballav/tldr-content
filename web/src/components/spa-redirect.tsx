'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function SPARedirect() {
  const router = useRouter();

  useEffect(() => {
    // Handle GitHub Pages SPA redirect
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('p');

    if (redirectPath) {
      // Remove the query params and redirect to the actual path
      const newPath = '/' + redirectPath;
      const hash = window.location.hash;

      // Clean URL and navigate
      window.history.replaceState(null, '', newPath + hash);
      router.replace(newPath + hash);
    }
  }, [router]);

  return null;
}
