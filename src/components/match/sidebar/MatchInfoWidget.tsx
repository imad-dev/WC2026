import { CalendarDays, MapPin, Tv, ShieldAlert } from 'lucide-react';

export default function MatchInfoWidget({ match }: any) {
  const dateStr = match.match_date ? new Date(match.match_date).toLocaleDateString() : 'TBA';
  
  return (
    <div className="bg-[var(--wc-surface)] rounded-xl border border-[var(--wc-border)] overflow-hidden shadow-md">
      <div className="px-4 py-3 bg-[rgba(255,255,255,0.02)] border-b border-[var(--wc-border)]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Match Info</h3>
      </div>
      
      <div className="p-4 space-y-4 text-xs">
        <div className="flex items-start gap-3">
          <CalendarDays className="w-4 h-4 text-[var(--wc-text-muted)] shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white">{dateStr}</div>
            <div className="text-[var(--wc-text-muted)]">{match.match_time || 'Time TBA'}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-[var(--wc-text-muted)] shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white truncate max-w-[200px]">{match.venue?.name || match.venue || 'Venue TBA'}</div>
            {match.venue?.city && <div className="text-[var(--wc-text-muted)]">{match.venue.city}, {match.venue.country}</div>}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-[var(--wc-text-muted)] shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white">{match.referee || 'Referee TBA'}</div>
            <div className="text-[var(--wc-text-muted)]">Attendance: {match.attendance ? match.attendance.toLocaleString() : 'TBA'}</div>
          </div>
        </div>

        {match.broadcasters && match.broadcasters.length > 0 && (
          <div className="flex items-start gap-3 pt-2 border-t border-[var(--wc-border)]">
            <Tv className="w-4 h-4 text-[var(--wc-text-muted)] shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {match.broadcasters.map((b: string, i: number) => (
                <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-bold text-[var(--wc-text-muted)]">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
