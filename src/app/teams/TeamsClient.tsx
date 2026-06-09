'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

const CONFEDERATIONS = ['ALL', 'CONCACAF', 'UEFA', 'CONMEBOL', 'CAF', 'AFC', 'OFC'];

export default function TeamsClient({ teams }: { teams: any[] }) {
  const [activeConf, setActiveConf] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredTeams = teams.filter((team) => {
    const matchConf = activeConf === 'ALL' || team.confederation === activeConf;
    return matchConf;
  });

  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 sm:mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-green)] mb-3 font-semibold">
              All Qualified Nations
            </p>
            <h1 className="text-4xl md:text-5xl text-[var(--wc-text)] mb-2 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              Qualified Teams
            </h1>
            <p className="text-[var(--wc-text-muted)] text-sm md:text-base">
              Discover the 48 nations competing for the ultimate prize.
            </p>
          </div>
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--wc-text-muted)]" />
            <input 
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--wc-surface-2)] border border-[var(--wc-border)] rounded-full text-white placeholder-[var(--wc-text-muted)] focus:outline-none focus:border-[var(--wc-green)] transition-colors text-sm"
            />
          </div>
        </div>

        {/* Confederation Filters — scrollable on mobile */}
        <div className="overflow-x-auto pb-2 mb-8 sm:mb-10 scrollbar-hide">
          <div className="flex gap-2 sm:gap-3 min-w-max">
            {CONFEDERATIONS.map(conf => (
              <button
                key={conf}
                onClick={() => setActiveConf(conf)}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold tracking-wider transition-all whitespace-nowrap ${
                  activeConf === conf 
                    ? 'bg-[var(--wc-live)] text-[var(--wc-dark)] shadow-[0_0_15px_rgba(0,255,135,0.4)]' 
                    : 'bg-[var(--wc-surface-2)] text-[var(--wc-text-muted)] hover:text-white'
                }`}
              >
                {conf}
              </button>
            ))}
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6" style={{ perspective: '1000px' }}>
          {filteredTeams.map((team) => {
            const isMatch = search.trim() === '' || team.name.toLowerCase().includes(search.toLowerCase());
            
            return (
              <div 
                key={team.name}
                className={`relative group aspect-[3/4] w-full rounded-xl cursor-pointer transition-all duration-500 ${!isMatch ? 'opacity-40 blur-[4px] grayscale' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 w-full h-full duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="absolute inset-0 w-full h-full bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-xl flex flex-col items-center justify-center p-3 sm:p-4 [backface-visibility:hidden] shadow-lg">
                    <img 
                      src={team.flag_url || `https://flagcdn.com/120x90/${team.id}.png`} 
                      alt={team.name} 
                      className="w-16 sm:w-20 h-12 sm:h-15 rounded shadow-md mb-3 sm:mb-4 object-cover" 
                      loading="lazy"
                    />
                    <h3 className="text-lg sm:text-2xl text-center leading-tight truncate w-full" style={{ fontFamily: 'var(--font-display)' }}>{team.name}</h3>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[var(--wc-text-muted)] mt-1.5 sm:mt-2 uppercase">{team.confederation}</span>
                  </div>
                  
                  {/* Back */}
                  <div className="absolute inset-0 w-full h-full bg-[var(--wc-surface-2)] border border-[var(--wc-green)] rounded-xl flex flex-col items-center justify-center p-3 sm:p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_20px_rgba(0,166,81,0.2)]">
                    <span className="text-[9px] sm:text-[10px] text-[var(--wc-text-muted)] uppercase tracking-widest mb-1">FIFA Ranking</span>
                    <span className="text-3xl sm:text-4xl text-[var(--wc-green)] mb-3 sm:mb-4 tabular" style={{ fontFamily: 'var(--font-mono)' }}>#{team.fifa_ranking}</span>
                    <Link href={`/teams/${team.id}`} className="px-3 sm:px-4 py-2 bg-[rgba(255,255,255,0.1)] hover:bg-[var(--wc-green)] hover:text-black transition-colors rounded text-xs font-bold w-full uppercase text-center flex items-center justify-center">
                      View Squad
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
