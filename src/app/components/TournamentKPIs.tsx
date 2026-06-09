import { TOURNAMENT_INFO } from '../../data/wc2026Static';
import { Users, Trophy, MapPin, Calendar, DollarSign, Tv } from 'lucide-react';
import Link from 'next/link';

export function TournamentKPIs() {
  const stats = [
    { label: 'TEAMS', value: String(TOURNAMENT_INFO.totalTeams), sub: 'From 6 confederations', color: 'var(--wc-green)', Icon: Users, href: '/teams' },
    { label: 'MATCHES', value: String(TOURNAMENT_INFO.totalMatches), sub: 'Across 3 countries', color: 'var(--wc-gold)', Icon: Trophy, href: '/groups' },
    { label: 'VENUES', value: String(TOURNAMENT_INFO.totalStadiums), sub: 'Host cities', color: 'var(--wc-blue-ref)', Icon: MapPin, href: '/venues' },
    { label: 'MAX CAPACITY', value: '87.5K', sub: 'Estadio Azteca', color: 'var(--wc-red)', Icon: Tv },
    { label: 'DAYS', value: '39', sub: 'Of tournament play', color: 'var(--wc-gold)', Icon: Calendar },
    { label: 'PRIZE FUND', value: '$1B', sub: 'Record prize pool', color: 'var(--wc-green)', Icon: DollarSign },
  ];

  return (
    <section id="tournament-kpis" className="relative z-10">
      <p className="text-xs uppercase tracking-[0.2em] mb-6 text-[var(--wc-text-muted)] font-semibold">
        Tournament Overview
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const CardContent = (
            <div
              className="rounded-xl p-5 border text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-[var(--wc-surface)] border-[var(--wc-border)] group h-full flex flex-col items-center justify-center cursor-pointer"
            >
              <stat.Icon
                className="w-4 h-4 mx-auto mb-2 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ color: stat.color }}
              />
              <div
                className="text-3xl font-extrabold tabular-nums"
                style={{ fontFamily: 'var(--font-display)', color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-[10px] font-bold uppercase mt-1 text-white tracking-wider">
                {stat.label}
              </div>
              <div className="text-[10px] mt-1 text-[var(--wc-text-muted)]">
                {stat.sub}
              </div>
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block">
              {CardContent}
            </Link>
          ) : (
            <div key={stat.label}>
              {CardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
