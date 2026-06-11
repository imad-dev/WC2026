import type { Metadata } from 'next';
import AboutUs from '../_legacy-pages/AboutUs';

export const metadata: Metadata = {
  title: 'About Us — WC2026.games',
  description: 'Learn about WC2026.games — your free FIFA World Cup 2026 live-streaming hub.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <h1 className="sr-only">About WC2026.games</h1>
      <AboutUs />
    </>
  );
}
