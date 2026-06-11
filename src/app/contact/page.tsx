import type { Metadata } from 'next';
import ContactUs from '../_legacy-pages/ContactUs';

export const metadata: Metadata = {
  title: 'Contact Us — WC2026.games',
  description: 'Get in touch with the WC2026.games team.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <h1 className="sr-only">Contact WC2026.games</h1>
      <ContactUs />
    </>
  );
}
