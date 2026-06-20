import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { NavBar } from './components/NavBar';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Footer } from '../components/layout/Footer';
import { AdScripts } from './components/AdScripts';
import '../styles/index.css';
import { Bebas_Neue, Inter, Roboto_Mono } from 'next/font/google';

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: 'FIFA World Cup 2026 Live — Free HD Streams, Scores & Schedule | WC2026.games',
    template: '%s | WC2026.games',
  },
  description:
    'Watch all 104 FIFA World Cup 2026 matches live in Full HD for free. Real-time scores, group standings, match schedule, team squads, and venue guides across USA, Canada, and Mexico.',
  verification: {
    yandex: '423eb30a370535ff',
  },
  metadataBase: new URL('https://wc2026.games'),
  alternates: { canonical: '/live' },
  openGraph: {
    title: 'FIFA World Cup 2026 Live — Free HD Streams & Scores',
    description:
      'Live streaming all 104 World Cup 2026 matches for free. Real-time scores, group standings, and full tournament coverage for all 48 teams.',
    type: 'website',
    url: 'https://wc2026.games/live',
    siteName: 'WC2026.games',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FIFA World Cup 2026 — Live Streams, Scores, Schedule & Standings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIFA World Cup 2026 Live — Free HD Streams | WC2026.games',
    description: 'Watch all 104 matches live. Real-time scores, standings, and full tournament coverage.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: { 'theme-color': '#0a0e1a' },
};

// JSON-LD structured data
const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WC2026.games',
  url: 'https://wc2026.games',
  description:
    'FIFA World Cup 2026 live streaming hub — free HD streams, real-time scores, match schedule, group standings, and team profiles for all 48 teams.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://wc2026.games/schedule?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const jsonLdSportsEvent = {
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: 'FIFA World Cup 2026',
  description:
    'The 23rd FIFA World Cup — the first with 48 teams — hosted across 16 venues in USA, Canada, and Mexico with 104 matches.',
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
    url: 'https://wc2026.games/live',
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
    'FIFA World Cup 2026 live streaming hub — free HD streams, real-time scores, match schedule, and group standings.',
  logo: 'https://wc2026.games/favicon.png',
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }} suppressHydrationWarning>
        {/* JSON-LD Structured Data */}
        <Script
          id="jsonld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
          strategy="beforeInteractive"
        />
        <Script
          id="jsonld-sportsevent"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSportsEvent) }}
          strategy="beforeInteractive"
        />
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
          strategy="beforeInteractive"
        />

        <NavBar />
        <PageWrapper>
          {children}
        </PageWrapper>
        <Footer />
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F0FWMJXBPS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F0FWMJXBPS');
          `}
        </Script>
        <AdScripts />
      </body>
    </html>
  );
}
