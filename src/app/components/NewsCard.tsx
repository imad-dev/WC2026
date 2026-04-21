import { ExternalLink, Clock } from 'lucide-react';
import type { NewsItem } from '../../hooks/useFootballNews';

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NewsCard({ item, featured = false }: NewsCardProps) {
  const time = timeAgo(item.pubDate);

  if (featured) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer"
        className="group block rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
        {/* Image */}
        {item.thumbnail ? (
          <div className="w-full h-48 overflow-hidden relative">
            <img src={item.thumbnail} alt={item.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,8,16,0.8) 0%, transparent 60%)' }} />
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded font-bold"
                style={{ background: 'var(--green-live)', color: 'var(--void)' }}>
                {item.source || 'News'}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-32 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(0,230,118,0.08) 0%, var(--surface-2) 100%)' }}>
            <span className="text-5xl">⚽</span>
          </div>
        )}

        <div className="p-4">
          <h3 className="text-sm font-bold mb-2 line-clamp-2 group-hover:text-green-400 transition-colors"
            style={{ color: 'var(--white-primary)', fontFamily: 'var(--font-display)' }}>
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--white-muted)' }}>
              {item.description.slice(0, 120)}...
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--white-ghost)' }}>
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
            <ExternalLink className="w-3 h-3" style={{ color: 'var(--green-live)' }} />
          </div>
        </div>
      </a>
    );
  }

  // Compact card
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-xl border transition-all hover:-translate-y-0.5"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      {item.thumbnail && (
        <img src={item.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      )}
      {!item.thumbnail && (
        <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl"
          style={{ background: 'var(--surface-2)' }}>⚽</div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-semibold mb-1 line-clamp-2 transition-colors group-hover:text-green-400"
          style={{ color: 'var(--white-primary)' }}>
          {item.title}
        </h3>
        <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--white-ghost)' }}>
          <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-3)', color: 'var(--white-ghost)' }}>
            {item.source || 'News'}
          </span>
          <span>{time}</span>
        </div>
      </div>
      <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'var(--white-ghost)' }} />
    </a>
  );
}

export function NewsCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className="rounded-2xl border overflow-hidden animate-pulse"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      {featured && <div className="w-full h-48" style={{ background: 'var(--surface-2)' }} />}
      <div className="p-4 space-y-2">
        <div className="h-4 rounded" style={{ background: 'var(--surface-2)', width: '85%' }} />
        <div className="h-4 rounded" style={{ background: 'var(--surface-2)', width: '60%' }} />
        <div className="h-3 rounded mt-3" style={{ background: 'var(--surface-2)', width: '30%' }} />
      </div>
    </div>
  );
}
