import type { Metadata } from 'next';
import ContactUs from '../_legacy-pages/ContactUs';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the WC2026.games team. Report issues, suggest features, or inquire about partnerships and advertising.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact WC2026.games',
    description: 'Get in touch with the WC2026.games team for support, partnerships, or feedback.',
    url: 'https://wc2026.games/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 bg-[var(--wc-dark)]">
        <h1 className="text-3xl md:text-4xl text-white uppercase mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Contact Us
        </h1>
        <p className="text-[var(--wc-text-muted)] text-sm mb-6">
          Have a question, partnership inquiry, or feedback? Reach out to the WC2026.games team.
        </p>
      </div>
      <ContactUs />
    </>
  );
}
