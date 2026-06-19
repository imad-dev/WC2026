import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { NavBar } from './components/NavBar';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Footer } from '../components/layout/Footer';
import '../styles/index.css';
import { Bebas_Neue, Inter, Roboto_Mono } from 'next/font/google';

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'WC2026 — FIFA World Cup 2026 Live Streaming | Full HD Free',
  description:
    'Watch all 104 FIFA World Cup 2026 matches live. Get your wc 2026 stream here with fifa wc free streaming, real-time scores, and standings.',
  verification: {
    yandex: '423eb30a370535ff',
  },
  metadataBase: new URL('https://wc2026.games'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Watch FIFA World Cup 2026 Live Streaming Full HD Free',
    description:
      'Live streaming world cup 2026 matches. Free stream, real-time scores, and group standings for all 48 teams.',
    type: 'website',
    url: 'https://wc2026.games/',
    siteName: 'WC2026.games',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FIFA World Cup 2026 — Live streaming world cup 2026, free streams',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Streaming WC 2026 | WC2026.games',
    description: 'All 104 matches live. FIFA world cup 2026 live streaming full hd free, real-time scores, standings.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: 'https://wc2026.games/favicon.png', type: 'image/png' },
    ],
  },
  robots: 'index, follow',
  other: { 'theme-color': '#0a0e1a' },
};

// JSON-LD structured data
const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WC2026.games',
  url: 'https://wc2026.games',
  description:
    'Watch FIFA World Cup 2026 live streaming. Get your wc 2026 stream and fifa wc free streaming here. Real-time scores and live streaming world cup 2026.',
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
    'FIFA World Cup 2026 live streaming hub — free streams, wc 2026 stream, scores, schedules, and standings.',
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="jsonld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <Script
          id="jsonld-sportsevent"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSportsEvent) }}
        />
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        {/* Google AdSense */}
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1999755644541481"
          crossOrigin="anonymous"
        />
        {/* Popunder Script */}
        <script type="text/javascript" src="https://pl29770201.effectivecpmnetwork.com/5a/71/87/5a71872f0b95ba2ae33f1ce0e281902b.js"></script>
      </head>
      <body style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }} suppressHydrationWarning>
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
        {/* Social Bar Script */}
        <script type="text/javascript" src="https://pl29770203.effectivecpmnetwork.com/34/94/04/349404a6f693ba2d8907d7b787e9513e.js"></script>
      </body>
    </html>
  );
}
