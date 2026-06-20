import type { Metadata } from 'next';
import NewsPage from '../_legacy-pages/NewsPage';

export const metadata: Metadata = {
  title: 'World Cup 2026 News — Latest Updates & Highlights',
  description:
    'Stay up to date with the latest FIFA World Cup 2026 news, transfer rumours, match highlights, and tournament updates from all 48 teams across USA, Canada, and Mexico.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'World Cup 2026 News — Latest Updates & Highlights',
    description: 'Breaking news and updates from the 2026 FIFA World Cup tournament.',
    url: 'https://wc2026.games/news',
  },
};

export default function NewsRoutePage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 bg-[var(--wc-dark)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-gold)] mb-3 font-semibold">
          Tournament News
        </p>
        <h1 className="text-3xl md:text-4xl text-white uppercase mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          World Cup 2026 News & Updates
        </h1>
        <p className="text-[var(--wc-text-muted)] text-sm mb-6">
          The latest headlines, match previews, and post-game analysis from the 2026 FIFA World Cup.
        </p>
      </div>
      <NewsPage />
    </>
  );
}
