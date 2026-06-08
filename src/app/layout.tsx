import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import I18nProvider from './components/I18nProvider';
import '../styles/index.css';

export const metadata: Metadata = {
  title: 'WC2026 — FIFA World Cup 2026 Live | Free Stream & Scores',
  description:
    'Watch all 104 FIFA World Cup 2026 matches live. Free geo-routed streams, real-time scores, group standings, and full schedule. June 11 – July 19, 2026.',
  metadataBase: new URL('https://wc2026.games'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Watch FIFA World Cup 2026 Live | Free Stream & Scores',
    description:
      'All 104 matches live. Free stream, real-time scores, group standings for all 48 teams across USA, Canada & Mexico.',
    type: 'website',
    url: 'https://wc2026.games/',
    siteName: 'WC2026.games',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FIFA World Cup 2026 — Live scores, free streams, group standings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watch FIFA World Cup 2026 Live | WC2026.games',
    description: 'All 104 matches live. Free stream, real-time scores, standings.',
    images: ['/og-image.png'],
  },
  robots: 'index, follow',
  other: { 'theme-color': '#060810' },
};

// JSON-LD structured data
const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WC2026.games',
  url: 'https://wc2026.games',
  description:
    'Watch FIFA World Cup 2026 live. Free streams, real-time scores, group standings, and full schedule for all 104 matches across USA, Canada, and Mexico.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://wc2026.games/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const jsonLdSportsEvent = {
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: 'FIFA World Cup 2026',
  description:
    'The 23rd FIFA World Cup, the first with 48 teams, hosted across USA, Canada, and Mexico with 104 matches in 16 venues.',
  startDate: '2026-06-11',
  endDate: '2026-07-19',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'USA, Canada, Mexico',
    address: { '@type': 'PostalAddress', addressCountry: 'US' },
  },
  organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
  sport: 'Football/Soccer',
  url: 'https://wc2026.games',
  image: 'https://wc2026.games/og-image.png',
  performer: [
    {
      '@type': 'SportsTeam',
      name: '48 National Teams',
    }
  ],
  offers: {
    '@type': 'Offer',
    url: 'https://wc2026.games',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WC2026.games',
  url: 'https://wc2026.games',
  description:
    'FIFA World Cup 2026 live hub — free streams, scores, schedules, and standings.',
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSportsEvent) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1999755644541481"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ height: '100%', margin: 0 }}>
        <I18nProvider>{children}</I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
