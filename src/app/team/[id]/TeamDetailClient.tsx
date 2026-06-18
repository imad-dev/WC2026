'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, User, Trophy, Calendar, MapPin, Shield } from 'lucide-react';

const POS_LABEL: Record<string, string> = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
};
const POS_COLOR: Record<string, string> = {
  GK: '#f59e0b',
  DF: '#3b82f6',
  MF: '#10b981',
  FW: '#ef4444',
};
const POS_ORDER = ['GK', 'DF', 'MF', 'FW'];

function PlayerCard({ player, teamColor, flagUrl }: { player: any; teamColor: string; flagUrl: string }) {
  const posColor = POS_COLOR[player.position] || '#888';
  return (
    <div className="bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 group">
      {/* Colored top bar */}
      <div className="h-1" style={{ backgroundColor: posColor }} />
      {/* Photo area */}
      <div className="relative h-[160px] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at 50% 100%, ${teamColor}, transparent 70%)` }}
        />
        {player.photo_url ? (
          <img src={player.photo_url} alt={player.name} className="h-full w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <User className="w-20 h-20 text-[rgba(255,255,255,0.15)] relative z-10" />
        )}
        {/* Jersey number badge */}
        <div 
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg"
          style={{ backgroundColor: teamColor || '#333' }}
        >
          {player.number}
        </div>
        {/* Flag */}
        <img src={flagUrl} alt="" className="absolute top-3 left-3 w-7 h-5 object-cover rounded-[2px] shadow-sm" />
      </div>
      <div className="p-3">
        <h3 className="text-[13px] font-bold text-white uppercase truncate leading-tight">{player.name}</h3>
        <span 
          className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: posColor, backgroundColor: `${posColor}20` }}
        >
          {POS_LABEL[player.position] || player.position}
        </span>
      </div>
    </div>
  );
}

function MatchCard({ match, teamName }: { match: any; teamName: string }) {
  const isHome = match.home_team === teamName;
  const opponent = isHome ? match.away_team : match.home_team;
  const myScore = isHome ? match.home_score : match.away_score;
  const oppScore = isHome ? match.away_score : match.home_score;
  const isFinished = match.status === 'finished';
  const date = match.kickoff_utc ? new Date(match.kickoff_utc) : null;

  let resultLabel = '';
  let resultColor = '';
  if (isFinished && myScore !== null && oppScore !== null) {
    if (myScore > oppScore) { resultLabel = 'W'; resultColor = '#10b981'; }
    else if (myScore < oppScore) { resultLabel = 'L'; resultColor = '#ef4444'; }
    else { resultLabel = 'D'; resultColor = '#f59e0b'; }
  }

  return (
    <div className="bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl p-4 min-w-[240px] snap-start">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-[var(--wc-text-muted)] uppercase tracking-wider">
          Group {match.group_name}
        </span>
        {resultLabel && (
          <span className="text-[11px] font-black px-2 py-0.5 rounded" style={{ color: resultColor, backgroundColor: `${resultColor}20` }}>
            {resultLabel}
          </span>
        )}
      </div>
      <div className="text-center mb-3">
        <div className="text-[13px] text-[var(--wc-text-muted)] mb-1">{isHome ? '🏠 Home' : '✈️ Away'}</div>
        <div className="font-bold text-white text-base truncate">{teamName}</div>
        {isFinished && myScore !== null ? (
          <div className="text-3xl font-black text-white my-1">{myScore} – {oppScore}</div>
        ) : (
          <div className="text-2xl font-black text-[var(--wc-text-muted)] my-1">vs</div>
        )}
        <div className="font-bold text-white text-base truncate">{opponent}</div>
      </div>
      {date && (
        <div className="flex items-center gap-1 text-[11px] text-[var(--wc-text-muted)] mt-2">
          <Calendar className="w-3 h-3" />
          {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      {match.venue && (
        <div className="flex items-center gap-1 text-[10px] text-[var(--wc-text-muted)] mt-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{match.venue.split(',')[0]}</span>
        </div>
      )}
    </div>
  );
}

export default function TeamDetailClient({ team, players, fixtures }: { team: any; players: any[]; fixtures: any[] }) {
  const [activePos, setActivePos] = useState<string>('ALL');
  
  const bgColor = team.kit_primary_color || '#1a2235';
  const flagUrl = team.flag_url || `https://flagcdn.com/w80/un.png`;

  // Group players by position
  const playersByPos = POS_ORDER.reduce((acc, pos) => {
    acc[pos] = players.filter(p => p.position === pos).sort((a, b) => a.number - b.number);
    return acc;
  }, {} as Record<string, any[]>);

  const filteredPlayers = activePos === 'ALL' ? players.sort((a, b) => a.number - b.number) : playersByPos[activePos] || [];

  const record = { w: 0, d: 0, l: 0 };
  fixtures.filter(m => m.status === 'finished').forEach(m => {
    const isHome = m.home_team === team.name;
    const ms = isHome ? m.home_score : m.away_score;
    const os = isHome ? m.away_score : m.home_score;
    if (ms > os) record.w++;
    else if (ms < os) record.l++;
    else record.d++;
  });

  return (
    <div className="w-full min-h-screen bg-[var(--wc-surface)]">
      {/* Breadcrumb */}
      <div className="bg-[var(--wc-dark)] border-b border-[var(--wc-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--wc-text-muted)]">
            <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
            <span>&gt;</span>
            <span className="text-white">{team.name}</span>
          </div>
          <Link href="/teams" className="text-sm text-[var(--wc-text-muted)] hover:text-white transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> All Teams
          </Link>
        </div>
      </div>

      {/* HERO BANNER */}
      <section className="w-full relative overflow-hidden" style={{ backgroundColor: bgColor }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        {/* Background flag watermark */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 overflow-hidden pointer-events-none">
          <img src={flagUrl} alt="" className="w-full h-full object-cover object-left" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            {/* Left */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img src={flagUrl} alt={`${team.name} flag`} className="w-20 h-14 rounded object-cover shadow-xl border-2 border-white/20" />
                {team.is_host_country && (
                  <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20">
                    🏆 Host Nation
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-[56px] md:text-[80px] text-white leading-none uppercase font-black drop-shadow-xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {team.name}
                </h1>
                <p className="text-white/70 font-medium tracking-wide mt-1">
                  {team.confederation_full || team.confederation} · Group {team.group_letter}
                </p>
              </div>
            </div>

            {/* Right — stat pills */}
            <div className="flex gap-3 flex-wrap">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl min-w-[120px] text-center">
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">FIFA Rank</div>
                <div className="text-2xl font-black text-white">#{team.world_ranking || '-'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl min-w-[120px] text-center">
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Appearances</div>
                <div className="text-2xl font-black text-white">{team.participations ?? '-'}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl min-w-[120px] text-center">
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Squad Size</div>
                <div className="text-2xl font-black text-white">{players.length}</div>
              </div>
              {record.w + record.d + record.l > 0 && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl min-w-[120px] text-center">
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">WC2026 Record</div>
                  <div className="text-base font-black text-white">{record.w}W {record.d}D {record.l}L</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16">

        {/* FIXTURES */}
        {fixtures.length > 0 && (
          <section>
            <h2 className="text-3xl text-[var(--wc-text)] mb-6 uppercase font-black" style={{ fontFamily: 'var(--font-display)' }}>
              Fixtures & Results
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
              {fixtures.map(match => (
                <MatchCard key={match.id} match={match} teamName={team.name} />
              ))}
            </div>
          </section>
        )}

        {/* SQUAD */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl text-[var(--wc-text)] uppercase font-black" style={{ fontFamily: 'var(--font-display)' }}>
              Official Squad <span className="text-[var(--wc-text-muted)] text-xl font-normal">({players.length} players)</span>
            </h2>
            {/* Position filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {['ALL', ...POS_ORDER].map(pos => (
                <button
                  key={pos}
                  onClick={() => setActivePos(pos)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all ${
                    activePos === pos
                      ? 'text-black border-transparent'
                      : 'text-[var(--wc-text-muted)] border-[var(--wc-border)] hover:text-white'
                  }`}
                  style={activePos === pos ? { backgroundColor: pos === 'ALL' ? bgColor || '#00a651' : POS_COLOR[pos], borderColor: 'transparent' } : {}}
                >
                  {pos === 'ALL' ? `All (${players.length})` : `${pos} (${(playersByPos[pos] || []).length})`}
                </button>
              ))}
            </div>
          </div>

          {filteredPlayers.length === 0 ? (
            <div className="p-12 bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-2xl text-center">
              <Shield className="w-12 h-12 text-[var(--wc-text-muted)] mx-auto mb-3 opacity-40" />
              <p className="text-[var(--wc-text-muted)]">No players in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredPlayers.map(player => (
                <PlayerCard key={player.id} player={player} teamColor={bgColor} flagUrl={flagUrl} />
              ))}
            </div>
          )}
        </section>

        {/* ABOUT + STATS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-3xl text-[var(--wc-text)] uppercase font-black" style={{ fontFamily: 'var(--font-display)' }}>About</h2>
            <p className="text-[var(--wc-text-muted)] leading-relaxed text-lg">
              {team.bio_short || `${team.name} is competing in the 2026 FIFA World Cup, representing ${team.confederation}. They are showcasing their talent on the global stage across USA, Canada, and Mexico.`}
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { label: 'FIFA Ranking', value: team.world_ranking ? `#${team.world_ranking}` : 'N/A' },
              { label: 'WC Appearances', value: team.participations ?? 'N/A' },
              { label: 'Confederation', value: team.confederation || 'N/A' },
              { label: 'Group', value: team.group_letter ? `Group ${team.group_letter}` : 'N/A' },
            ].map(stat => (
              <div key={stat.label} className="bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl p-5 flex flex-col justify-center">
                <span className="text-[10px] text-[var(--wc-text-muted)] font-bold tracking-widest uppercase mb-1">{stat.label}</span>
                <span className="text-2xl text-white font-black">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
