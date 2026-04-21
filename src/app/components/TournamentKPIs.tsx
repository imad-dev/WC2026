import { TOURNAMENT_INFO, STADIUMS } from '../../data/wc2026Static';

export function TournamentKPIs() {
  const stats = [
    { label: 'Teams', value: String(TOURNAMENT_INFO.totalTeams), sub: '6 confederations', color: 'var(--green-live)' },
    { label: 'Matches', value: String(TOURNAMENT_INFO.totalMatches), sub: 'Group + Knockout', color: 'var(--gold-leader)' },
    { label: 'Venues', value: String(TOURNAMENT_INFO.totalStadiums), sub: 'Across 3 countries', color: 'var(--blue-ref)' },
    { label: 'Max Cap.', value: '87.5K', sub: 'Estadio Azteca', color: 'var(--red-loss)' },
    { label: 'Duration', value: '39', sub: 'Days of football', color: 'var(--amber-draw)' },
    { label: 'Prize Fund', value: '$1B', sub: 'Record FIFA prize', color: 'var(--green-live)' },
  ];

  return (
    <section id="tournament-kpis">
      <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--white-ghost)', letterSpacing: '0.1em' }}>
        Tournament Overview
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg p-4 border text-center transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
          >
            <div
              className="text-2xl font-extrabold tabular-nums"
              style={{ fontFamily: 'var(--font-display)', color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-xs font-semibold uppercase mt-0.5" style={{ color: 'var(--white-primary)' }}>
              {stat.label}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--white-ghost)' }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
