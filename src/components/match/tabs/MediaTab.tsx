import { PlaySquare } from 'lucide-react';

export default function MediaTab({ match }: any) {
  const isFinished = match.status === 'finished';
  const videoId = match.youtube_video_id; // e.g. "dQw4w9WgXcQ"

  return (
    <div className="p-4 md:p-6 w-full space-y-8">
      {/* HIGHLIGHTS SECTION */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--wc-text-muted)] mb-4">Official Highlights</h3>
        
        {isFinished && videoId ? (
          <div className="w-full aspect-video rounded-xl overflow-hidden border border-[var(--wc-border)] bg-black shadow-lg">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
              title="Match Highlights" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="w-full aspect-video rounded-xl border border-[var(--wc-border)] border-dashed bg-white/5 flex flex-col items-center justify-center text-center p-6">
            <PlaySquare className="w-12 h-12 text-[var(--wc-text-muted)] mb-3 opacity-50" />
            <h4 className="font-bold text-white mb-1">Highlights unavailable</h4>
            <p className="text-xs text-[var(--wc-text-muted)]">
              {isFinished 
                ? "We are currently processing the official highlights. Check back shortly."
                : "Highlights will be available here shortly after the match concludes."}
            </p>
          </div>
        )}
      </section>

      {/* NEWS SECTION (Placeholder for now) */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--wc-text-muted)] mb-4">Latest News</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-lg overflow-hidden group cursor-pointer hover:border-[var(--wc-text-muted)] transition-colors">
            <div className="w-full h-32 bg-[var(--wc-surface-2)] overflow-hidden">
              <img src="/assets/hero-bg.jpg" alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
            </div>
            <div className="p-3">
              <div className="text-[10px] text-[var(--wc-text-muted)] mb-1">FIFA.com · 2 hours ago</div>
              <h4 className="font-bold text-sm text-white line-clamp-2">{match.home_team?.name || 'Home'} Manager speaks out ahead of crucial fixture</h4>
            </div>
          </div>
          
          <div className="bg-[var(--wc-surface)] border border-[var(--wc-border)] rounded-lg overflow-hidden group cursor-pointer hover:border-[var(--wc-text-muted)] transition-colors">
            <div className="w-full h-32 bg-[var(--wc-surface-2)] overflow-hidden">
              <img src="/assets/hero-bg.jpg" alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
            </div>
            <div className="p-3">
              <div className="text-[10px] text-[var(--wc-text-muted)] mb-1">FIFA.com · 5 hours ago</div>
              <h4 className="font-bold text-sm text-white line-clamp-2">Key players to watch in {match.home_team?.short_name} vs {match.away_team?.short_name}</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
