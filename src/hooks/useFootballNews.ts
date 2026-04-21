import { useState, useEffect } from 'react';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
  author: string;
  categories: string[];
  source?: string;
}

export const NEWS_TABS = [
  { key: 'all',      label: 'All News',  flag: '🌍', keywords: [] },
  { key: 'wc2026',   label: 'WC 2026',   flag: '⚽', keywords: ['world cup', '2026', 'fifa', 'wc2026', 'world cup 2026'] },
  { key: 'morocco',  label: 'Morocco',   flag: '🇲🇦', keywords: ['morocco', 'atlas lions', 'hakimi', 'ouahbi', 'maroc', 'mazraoui'] },
  { key: 'brazil',   label: 'Brazil',    flag: '🇧🇷', keywords: ['brazil', 'brasil', 'vinicius', 'raphinha', 'seleção'] },
  { key: 'argentina',label: 'Argentina', flag: '🇦🇷', keywords: ['argentina', 'messi', 'scaloni', 'albiceleste', 'álvarez'] },
  { key: 'france',   label: 'France',    flag: '🇫🇷', keywords: ['france', 'mbappé', 'mbappe', 'les bleus', 'griezmann'] },
  { key: 'england',  label: 'England',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', keywords: ['england', 'kane', 'bellingham', 'three lions', 'tuchel'] },
  { key: 'germany',  label: 'Germany',   flag: '🇩🇪', keywords: ['germany', 'deutschland', 'nagelsmann', 'wirtz', 'musiala'] },
  { key: 'spain',    label: 'Spain',     flag: '🇪🇸', keywords: ['spain', 'españa', 'de la fuente', 'yamal', 'pedri'] },
] as const;

export type NewsTabKey = typeof NEWS_TABS[number]['key'];

const RSS_URL = 'https://feeds.bbci.co.uk/sport/football/rss.xml';
const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=50`;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function filterByTab(items: NewsItem[], tabKey: string): NewsItem[] {
  const tab = NEWS_TABS.find(t => t.key === tabKey);
  if (!tab || tab.keywords.length === 0) return items;
  const keywords = tab.keywords as readonly string[];
  return items.filter(item => {
    const text = (item.title + ' ' + item.description).toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });
}

// Cache to avoid re-fetching
let cachedItems: NewsItem[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

export function useFootballNews(tabKey: NewsTabKey = 'all') {
  const [allItems, setAllItems] = useState<NewsItem[]>(cachedItems || []);
  const [loading, setLoading] = useState(!cachedItems);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    if (cachedItems && now - cacheTime < CACHE_TTL) {
      setAllItems(cachedItems);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(API)
      .then(r => r.json())
      .then(data => {
        if (data.status !== 'ok') throw new Error('Feed error');
        const items: NewsItem[] = (data.items || []).map((it: NewsItem) => ({
          ...it,
          description: stripHtml(it.description || ''),
          thumbnail: it.thumbnail || '',
          source: 'BBC Sport',
        }));
        cachedItems = items;
        cacheTime = Date.now();
        setAllItems(items);
        setLoading(false);
        setError(null);
      })
      .catch(() => {
        setError('Could not load news. Check your connection.');
        setLoading(false);
      });
  }, []);

  const filtered = filterByTab(allItems, tabKey);
  return { items: filtered, loading, error };
}
