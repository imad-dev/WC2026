import { COMPETITIONS, type CompetitionCode } from '../../services/api';

interface LeagueSelectorProps {
  selected: CompetitionCode;
  onChange: (code: CompetitionCode) => void;
}

const LEAGUES: CompetitionCode[] = ['PL', 'PD', 'BL1', 'SA', 'FL1', 'CL'];

const LEAGUE_ICONS: Record<CompetitionCode, string> = {
  PL: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  PD: '🇪🇸',
  BL1: '🇩🇪',
  SA: '🇮🇹',
  FL1: '🇫🇷',
  CL: '⭐',
  WC: '🌍',
};

const LEAGUE_SHORT: Record<CompetitionCode, string> = {
  PL: 'Premier League',
  PD: 'La Liga',
  BL1: 'Bundesliga',
  SA: 'Serie A',
  FL1: 'Ligue 1',
  CL: 'Champions League',
  WC: 'World Cup',
};

export function LeagueSelector({ selected, onChange }: LeagueSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {LEAGUES.map((code) => {
        const isActive = selected === code;
        return (
          <button
            key={code}
            id={`league-tab-${code.toLowerCase()}`}
            onClick={() => onChange(code)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap"
            style={{
              background: isActive ? COMPETITIONS[code]?.color || 'var(--green-live)' : 'var(--surface-2)',
              color: isActive ? '#fff' : 'var(--white-muted)',
              border: isActive ? 'none' : '1px solid var(--border)',
              boxShadow: isActive ? `0 0 16px ${COMPETITIONS[code]?.color || 'var(--green-live)'}44` : 'none',
              transform: isActive ? 'translateY(-1px)' : 'none',
              letterSpacing: '0.02em',
            }}
          >
            <span className="text-base leading-none">{LEAGUE_ICONS[code]}</span>
            <span className="hidden sm:inline">{LEAGUE_SHORT[code]}</span>
            <span className="sm:hidden">{code}</span>
          </button>
        );
      })}
    </div>
  );
}
