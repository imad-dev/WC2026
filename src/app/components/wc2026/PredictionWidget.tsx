"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface PredictionWidgetProps {
  matchId: string;
  teamA: string;
  teamB: string;
}

interface PredictionStats {
  team_a_pct: number;
  draw_pct: number;
  team_b_pct: number;
  total_votes: number;
}

export function PredictionWidget({ matchId, teamA, teamB }: PredictionWidgetProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [choice, setChoice] = useState<'team_a' | 'draw' | 'team_b' | null>(null);
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate or get unique device ID
  const getUserId = () => {
    let id = localStorage.getItem('wc2026_user_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('wc2026_user_id', id);
    }
    return id;
  };

  useEffect(() => {
    async function loadData() {
      const userId = getUserId();
      // Check if user already voted
      const { data: voteData } = await supabase
        .from('wc2026_predictions')
        .select('choice')
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .single();

      if (voteData) {
        setHasVoted(true);
        setChoice(voteData.choice as any);
      }

      // Fetch global percentages
      const { data: statsData, error } = await supabase
        .rpc('get_prediction_percentages', { p_match_id: matchId });
      
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }
      setLoading(false);
    }
    loadData();
  }, [matchId]);

  const handleVote = async (selectedChoice: 'team_a' | 'draw' | 'team_b') => {
    const userId = getUserId();
    
    // Optimistic UI update
    setHasVoted(true);
    setChoice(selectedChoice);
    
    // Mock calculate new stats optimistically
    setStats(prev => {
      if (!prev) return { team_a_pct: selectedChoice === 'team_a' ? 100 : 0, draw_pct: selectedChoice === 'draw' ? 100 : 0, team_b_pct: selectedChoice === 'team_b' ? 100 : 0, total_votes: 1 };
      
      const newTotal = prev.total_votes + 1;
      return {
        ...prev,
        total_votes: newTotal
      };
    });

    // Actual mutation
    await supabase.from('wc2026_predictions').upsert({
      match_id: matchId,
      user_id: userId,
      choice: selectedChoice
    }, { onConflict: 'match_id,user_id' });

    // Refetch accurate stats
    const { data: statsData } = await supabase
      .rpc('get_prediction_percentages', { p_match_id: matchId });
      
    if (statsData && statsData.length > 0) {
      setStats(statsData[0]);
    }
  };

  if (loading) {
    return <div className="h-14 animate-pulse rounded bg-[var(--wc-surface-2)] w-full"></div>;
  }

  if (hasVoted && stats) {
    return (
      <div className="w-full transition-all duration-500">
        <div className="flex justify-between items-end mb-2">
           <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[var(--wc-text-muted)] uppercase">Poll Results</span>
           <span className="text-[9px] sm:text-[10px] font-mono text-[var(--wc-text-muted)]">
             <span className={choice === 'team_a' ? 'text-[var(--wc-green)]' : 'text-white'}>{stats.team_a_pct}%</span> / <span className={choice === 'draw' ? 'text-[var(--wc-gold)]' : 'text-white'}>{stats.draw_pct}%</span> / <span className={choice === 'team_b' ? 'text-[var(--wc-red)]' : 'text-white'}>{stats.team_b_pct}%</span>
           </span>
        </div>
        <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-[var(--wc-surface-2)] shadow-inner">
          <div 
            style={{ 
              width: `${stats.team_a_pct}%`, 
              backgroundColor: choice === 'team_a' ? 'var(--wc-green)' : 'var(--wc-border)',
              transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1), background-color 400ms'
            }} 
            className="h-full"
          />
          <div 
            style={{ 
              width: `${stats.draw_pct}%`, 
              backgroundColor: choice === 'draw' ? 'var(--wc-gold)' : 'var(--wc-border)',
              transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1), background-color 400ms'
            }} 
            className="h-full border-x border-[var(--wc-dark)]"
          />
          <div 
            style={{ 
              width: `${stats.team_b_pct}%`, 
              backgroundColor: choice === 'team_b' ? 'var(--wc-red)' : 'var(--wc-border)',
              transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1), background-color 400ms'
            }} 
            className="h-full"
          />
        </div>
        <div className="text-right text-[9px] mt-1 text-[var(--wc-text-muted)] tracking-wider">
          {stats.total_votes} votes
        </div>
      </div>
    );
  }

  // Truncate long team names for button labels
  const shortenName = (name: string) => name.length > 8 ? name.slice(0, 7) + '.' : name;

  return (
    <div>
      <div className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[var(--wc-text-muted)] uppercase mb-2">Who wins?</div>
      <div className="flex gap-1.5 sm:gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); handleVote('team_a'); }}
          className="flex-1 py-2 px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-bold rounded-lg border border-[var(--wc-border)] bg-[rgba(255,255,255,0.04)] text-[var(--wc-text-muted)] transition-all hover:border-[var(--wc-green)] hover:text-white hover:bg-[rgba(0,166,81,0.1)] active:scale-95 truncate"
        >
          {shortenName(teamA)}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleVote('draw'); }}
          className="shrink-0 py-2 px-3 sm:px-4 text-[9px] sm:text-[10px] font-bold rounded-lg border border-[var(--wc-border)] bg-[rgba(255,255,255,0.04)] text-[var(--wc-text-muted)] transition-all hover:border-[var(--wc-gold)] hover:text-white hover:bg-[rgba(245,166,35,0.1)] active:scale-95"
        >
          DRAW
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleVote('team_b'); }}
          className="flex-1 py-2 px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-bold rounded-lg border border-[var(--wc-border)] bg-[rgba(255,255,255,0.04)] text-[var(--wc-text-muted)] transition-all hover:border-[var(--wc-red)] hover:text-white hover:bg-[rgba(232,0,29,0.1)] active:scale-95 truncate"
        >
          {shortenName(teamB)}
        </button>
      </div>
    </div>
  );
}
