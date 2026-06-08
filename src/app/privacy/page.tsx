import type { Metadata } from 'next';
import PrivacyPolicy from '../_legacy-pages/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy — WC2026.games',
  description: 'Privacy policy for WC2026.games — how we handle your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
