import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: team } = await supabaseAdmin
    .from('wc2026_teams')
    .select('name')
    .eq('id', params.id)
    .single();

  if (!team) return { title: 'Team Not Found | WC2026' };

  return {
    title: `${team.name} | WC2026 Squad`,
    description: `Official squad and match information for ${team.name} at the FIFA World Cup 2026.`,
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { data: team, error } = await supabaseAdmin
    .from('wc2026_teams')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !team) {
    notFound();
  }

  // Future: fetch matches for this team
  // const { data: matches } = await supabaseAdmin.from('wc2026_matches').select('...').or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`);

  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)] pb-20">
      {/* Hero Header */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex items-end justify-center pb-12 overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
        {/* Background ambient glow based on flag or generic green */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-[var(--wc-green)] to-transparent mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--wc-green)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <img 
            src={team.flag_url || `https://flagcdn.com/160x120/${team.id}.png`} 
            alt={`${team.name} flag`} 
            className="w-32 h-24 md:w-40 md:h-30 object-cover shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-lg mb-6 border border-[rgba(255,255,255,0.1)]"
          />
          <h1 className="text-5xl md:text-7xl text-white uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {team.name}
          </h1>
          <div className="flex gap-4 mt-4 items-center">
            <span className="px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-xs font-bold tracking-widest text-[var(--wc-text-muted)] uppercase">
              {team.confederation}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-xs font-bold tracking-widest text-[var(--wc-text-muted)] uppercase">
              Group {team.group_letter}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[rgba(0,166,81,0.1)] border border-[rgba(0,166,81,0.3)] text-xs font-bold tracking-widest text-[var(--wc-green)] uppercase">
              Rank #{team.fifa_ranking}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12">
        <Link href="/teams" className="inline-flex items-center text-sm font-medium text-[var(--wc-text-muted)] hover:text-white transition-colors mb-8">
          &larr; Back to all teams
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <section className="bg-[var(--wc-surface)] rounded-2xl p-6 md:p-8 border border-[var(--wc-border)]">
              <h2 className="text-2xl text-white uppercase mb-4" style={{ fontFamily: 'var(--font-display)' }}>Squad Roster</h2>
              <p className="text-[var(--wc-text-muted)] text-sm">
                Official squad data is synchronized closer to the tournament start date. 
                Keep an eye out for final 26-man roster announcements.
              </p>
              
              <div className="mt-6 flex flex-col items-center justify-center py-12 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl bg-[rgba(255,255,255,0.01)]">
                <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4">
                  <span className="text-2xl">⏳</span>
                </div>
                <p className="text-sm text-[var(--wc-text-muted)] uppercase tracking-wider font-semibold">Pending Official Announcement</p>
              </div>
            </section>
          </div>

          <div className="col-span-1 space-y-8">
            <section className="bg-[var(--wc-surface)] rounded-2xl p-6 md:p-8 border border-[var(--wc-border)]">
              <h2 className="text-2xl text-white uppercase mb-4" style={{ fontFamily: 'var(--font-display)' }}>Stats Overview</h2>
              <ul className="space-y-4">
                <li className="flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-sm text-[var(--wc-text-muted)] uppercase tracking-wider">Group</span>
                  <span className="text-lg text-white font-bold">{team.group_letter}</span>
                </li>
                <li className="flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-sm text-[var(--wc-text-muted)] uppercase tracking-wider">World Rank</span>
                  <span className="text-lg text-[var(--wc-green)] font-bold">#{team.fifa_ranking}</span>
                </li>
                <li className="flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-sm text-[var(--wc-text-muted)] uppercase tracking-wider">Region</span>
                  <span className="text-lg text-white font-bold">{team.confederation}</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
