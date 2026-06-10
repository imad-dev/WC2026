import { Metadata } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { MatchCard } from '@/components/ui/MatchCard';
import { MatchTabs } from '@/components/ui/MatchTabs';
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

        {/* Additional Match Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 md:mt-24">
          
          {/* Broadcasting Channels */}
          <div className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--wc-red)] opacity-5 rounded-bl-full transition-transform group-hover:scale-110"></div>
            <h3 className="text-xl text-white uppercase tracking-wider mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="w-2 h-2 rounded-full bg-[var(--wc-red)] animate-pulse"></span>
              Broadcasters
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--wc-border)]">
                <span className="text-[var(--wc-text-muted)] font-medium">USA</span>
                <span className="text-white font-bold tracking-wide">FOX Sports, Telemundo</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--wc-border)]">
                <span className="text-[var(--wc-text-muted)] font-medium">Canada</span>
                <span className="text-white font-bold tracking-wide">TSN, RDS</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--wc-border)]">
                <span className="text-[var(--wc-text-muted)] font-medium">UK</span>
                <span className="text-white font-bold tracking-wide">BBC, ITV</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--wc-border)]">
                <span className="text-[var(--wc-text-muted)] font-medium">Global</span>
                <span className="text-white font-bold tracking-wide">FIFA+ App</span>
              </div>
            </div>
            <a href="/live" className="mt-8 inline-block w-full py-3.5 text-center bg-[var(--wc-red)] hover:bg-[#ff1a35] text-white font-bold rounded tracking-widest uppercase transition-colors shadow-[0_4px_15px_rgba(232,0,29,0.3)]">
              Watch Live Stream
            </a>
          </div>

          {/* Match Facts & Stats */}
          <div className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--wc-green)] opacity-5 rounded-bl-full transition-transform group-hover:scale-110"></div>
            <h3 className="text-xl text-white uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-display)' }}>Match Facts</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--wc-border)]">
                <span className="text-[var(--wc-text-muted)] font-medium">Referee</span>
                <span className="text-white font-bold tracking-wide">TBA</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--wc-border)]">
                <span className="text-[var(--wc-text-muted)] font-medium">Venue</span>
                <span className="text-white font-bold tracking-wide text-right max-w-[200px] truncate">{match.venue}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--wc-border)]">
                <span className="text-[var(--wc-text-muted)] font-medium">Stage</span>
                <span className="text-[var(--wc-gold)] font-bold tracking-wide uppercase">{match.group_name ? `Group ${match.group_name}` : 'Knockout'}</span>
              </div>
            </div>
            
            <h4 className="text-sm font-bold text-[var(--wc-text-muted)] uppercase tracking-widest mt-6 mb-4">Head to Head Win Probability</h4>
            <div className="w-full flex h-3 rounded-full overflow-hidden bg-[var(--wc-surface-2)]">
              <div className="bg-[var(--wc-green)] h-full" style={{ width: '45%' }}></div>
              <div className="bg-[var(--wc-text-muted)] h-full opacity-30" style={{ width: '15%' }}></div>
              <div className="bg-[#4a90e2] h-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex justify-between text-xs font-bold mt-2 text-[var(--wc-text-muted)]">
              <span className="text-[var(--wc-green)]">45% {match.home_team}</span>
              <span>15% Draw</span>
              <span className="text-[#4a90e2]">40% {match.away_team}</span>
            </div>
          </div>
        </div>

        <MatchTabs matchId={match.id} homeTeam={match.home_team} awayTeam={match.away_team} />

      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[rgba(10,14,26,0.9)] backdrop-blur-md border-t border-[var(--wc-border)] z-50">
        <a href="/live" className="flex justify-center items-center py-4 bg-[var(--wc-red)] text-white font-bold rounded tracking-widest uppercase w-full shadow-[0_0_15px_rgba(232,0,29,0.5)]">
          WATCH LIVE STREAM
        </a>
      </div>
    </div>
  );
}
