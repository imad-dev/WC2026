import type { Metadata } from 'next';
import TermsOfService from '../_legacy-pages/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service — WC2026.games',
  description: 'Terms of service for WC2026.games.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <>
      <h1 className="sr-only">Terms of Service - WC2026.games</h1>
      <TermsOfService />
    </>
  );
}
