"use client";
import { useState } from 'react';
import { Newspaper, RefreshCw } from 'lucide-react';
import { useFootballNews, NEWS_TABS, type NewsTabKey } from '../../hooks/useFootballNews';
import { NewsCard, NewsCardSkeleton } from '../components/NewsCard';

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<NewsTabKey>('all');
  const { items, loading, error } = useFootballNews(activeTab);

  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Page title */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--wc-green)] mb-3 font-semibold flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5" />
            Live Feed
          </p>
          <h1 className="text-4xl md:text-5xl text-[var(--wc-text)] uppercase mb-2"
            style={{ fontFamily: 'var(--font-display)' }}>
            Football <span className="text-[var(--wc-green)]">News</span>
          </h1>
          <p className="text-sm text-[var(--wc-text-muted)]">
            Latest football news from FIFA — filter by team to follow your favourite nations.
          </p>
        </div>

        {/* Tab bar — scrollable on mobile */}
        <div className="overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <div className="flex gap-2 p-1 rounded-xl min-w-max"
            style={{ background: 'var(--wc-surface)', border: '1px solid var(--wc-border)' }}>
            {NEWS_TABS.map(tab => (
              <button key={tab.key}
                id={`news-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                style={{
                  background: activeTab === tab.key ? 'var(--wc-green)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--wc-dark)' : 'var(--wc-text-muted)',
                }}>
                <span className="text-base">{tab.flag}</span>
                <span>{tab.label}</span>
                {activeTab === tab.key && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{ background: 'rgba(0,0,0,0.2)' }}>
                    {loading ? '…' : items.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-5 rounded-xl border mb-6"
            style={{ background: 'rgba(255,61,87,0.08)', borderColor: 'rgba(255,61,87,0.3)' }}>
            <RefreshCw className="w-5 h-5 shrink-0" style={{ color: 'var(--wc-red)' }} />
            <div className="min-w-0">
              <div className="text-sm font-semibold mb-0.5 text-white">Unable to load news feed</div>
              <div className="text-xs text-[var(--wc-text-muted)] truncate">{error}</div>
            </div>
          </div>
        )}

        {/* Loading — skeletons */}
        {loading && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {[0, 1, 2].map(i => <NewsCardSkeleton key={i} featured />)}
            </div>
            <div className="space-y-2">
              {[0, 1, 2, 3].map(i => <NewsCardSkeleton key={i} />)}
            </div>
          </div>
        )}

        {/* Articles */}
        {!loading && !error && items.length > 0 && (
          <>
            {/* Top 3 featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {items.slice(0, 3).map((item, i) => (
                <NewsCard key={i} item={item} featured />
              ))}
            </div>

            {/* Divider */}
            {items.length > 3 && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[var(--wc-border)]" />
                  <span className="text-xs uppercase tracking-widest text-[var(--wc-text-muted)]">More Articles</span>
                  <div className="flex-1 h-px bg-[var(--wc-border)]" />
                </div>

                {/* Rest as compact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.slice(3).map((item, i) => (
                    <NewsCard key={i} item={item} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20 rounded-2xl border"
            style={{ background: 'var(--wc-surface)', borderColor: 'var(--wc-border)' }}>
            <div className="text-5xl mb-4">📰</div>
            <div className="text-lg font-bold mb-2 text-white">
              No articles found
            </div>
            <div className="text-sm mb-5 text-[var(--wc-text-muted)]">
              No recent articles matching this team in the feed right now.
            </div>
            <button onClick={() => setActiveTab('all')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 bg-[var(--wc-green)] text-[var(--wc-dark)]">
              Show all news
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
