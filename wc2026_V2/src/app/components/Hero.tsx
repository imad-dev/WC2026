import { useTournamentPhase } from '../../hooks/useTournamentPhase';
import { useCountdown } from '../../hooks/useCountdown';
import { TOURNAMENT_INFO } from '../../data/wc2026Static';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';

export function Hero() {
  const { isPreTournament, isLive } = useTournamentPhase();
  const countdown = useCountdown(TOURNAMENT_INFO.opener.date);

  const todayMatches = [
    { teamA: 'BRA', flagA: '🇧🇷', teamB: 'ARG', flagB: '🇦🇷', scoreA: 2, scoreB: 1, status: 'LIVE', time: '67\'', stadium: 'MetLife Stadium' },
    { teamA: 'ENG', flagA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', teamB: 'FRA', flagB: '🇫🇷', scoreA: 1, scoreB: 1, status: 'FT', stadium: 'SoFi Stadium' },
    { teamA: 'ESP', flagA: '🇪🇸', teamB: 'POR', flagB: '🇵🇹', status: 'UPCOMING', time: '20:00', stadium: 'AT&T Stadium' },
  ];

  if (isPreTournament) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          height: 'auto',
          minHeight: '600px',
          background: 'radial-gradient(circle at center, transparent 0%, var(--void) 100%)',
        }}
      >
        {/* Background with overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0A0E1A 0%, #121828 50%, #0A0E1A 100%)',
            opacity: 0.8,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />

        <div className="relative h-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-12 md:py-16">
          {/* Pre-Tournament Hero */}
          <div className="text-center space-y-8">
            {/* Countdown Badge */}
            <div className="flex items-center gap-2 justify-center">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: 'var(--gold-leader)' }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--gold-leader)', letterSpacing: '0.08em' }}
              >
                TOURNAMENT OPENER
              </span>
            </div>

            {/* Main Countdown */}
            <div>
              <div
                className="text-xs uppercase tracking-wider mb-4"
                style={{ color: 'var(--white-muted)', letterSpacing: '0.08em' }}
              >
                KICKS OFF IN
              </div>
              <div className="flex items-center justify-center gap-4 md:gap-8">
                {[
                  { value: countdown.days, label: 'DAYS' },
                  { value: countdown.hours, label: 'HOURS' },
                  { value: countdown.minutes, label: 'MINS' },
                  { value: countdown.seconds, label: 'SECS' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className="text-5xl md:text-7xl lg:text-8xl font-extrabold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--green-live)',
                        fontFeatureSettings: '"tnum" 1',
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wider mt-2"
                      style={{ color: 'var(--white-muted)', letterSpacing: '0.08em' }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opener Match Info */}
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-5xl md:text-6xl border mx-auto mb-3" style={{ borderColor: 'var(--border)' }}>
                    🇲🇽
                  </div>
                  <div
                    className="text-2xl md:text-4xl font-extrabold uppercase"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--white-primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    MEXICO
                  </div>
                </div>

                <div
                  className="text-2xl md:text-3xl font-semibold"
                  style={{ color: 'var(--white-muted)' }}
                >
                  vs
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-5xl md:text-6xl border mx-auto mb-3" style={{ borderColor: 'var(--border)' }}>
                    🇿🇦
                  </div>
                  <div
                    className="text-2xl md:text-4xl font-extrabold uppercase"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--white-primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    SOUTH AFRICA
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="flex items-center justify-center gap-6 text-sm" style={{ color: 'var(--white-muted)' }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>June 11, 2026 · 19:00 UTC</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{TOURNAMENT_INFO.opener.stadium}, {TOURNAMENT_INFO.opener.city}</span>
                </div>
              </div>

              {/* Tournament Stats Banner */}
              <div
                className="mt-8 p-6 rounded-lg border inline-flex items-center gap-8 mx-auto"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                {[
                  { icon: Users, value: '48', label: 'TEAMS' },
                  { icon: Trophy, value: '104', label: 'MATCHES' },
                  { icon: MapPin, value: '16', label: 'STADIUMS' },
                  { icon: Calendar, value: '3', label: 'COUNTRIES' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className="w-4 h-4" style={{ color: 'var(--gold-leader)' }} />
                      <span
                        className="text-2xl font-extrabold"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--white-primary)',
                          fontFeatureSettings: '"tnum" 1',
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                    <div
                      className="text-xs uppercase tracking-wider"
                      style={{ color: 'var(--white-muted)', letterSpacing: '0.08em' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // LIVE tournament mode - show live match
  return (
    <section
      className="relative overflow-hidden"
      style={{
        height: 'auto',
        minHeight: '500px',
        background: 'radial-gradient(circle at center, transparent 0%, var(--void) 100%)',
      }}
    >
      {/* Background with overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0A0E1A 0%, #121828 50%, #0A0E1A 100%)',
          opacity: 0.8,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      <div className="relative h-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
        {/* Left Column - 7fr (Match Focus) */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          {/* Live Badge */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--green-live)' }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--green-live)', letterSpacing: '0.08em' }}
            >
              LIVE — 67'
            </span>
          </div>

          <div
            className="text-xs uppercase tracking-wider"
            style={{ color: 'var(--white-muted)', letterSpacing: '0.08em' }}
          >
            SEMIFINAL
          </div>

          {/* Match Display */}
          <div className="space-y-4 md:space-y-6">
            {/* Morocco */}
            <div className="flex items-center gap-3 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl md:text-4xl border" style={{ borderColor: 'var(--border)' }}>
                🇲🇦
              </div>
              <div
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase flex-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--white-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                MOROCCO
              </div>
              <div
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--green-live)',
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                2
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* France */}
            <div className="flex items-center gap-3 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl md:text-4xl border" style={{ borderColor: 'var(--border)' }}>
                🇫🇷
              </div>
              <div
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase flex-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--white-muted)',
                  letterSpacing: '-0.02em',
                }}
              >
                FRANCE
              </div>
              <div
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--white-muted)',
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                1
              </div>
            </div>
          </div>

          {/* Scorers */}
          <div className="text-sm" style={{ color: 'var(--white-muted)' }}>
            Ziyech 23' · En-Nesyri 61' | Mbappé 38'
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--white-muted)' }}>
                <span>Possession</span>
                <span style={{ fontFeatureSettings: '"tnum" 1' }}>54% - 46%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-1)' }}>
                <div className="h-full" style={{ width: '54%', background: 'var(--green-live)' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--white-muted)' }}>
                <span>Shots on target</span>
                <span style={{ fontFeatureSettings: '"tnum" 1' }}>4 - 3</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--white-muted)' }}>
                <span>Pass accuracy</span>
                <span style={{ fontFeatureSettings: '"tnum" 1' }}>87% - 91%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 5fr (Today's Fixtures) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="text-xs uppercase tracking-wider mb-4"
            style={{ color: 'var(--white-muted)', letterSpacing: '0.08em' }}
          >
            TODAY'S FIXTURES
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {todayMatches.map((match, idx) => (
              <div
                key={idx}
                className="rounded p-4 border transition-all duration-200 hover:border-border-active hover:bg-surface-3"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{match.flagA}</span>
                    <span className="text-sm" style={{ color: 'var(--white-primary)' }}>
                      {match.teamA}
                    </span>
                  </div>
                  {match.status === 'UPCOMING' ? (
                    <span
                      className="text-sm"
                      style={{ color: 'var(--white-muted)', fontFeatureSettings: '"tnum" 1' }}
                    >
                      {match.time}
                    </span>
                  ) : (
                    <span
                      className="text-2xl font-semibold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontFeatureSettings: '"tnum" 1',
                        color: 'var(--white-primary)',
                      }}
                    >
                      {match.scoreA}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{match.flagB}</span>
                    <span className="text-sm" style={{ color: 'var(--white-primary)' }}>
                      {match.teamB}
                    </span>
                  </div>
                  {match.status !== 'UPCOMING' && (
                    <span
                      className="text-2xl font-semibold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontFeatureSettings: '"tnum" 1',
                        color: 'var(--white-primary)',
                      }}
                    >
                      {match.scoreB}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--white-ghost)' }}>
                    {match.stadium}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-semibold uppercase"
                    style={{
                      background: match.status === 'LIVE' ? 'var(--green-live)' : 'var(--surface-3)',
                      color: match.status === 'LIVE' ? 'var(--void)' : 'var(--white-muted)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {match.status === 'LIVE' && match.time ? match.time : match.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
