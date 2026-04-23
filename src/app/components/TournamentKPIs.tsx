import { useTranslation } from 'react-i18next';
import { TOURNAMENT_INFO } from '../../data/wc2026Static';

export function TournamentKPIs() {
  const { t } = useTranslation();
  const stats = [
    { label: t('kpi.teams'), value: String(TOURNAMENT_INFO.totalTeams), sub: t('kpi.teams_sub'), color: 'var(--green-live)' },
    { label: t('kpi.matches'), value: String(TOURNAMENT_INFO.totalMatches), sub: t('kpi.matches_sub'), color: 'var(--gold-leader)' },
    { label: t('kpi.venues'), value: String(TOURNAMENT_INFO.totalStadiums), sub: t('kpi.venues_sub'), color: 'var(--blue-ref)' },
    { label: t('kpi.max_cap'), value: '87.5K', sub: t('kpi.max_cap_sub'), color: 'var(--red-loss)' },
    { label: t('kpi.duration'), value: '39', sub: t('kpi.duration_sub'), color: 'var(--amber-draw)' },
    { label: t('kpi.prize_fund'), value: '$1B', sub: t('kpi.prize_fund_sub'), color: 'var(--green-live)' },
  ];

  return (
    <section id="tournament-kpis">
      <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--white-ghost)', letterSpacing: '0.1em' }}>
        {t('kpi.overview')}
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
