import { Metadata } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { MatchCard } from '@/components/ui/MatchCard';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: match } = await supabase
    .from('wc2026_matches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!match) return { title: 'Match Not Found' };

  const title = `${match.home_team} vs ${match.away_team} — WC2026 Live Score | wc2026.games`;
  const description = `Follow the ${match.home_team} vs ${match.away_team} match live. Group ${match.group_name || 'Knockout'}, ${new Date(match.kickoff_utc).toLocaleDateString()} at ${match.venue}. Get real-time scores, stats, and live streams.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [`/api/og?match=${match.id}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?match=${match.id}`],
    },
  };
}

export default async function MatchPage({ params }: { params: { id: string } }) {
  const { data: match } = await supabase
    .from('wc2026_matches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!match) notFound();

  // JSON-LD structured data for the match event
  const jsonLdSportsEvent = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.home_team} vs ${match.away_team} - FIFA World Cup 2026`,
    description: `FIFA World Cup 2026 match between ${match.home_team} and ${match.away_team} at ${match.venue}.`,
    startDate: match.kickoff_utc,
    eventStatus: match.status === 'finished' ? 'https://schema.org/EventScheduled' : 
                 match.status === 'live' ? 'https://schema.org/EventLive' : 
                 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: match.venue,
    },
    homeTeam: {
      '@type': 'SportsTeam',
      name: match.home_team,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: match.away_team,
    },
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[var(--wc-dark)] py-8 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSportsEvent) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <div className="mb-8">
          <a href="/schedule" className="text-[var(--wc-text-muted)] hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
            ← Back to Schedule
          </a>
        </div>

        {/* Detailed Match Card */}
        <div className="w-full scale-100 md:scale-110 origin-top mb-12">
          <MatchCard match={match} />
        </div>

        {/* Additional Match Info Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 md:mt-24">
          <div className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl p-6">
            <h3 className="text-xl text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-display)' }}>Match Facts</h3>
            <ul className="text-sm text-[var(--wc-text-muted)] space-y-3">
              <li><strong>Referee:</strong> TBD</li>
              <li><strong>Attendance:</strong> TBD</li>
              <li><strong>Weather:</strong> TBD</li>
            </ul>
          </div>
          <div className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl p-6">
            <h3 className="text-xl text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-display)' }}>Watch Live</h3>
            <p className="text-sm text-[var(--wc-text-muted)] mb-4">Streams are available in your region via official broadcasters.</p>
            <a href="/live" className="inline-block w-full py-3 text-center bg-[var(--wc-red)] hover:bg-[#ff1a35] text-white font-bold rounded tracking-widest uppercase transition-colors">
              Go to Live Hub
            </a>
          </div>
        </div>

      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[rgba(10,14,26,0.9)] backdrop-blur-md border-t border-[var(--wc-border)] z-50">
        <a href="/live" className="flex justify-center items-center py-4 bg-[var(--wc-red)] text-white font-bold rounded tracking-widest uppercase w-full shadow-[0_0_15px_rgba(232,0,29,0.5)]">
          WATCH LIVE
        </a>
      </div>
    </div>
  );
}
