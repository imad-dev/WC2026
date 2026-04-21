import { TOURNAMENT_INFO } from '../../data/wc2026Static';
import { useCountdown } from '../../hooks/useCountdown';
import { Calendar, MapPin, Users, Trophy, ChevronDown } from 'lucide-react';

export function Hero() {
  const countdown = useCountdown(TOURNAMENT_INFO.opener.date);

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ minHeight: '580px' }}
    >
      {/* Animated background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #060810 0%, #0d1526 45%, #060810 100%)',
        }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)',
        }}
      />
      {/* Green radial glow */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,230,118,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Countdown */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--gold-leader)', background: 'rgba(255,179,0,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold-leader)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gold-leader)' }}>
                TOURNAMENT OPENER
              </span>
            </div>

            {/* Title */}
            <div>
              <h1
                className="text-5xl md:text-7xl font-extrabold uppercase leading-none"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--white-primary)' }}
              >
                FIFA<br />
                <span style={{ color: 'var(--green-live)' }}>World Cup</span><br />
                2026
              </h1>
            </div>

            {/* Countdown */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--white-muted)' }}>
                Kicks off in
              </p>
              <div className="flex items-end gap-3 md:gap-5">
                {[
                  { value: countdown.days, label: 'Days' },
                  { value: countdown.hours, label: 'Hrs' },
                  { value: countdown.minutes, label: 'Min' },
                  { value: countdown.seconds, label: 'Sec' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className="text-4xl md:text-6xl font-extrabold tabular-nums px-3 py-2 rounded-lg"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--green-live)',
                        background: 'rgba(0,230,118,0.08)',
                        border: '1px solid rgba(0,230,118,0.15)',
                        minWidth: '70px',
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs uppercase tracking-widest mt-1.5" style={{ color: 'var(--white-muted)' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opener meta */}
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--white-muted)' }}>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--green-live)' }} />
                June 11, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--green-live)' }} />
                {TOURNAMENT_INFO.opener.stadium}, {TOURNAMENT_INFO.opener.city}
              </span>
            </div>
          </div>

          {/* RIGHT — Opener match + stats */}
          <div className="space-y-6">
            {/* Opener match card */}
            <div
              className="rounded-xl p-6 border relative overflow-hidden"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--white-ghost)', letterSpacing: '0.1em' }}>
                Opening Match
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <div className="text-5xl mb-2">{TOURNAMENT_INFO.opener.homeFlag}</div>
                  <div className="text-xl font-extrabold uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
                    {TOURNAMENT_INFO.opener.homeTeam}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-xl font-bold px-4 py-1.5 rounded"
                    style={{ background: 'var(--surface-2)', color: 'var(--white-muted)' }}
                  >
                    VS
                  </div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-5xl mb-2">{TOURNAMENT_INFO.opener.awayFlag}</div>
                  <div className="text-xl font-extrabold uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
                    {TOURNAMENT_INFO.opener.awayTeam}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users, value: '48', label: 'Teams', sub: '3 host nations' },
                { icon: Trophy, value: '104', label: 'Matches', sub: 'Group + KO stages' },
                { icon: MapPin, value: '16', label: 'Venues', sub: 'USA, Canada, Mexico' },
                { icon: Calendar, value: '39', label: 'Days', sub: 'Jun 11 → Jul 19' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 border"
                  style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-3.5 h-3.5" style={{ color: 'var(--gold-leader)' }} />
                    <span
                      className="text-2xl font-extrabold"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--white-muted)' }}>
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
