import type { Metadata } from 'next';
import NewsPage from '../_legacy-pages/NewsPage';

export const metadata: Metadata = {
  title: 'World Cup 2026 News — WC2026.games',
  description:
    'Latest FIFA World Cup 2026 news, updates, and highlights from all 48 teams.',
  alternates: { canonical: '/news' },
};

export default function NewsRoutePage() {
  return (
    <>
      <h1 className="sr-only">World Cup 2026 News and Updates</h1>
      <NewsPage />
    </>
  );
}
