import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Newspaper, RefreshCw } from 'lucide-react';
import { useFootballNews, NEWS_TABS, type NewsTabKey } from '../../hooks/useFootballNews';
import { NewsCard, NewsCardSkeleton } from '../components/NewsCard';

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<NewsTabKey>('all');
  const { items, loading, error } = useFootballNews(activeTab);

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)', fontFamily: 'var(--font-body)' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b px-4 md:px-8 lg:px-20 py-3 flex items-center gap-4"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-glass)', backdropFilter: 'blur(20px)' }}>
        <Link to="/" className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--green-live)' }}>
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <span style={{ color: 'var(--border)' }}>|</span>
        <div className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="font-extrabold text-white">WC</span>
          <span className="font-extrabold" style={{ color: 'var(--green-live)' }}>2026</span>
          <span className="text-sm" style={{ color: 'var(--white-ghost)' }}>.games</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
          style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', color: 'var(--green-live)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green-live)' }} />
          Live Feed
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* Page title */}
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="w-6 h-6" style={{ color: 'var(--green-live)' }} />
          <h1 className="text-4xl font-extrabold uppercase"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)', letterSpacing: '-0.03em' }}>
            Football <span style={{ color: 'var(--green-live)' }}>News</span>
          </h1>
        </div>
        <p className="text-sm mb-8" style={{ color: 'var(--white-muted)' }}>
          Latest football news from BBC Sport — filter by team to follow your favourite nations to WC2026.
        </p>

        {/* Tab bar — all teams */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 rounded-xl"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          {NEWS_TABS.map(tab => (
            <button key={tab.key}
              id={`news-tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: activeTab === tab.key ? 'var(--green-live)' : 'transparent',
                color: activeTab === tab.key ? 'var(--void)' : 'var(--white-muted)',
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

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-5 rounded-xl border mb-6"
            style={{ background: 'rgba(255,61,87,0.08)', borderColor: 'rgba(255,61,87,0.3)' }}>
            <RefreshCw className="w-5 h-5" style={{ color: 'var(--red-loss)' }} />
            <div>
              <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--white-primary)' }}>Unable to load news feed</div>
              <div className="text-xs" style={{ color: 'var(--white-muted)' }}>{error}</div>
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
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--white-ghost)' }}>More Articles</span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
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
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <div className="text-5xl mb-4">📰</div>
            <div className="text-lg font-bold mb-2" style={{ color: 'var(--white-primary)' }}>
              No articles found
            </div>
            <div className="text-sm mb-5" style={{ color: 'var(--white-muted)' }}>
              No recent articles matching this team in the feed right now.
            </div>
            <button onClick={() => setActiveTab('all')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--green-live)', color: 'var(--void)' }}>
              Show all news
            </button>
          </div>
        )}
      </div>

      <PageFooter />
    </div>
  );
}

function PageFooter() {
  return (
    <footer className="border-t mt-16 py-8 px-6 md:px-20 text-center text-xs" style={{ borderColor: 'var(--border)', color: 'var(--white-ghost)' }}>
      <div className="flex flex-wrap justify-center gap-6 mb-3">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </div>
      <p>© 2026 WC2026.games · News sourced from BBC Sport · Not affiliated with FIFA</p>
    </footer>
  );
}
