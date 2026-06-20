import type { Metadata } from 'next';
import { MatchGrid } from '@/components/sections/MatchGrid';
import Link from 'next/link';
import { generateFAQJsonLd } from '@/lib/seo-helpers';

const SCHEDULE_FAQS = [
  { q: 'When does the World Cup 2026 start?', a: 'The FIFA World Cup 2026 kicks off on June 11, 2026, with the opening match at Estadio Azteca in Mexico City.' },
  { q: 'How many matches are in the World Cup 2026?', a: 'There are 104 matches in total — 72 group stage matches followed by 32 knockout stage matches including the Final on July 19 at MetLife Stadium.' },
  { q: 'What is the new World Cup 2026 format?', a: 'The 2026 World Cup features 48 teams in 12 groups of 4. The top 2 from each group plus the 8 best third-placed teams advance to a Round of 32.' },
  { q: 'Where can I watch World Cup 2026 for free?', a: 'WC2026.games provides free live streaming of all 104 matches in Full HD quality with real-time scores and commentary.' },
];

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Match Schedule — All 104 Games',
  description: 'Complete match schedule for the 2026 FIFA World Cup. View all 104 games across group stage and knockout rounds. Filter by date, group, and venue. Kick-off times in your local timezone.',
  alternates: { canonical: '/schedule' },
  openGraph: {
    title: 'FIFA World Cup 2026 Match Schedule — All 104 Games',
    description: 'Full match schedule for every World Cup 2026 game. Group stage, Round of 32, Quarter-Finals, Semi-Finals, and the Final at MetLife Stadium.',
    url: 'https://wc2026.games/schedule',
  },
};

export default function SchedulePage() {
  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-gold)] mb-3 font-semibold">
          Tournament Schedule
        </p>
        <h1 className="text-3xl md:text-4xl text-white uppercase mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          FIFA World Cup 2026 Match Schedule
        </h1>
        <p className="text-[var(--wc-text-muted)] text-sm md:text-base max-w-3xl leading-relaxed mb-6">
          Browse the complete schedule of all 104 FIFA World Cup 2026 matches — from the opening match at Estadio Azteca on June 11 to the Final at MetLife Stadium on July 19, 2026. All kick-off times are displayed in your local timezone. Use the filters below to find matches by group, date, or venue.
        </p>

        {/* Internal Navigation */}
        <nav className="flex flex-wrap gap-2 mb-6" aria-label="Quick links">
          <Link href="/groups" className="text-xs px-3 py-1.5 rounded-full bg-[var(--wc-surface)] border border-[var(--wc-border)] text-[var(--wc-text-muted)] hover:text-white hover:border-[var(--wc-green)] transition-colors">Group Standings</Link>
          <Link href="/teams" className="text-xs px-3 py-1.5 rounded-full bg-[var(--wc-surface)] border border-[var(--wc-border)] text-[var(--wc-text-muted)] hover:text-white hover:border-[var(--wc-green)] transition-colors">All 48 Teams</Link>
          <Link href="/venues" className="text-xs px-3 py-1.5 rounded-full bg-[var(--wc-surface)] border border-[var(--wc-border)] text-[var(--wc-text-muted)] hover:text-white hover:border-[var(--wc-green)] transition-colors">Stadiums & Venues</Link>
          <Link href="/live" className="text-xs px-3 py-1.5 rounded-full bg-[rgba(0,166,81,0.1)] border border-[rgba(0,166,81,0.3)] text-[var(--wc-green)] hover:bg-[var(--wc-green)] hover:text-black transition-colors">Watch Live</Link>
        </nav>
      </div>

      {/* Schedule Page Monetization Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-center mb-6">
        <a 
          href="https://www.effectivecpmnetwork.com/steh40ys?key=c3817b02a6ce5ba1e04b14695f562abc" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          className="w-full md:w-1/3 py-4 bg-gradient-to-r from-[var(--wc-red)] to-red-600 text-white font-bold text-lg rounded-xl text-center shadow-[0_0_20px_rgba(232,0,29,0.4)] hover:scale-[1.02] transition-transform uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <span className="text-2xl">💰</span> Bet & Win Big!
        </a>
        
        <div className="w-full md:w-2/3 min-h-[100px] flex items-center justify-center bg-black/20 rounded-xl overflow-hidden border border-[var(--wc-border)]">
          <div id="container-3ffa407b9e421b28184453613f9fdd5c"></div>
        </div>
      </div>

      <MatchGrid />

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl text-white uppercase mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SCHEDULE_FAQS.map((faq) => (
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

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQJsonLd(
            SCHEDULE_FAQS.map(f => ({ question: f.q, answer: f.a }))
          )),
        }}
      />
    </div>
  );
}
