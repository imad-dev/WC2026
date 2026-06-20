import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { VenueCard } from '@/components/ui/VenueCard';
import Link from 'next/link';
import { generateFAQJsonLd } from '@/lib/seo-helpers';

const VENUE_FAQS = [
  { q: 'Where is the World Cup 2026 Final?', a: 'The Final will be held at MetLife Stadium in East Rutherford, New Jersey, on July 19, 2026. The stadium has a capacity of 82,500.' },
  { q: 'Which stadium hosts the opening match?', a: 'The opening match takes place at Estadio Azteca in Mexico City on June 11, 2026 — one of the most iconic football stadiums in the world with 87,523 capacity.' },
  { q: 'How many countries host World Cup 2026?', a: 'Three countries — the United States (11 venues), Mexico (3 venues), and Canada (2 venues) — co-host the tournament.' },
  { q: 'What is the largest World Cup 2026 venue?', a: 'Estadio Azteca in Mexico City is the largest venue at 87,523 capacity, followed by MetLife Stadium at 82,500.' },
];

export const metadata: Metadata = {
  title: 'World Cup 2026 Venues & Stadium Guide — 16 Host Cities',
  description: 'Explore all 16 official FIFA World Cup 2026 stadiums across USA, Canada, and Mexico. Stadium capacities, host cities, and match assignments for MetLife Stadium, Estadio Azteca, SoFi Stadium, and more.',
  alternates: { canonical: '/venues' },
  openGraph: {
    title: 'World Cup 2026 Venues & Stadium Guide — 16 Host Cities',
    description: '16 iconic stadiums across 3 countries hosting the FIFA World Cup 2026. Find your nearest venue.',
    url: 'https://wc2026.games/venues',
  },
};

const getVenues = unstable_cache(
  async () => {
    const { data, error } = await supabaseAdmin
      .from('wc2026_venues')
      .select('*')
      .order('capacity', { ascending: false });

    if (error) {
      console.error('Error fetching venues:', error);
      return [];
    }
    return data || [];
  },
  ['wc2026-venues'],
  { revalidate: 30 }
);

export default async function VenuesPage() {
  const venues = await getVenues();

  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-gold)] mb-3 font-semibold">
            Tournament Venues
          </p>
          <h1
            className="text-4xl md:text-5xl text-[var(--wc-text)] mb-3 uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Host Cities & Venues
          </h1>
          <p className="text-[var(--wc-text-muted)] text-sm md:text-base max-w-3xl leading-relaxed mb-6">
            16 iconic stadiums across USA, Canada, and Mexico will host the 104 matches of the 2026 FIFA World Cup — the largest in history. The opening match takes place at Estadio Azteca in Mexico City, while the Final will be held at MetLife Stadium in New York/New Jersey.
          </p>

          {/* Internal Navigation */}
          <nav className="flex flex-wrap gap-2" aria-label="Quick links">
            <Link href="/schedule" className="text-xs px-3 py-1.5 rounded-full bg-[var(--wc-surface)] border border-[var(--wc-border)] text-[var(--wc-text-muted)] hover:text-white hover:border-[var(--wc-green)] transition-colors">Match Schedule</Link>
            <Link href="/groups" className="text-xs px-3 py-1.5 rounded-full bg-[var(--wc-surface)] border border-[var(--wc-border)] text-[var(--wc-text-muted)] hover:text-white hover:border-[var(--wc-green)] transition-colors">Group Standings</Link>
            <Link href="/teams" className="text-xs px-3 py-1.5 rounded-full bg-[var(--wc-surface)] border border-[var(--wc-border)] text-[var(--wc-text-muted)] hover:text-white hover:border-[var(--wc-green)] transition-colors">All 48 Teams</Link>
            <Link href="/live" className="text-xs px-3 py-1.5 rounded-full bg-[rgba(0,166,81,0.1)] border border-[rgba(0,166,81,0.3)] text-[var(--wc-green)] hover:bg-[var(--wc-green)] hover:text-black transition-colors">Watch Live</Link>
          </nav>
        </div>

        {/* Masonry Grid — single column on mobile */}
        <div className="columns-1 sm:columns-2 gap-4 sm:gap-6">
          {venues.map((venue, idx) => (
            <VenueCard key={venue.id} venue={venue} idx={idx} />
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-2xl text-white uppercase mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Venue FAQ
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {VENUE_FAQS.map((faq) => (
              <details key={faq.q} className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl p-4 group">
                <summary className="text-white font-medium cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-[var(--wc-text-muted)] group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="mt-3 text-[var(--wc-text-muted)] text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQJsonLd(
            VENUE_FAQS.map(f => ({ question: f.q, answer: f.a }))
          )),
        }}
      />
    </div>
  );
}
