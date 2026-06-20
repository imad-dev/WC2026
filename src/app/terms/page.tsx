import type { Metadata } from 'next';
import TermsOfService from '../_legacy-pages/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service for WC2026.games. By using our FIFA World Cup 2026 live-streaming platform, you agree to these terms and conditions.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service — WC2026.games',
    description: 'Terms and conditions for using WC2026.games live streaming and scores platform.',
    url: 'https://wc2026.games/terms',
  },
};

export default function TermsPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 bg-[var(--wc-dark)]">
        <h1 className="text-3xl md:text-4xl text-white uppercase mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Terms of Service
        </h1>
        <p className="text-[var(--wc-text-muted)] text-sm mb-6">
          Last updated: June 2026. Please read these terms carefully before using WC2026.games.
        </p>
      </div>
      <TermsOfService />
    </>
  );
}
