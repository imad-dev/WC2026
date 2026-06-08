"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
      
      // Rough optimistic update (not perfectly math-accurate but good for instant feedback)
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
    return <div className="h-8 animate-pulse rounded bg-[var(--surface-3)] w-full max-w-md mx-auto mt-4"></div>;
  }

  if (hasVoted && stats) {
    return (
      <div className="w-full max-w-md mx-auto mt-4 transition-all duration-500">
        <div className="flex justify-between text-xs mb-1 font-semibold" style={{ color: 'var(--white-muted)' }}>
          <span className={choice === 'team_a' ? 'text-[var(--green-live)]' : ''}>{stats.team_a_pct}% {teamA}</span>
          <span className={choice === 'draw' ? 'text-[var(--green-live)]' : ''}>{stats.draw_pct}% Draw</span>
          <span className={choice === 'team_b' ? 'text-[var(--green-live)]' : ''}>{stats.team_b_pct}% {teamB}</span>
        </div>
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-[var(--surface-3)]">
          <div 
            style={{ width: `${stats.team_a_pct}%`, backgroundColor: choice === 'team_a' ? 'var(--green-live)' : 'var(--blue-ref)' }} 
            className="h-full transition-all duration-1000 ease-out"
          />
          <div 
            style={{ width: `${stats.draw_pct}%`, backgroundColor: choice === 'draw' ? 'var(--green-live)' : 'var(--white-muted)' }} 
            className="h-full transition-all duration-1000 ease-out border-x border-[var(--void)]"
          />
          <div 
            style={{ width: `${stats.team_b_pct}%`, backgroundColor: choice === 'team_b' ? 'var(--green-live)' : 'var(--morocco-red)' }} 
            className="h-full transition-all duration-1000 ease-out"
          />
        </div>
        <div className="text-center text-[10px] mt-1" style={{ color: 'var(--white-ghost)' }}>
          {stats.total_votes} predictions
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button 
        onClick={() => handleVote('team_a')}
        className="flex-1 py-1.5 px-3 text-xs font-semibold rounded border border-[var(--border)] transition-colors hover:bg-[var(--surface-3)] hover:text-white"
        style={{ color: 'var(--white-muted)' }}
      >
        {teamA} Win
      </button>
      <button 
        onClick={() => handleVote('draw')}
        className="flex-1 py-1.5 px-3 text-xs font-semibold rounded border border-[var(--border)] transition-colors hover:bg-[var(--surface-3)] hover:text-white"
        style={{ color: 'var(--white-muted)' }}
      >
        Draw
      </button>
      <button 
        onClick={() => handleVote('team_b')}
        className="flex-1 py-1.5 px-3 text-xs font-semibold rounded border border-[var(--border)] transition-colors hover:bg-[var(--surface-3)] hover:text-white"
        style={{ color: 'var(--white-muted)' }}
      >
        {teamB} Win
      </button>
    </div>
  );
}
