import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Live — Free HD Streams & Live Streaming',
  description:
    'Watch every match of the FIFA World Cup 2026 live streaming in Full HD for free. Access live FIFA World Cup 2026 match streams, real-time scores, standings, and fan chat.',
  alternates: { canonical: '/live' },
  openGraph: {
    title: 'FIFA World Cup 2026 Live — Free HD Streams & Live Streaming',
    description:
      'Watch every match of the FIFA World Cup 2026 live streaming in Full HD for free. Access live FIFA World Cup 2026 match streams, real-time scores, standings, and fan chat.',
    url: 'https://wc2026.games/live',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How to watch the FIFA World Cup 2026 live streaming?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can watch all 104 matches of the FIFA World Cup 2026 live streaming for free on WC2026.games. Our platform offers Full HD quality streams with real-time score updates, live chat, and match predictions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I find free live streams of the FIFA World Cup 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "WC2026.games provides free, high-performance live streams of all FIFA World Cup 2026 matches. You don't need a paid subscription or account — simply visit our live hub, choose the match on air, and start streaming immediately.",
      },
    },
    {
      '@type': 'Question',
      name: 'What matches of the 2026 FIFA World Cup are happening today?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can check the daily schedule and find out what match is happening today directly in our Match Schedule section. The matches list, kickoff times in your local timezone, and streaming links are updated in real-time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I stream the World Cup 2026 live on mobile devices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Our platform is optimized for mobile-first fans. You can watch live streams, track real-time scores, use the interactive match predictor, and chat with other fans on any smartphone or tablet.',
      },
    },
  ],
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="faq-jsonld-live"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
