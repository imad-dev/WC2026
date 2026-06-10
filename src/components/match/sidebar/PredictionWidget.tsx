import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function PredictionWidget({ matchId, homeTeam, awayTeam, initialPredictions, onPredict }: any) {
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Parse predictions or use defaults
  const p = initialPredictions || { home: 33, draw: 34, away: 33, total: 0 };

  const handleVote = async (choice: 'home' | 'draw' | 'away') => {
    if (hasVoted || loading) return;
    setLoading(true);
    try {
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('wc2026_session') || Math.random().toString(36).substring(7) : 'anon';
      if (typeof window !== 'undefined') localStorage.setItem('wc2026_session', sessionId);
      
      await supabase.from('wc2026_predictions').insert({
        match_id: matchId,
        choice,
        session_id: sessionId
      });
      
      setHasVoted(true);
      
      // Optimistic update
      const newTotal = p.total + 1;
      const homeCount = Math.round((p.home / 100) * p.total) + (choice === 'home' ? 1 : 0);
      const drawCount = Math.round((p.draw / 100) * p.total) + (choice === 'draw' ? 1 : 0);
      const awayCount = Math.round((p.away / 100) * p.total) + (choice === 'away' ? 1 : 0);
      
      onPredict({
        home: Math.round((homeCount / newTotal) * 100),
        draw: Math.round((drawCount / newTotal) * 100),
        away: Math.round((awayCount / newTotal) * 100),
        total: newTotal
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--wc-surface)] rounded-xl border border-[var(--wc-border)] overflow-hidden shadow-md p-4">
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4">
        <Trophy className="w-4 h-4 text-[var(--wc-gold)]" />
        Who will win?
      </div>
      
      <div className="flex gap-2 mb-4">
        <button onClick={() => handleVote('home')} disabled={hasVoted} className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">
          {homeTeam?.country_code && <img src={`https://flagcdn.com/24x18/${homeTeam.country_code}.png`} alt={homeTeam.name} className="mb-1 rounded-sm" />}
          <span className="text-xs font-bold">{homeTeam?.short_name || '1'}</span>
        </button>
        <button onClick={() => handleVote('draw')} disabled={hasVoted} className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">
          <span className="text-lg font-black text-[var(--wc-text-muted)] mb-1">X</span>
          <span className="text-xs font-bold text-[var(--wc-text-muted)]">DRAW</span>
        </button>
        <button onClick={() => handleVote('away')} disabled={hasVoted} className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">
          {awayTeam?.country_code && <img src={`https://flagcdn.com/24x18/${awayTeam.country_code}.png`} alt={awayTeam.name} className="mb-1 rounded-sm" />}
          <span className="text-xs font-bold">{awayTeam?.short_name || '2'}</span>
        </button>
      </div>

      <div className="space-y-1">
        <div className="w-full flex h-2 rounded-full overflow-hidden bg-[var(--wc-surface-2)] transition-all duration-500">
          <div className="bg-[var(--wc-green)] h-full transition-all duration-500" style={{ width: `${p.home}%` }}></div>
          <div className="bg-[var(--wc-text-muted)] h-full transition-all duration-500" style={{ width: `${p.draw}%` }}></div>
          <div className="bg-[#4a90e2] h-full transition-all duration-500" style={{ width: `${p.away}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-[var(--wc-text-muted)] px-1">
          <span className="text-[var(--wc-green)]">{p.home}%</span>
          <span>{p.draw}%</span>
          <span className="text-[#4a90e2]">{p.away}%</span>
        </div>
      </div>
      
      <div className="text-center text-[10px] text-[var(--wc-text-muted)] mt-2">
        {p.total} votes
      </div>
    </div>
  );
}
