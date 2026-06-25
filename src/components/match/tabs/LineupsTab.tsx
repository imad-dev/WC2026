import { useState } from 'react';
import { getPlayerPhoto } from '../../../lib/utils/playerPhoto';

type FilterStat = 'Performance' | 'Age' | 'Club' | 'Market Value' | 'Height' | 'Fantasy';

export default function LineupsTab({ match, lineups }: any) {
  const [activeFilter, setActiveFilter] = useState<FilterStat>('Performance');

  const homeTeamId = match.home_team?.id || match.home_team_id;
  const awayTeamId = match.away_team?.id || match.away_team_id;

  const homeLineup = lineups.filter((l: any) => l.team_id === homeTeamId && l.is_starting);
  const awayLineup = lineups.filter((l: any) => l.team_id === awayTeamId && l.is_starting);

  const homeBench = lineups.filter((l: any) => l.team_id === homeTeamId && !l.is_starting);
  const awayBench = lineups.filter((l: any) => l.team_id === awayTeamId && !l.is_starting);

  const getStatValue = (playerObj: any) => {
    const p = playerObj.player || {};
    switch (activeFilter) {
      case 'Performance': return playerObj.rating || p.rating_avg || '-';
      case 'Age': return `${p.age || '-'} yrs`;
      case 'Club': return p.club_name || '-';
      case 'Market Value': return p.market_value_k ? `€${(p.market_value_k / 1000).toFixed(1)}M` : '-';
      case 'Height': return `${p.height_cm || '-'} cm`;
      case 'Fantasy': return playerObj.rating ? Math.round(playerObj.rating * 1.5) : '-';
      default: return '-';
    }
  };

  const renderPlayerBubble = (l: any) => {
    const p = l.player || {};
    const photo = getPlayerPhoto(p);
    
    // Fallback coordinates if missing
    let x = l.position_x ?? 0.5;
    let y = l.position_y ?? 0.5;

    return (
      <div 
        key={l.id} 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
        style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        title={`${p.name || 'Unknown'}\n${p.club_name || ''}\nPos: ${p.position || ''}`}
      >
        <div className="relative">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden bg-[var(--wc-surface)] shadow-lg group-hover:scale-110 transition-transform">
            <img src={photo} alt={p.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-black/80 rounded-full text-[8px] md:text-[10px] font-bold flex items-center justify-center text-white border border-white/20">
            {l.shirt_number || p.number || '-'}
          </div>
        </div>
        <div className="mt-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] md:text-[10px] font-bold text-white whitespace-nowrap text-center">
          <div className="truncate max-w-[60px]">{p.short_name || p.name}</div>
          <div className={`text-[9px] ${activeFilter === 'Performance' ? 'text-[var(--wc-gold)]' : 'text-white/70'}`}>
            {getStatValue(l)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 w-full">
      {/* FILTER PILLS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['Performance', 'Club', 'Age', 'Market Value', 'Height', 'Fantasy'] as FilterStat[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeFilter === f 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-[var(--wc-text-muted)] hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* PITCH */}
      <div className="relative w-full max-w-[600px] mx-auto mb-8">
        {/* Headers */}
        <div className="flex justify-between items-end mb-2">
          <div className="text-xs font-bold">
            <span className="text-white">{match.home_team?.short_name || 'HOME'}</span>
            <span className="text-[var(--wc-text-muted)] ml-2">({match.home_team?.formation || '4-3-3'})</span>
          </div>
          <div className="text-xs font-bold">
            <span className="text-[var(--wc-text-muted)] mr-2">({match.away_team?.formation || '4-3-3'})</span>
            <span className="text-white">{match.away_team?.short_name || 'AWAY'}</span>
          </div>
        </div>

        {/* Pitch container */}
        <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden" style={{ background: 'linear-gradient(to bottom, #2d6a4f, #1b4332)' }}>
          {/* Pitch lines overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="white" strokeWidth="2" />
            <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="white" strokeWidth="2" />
            <circle cx="50%" cy="50%" r="15%" fill="none" stroke="white" strokeWidth="2" />
            <rect x="25%" y="5%" width="50%" height="15%" fill="none" stroke="white" strokeWidth="2" />
            <rect x="25%" y="80%" width="50%" height="15%" fill="none" stroke="white" strokeWidth="2" />
            <path d="M45 20 A 5 5 0 0 0 55 20" stroke="white" strokeWidth="2" fill="none" />
            <path d="M45 80 A 5 5 0 0 1 55 80" stroke="white" strokeWidth="2" fill="none" />
          </svg>

          {/* Players */}
          {homeLineup.map(renderPlayerBubble)}
          {awayLineup.map(renderPlayerBubble)}
        </div>
      </div>

      {/* BENCH */}
      {(homeBench.length > 0 || awayBench.length > 0) && (
        <div className="w-full border-t border-[var(--wc-border)] pt-6 mt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--wc-text-muted)] mb-4 text-center">Substitutes</h3>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="text-xs font-bold border-b border-[var(--wc-border)] pb-2 mb-2">{match.home_team?.name || 'Home Bench'}</div>
              {homeBench.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between text-xs bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-[10px] text-[var(--wc-text-muted)]">{l.shirt_number}</span>
                    <span>{l.player?.name}</span>
                  </div>
                  <span className="font-bold text-[var(--wc-gold)]">{getStatValue(l)}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-xs font-bold border-b border-[var(--wc-border)] pb-2 mb-2">{match.away_team?.name || 'Away Bench'}</div>
              {awayBench.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between text-xs bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-[10px] text-[var(--wc-text-muted)]">{l.shirt_number}</span>
                    <span>{l.player?.name}</span>
                  </div>
                  <span className="font-bold text-[var(--wc-gold)]">{getStatValue(l)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
