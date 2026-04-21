import { Target, User, Shield, AlertCircle, Users, Trophy, MapPin, Globe } from 'lucide-react';
import { useTournamentPhase } from '../../hooks/useTournamentPhase';
import { TOURNAMENT_INFO } from '../../data/wc2026Static';

export function TournamentKPIs() {
  const { isPreTournament } = useTournamentPhase();

  const preTournamentKPIs = [
    {
      icon: Users,
      value: TOURNAMENT_INFO.totalTeams.toString(),
      label: 'Teams',
      subtitle: 'Qualified nations',
      color: 'var(--gold-leader)',
    },
    {
      icon: Trophy,
      value: TOURNAMENT_INFO.totalMatches.toString(),
      label: 'Matches',
      subtitle: 'Scheduled fixtures',
      color: 'var(--green-live)',
    },
    {
      icon: MapPin,
      value: TOURNAMENT_INFO.totalStadiums.toString(),
      label: 'Stadiums',
      subtitle: 'Host venues',
      color: 'var(--blue-ref)',
    },
    {
      icon: Globe,
      value: '3',
      label: 'Countries',
      subtitle: 'USA · Canada · Mexico',
      color: 'var(--white-primary)',
    },
  ];

  const liveTournamentKPIs = [
    {
      icon: Target,
      value: '147',
      label: 'Goals Scored',
      subtitle: '3.1 per match avg',
      color: 'var(--green-live)',
    },
    {
      icon: User,
      value: 'VINICIUS JR',
      label: 'Top Scorer',
      subtitle: '7 goals · Brazil',
      color: 'var(--gold-leader)',
      valueSize: 'text-2xl',
    },
    {
      icon: Shield,
      value: '18',
      label: 'Clean Sheets',
      subtitle: 'across 47 matches',
      color: 'var(--blue-ref)',
    },
    {
      icon: AlertCircle,
      value: '9',
      label: 'Red Cards',
      subtitle: '3 in knockout stage',
      color: 'var(--red-loss)',
    },
  ];

  const kpis = isPreTournament ? preTournamentKPIs : liveTournamentKPIs;

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded p-5 border transition-all duration-200 hover:border-border-active"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div
              className={kpi.valueSize || 'text-4xl'}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--white-primary)',
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {kpi.value}
            </div>
            <div className="mt-2 text-xs" style={{ color: 'var(--white-muted)' }}>
              {kpi.label}
            </div>
            <div className="mt-1 text-xs" style={{ color: 'var(--white-ghost)' }}>
              {kpi.subtitle}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
