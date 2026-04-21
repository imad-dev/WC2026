import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ChevronRight, RefreshCw } from 'lucide-react';
import { useFootballNews, NEWS_TABS, type NewsTabKey } from '../../hooks/useFootballNews';
import { NewsCard, NewsCardSkeleton } from './NewsCard';

export function NewsSection() {
  const [activeTab, setActiveTab] = useState<NewsTabKey>('all');
  const { items, loading, error } = useFootballNews(activeTab);

  const visibleTabs = NEWS_TABS.slice(0, 5); // Show first 5 tabs in home view

  return (
    <section id="news-section" className="mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5" style={{ color: 'var(--green-live)' }} />
          <h2 className="text-xl font-extrabold uppercase"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)', letterSpacing: '-0.02em' }}>
            Latest Football News
          </h2>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green-live)' }} />
        </div>
        <Link to="/news"
          className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
          style={{ color: 'var(--green-live)' }}>
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tab pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {visibleTabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeTab === tab.key ? 'var(--green-live)' : 'var(--surface-2)',
              color: activeTab === tab.key ? 'var(--void)' : 'var(--white-muted)',
              border: activeTab === tab.key ? 'none' : '1px solid var(--border)',
            }}>
            <span>{tab.flag}</span> {tab.label}
          </button>
        ))}
        <Link to="/news"
          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:border-green-500"
          style={{ border: '1px solid var(--border)', color: 'var(--white-ghost)' }}>
          More →
        </Link>
      </div>

      {/* Content */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border text-sm"
          style={{ background: 'rgba(255,61,87,0.08)', borderColor: 'rgba(255,61,87,0.3)', color: 'var(--white-muted)' }}>
          <RefreshCw className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--red-loss)' }} />
          {error}
          <Link to="/news" className="ml-auto text-xs underline" style={{ color: 'var(--green-live)' }}>Try full page</Link>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[0, 1, 2].map(i => <NewsCardSkeleton key={i} featured={i === 0} />)}
        </div>
      )}

      {/* Articles — 1 featured + 3 compact */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Featured card */}
          <NewsCard item={items[0]} featured />

          {/* Compact list */}
          <div className="space-y-2">
            {items.slice(1, 5).map((item, i) => (
              <NewsCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-10 rounded-xl border"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', color: 'var(--white-ghost)' }}>
          <div className="text-3xl mb-2">📰</div>
          <div className="text-sm">No articles found for this team right now.</div>
          <button onClick={() => setActiveTab('all')} className="mt-3 text-xs underline" style={{ color: 'var(--green-live)' }}>
            Show all news
          </button>
        </div>
      )}
    </section>
  );
}
