import type { Metadata } from 'next';
import AboutUs from '../_legacy-pages/AboutUs';

export const metadata: Metadata = {
  title: 'About Us — Who We Are',
  description:
    'WC2026.games is a free FIFA World Cup 2026 live-streaming and real-time scores platform. Learn about our mission to bring every match to fans worldwide.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About WC2026.games — Free World Cup 2026 Streaming',
    description: 'Learn about WC2026.games — your free FIFA World Cup 2026 live-streaming hub.',
    url: 'https://wc2026.games/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 bg-[var(--wc-dark)]">
        <h1 className="text-3xl md:text-4xl text-white uppercase mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          About WC2026.games
        </h1>
        <p className="text-[var(--wc-text-muted)] text-sm mb-6">
          Your free hub for every FIFA World Cup 2026 match — live streams, real-time scores, and full tournament coverage.
        </p>
      </div>
      <AboutUs />
    </>
  );
}
