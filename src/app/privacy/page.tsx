import type { Metadata } from 'next';
import PrivacyPolicy from '../_legacy-pages/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for WC2026.games. Learn how we collect, use, and protect your personal data when using our FIFA World Cup 2026 live-streaming platform.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy — WC2026.games',
    description: 'How WC2026.games handles your data and privacy while using our streaming platform.',
    url: 'https://wc2026.games/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 bg-[var(--wc-dark)]">
        <h1 className="text-3xl md:text-4xl text-white uppercase mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Privacy Policy
        </h1>
        <p className="text-[var(--wc-text-muted)] text-sm mb-6">
          Last updated: June 2026. This policy describes how WC2026.games collects and handles your information.
        </p>
      </div>
      <PrivacyPolicy />
    </>
  );
}
