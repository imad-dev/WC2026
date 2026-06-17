import { useState, useEffect, useCallback, useRef } from 'react';
import { resolveStreamConfig, type StreamConfig } from '../../../lib/geoStreamRouter';
import { useConfig, useGeo } from '../../../hooks/useSupabase';
import type { WC2026Match } from '../../../lib/supabaseClient';
import { RefreshCw, Tv, Radio, MapPin, Clock, AlertCircle } from 'lucide-react';

interface LivePlayerProps {
  nextMatch?: WC2026Match | null;
}

export function LivePlayer({ nextMatch }: LivePlayerProps) {
  const country = useGeo();
  const { value: beinVideoId } = useConfig('bein_live_video_id');
  const [streamConfig, setStreamConfig] = useState<StreamConfig | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Resolve stream based on geo
  useEffect(() => {
    const config = resolveStreamConfig(country);
    setStreamConfig(config);
  }, [country]);

  // Determine the embed URL
  const getEmbedUrl = useCallback(() => {
    return 'https://pr.onlineworldcup2026.com/albaplayer/sports-1/';
  }, []);

  // Check if any match is currently live
  useEffect(() => {
    if (nextMatch && nextMatch.status === 'live') {
      setIsLive(true);
    } else {
      setIsLive(false);
    }
  }, [nextMatch]);

  // Countdown timer to next match
  useEffect(() => {
    if (!nextMatch || isLive) {
      setCountdown('');
      return;
    }

    const update = () => {
      const now = Date.now();
      const kickoff = new Date(nextMatch.kickoff_utc).getTime();
      const diff = kickoff - now;

      if (diff <= 0) {
        setCountdown('Starting now!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [nextMatch, isLive]);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualReload = () => {
    setLastRefresh(Date.now());
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className="rounded-2xl overflow-hidden border" style={{
      background: 'var(--surface-1)',
      borderColor: isLive ? 'var(--green-live)' : 'var(--border)',
      boxShadow: isLive ? '0 0 30px rgba(0,230,118,0.15)' : 'none',
    }}>
      {/* ── Header Bar ── */}
      <div className="flex items-center justify-between px-4 py-3" style={{
        background: isLive
          ? 'linear-gradient(135deg, rgba(0,230,118,0.12) 0%, rgba(0,161,82,0.08) 100%)'
          : 'var(--surface-2)',
        borderBottom: `1px solid ${isLive ? 'rgba(0,230,118,0.2)' : 'var(--border)'}`,
      }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isLive ? (
              <Tv className="w-4 h-4" style={{ color: 'var(--green-live)' }} />
            ) : (
              <Radio className="w-4 h-4" style={{ color: 'var(--white-muted)' }} />
            )}
            <span className="text-sm font-bold" style={{
              color: isLive ? 'var(--green-live)' : 'var(--white-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em',
            }}>
              {isLive ? '● LIVE NOW' : 'LIVE PLAYER'}
            </span>
          </div>

          {streamConfig && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--white-muted)',
              border: '1px solid var(--border)',
            }}>
              <MapPin className="w-3 h-3" />
              {streamConfig.region}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {streamConfig && (
            <span className="hidden sm:inline text-xs" style={{ color: 'var(--white-ghost)' }}>
              {streamConfig.channelName}
            </span>
          )}
          <button
            onClick={handleManualReload}
            className="p-1.5 rounded-md transition-all duration-200 hover:scale-110"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--white-muted)',
            }}
            aria-label="Refresh stream"
            title="Refresh stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Player Area ── */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
        {isLive && embedUrl ? (
          <iframe
            ref={iframeRef}
            key={lastRefresh}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="FIFA World Cup 2026 Live Stream"
            style={{ border: 'none' }}
          />
        ) : (
          /* ── Not Live Fallback ── */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center" style={{
            background: `
              radial-gradient(ellipse at 50% 0%, rgba(0,230,118,0.06) 0%, transparent 60%),
              var(--surface-1)
            `,
          }}>
            {/* Large soccer ball icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, rgba(0,230,118,0.15) 0%, rgba(0,230,118,0.05) 100%)',
                border: '2px solid rgba(0,230,118,0.2)',
              }}>
                <span className="text-4xl">⚽</span>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{
                border: '2px solid var(--green-live)',
                animationDuration: '3s',
              }} />
            </div>

            <h3 className="text-lg font-bold mb-2" style={{
              color: 'var(--white-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}>
              No Match Currently Live
            </h3>

            {nextMatch ? (
              <div className="space-y-3">
                <p className="text-sm" style={{ color: 'var(--white-muted)' }}>
                  Next: <strong style={{ color: 'var(--white-primary)' }}>
                    {nextMatch.home_team} vs {nextMatch.away_team}
                  </strong>
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <Clock className="w-4 h-4" style={{ color: 'var(--gold-leader)' }} />
                  <span className="text-base font-bold" style={{
                    color: 'var(--gold-leader)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.02em',
                  }}>
                    {countdown}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--white-ghost)' }}>
                  {new Intl.DateTimeFormat(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  }).format(new Date(nextMatch.kickoff_utc))}
                  {' · '}
                  {nextMatch.venue}
                </p>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--white-muted)' }}>
                Stream will appear here when a match is live
              </p>
            )}

            {streamConfig && (
              <div className="mt-6 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--white-ghost)' }}>
                <AlertCircle className="w-3 h-3" />
                {streamConfig.note}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer info ── */}
      {streamConfig && (
        <div className="flex items-center justify-between px-4 py-2 text-[11px]" style={{
          background: 'var(--surface-2)',
          borderTop: '1px solid var(--border)',
          color: 'var(--white-ghost)',
        }}>
          <span>📡 {streamConfig.channelName}</span>
          <span>Auto-refresh: 30 min</span>
        </div>
      )}
    </div>
  );
}
