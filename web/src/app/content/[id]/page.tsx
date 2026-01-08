import { ContentDetail } from '@/components/content/content-detail';

// For static export, we need to provide all params at build time
// Since we have many items, we'll use a placeholder and handle client-side
export function generateStaticParams() {
  // Generate a few popular IDs to pre-render, rest will 404 but work with GitHub Pages SPA redirect
  return [
    { id: 'tt0111161' }, // Shawshank Redemption
    { id: 'tt0068646' }, // The Godfather
    { id: 'tt0468569' }, // The Dark Knight
  ];
}

interface ContentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { id } = await params;
  return <ContentDetail id={id} />;
}
