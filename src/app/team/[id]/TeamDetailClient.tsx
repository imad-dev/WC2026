'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { createMatchSlug } from '@/lib/utils/slug';

export default function TeamDetailClient({ team, players, fixtures }: { team: any, players: any[], fixtures: any[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = (220 + 12) * 4; // card width + gap * 4 cards
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const bgColor = team.kit_primary_color || '#1a2235';
  const flagUrl = team.flag_url || `https://flagcdn.com/120x90/${team.country_code?.toLowerCase() || 'un'}.png`;

  return (
    <div className="w-full min-h-screen bg-[var(--wc-surface)]">
      {/* Breadcrumb Navigation */}
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

      {/* SECTION A — HERO BANNER */}
      <section 
        className="w-full relative h-[280px] overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between py-10 md:py-0">
          
          {/* Left Side */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img src={flagUrl} alt={`${team.name} flag`} className="w-16 h-12 rounded-[2px] shadow-md object-cover" />
              {team.is_host_country && (
                <span className="px-3 py-1 bg-black/30 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  Host Country
                </span>
              )}
            </div>
            <div>
              <h1 className="text-[56px] md:text-[72px] text-white leading-none uppercase drop-shadow-md" style={{ fontFamily: 'var(--font-display)' }}>
                {team.name}
              </h1>
              <p className="text-white/80 font-medium tracking-wide">
                {team.confederation_full || team.confederation || 'FIFA'}
              </p>
            </div>
          </div>

          {/* Right Side (Pills) */}
          <div className="hidden md:flex gap-4">
            <div className="bg-white rounded p-4 shadow-xl min-w-[140px] text-center">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Group Stage</div>
              <div className="text-xl font-black text-[#000]">{team.group_name || 'TBA'}</div>
            </div>
            <div className="bg-white rounded p-4 shadow-xl min-w-[140px] text-center">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">FIFA Ranking</div>
              <div className="text-xl font-black text-[#000]">#{team.world_ranking || '-'}</div>
            </div>
            <div className="bg-white rounded p-4 shadow-xl min-w-[140px] text-center">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Appearances</div>
              <div className="text-xl font-black text-[#000]">{team.participations || '-'}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col gap-16">

        {/* SECTION B — FIXTURES */}
        <section>
          <h2 className="text-3xl text-[var(--wc-text)] mb-6 uppercase" style={{ fontFamily: 'var(--font-display)' }}>Fixtures</h2>
          {fixtures.length === 0 ? (
            <div className="p-8 bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl text-center text-[var(--wc-text-muted)]">
              No fixtures scheduled yet.
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
              {fixtures.map((match) => (
                <Link 
                  key={match.id} 
                  href={`/match/${createMatchSlug(match.home_team?.name || '', match.away_team?.name || '')}`}
                  className="snap-start shrink-0 w-[280px] bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-[12px] text-gray-500 font-medium mb-1 truncate">
                    FIFA World Cup 2026™
                  </div>
                  <div className="flex justify-between items-center text-[12px] text-gray-500 mb-4">
                    <span className="truncate">{match.round || 'Group Stage'} · {match.venue?.name || 'TBA'}</span>
                    <span className="shrink-0 ml-2">{match.kickoff_utc ? new Date(match.kickoff_utc).toLocaleDateString() : 'TBA'}</span>
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://flagcdn.com/24x18/${match.home_team?.country_code?.toLowerCase() || 'un'}.png`} 
                          alt="Home Flag" 
                          className="w-6 h-4 rounded-[1px] object-cover" 
                        />
                        <span className="font-bold text-[#000] truncate max-w-[120px]">{match.home_team?.name || 'TBA'}</span>
                      </div>
                      {match.status === 'finished' && match.home_score !== null ? (
                        <span className="text-xl font-bold text-[#000]">{match.home_score}</span>
                      ) : null}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://flagcdn.com/24x18/${match.away_team?.country_code?.toLowerCase() || 'un'}.png`} 
                          alt="Away Flag" 
                          className="w-6 h-4 rounded-[1px] object-cover" 
                        />
                        <span className="font-bold text-[#000] truncate max-w-[120px]">{match.away_team?.name || 'TBA'}</span>
                      </div>
                      {match.status === 'finished' && match.away_score !== null ? (
                        <span className="text-xl font-bold text-[#000]">{match.away_score}</span>
                      ) : match.status !== 'finished' && match.kickoff_utc ? (
                        <span className="text-lg font-bold text-[#000]">
                          {new Date(match.kickoff_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">FOX</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">Telemundo</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* SECTION C — SQUAD */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl text-[var(--wc-text)] uppercase" style={{ fontFamily: 'var(--font-display)' }}>Squad</h2>
            <div className="flex items-center gap-4">
              <Link href={`/teams/${team.id}/squad`} className="text-[var(--wc-green)] text-sm font-bold tracking-widest uppercase hover:underline hidden sm:block">
                See All
              </Link>
              <div className="flex gap-2">
                <button onClick={() => scrollCarousel('left')} className="w-10 h-10 rounded-full bg-[var(--wc-surface-2)] flex items-center justify-center text-white hover:bg-[var(--wc-green)] hover:text-black transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scrollCarousel('right')} className="w-10 h-10 rounded-full bg-[var(--wc-surface-2)] flex items-center justify-center text-white hover:bg-[var(--wc-green)] hover:text-black transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {players.length === 0 ? (
            <div className="p-8 bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl text-center text-[var(--wc-text-muted)]">
              Squad list has not been announced yet.
            </div>
          ) : (
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto gap-3 pb-8 snap-x snap-mandatory scrollbar-hide"
            >
              {players.map((player) => (
                <Link 
                  key={player.id} 
                  href={`/player/${player.id}`}
                  className="snap-start shrink-0 w-[220px] bg-white border border-gray-100 rounded-[12px] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 group"
                >
                  <div className="relative h-[240px] bg-[#f5f5f5] rounded-t-[12px] p-4 flex flex-col justify-end overflow-hidden">
                    <img 
                      src={flagUrl} 
                      alt="flag" 
                      className="absolute top-4 left-4 w-6 h-[18px] object-cover rounded-[2px] shadow-sm z-10" 
                    />
                    
                    {player.photo_url ? (
                      <img 
                        src={player.photo_url} 
                        alt={player.name} 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-auto object-contain max-h-[95%] transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User className="w-32 h-32 text-[#cccccc]" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-white rounded-b-[12px]">
                    <h3 className="text-[13px] font-bold text-[#000] uppercase truncate mb-1">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{player.position || 'N/A'}</span>
                      {player.number && (
                        <span className="text-[11px] font-bold text-[var(--wc-green)] bg-[var(--wc-dark)] px-1.5 py-0.5 rounded">#{player.number}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* SECTION D — TEAM INFO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-3xl text-[var(--wc-text)] uppercase" style={{ fontFamily: 'var(--font-display)' }}>About</h2>
            <p className="text-[var(--wc-text-muted)] leading-relaxed text-lg">
              {team.bio_short || `${team.name} is a competing nation in the 2026 FIFA World Cup representing ${team.confederation}. They are preparing to showcase their talent on the global stage across USA, Canada, and Mexico.`}
            </p>
            
            <div className="mt-4 p-4 border border-[var(--wc-border)] rounded-xl flex items-center gap-4 bg-[var(--wc-surface-2)] max-w-sm">
              <div className="w-16 h-16 rounded-full bg-[var(--wc-dark)] border border-[var(--wc-border)] flex items-center justify-center overflow-hidden shrink-0">
                <User className="w-8 h-8 text-[var(--wc-text-muted)]" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">{team.coach_name || 'TBA'}</div>
                <div className="text-[var(--wc-text-muted)] text-sm">Head Coach</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl p-6 flex flex-col justify-center">
              <span className="text-xs text-[var(--wc-text-muted)] font-bold tracking-widest uppercase mb-1">FIFA Ranking</span>
              <span className="text-3xl text-white font-black" style={{ fontFamily: 'var(--font-mono)' }}>#{team.world_ranking || '-'}</span>
            </div>
            <div className="bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl p-6 flex flex-col justify-center">
              <span className="text-xs text-[var(--wc-text-muted)] font-bold tracking-widest uppercase mb-1">Founded</span>
              <span className="text-3xl text-white font-black" style={{ fontFamily: 'var(--font-mono)' }}>{team.founded_year || 'N/A'}</span>
            </div>
            <div className="bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl p-6 flex flex-col justify-center">
              <span className="text-xs text-[var(--wc-text-muted)] font-bold tracking-widest uppercase mb-1">Confederation</span>
              <span className="text-xl text-white font-bold">{team.confederation || '-'}</span>
            </div>
            <div className="bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-xl p-6 flex flex-col justify-center">
              <span className="text-xs text-[var(--wc-text-muted)] font-bold tracking-widest uppercase mb-1">Appearances</span>
              <span className="text-3xl text-white font-black" style={{ fontFamily: 'var(--font-mono)' }}>{team.participations || '-'}</span>
            </div>
          </div>
          
        </section>

      </div>
    </div>
  );
}
